// Based on packages/auth-db/src/db/schema.ts smartFhirClient table
// and .fhir/SmartClientBackendServices.md

/**
 * Configuration for the SmartClient.
 * These values are typically fetched from a secure database.
 */
export interface SmartClientConfig {
  /** The client ID issued during registration with the FHIR authorization server. */
  clientId: string;

  /** The scope of access requested. e.g., "system/Observation.rs" */
  scope: string;

  /**
   * The issuer URL of the client itself. This is used as the `iss` and `sub`
   * claims in the JWT. It should be the same as the `clientId`.
   */
  iss: string;

  /** The base URL of the FHIR server. e.g., "https://fhir.example.com/r4" */
  fhirBaseUrl?: string;

  /**
   * The client's private key in PEM or JWK format.
   * This key is used to sign the JWT assertion.
   * Ensure this is stored securely.
   */
  privateKey: string; // Can be PEM string or a JWK object stringified

  /**
   * Optional: The Key ID (`kid`) for the public key, if registered with the FHIR server.
   * This is included in the JWT header.
   */
  kid?: string;

  /**
   * Optional: The JWA algorithm (e.g., `RS384`, `ES384`) used for signing the authentication JWT.
   * Defaults to 'RS384' if not specified.
   * The FHIR server must support this algorithm.
   */
  signingAlgorithm?: 'RS384' | 'ES384' | string; // Allow other JWA standard algs

  /**
   * Optional: The URL where the client's public JWK Set can be found.
   * This is included in the JWT header as `jku`.
   */
  jwksUrl?: string;

  /**
   * Optional: The lifetime of the generated JWT assertion in seconds.
   * Defaults to 300 seconds (5 minutes).
   * This should be a short duration.
   */
  jwtLifetime?: number;

  // Fields from the database schema that are not directly used by the client logic itself
  // but are part of the configuration object:
  // organizationId: string;
  // clientSecret?: string; // Asymmetric auth primarily uses keys
  // redirectUri: string; // More relevant for 3-legged OAuth, but part of schema
  // provider: 'demo' | 'azure' | 'aws' | 'gcp';
  // environment: 'development' | 'production';
}

/**
 * Represents the response from the FHIR server's .well-known/smart-configuration endpoint.
 */
export interface SmartConfiguration {
  /** The OAuth 2.0 token endpoint URL. */
  token_endpoint: string;
  /** Array of supported OAuth 2.0 scopes. */
  scopes_supported?: string[];
  /** Array of supported response types. */
  response_types_supported?: string[];
  /** Array of supported grant types. */
  grant_types_supported?: string[];
  /** Array of supported token endpoint authentication methods. e.g., "private_key_jwt" */
  token_endpoint_auth_methods_supported?: string[];
  /** Array of supported JWS signing algorithms for token endpoint authentication. e.g., "RS384", "ES384" */
  token_endpoint_auth_signing_alg_values_supported?: string[];
  /** URL to the FHIR server's capability statement. */
  capabilities?: string[];
  /** Recommended if requests are signed (JAdES) */
  jwks_uri?: string;
  // Other properties as defined by the SMART App Launch IG
  [key: string]: any;
}

/**
 * Represents the access token response from the FHIR authorization server.
 */
export interface TokenResponse {
  /** The access token issued by the FHIR authorization server. */
  access_token: string;
  /** The type of token issued (e.g., "Bearer"). */
  token_type: "Bearer" | "bearer"; // Typically "bearer"
  /** The lifetime in seconds of the access token. */
  expires_in: number;
  /** The scope of access authorized. This may be different from the scopes requested. */
  scope: string;
  /** Refresh token (SHOULD NOT be issued for backend services as per spec). */
  refresh_token?: string;
  // Other properties as defined by RFC6749
  [key: string]: any;
}

/**
 * Error structure for SmartClient operations.
 */
export class SmartClientError extends Error {
  public readonly cause?: Error;
  public readonly details?: any;

  constructor(message: string, options?: { cause?: Error, details?: any }) {
    super(message);
    this.name = 'SmartClientError';
    this.cause = options?.cause;
    this.details = options?.details;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SmartClientError.prototype);
  }
}

export class SmartClientInitializationError extends SmartClientError {
  constructor(message: string, options?: { cause?: Error, details?: any }) {
    super(message, options);
    this.name = 'SmartClientInitializationError';
    Object.setPrototypeOf(this, SmartClientInitializationError.prototype);
  }
}

export class SmartClientAuthenticationError extends SmartClientError {
  constructor(message: string, options?: { cause?: Error, details?: any }) {
    super(message, options);
    this.name = 'SmartClientAuthenticationError';
    Object.setPrototypeOf(this, SmartClientAuthenticationError.prototype);
  }
}

export class SmartClientRequestError extends SmartClientError {
  constructor(message: string, options?: { cause?: Error, details?: any }) {
    super(message, options);
    this.name = 'SmartClientRequestError';
    Object.setPrototypeOf(this, SmartClientRequestError.prototype);
  }
}
