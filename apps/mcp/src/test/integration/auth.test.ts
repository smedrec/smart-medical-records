import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../worker'; // Assuming this is the entry point for the Hono app
import { FHIR_SESSION_COOKIE, FHIR_PKCE_VERIFIER_COOKIE, FHIR_AUTH_STATE_COOKIE } from '../../lib/auth-constants'; // Updated import path

// Mock global fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock global crypto for deterministic PKCE generation if needed for assertions
// This setup should ideally match the one in fhir/src/client.test.ts if consistency is desired
const mockCryptoImpl = {
  getRandomValues: (array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) array[i] = i + 1; // Predictable
    return array;
  },
  subtle: {
    digest: async (algorithm: string, data: Uint8Array) => {
      // Simple mock hash: just reverse the data and convert to ArrayBuffer for testing
      const reversed = data.slice().reverse();
      return reversed.buffer as ArrayBuffer;
    },
  },
};

// @ts-ignore
globalThis.crypto = mockCryptoImpl;


// Mock environment variables for Hono context `c.env`
const mockEnv = {
  NAME: 'mcp-worker-test',
  ENVIRONMENT: 'test',
  SENTRY_RELEASE: 'test-release',
  ALLOWED_ORIGINS: '*',
  // SMART on FHIR specific env vars (ensure these match what your app expects)
  SMART_CLIENT_ID: 'test-mcp-client-id',
  SMART_SCOPE: 'patient/*.read launch/patient openid fhirUser profile',
  SMART_ISS: 'https://mock-fhir-server.example.com/r4', // Mock issuer
  SMART_REDIRECT_URI: 'http://localhost/auth/callback', // This will be overridden by dynamic one in /login but good for default
  CERBOS_HTTP_API_URL: 'http://localhost:3593',
  // other env vars...
};

const TEST_APP_BASE_URL = 'http://localhost'; // Assuming app runs at localhost for testing redirect URIs

describe('MCP Authentication Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Clears call counts and custom implementations for mocks
  });

  describe('GET /auth/login', () => {
    it('should redirect to FHIR IdP authorization endpoint and set PKCE/state cookies', async () => {
      const smartWellKnownConfig = {
        authorization_endpoint: `${mockEnv.SMART_ISS}/connect/authorize`,
        token_endpoint: `${mockEnv.SMART_ISS}/connect/token`,
        // other SMART config fields...
      };
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(smartWellKnownConfig), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const req = new Request(`${TEST_APP_BASE_URL}/auth/login`, { method: 'GET' });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);

      expect(res.status).toBe(302); // Or 307 for Hono redirects

      const location = res.headers.get('Location');
      expect(location).toBeTruthy();
      const authUrl = new URL(location!);
      expect(authUrl.origin).toBe(new URL(smartWellKnownConfig.authorization_endpoint).origin);
      expect(authUrl.pathname).toBe(new URL(smartWellKnownConfig.authorization_endpoint).pathname);
      expect(authUrl.searchParams.get('response_type')).toBe('code');
      expect(authUrl.searchParams.get('client_id')).toBe(mockEnv.SMART_CLIENT_ID);
      const expectedRedirectUri = `${TEST_APP_BASE_URL}/auth/callback`;
      expect(authUrl.searchParams.get('redirect_uri')).toBe(expectedRedirectUri);
      expect(authUrl.searchParams.get('scope')).toBe(mockEnv.SMART_SCOPE);
      expect(authUrl.searchParams.get('aud')).toBe(mockEnv.SMART_ISS);
      expect(authUrl.searchParams.get('code_challenge_method')).toBe('S256');
      expect(authUrl.searchParams.get('state')).toBeDefined();
      expect(authUrl.searchParams.get('code_challenge')).toBeDefined();

      const cookies = res.headers.getSetCookie();
      expect(cookies.some(c => c.startsWith(`${FHIR_PKCE_VERIFIER_COOKIE}=`) && c.includes('HttpOnly') && c.includes('Secure') && c.includes('SameSite=Lax') && c.includes('Path=/'))).toBe(true);
      expect(cookies.some(c => c.startsWith(`${FHIR_AUTH_STATE_COOKIE}=`) && c.includes('HttpOnly') && c.includes('Secure') && c.includes('SameSite=Lax') && c.includes('Path=/'))).toBe(true);
    });

    it('should handle failure if SMART config fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Failed to fetch SMART config'));

      const req = new Request(`${TEST_APP_BASE_URL}/auth/login`, { method: 'GET' });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain('FHIR Login initiation failed');
    });
  });

  describe('GET /auth/callback', () => {
    const mockAuthCode = 'test-auth-code';
    let pkceVerifierFromLogin: string;
    let stateFromLogin: string;

    // Simulate the /auth/login call to get actual PKCE and state values
    beforeEach(async () => {
        const smartWellKnownConfig = {
            authorization_endpoint: `${mockEnv.SMART_ISS}/connect/authorize`,
            token_endpoint: `${mockEnv.SMART_ISS}/connect/token`,
        };
        mockFetch.mockResolvedValueOnce( // For .well-known in this specific beforeEach
            new Response(JSON.stringify(smartWellKnownConfig), { status: 200, headers: { 'Content-Type': 'application/json' } })
        );
        const loginReq = new Request(`${TEST_APP_BASE_URL}/auth/login`, { method: 'GET' });
        const loginRes = await handler.fetch(loginReq, mockEnv, {} as ExecutionContext);
        const loginCookies = loginRes.headers.getSetCookie();

        const pkceCookie = loginCookies.find(c => c.startsWith(`${FHIR_PKCE_VERIFIER_COOKIE}=`));
        pkceVerifierFromLogin = pkceCookie?.split(';')[0]?.split('=')[1] || '';

        const stateCookie = loginCookies.find(c => c.startsWith(`${FHIR_AUTH_STATE_COOKIE}=`));
        stateFromLogin = stateCookie?.split(';')[0]?.split('=')[1] || '';

        mockFetch.mockReset(); // Reset fetch for token endpoint mocks
    });

    it('should exchange code for token, set session cookie, clear temp cookies, and redirect', async () => {
      const mockTokenResponse = {
        access_token: 'mock-access-token',
        id_token: 'mock-id-token', // Contains sub: 'test-user-placeholder'
        expires_in: 3600,
        scope: mockEnv.SMART_SCOPE,
        token_type: 'Bearer',
      };
      mockFetch.mockResolvedValueOnce( // For token endpoint
        new Response(JSON.stringify(mockTokenResponse), { status: 200, headers: { 'Content-Type': 'application/json' } })
      );

      const callbackUrl = new URL(`${TEST_APP_BASE_URL}/auth/callback`);
      callbackUrl.searchParams.set('code', mockAuthCode);
      callbackUrl.searchParams.set('state', stateFromLogin);

      const req = new Request(callbackUrl.toString(), {
        method: 'GET',
        headers: {
          'Cookie': `${FHIR_PKCE_VERIFIER_COOKIE}=${pkceVerifierFromLogin}; ${FHIR_AUTH_STATE_COOKIE}=${stateFromLogin}`
        }
      });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);

      expect(res.status).toBe(302); // Redirect to '/'
      expect(res.headers.get('Location')).toBe('/');

      const setCookies = res.headers.getSetCookie();
      const sessionCookie = setCookies.find(c => c.startsWith(`${FHIR_SESSION_COOKIE}=`));
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie).toContain('HttpOnly');
      expect(sessionCookie).toContain('Secure');
      expect(sessionCookie).toContain('SameSite=Lax');

      // Check that temp cookies are cleared (Max-Age=0 or expires in past)
      expect(setCookies.some(c => c.startsWith(`${FHIR_PKCE_VERIFIER_COOKIE}=;`) && (c.includes('Max-Age=0') || c.includes('expires=Thu, 01 Jan 1970')))).toBe(true);
      expect(setCookies.some(c => c.startsWith(`${FHIR_AUTH_STATE_COOKIE}=;`) && (c.includes('Max-Age=0') || c.includes('expires=Thu, 01 Jan 1970')))).toBe(true);

      // Verify token endpoint was called correctly
      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toBe(`${mockEnv.SMART_ISS}/connect/token`); // Token endpoint URL
      const params = new URLSearchParams(fetchCall[1]?.body as string);
      expect(params.get('grant_type')).toBe('authorization_code');
      expect(params.get('code')).toBe(mockAuthCode);
      expect(params.get('redirect_uri')).toBe(`${TEST_APP_BASE_URL}/auth/callback`);
      expect(params.get('client_id')).toBe(mockEnv.SMART_CLIENT_ID);
      expect(params.get('code_verifier')).toBe(pkceVerifierFromLogin);
    });

    it('should fail if state is invalid', async () => {
      const callbackUrl = new URL(`${TEST_APP_BASE_URL}/auth/callback`);
      callbackUrl.searchParams.set('code', mockAuthCode);
      callbackUrl.searchParams.set('state', 'invalid-state-value'); // Mismatched state

      const req = new Request(callbackUrl.toString(), {
        method: 'GET',
        headers: {
          'Cookie': `${FHIR_PKCE_VERIFIER_COOKIE}=${pkceVerifierFromLogin}; ${FHIR_AUTH_STATE_COOKIE}=${stateFromLogin}`
        }
      });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);
      expect(res.status).toBe(500); // Or 400 depending on error handling in createSmartFhirClient
      const json = await res.json();
      expect(json.error).toContain('FHIR callback processing failed');
      expect(json.details).toContain('Invalid state parameter received');
    });

    it('should fail if token endpoint returns an error', async () => {
      mockFetch.mockResolvedValueOnce( // For token endpoint
        new Response(JSON.stringify({ error: 'invalid_grant', error_description: ' проблемы с кодом авторизации или кодом PKCE' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      );

      const callbackUrl = new URL(`${TEST_APP_BASE_URL}/auth/callback`);
      callbackUrl.searchParams.set('code', mockAuthCode);
      callbackUrl.searchParams.set('state', stateFromLogin);

      const req = new Request(callbackUrl.toString(), {
        method: 'GET',
        headers: {
          'Cookie': `${FHIR_PKCE_VERIFIER_COOKIE}=${pkceVerifierFromLogin}; ${FHIR_AUTH_STATE_COOKIE}=${stateFromLogin}`
        }
      });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toContain('FHIR callback processing failed');
      expect(json.details).toContain('SMART on FHIR authentication failed during ready()');
    });
  });

  describe('GET /auth/logout', () => {
    it('should clear session cookie and redirect to /', async () => {
      const req = new Request(`${TEST_APP_BASE_URL}/auth/logout`, {
        method: 'GET',
        headers: {
          'Cookie': `${FHIR_SESSION_COOKIE}=some-session-data` // Simulate logged-in state
        }
      });
      const res = await handler.fetch(req, mockEnv, {} as ExecutionContext);

      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('/');

      const cookies = res.headers.getSetCookie();
      expect(cookies.some(c => c.startsWith(`${FHIR_SESSION_COOKIE}=;`) && (c.includes('Max-Age=0') || c.includes('expires=Thu, 01 Jan 1970')))).toBe(true);
    });
  });
});
