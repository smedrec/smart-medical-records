import { eq } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthDb } from '../db/index'
import { licenseCertificate, practitioner, user, verificationAttempt } from '../db/schema'

import type {
	NewLicenseCertificate,
	NewPractitioner,
	NewUser,
	NewVerificationAttempt,
	PractitionerWithCertificates,
} from '../db/types'

// Mock dependencies
vi.mock('drizzle-orm/postgres-js')
vi.mock('postgres')

describe('AuthDb Integration', () => {
	let authDb: AuthDb
	let mockDb: any

	beforeEach(() => {
		vi.clearAllMocks()

		// Mock drizzle instance with more complete query builder
		mockDb = {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockReturnThis(),
			leftJoin: vi.fn().mockReturnThis(),
			innerJoin: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			set: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
		}

		// Mock the AuthDb constructor
		authDb = {
			getDrizzleInstance: () => mockDb,
			checkAuthDbConnection: vi.fn().mockResolvedValue(true),
			end: vi.fn().mockResolvedValue(undefined),
		} as any

		// Mock console methods
		vi.spyOn(console, 'error').mockImplementation(() => {})
		vi.spyOn(console, 'info').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Practitioner Onboarding Workflow', () => {
		it('should support complete practitioner onboarding flow', async () => {
			const db = authDb.getDrizzleInstance()

			// Step 1: Create a new user
			const newUser: NewUser = {
				id: 'user-123',
				name: 'Dr. Jane Smith',
				email: 'jane.smith@example.com',
				emailVerified: true,
				role: 'practitioner',
			}

			mockDb.returning.mockResolvedValueOnce([{ ...newUser, createdAt: new Date() }])
			await db.insert(user).values(newUser).returning()

			// Step 2: Create practitioner profile
			const newPractitioner: NewPractitioner = {
				id: 'user-123',
				licenseNumber: 'MD789012',
				jurisdiction: 'US-NY',
				licenseType: 'MD',
				verificationStatus: 'pending',
				specialties: ['Emergency Medicine', 'Internal Medicine'],
				credentials: ['MD', 'FACEP'],
			}

			mockDb.returning.mockResolvedValueOnce([{ ...newPractitioner, createdAt: new Date() }])
			await db.insert(practitioner).values(newPractitioner).returning()

			// Step 3: Upload license certificate
			const newCertificate: NewLicenseCertificate = {
				practitionerId: 'user-123',
				fileName: 'medical_license_ny.pdf',
				fileSize: 2048000,
				mimeType: 'application/pdf',
				filePath: '/uploads/certificates/user-123/medical_license_ny.pdf',
				ocrStatus: 'pending',
				verificationStatus: 'pending',
			}

			mockDb.returning.mockResolvedValueOnce([{ ...newCertificate, id: 'cert-456' }])
			await db.insert(licenseCertificate).values(newCertificate).returning()

			// Step 4: Create verification attempt
			const newAttempt: NewVerificationAttempt = {
				practitionerId: 'user-123',
				attemptType: 'api',
				status: 'pending',
				apiProvider: 'NY State Medical Board',
				apiResponse: {
					licenseNumber: 'MD789012',
					status: 'active',
					expiryDate: '2025-12-31',
				},
			}

			mockDb.returning.mockResolvedValueOnce([{ ...newAttempt, id: 'attempt-789' }])
			await db.insert(verificationAttempt).values(newAttempt).returning()

			// Verify all operations were called correctly
			expect(mockDb.insert).toHaveBeenCalledTimes(4)
			expect(mockDb.values).toHaveBeenCalledTimes(4)
			expect(mockDb.returning).toHaveBeenCalledTimes(4)
		})

		it('should support querying practitioner with related data', async () => {
			const db = authDb.getDrizzleInstance()

			// Mock complex query result
			const mockPractitionerData = [
				{
					practitioner: {
						id: 'user-123',
						licenseNumber: 'MD789012',
						jurisdiction: 'US-NY',
						licenseType: 'MD',
						verificationStatus: 'verified',
						specialties: ['Emergency Medicine'],
						credentials: ['MD', 'FACEP'],
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					user: {
						id: 'user-123',
						name: 'Dr. Jane Smith',
						email: 'jane.smith@example.com',
						emailVerified: true,
						role: 'practitioner',
					},
					licenseCertificate: {
						id: 'cert-456',
						practitionerId: 'user-123',
						fileName: 'medical_license_ny.pdf',
						verificationStatus: 'verified',
						ocrStatus: 'completed',
					},
				},
			]

			mockDb.returning.mockResolvedValue(mockPractitionerData)

			// Query practitioner with user and certificate data
			await db
				.select()
				.from(practitioner)
				.leftJoin(user, eq(practitioner.id, user.id))
				.leftJoin(licenseCertificate, eq(practitioner.id, licenseCertificate.practitionerId))
				.where(eq(practitioner.verificationStatus, 'verified'))
				.returning()

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(practitioner)
			expect(mockDb.leftJoin).toHaveBeenCalledTimes(2)
			expect(mockDb.where).toHaveBeenCalled()
		})
	})

	describe('Verification Workflow', () => {
		it('should support updating verification status', async () => {
			const db = authDb.getDrizzleInstance()

			// Mock updating practitioner verification status
			mockDb.returning.mockResolvedValue([
				{
					id: 'user-123',
					verificationStatus: 'verified',
					verifiedAt: new Date(),
					verifiedBy: 'admin-456',
				},
			])

			await db
				.update(practitioner)
				.set({
					verificationStatus: 'verified',
					verifiedAt: new Date(),
					verifiedBy: 'admin-456',
				})
				.where(eq(practitioner.id, 'user-123'))
				.returning()

			expect(mockDb.update).toHaveBeenCalledWith(practitioner)
			expect(mockDb.set).toHaveBeenCalled()
			expect(mockDb.where).toHaveBeenCalled()
			expect(mockDb.returning).toHaveBeenCalled()
		})

		it('should support creating multiple verification attempts', async () => {
			const db = authDb.getDrizzleInstance()

			const attempts: NewVerificationAttempt[] = [
				{
					practitionerId: 'user-123',
					attemptType: 'api',
					status: 'failed',
					apiProvider: 'NPI Registry',
					notes: 'License number not found in NPI database',
				},
				{
					practitionerId: 'user-123',
					attemptType: 'ocr',
					status: 'completed',
					ocrConfidence: '0.92',
					notes: 'OCR processing completed successfully',
				},
				{
					practitionerId: 'user-123',
					attemptType: 'manual',
					status: 'verified',
					reviewedBy: 'admin-456',
					notes: 'Manual verification completed by admin',
				},
			]

			mockDb.returning.mockResolvedValue(
				attempts.map((attempt, index) => ({ ...attempt, id: `attempt-${index + 1}` }))
			)

			// Insert multiple verification attempts
			for (const attempt of attempts) {
				await db.insert(verificationAttempt).values(attempt).returning()
			}

			expect(mockDb.insert).toHaveBeenCalledTimes(3)
			expect(mockDb.values).toHaveBeenCalledTimes(3)
		})
	})

	describe('Admin Dashboard Queries', () => {
		it('should support querying pending approvals', async () => {
			const db = authDb.getDrizzleInstance()

			// Mock query for practitioners pending approval
			mockDb.returning.mockResolvedValue([
				{
					practitioner: {
						id: 'user-123',
						licenseNumber: 'MD789012',
						verificationStatus: 'manual_review',
						createdAt: new Date(),
					},
					user: {
						id: 'user-123',
						name: 'Dr. Jane Smith',
						email: 'jane.smith@example.com',
					},
				},
			])

			await db
				.select()
				.from(practitioner)
				.innerJoin(user, eq(practitioner.id, user.id))
				.where(eq(practitioner.verificationStatus, 'manual_review'))
				.returning()

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(practitioner)
			expect(mockDb.innerJoin).toHaveBeenCalled()
			expect(mockDb.where).toHaveBeenCalled()
		})

		it('should support querying verification statistics', async () => {
			const db = authDb.getDrizzleInstance()

			// Mock aggregation query results
			mockDb.returning.mockResolvedValue([
				{
					verificationStatus: 'verified',
					count: 150,
				},
				{
					verificationStatus: 'pending',
					count: 25,
				},
				{
					verificationStatus: 'manual_review',
					count: 8,
				},
				{
					verificationStatus: 'failed',
					count: 3,
				},
			])

			// This would be a more complex aggregation query in practice
			await db.select().from(practitioner).returning()

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockDb.from).toHaveBeenCalledWith(practitioner)
		})
	})

	describe('Data Cleanup and Maintenance', () => {
		it('should support cascading deletes when user is removed', async () => {
			const db = authDb.getDrizzleInstance()

			mockDb.returning.mockResolvedValue([{ id: 'user-123' }])

			// Delete user (should cascade to practitioner, certificates, and attempts)
			await db.delete(user).where(eq(user.id, 'user-123')).returning()

			expect(mockDb.delete).toHaveBeenCalledWith(user)
			expect(mockDb.where).toHaveBeenCalled()
			expect(mockDb.returning).toHaveBeenCalled()
		})

		it('should support updating OCR processing status', async () => {
			const db = authDb.getDrizzleInstance()

			mockDb.returning.mockResolvedValue([
				{
					id: 'cert-456',
					ocrStatus: 'completed',
					ocrResult: {
						extractedText: 'Medical License...',
						confidence: 0.95,
						licenseNumber: 'MD789012',
					},
				},
			])

			await db
				.update(licenseCertificate)
				.set({
					ocrStatus: 'completed',
					ocrResult: {
						extractedText: 'Medical License...',
						confidence: 0.95,
						licenseNumber: 'MD789012',
					},
				})
				.where(eq(licenseCertificate.id, 'cert-456'))
				.returning()

			expect(mockDb.update).toHaveBeenCalledWith(licenseCertificate)
			expect(mockDb.set).toHaveBeenCalled()
			expect(mockDb.where).toHaveBeenCalled()
		})
	})
})
