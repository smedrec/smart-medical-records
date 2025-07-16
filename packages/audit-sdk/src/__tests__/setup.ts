/**
 * Test setup file for Audit SDK tests
 */

import { vi } from 'vitest'

// Mock Node.js crypto module for consistent testing
vi.mock('crypto', async (importOriginal) => {
	const actual = await importOriginal<typeof import('crypto')>()
	return {
		...actual,
		createHash: vi.fn().mockReturnValue({
			update: vi.fn().mockReturnThis(),
			digest: vi.fn().mockReturnValue('mocked-hash-value'),
		}),
		createHmac: vi.fn().mockReturnValue({
			update: vi.fn().mockReturnThis(),
			digest: vi.fn().mockReturnValue('mocked-signature-value'),
		}),
		randomBytes: actual.randomBytes,
	}
})

// Mock Redis for unit tests
vi.mock('ioredis', () => {
	const mockRedis = {
		status: 'ready',
		on: vi.fn(),
		quit: vi.fn().mockResolvedValue('OK'),
		disconnect: vi.fn().mockResolvedValue(undefined),
		llen: vi.fn().mockResolvedValue(0),
		lrange: vi.fn().mockResolvedValue([]),
		del: vi.fn().mockResolvedValue(1),
	}

	return {
		default: vi.fn().mockImplementation(() => mockRedis),
		Redis: vi.fn().mockImplementation(() => mockRedis),
	}
})

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.AUDIT_SECRET_KEY = 'test-secret-key-for-unit-tests'

// Global test timeout
vi.setConfig({ testTimeout: 5000 })
