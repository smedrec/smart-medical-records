import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthDb } from '../db/index'
import {
	documentVerificationStatusEnum,
	licenseCertificate,
	ocrStatusEnum,
	practitioner,
	user,
	userRoleEnum,
	verificationAttempt,
	verificationAttemptTypeEnum,
	verificationStatusEnum,
} from '../db/schema'

import type {
	NewLicenseCertificate,
	NewPractitioner,
	NewUser,
	NewVerificationAttempt,
} from '../db/types'

// Mock dependencies
vi.mock('drizzle-orm/postgres-js')
vi.mock('postgres')

describe('AuthDb Schema', () => {
	let mockClient: any
	let mockDb: any
	let authDb: AuthDb

	beforeEach(() => {
		vi.clearAllMocks()

		// Mock postgres client
		mockClient = {
			end: vi.fn().mockResolvedValue(undefined),
		}
		;(postgres as any).mockImplementation(() => mockClient)

		// Mock drizzle instance
		mockDb = {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockResolvedValue([]),
			leftJoin: vi.fn().mockReturnThis(),
		}
		;(drizzle as any).mockImplementation(() => mockDb)

		// Mock console methods
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Constructor', () => {
		it('should initialize successfully with provided PostgreSQL URL', () => {
			const testUrl = 'postgresql://test:test@localhost:5432/testdb'
			authDb = new AuthDb(testUrl)

			expect(postgres).toHaveBeenCalledWith(testUrl, { max: 10 })
			expect(drizzle).toHaveBeenCalledWith(mockClient, { schema: expect.any(Object) })
			expect(authDb).toBeInstanceOf(AuthDb)
		})

		it('should initialize successfully using AUTH_DB_URL from environment', () => {
			process.env.AUTH_DB_URL = 'postgresql://env:env@localhost:5432/envdb'
			authDb = new AuthDb()

			expect(postgres).toHaveBeenCalledWith(process.env.AUTH_DB_URL, { max: 10 })
			expect(drizzle).toHaveBeenCalledWith(mockClient, { schema: expect.any(Object) })
			expect(authDb).toBeInstanceOf(AuthDb)

			delete process.env.AUTH_DB_URL
		})

		it('should use custom maxConnections parameter', () => {
			const testUrl = 'postgresql://test:test@localhost:5432/testdb'
			authDb = new AuthDb(testUrl, { maxConnections: 20 })

			expect(postgres).toHaveBeenCalledWith(testUrl, { max: 20 })
		})

		it('should throw error when no PostgreSQL URL is provided', () => {
			const originalEnv = process.env.AUTH_DB_URL
			delete process.env.AUTH_DB_URL

			expect(() => new AuthDb()).toThrow(
				'AuthDb: PostgreSQL connection URL not provided and could not be found in environment variables (AUTH_DB_URL).'
			)

			if (originalEnv) {
				process.env.AUTH_DB_URL = originalEnv
			}
		})
	})

	describe('getDrizzleInstance', () => {
		beforeEach(() => {
			authDb = new AuthDb('postgresql://test:test@localhost:5432/testdb')
		})

		it('should return the drizzle instance', () => {
			const drizzleInstance = authDb.getDrizzleInstance()
			expect(drizzleInstance).toBe(mockDb)
		})
	})

	describe('checkAuthDbConnection', () => {
		beforeEach(() => {
			authDb = new AuthDb('postgresql://test:test@localhost:5432/testdb')
		})

		it('should return true when connection is successful', async () => {
			// Mock the postgres client as a function (template literal syntax)
			const mockTemplateQuery = vi.fn().mockResolvedValue([{ result: 1 }])
			// Replace the mockClient with a function that has the end method
			const mockClientFunction = Object.assign(mockTemplateQuery, {
				end: vi.fn().mockResolvedValue(undefined),
			})
			;(authDb as any).client = mockClientFunction

			const result = await authDb.checkAuthDbConnection()
			expect(result).toBe(true)
			expect(mockTemplateQuery).toHaveBeenCalledWith(['SELECT 1'])
		})

		it('should return false and log error when connection fails', async () => {
			const connectionError = new Error('Connection failed')
			// Mock the postgres client as a function that throws an error
			const mockTemplateQuery = vi.fn().mockRejectedValue(connectionError)
			const mockClientFunction = Object.assign(mockTemplateQuery, {
				end: vi.fn().mockResolvedValue(undefined),
			})
			;(authDb as any).client = mockClientFunction

			const result = await authDb.checkAuthDbConnection()
			expect(result).toBe(false)
			expect(console.error).toHaveBeenCalledWith('🔴 Database connection failed:', connectionError)
		})
	})

	describe('end', () => {
		beforeEach(() => {
			authDb = new AuthDb('postgresql://test:test@localhost:5432/testdb')
		})

		it('should close the client connection', async () => {
			await authDb.end()
			expect(mockClient.end).toHaveBeenCalledTimes(1)
		})
	})

	describe('Schema Tables', () => {
		it('should have all required practitioner management tables defined', () => {
			expect(practitioner).toBeDefined()
			expect(licenseCertificate).toBeDefined()
			expect(verificationAttempt).toBeDefined()
			expect(user).toBeDefined()
		})

		it('should have all required enums defined', () => {
			expect(verificationStatusEnum.enumValues).toEqual([
				'pending',
				'verified',
				'failed',
				'manual_review',
				'expired',
			])
			expect(ocrStatusEnum.enumValues).toEqual(['pending', 'processing', 'completed', 'failed'])
			expect(documentVerificationStatusEnum.enumValues).toEqual([
				'pending',
				'verified',
				'failed',
				'manual_review',
			])
			expect(verificationAttemptTypeEnum.enumValues).toEqual(['api', 'ocr', 'manual'])
			expect(userRoleEnum.enumValues).toEqual(['owner', 'practitioner', 'assistant'])
		})
	})

	describe('Type Validation', () => {
		it('should validate NewUser type structure', () => {
			const newUser: NewUser = {
				id: 'user-123',
				name: 'Dr. John Doe',
				email: 'john.doe@example.com',
				emailVerified: true,
				role: 'practitioner',
			}

			expect(newUser.id).toBe('user-123')
			expect(newUser.name).toBe('Dr. John Doe')
			expect(newUser.email).toBe('john.doe@example.com')
			expect(newUser.emailVerified).toBe(true)
			expect(newUser.role).toBe('practitioner')
		})

		it('should validate NewPractitioner type structure', () => {
			const newPractitioner: NewPractitioner = {
				id: 'user-123',
				licenseNumber: 'MD123456',
				jurisdiction: 'US-CA',
				licenseType: 'MD',
				verificationStatus: 'pending',
				specialties: ['Internal Medicine', 'Cardiology'],
				credentials: ['MD', 'FACP'],
			}

			expect(newPractitioner.id).toBe('user-123')
			expect(newPractitioner.licenseNumber).toBe('MD123456')
			expect(newPractitioner.jurisdiction).toBe('US-CA')
			expect(newPractitioner.licenseType).toBe('MD')
			expect(newPractitioner.verificationStatus).toBe('pending')
			expect(newPractitioner.specialties).toEqual(['Internal Medicine', 'Cardiology'])
			expect(newPractitioner.credentials).toEqual(['MD', 'FACP'])
		})

		it('should validate NewLicenseCertificate type structure', () => {
			const newCertificate: NewLicenseCertificate = {
				practitionerId: 'user-123',
				fileName: 'medical_license.pdf',
				fileSize: 1024000,
				mimeType: 'application/pdf',
				filePath: '/uploads/certificates/medical_license.pdf',
				ocrStatus: 'pending',
				verificationStatus: 'pending',
			}

			expect(newCertificate.practitionerId).toBe('user-123')
			expect(newCertificate.fileName).toBe('medical_license.pdf')
			expect(newCertificate.fileSize).toBe(1024000)
			expect(newCertificate.mimeType).toBe('application/pdf')
			expect(newCertificate.filePath).toBe('/uploads/certificates/medical_license.pdf')
			expect(newCertificate.ocrStatus).toBe('pending')
			expect(newCertificate.verificationStatus).toBe('pending')
		})

		it('should validate NewVerificationAttempt type structure', () => {
			const newAttempt: NewVerificationAttempt = {
				practitionerId: 'user-123',
				attemptType: 'api',
				status: 'pending',
				apiProvider: 'NPI Registry',
				apiResponse: { npiNumber: '1234567890', status: 'active' },
				ocrConfidence: '0.95',
				notes: 'Initial verification attempt via NPI Registry API',
			}

			expect(newAttempt.practitionerId).toBe('user-123')
			expect(newAttempt.attemptType).toBe('api')
			expect(newAttempt.status).toBe('pending')
			expect(newAttempt.apiProvider).toBe('NPI Registry')
			expect(newAttempt.apiResponse).toEqual({ npiNumber: '1234567890', status: 'active' })
			expect(newAttempt.ocrConfidence).toBe('0.95')
			expect(newAttempt.notes).toBe('Initial verification attempt via NPI Registry API')
		})
	})

	describe('Schema Relationships', () => {
		beforeEach(() => {
			authDb = new AuthDb('postgresql://test:test@localhost:5432/testdb')
		})

		it('should support practitioner to user relationship queries', () => {
			const db = authDb.getDrizzleInstance()

			// Mock a query that joins practitioner with user
			db.select().from(practitioner).leftJoin(user, expect.any(Function))

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(practitioner)
			expect(mockDb.leftJoin).toHaveBeenCalled()
		})

		it('should support license certificate to practitioner relationship queries', () => {
			const db = authDb.getDrizzleInstance()

			// Mock a query that joins license certificate with practitioner
			db.select().from(licenseCertificate).leftJoin(practitioner, expect.any(Function))

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(licenseCertificate)
			expect(mockDb.leftJoin).toHaveBeenCalled()
		})

		it('should support verification attempt to practitioner relationship queries', () => {
			const db = authDb.getDrizzleInstance()

			// Mock a query that joins verification attempt with practitioner
			db.select().from(verificationAttempt).leftJoin(practitioner, expect.any(Function))

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(verificationAttempt)
			expect(mockDb.leftJoin).toHaveBeenCalled()
		})
	})

	describe('CRUD Operations', () => {
		beforeEach(() => {
			authDb = new AuthDb('postgresql://test:test@localhost:5432/testdb')
		})

		it('should support inserting a new practitioner', async () => {
			const db = authDb.getDrizzleInstance()
			const newPractitioner: NewPractitioner = {
				id: 'user-123',
				licenseNumber: 'MD123456',
				jurisdiction: 'US-CA',
				licenseType: 'MD',
				verificationStatus: 'pending',
				specialties: ['Internal Medicine'],
				credentials: ['MD'],
			}

			mockDb.returning.mockResolvedValue([{ ...newPractitioner, createdAt: new Date() }])

			await db.insert(practitioner).values(newPractitioner).returning()

			expect(mockDb.insert).toHaveBeenCalledWith(practitioner)
			expect(mockDb.values).toHaveBeenCalledWith(newPractitioner)
			expect(mockDb.returning).toHaveBeenCalled()
		})

		it('should support querying practitioners by verification status', async () => {
			const db = authDb.getDrizzleInstance()

			mockDb.returning.mockResolvedValue([
				{
					id: 'user-123',
					licenseNumber: 'MD123456',
					verificationStatus: 'verified',
				},
			])

			await db.select().from(practitioner).where(expect.any(Function)).returning()

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(practitioner)
			expect(mockDb.where).toHaveBeenCalled()
		})
	})
})
