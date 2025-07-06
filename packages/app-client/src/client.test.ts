import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { AppClient } from './client'
import type { ClientOptions } from './types'

// Mock global fetch
global.fetch = vi.fn()

const mockFetch = (response: any, ok: boolean = true, status: number = 200) => {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  } as Response)
}

describe('AppClient', () => {
  let client: AppClient
  const baseUrl = 'http://localhost:3000/api'
  const defaultOptions: ClientOptions = { baseUrl, retries: 1, backoffMs: 10 }

  beforeEach(() => {
    client = new AppClient(defaultOptions)
    vi.resetAllMocks() // Reset mocks for each test
  })

  describe('ok', () => {
    it('should return { ok: true } on successful request', async () => {
      global.fetch = mockFetch({ ok: true })
      const response = await client.ok()
      expect(response).toEqual({ ok: true })
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/auth/ok`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: undefined,
        credentials: 'include',
      })
    })
  })

  describe('version', () => {
    it('should return version information on successful request', async () => {
      const mockVersion = { version: '1.0.0' }
      global.fetch = mockFetch(mockVersion)
      const response = await client.version()
      expect(response).toEqual(mockVersion)
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/version`, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: undefined,
        credentials: 'include',
      })
    })
  })

  describe('encrypt', () => {
    it('should return ciphertext on successful encryption', async () => {
      const plaintext = 'hello world'
      const mockResponse = { ciphertext: 'encryptedText' }
      global.fetch = mockFetch(mockResponse)
      const response = await client.encrypt(plaintext)
      expect(response).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/encrypt`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ plaintext }),
        credentials: 'include',
      })
    })
  })

  describe('decrypt', () => {
    it('should return plaintext on successful decryption', async () => {
      const ciphertext = 'encryptedText'
      const mockResponse = { plaintext: 'hello world' }
      global.fetch = mockFetch(mockResponse)
      const response = await client.decrypt(ciphertext)
      expect(response).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/decrypt`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciphertext }),
        credentials: 'include',
      })
    })
  })

  describe('Error Handling', () => {
    it('should throw an error if the request fails after retries', async () => {
      global.fetch = mockFetch({ message: 'Internal Server Error' }, false, 500)
      await expect(client.ok()).rejects.toThrow('HTTP error! status: 500 - {"message":"Internal Server Error"}')
      expect(fetch).toHaveBeenCalledTimes(defaultOptions.retries! + 1)
    })

    it('should throw an error with non-JSON error response', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 503,
            json: () => Promise.reject(new Error("Not JSON")), // Simulate non-JSON parsable error
            text: () => Promise.resolve("Service Unavailable"),
        } as Response)
        await expect(client.ok()).rejects.toThrow('HTTP error! status: 503 - Service Unavailable')
        expect(fetch).toHaveBeenCalledTimes(defaultOptions.retries! + 1)
    })

    it('should throw the last error after exhausting retries for network errors', async () => {
        const networkError = new Error('Network failure')
        global.fetch = vi.fn().mockRejectedValue(networkError)

        await expect(client.ok()).rejects.toThrow(networkError.message)
        expect(fetch).toHaveBeenCalledTimes(defaultOptions.retries! + 1)
    })
  })

  describe('Retry Mechanism', () => {
    it('should retry the request on failure', async () => {
      // First call fails, second succeeds
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Temporary error' }),
          text: () => Promise.resolve(JSON.stringify({ message: 'Temporary error' })),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ ok: true }),
          text: () => Promise.resolve(JSON.stringify({ ok: true })),
        } as Response)

      const response = await client.ok()
      expect(response).toEqual({ ok: true })
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should apply exponential backoff', async () => {
      vi.useFakeTimers()
      const clientWithLongerBackoff = new AppClient({ ...defaultOptions, retries: 2, backoffMs: 100, maxBackoffMs: 500 })

      // Fail twice, then succeed
       global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('Error 1') } as Response)
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('Error 2') }as Response)
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) } as Response)

      const promise = clientWithLongerBackoff.ok()

      // First attempt fails immediately
      // First retry delay
      await vi.advanceTimersByTimeAsync(100)
      // Second retry delay (100 * 2 = 200)
      await vi.advanceTimersByTimeAsync(200)

      const response = await promise
      expect(response).toEqual({ ok: true })
      expect(fetch).toHaveBeenCalledTimes(3)

      vi.useRealTimers()
    })

     it('should respect maxBackoffMs', async () => {
      vi.useFakeTimers()
      const clientWithMaxBackoff = new AppClient({ ...defaultOptions, retries: 3, backoffMs: 300, maxBackoffMs: 500 })

       global.fetch = vi.fn()
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('Error 1') } as Response) // delay 300ms
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('Error 2') } as Response) // delay 500ms (capped from 300*2=600)
        .mockResolvedValueOnce({ ok: false, status: 500, text: () => Promise.resolve('Error 3') } as Response) // delay 500ms (capped from 500*2=1000)
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) } as Response)

      const promise = clientWithMaxBackoff.ok()

      await vi.advanceTimersByTimeAsync(300) // 1st retry
      await vi.advanceTimersByTimeAsync(500) // 2nd retry
      await vi.advanceTimersByTimeAsync(500) // 3rd retry

      const response = await promise
      expect(response).toEqual({ ok: true })
      expect(fetch).toHaveBeenCalledTimes(4)

      vi.useRealTimers()
    })
  })

  describe('Request Options', () => {
    it('should include custom headers if provided in options', async () => {
      const customHeaders = { 'X-Custom-Header': 'TestValue' }
      client = new AppClient({ ...defaultOptions, headers: customHeaders })
      global.fetch = mockFetch({ ok: true })
      await client.ok()
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: { ...customHeaders, Accept: 'application/json', 'Content-Type': 'application/json' },
      }))
    })

    it('should merge method-specific headers with client options headers', async () => {
      const clientHeaders = { 'X-Client-Header': 'ClientValue' }
      const methodHeaders = { 'X-Method-Header': 'MethodValue' }
      client = new AppClient({ ...defaultOptions, headers: clientHeaders })
      global.fetch = mockFetch({ ok: true })
      await client.request('/test', { headers: methodHeaders })
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: { ...clientHeaders, ...methodHeaders, Accept: 'application/json', 'Content-Type': 'application/json' },
      }))
    })

    it('should correctly handle FormData body', async () => {
        const formData = new FormData()
        formData.append('key', 'value')
        global.fetch = mockFetch({ success: true })
        await client.request('/upload', { method: 'POST', body: formData })
        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            body: formData, // FormData should be passed directly
            // Content-Type for FormData is usually set by fetch automatically
        }))
    })

    it('should handle baseUrl with trailing slash', async () => {
        client = new AppClient({ ...defaultOptions, baseUrl: 'http://localhost:3000/api/' }); // note the trailing slash
        global.fetch = mockFetch({ ok: true });
        await client.ok();
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/ok', expect.any(Object));
    });

    it('should handle stream responses', async () => {
        const mockStreamResponse = {
            ok: true,
            status: 200,
            // Simulate a streamable response (e.g., ReadableStream)
            // For testing, we can just return the response object itself.
            // In a real scenario, this would be a ReadableStream.
            bodyUsed: false,
            headers: new Headers(),
            redirected: false,
            statusText: "OK",
            type: "default",
            url: "",
            clone: vi.fn(),
            arrayBuffer: vi.fn(),
            blob: vi.fn(),
            formData: vi.fn(),
            json: vi.fn().mockRejectedValue(new Error("Cannot parse JSON from stream directly")), // Ensure json() is not called
            text: vi.fn().mockRejectedValue(new Error("Cannot parse text from stream directly")),   // Ensure text() is not called
        } as unknown as Response;

        global.fetch = vi.fn().mockResolvedValue(mockStreamResponse);
        const response = await client.request<Response>('/stream-endpoint', { stream: true });

        expect(response).toBe(mockStreamResponse);
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}/stream-endpoint`, expect.objectContaining({
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: undefined,
            credentials: 'include',
            stream: true
        }));
        expect(response.json).not.toHaveBeenCalled();
        expect(response.text).not.toHaveBeenCalled();
    });
  })
})
