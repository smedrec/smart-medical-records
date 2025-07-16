import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuditDb } from '../db/index.js'
import { AuditGDPRIntegration } from '../gdpr-integration.js'

// Mock the AuditDb class
vi.mock('../db/index.js', () => ({
	AuditDb: vi.fn().mockImplementation(() => ({
		getDrizzleInstance: vi.fn().mockReturnValue({
			select: vi.fn(),
			insert: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		}),
		checkAuditDbConnection: vi.fn().mockResolvedValue(true),
		end: vi.fn().mockResolvedValue(undefined),
	})),
}))

// Mock the GDPR compliance service
vi.mock('@repo/audit', () => ({
	GDPRComplianceService: vi.fn().mockImplementation(() => ({
		exportUserData: vi.fn(),
		pseudonymizeUserData: vi.fn(),
		deleteUserDataWithAuditTrail: vi.fn(),
		applyRetentionPolicies: vi.fn(),
	})),
	GDPRUtils: {
		validateExportRequest: vi.fn(),
		maskSensitiveData: vi.fn().mockImplementation((data) => data.replace(/./g, '*')),
		generateComplianceMetadata: vi.fn(),
		isComplianceCriticalAction: vi.fn(),
		validateDataClassification: vi.fn(),
		getRecommendedRetentionPolicy: vi.fn(),
		generateTrackingId: vi.fn().mockReturnValue('gdpr-test-123-abc'),
	},
}))

describe('AuditGDPRIntegration', () => {
	let gdprIntegration: AuditGDPRIntegration
	let mockAuditDb: any
	let mockGdprService: any
	let mockDb: any

	beforeEach(() => {
		vi.clearAllMocks()

		// Setup mock database
		mockDb = {
			select: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			values: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			then: vi.fn(),
		}

		mockAuditDb = new AuditDb('mock-url')
		mockAuditDb.getDrizzleInstance.mockReturnValue(mockDb)

		gdprIntegration = new AuditGDPRIntegration(mockAuditDb)

		// Get the mocked GDPR service instance
		const { GDPRComplianceService } = require('@repo/audit')
		mockGdprService = new GDPRComplianceService()
	})

	describe('processDataAccessRequest', () => {
		it('should process valid data access request', async () => {
			const { GDPRUtils } = require('@repo/audit')

			// Mock validation
			GDPRUtils.validateExportRequest.mockReturnValue({
				valid: true,
				errors: [],
			})

			// Mock export result
			const mockExportResult = {
				requestId: 'req-123',
				principalId: 'user-123',
				exportTimestamp: '2024-01-15T10:00:00Z',
				format: 'json',
				recordCount: 5,
				dataSize: 1024,
				data: Buffer.from('{"test": "data"}'),
				metadata: {
					dateRange: { start: '2024-01-01', end: '2024-01-15' },
					categories: ['auth.login'],
					retentionPolicies: ['standard'],
					exportedBy: 'admin-user',
				},
			}

			mockGdprService.exportUserData.mockResolvedValue(mockExportResult)

			// Mock compliance metadata
			GDPRUtils.generateComplianceMetadata.mockReturnValue({
				gdprOperation: 'access_request',
				timestamp: '2024-01-15T10:00:00Z',
			})

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'json' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprIntegration.processDataAccessRequest(request)

			expect(GDPRUtils.validateExportRequest).toHaveBeenCalledWith(request)
			expect(mockGdprService.exportUserData).toHaveBeenCalledWith(request)
			expect(result).toEqual(mockExportResult)
		})

		it('should throw error for invalid request', async () => {
			const { GDPRUtils } = require('@repo/audit')

			GDPRUtils.validateExportRequest.mockReturnValue({
				valid: false,
				errors: ['Principal ID is required'],
			})

			const invalidRequest = {
				requestType: 'access' as const,
				format: 'json' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			await expect(gdprIntegration.processDataAccessRequest(invalidRequest as any)).rejects.toThrow(
				'Invalid GDPR request: Principal ID is required'
			)
		})
	})

	describe('processDataErasureRequest', () => {
		it('should process erasure request with compliance preservation', async () => {
			// Mock compliance records check
			mockDb.then.mockResolvedValueOnce([{ id: 1 }]) // Has compliance records

			// Mock deletion result
			mockGdprService.deleteUserDataWithAuditTrail.mockResolvedValue({
				recordsDeleted: 3,
				complianceRecordsPreserved: 2,
			})

			const result = await gdprIntegration.processDataErasureRequest('user-123', 'admin-user', true)

			expect(result.success).toBe(true)
			expect(result.summary.recordsDeleted).toBe(3)
			expect(result.summary.complianceRecordsPreserved).toBe(2)
			expect(mockGdprService.deleteUserDataWithAuditTrail).toHaveBeenCalledWith(
				'user-123',
				'admin-user',
				true
			)
		})

		it('should process complete erasure request', async () => {
			// Mock no compliance records
			mockDb.then.mockResolvedValueOnce([]) // No compliance records

			// Mock deletion result
			mockGdprService.deleteUserDataWithAuditTrail.mockResolvedValue({
				recordsDeleted: 5,
				complianceRecordsPreserved: 0,
			})

			const result = await gdprIntegration.processDataErasureRequest(
				'user-123',
				'admin-user',
				false
			)

			expect(result.success).toBe(true)
			expect(result.summary.recordsDeleted).toBe(5)
			expect(result.summary.complianceRecordsPreserved).toBe(0)
			expect(mockGdprService.deleteUserDataWithAuditTrail).toHaveBeenCalledWith(
				'user-123',
				'admin-user',
				false
			)
		})

		it('should handle erasure request errors', async () => {
			// Mock compliance records check
			mockDb.then.mockResolvedValueOnce([])

			// Mock deletion error
			mockGdprService.deleteUserDataWithAuditTrail.mockRejectedValue(
				new Error('Database connection failed')
			)

			const result = await gdprIntegration.processDataErasureRequest(
				'user-123',
				'admin-user',
				false
			)

			expect(result.success).toBe(false)
			expect(result.summary.error).toBe('Database connection failed')
		})
	})

	describe('processDataPortabilityRequest', () => {
		it('should process data portability request', async () => {
			const { GDPRUtils } = require('@repo/audit')

			// Mock validation
			GDPRUtils.validateExportRequest.mockReturnValue({
				valid: true,
				errors: [],
			})

			// Mock export result
			const mockExportResult = {
				requestId: 'req-456',
				principalId: 'user-123',
				exportTimestamp: '2024-01-15T10:00:00Z',
				format: 'json',
				recordCount: 3,
				dataSize: 512,
				data: Buffer.from('{"portable": "data"}'),
				metadata: {
					dateRange: { start: '2024-01-01', end: '2024-01-15' },
					categories: ['data.export'],
					retentionPolicies: ['standard'],
					exportedBy: 'admin-user',
				},
			}

			mockGdprService.exportUserData.mockResolvedValue(mockExportResult)
			GDPRUtils.generateComplianceMetadata.mockReturnValue({})

			const result = await gdprIntegration.processDataPortabilityRequest(
				'user-123',
				'admin-user',
				'json'
			)

			expect(result).toEqual(mockExportResult)
			expect(mockGdprService.exportUserData).toHaveBeenCalledWith(
				expect.objectContaining({
					principalId: 'user-123',
					requestType: 'portability',
					format: 'json',
					requestedBy: 'admin-user',
					includeMetadata: true,
				})
			)
		})
	})

	describe('pseudonymizeUserData', () => {
		it('should pseudonymize user data successfully', async () => {
			mockGdprService.pseudonymizeUserData.mockResolvedValue({
				pseudonymId: 'pseudo-abc123',
				recordsAffected: 4,
			})

			const result = await gdprIntegration.pseudonymizeUserData('user-123', 'admin-user', 'hash')

			expect(result.success).toBe(true)
			expect(result.pseudonymId).toBe('pseudo-abc123')
			expect(result.recordsAffected).toBe(4)
			expect(mockGdprService.pseudonymizeUserData).toHaveBeenCalledWith(
				'user-123',
				'hash',
				'admin-user'
			)
		})

		it('should handle pseudonymization errors', async () => {
			mockGdprService.pseudonymizeUserData.mockRejectedValue(new Error('Pseudonymization failed'))

			const result = await gdprIntegration.pseudonymizeUserData('user-123', 'admin-user', 'hash')

			expect(result.success).toBe(false)
			expect(result.pseudonymId).toBeUndefined()
			expect(result.recordsAffected).toBeUndefined()
		})
	})

	describe('applyDataRetentionPolicies', () => {
		it('should apply retention policies successfully', async () => {
			const mockResults = [
				{
					recordsArchived: 10,
					recordsDeleted: 5,
					archivedAt: '2024-01-15T10:00:00Z',
					policy: 'standard',
					summary: {
						byClassification: { PHI: 8, INTERNAL: 2 },
						byAction: { 'fhir.patient.read': 6, 'auth.login': 4 },
						dateRange: { start: '2024-01-01', end: '2024-01-15' },
					},
				},
				{
					recordsArchived: 3,
					recordsDeleted: 1,
					archivedAt: '2024-01-15T10:00:00Z',
					policy: 'extended',
					summary: {
						byClassification: { CONFIDENTIAL: 3 },
						byAction: { 'data.export': 3 },
						dateRange: { start: '2024-01-01', end: '2024-01-15' },
					},
				},
			]

			mockGdprService.applyRetentionPolicies.mockResolvedValue(mockResults)

			const results = await gdprIntegration.applyDataRetentionPolicies()

			expect(results).toEqual(mockResults)
			expect(mockGdprService.applyRetentionPolicies).toHaveBeenCalled()
		})

		it('should handle retention policy errors', async () => {
			mockGdprService.applyRetentionPolicies.mockRejectedValue(
				new Error('Policy application failed')
			)

			await expect(gdprIntegration.applyDataRetentionPolicies()).rejects.toThrow(
				'Policy application failed'
			)
		})
	})

	describe('createRetentionPolicy', () => {
		it('should create retention policy with valid data classification', async () => {
			const { GDPRUtils } = require('@repo/audit')

			GDPRUtils.validateDataClassification.mockReturnValue(true)
			GDPRUtils.getRecommendedRetentionPolicy.mockReturnValue({
				retentionDays: 365,
				archiveAfterDays: 90,
				deleteAfterDays: 365,
				policyName: 'test_policy',
			})

			mockDb.then.mockResolvedValue([])

			const policy = {
				policyName: 'custom_policy',
				dataClassification: 'PHI',
				retentionDays: 2555,
			}

			await gdprIntegration.createRetentionPolicy(policy)

			expect(GDPRUtils.validateDataClassification).toHaveBeenCalledWith('PHI')
			expect(mockDb.insert).toHaveBeenCalled()
			expect(mockDb.values).toHaveBeenCalledWith(
				expect.objectContaining({
					policyName: 'custom_policy',
					retentionDays: 2555,
					dataClassification: 'PHI',
					isActive: 'true',
					createdBy: 'system',
				})
			)
		})

		it('should reject invalid data classification', async () => {
			const { GDPRUtils } = require('@repo/audit')

			GDPRUtils.validateDataClassification.mockReturnValue(false)

			const policy = {
				policyName: 'invalid_policy',
				dataClassification: 'INVALID',
				retentionDays: 365,
			}

			await expect(gdprIntegration.createRetentionPolicy(policy)).rejects.toThrow(
				'Invalid data classification: INVALID'
			)
		})
	})

	describe('getComplianceStatus', () => {
		it('should return compliance status for user with data', async () => {
			const { GDPRUtils } = require('@repo/audit')

			const mockRecords = [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00Z',
					action: 'fhir.patient.read',
					dataClassification: 'PHI',
					retentionPolicy: 'healthcare',
				},
				{
					id: 2,
					timestamp: '2024-01-02T11:00:00Z',
					action: 'auth.login.success',
					dataClassification: 'INTERNAL',
					retentionPolicy: 'standard',
				},
				{
					id: 3,
					timestamp: '2024-01-03T12:00:00Z',
					action: 'gdpr.data.export',
					dataClassification: 'PHI',
					retentionPolicy: 'gdpr_compliance',
				},
			]

			mockDb.then.mockResolvedValue(mockRecords)
			GDPRUtils.isComplianceCriticalAction.mockImplementation(
				(action) => action.includes('auth.') || action.includes('gdpr.')
			)

			const status = await gdprIntegration.getComplianceStatus('user-123')

			expect(status.hasData).toBe(true)
			expect(status.recordCount).toBe(3)
			expect(status.dataClassifications).toEqual(['PHI', 'INTERNAL'])
			expect(status.retentionPolicies).toEqual(['healthcare', 'standard', 'gdpr_compliance'])
			expect(status.oldestRecord).toBe('2024-01-01T10:00:00Z')
			expect(status.newestRecord).toBe('2024-01-03T12:00:00Z')
			expect(status.complianceCriticalRecords).toBe(2)
		})

		it('should return empty status for user with no data', async () => {
			mockDb.then.mockResolvedValue([])

			const status = await gdprIntegration.getComplianceStatus('user-nonexistent')

			expect(status.hasData).toBe(false)
			expect(status.recordCount).toBe(0)
			expect(status.dataClassifications).toEqual([])
			expect(status.retentionPolicies).toEqual([])
			expect(status.complianceCriticalRecords).toBe(0)
		})
	})

	describe('generateComplianceReport', () => {
		it('should generate comprehensive compliance report', async () => {
			const { GDPRUtils } = require('@repo/audit')

			const mockRecords = [
				{
					timestamp: '2024-01-01T10:00:00Z',
					action: 'fhir.patient.read',
					dataClassification: 'PHI',
					retentionPolicy: 'healthcare',
				},
				{
					timestamp: '2024-01-02T11:00:00Z',
					action: 'gdpr.data.export',
					dataClassification: 'PHI',
					retentionPolicy: 'gdpr_compliance',
				},
				{
					timestamp: '2024-01-03T12:00:00Z',
					action: 'auth.login.success',
					dataClassification: 'INTERNAL',
					retentionPolicy: 'standard',
				},
			]

			mockDb.then.mockResolvedValue(mockRecords)
			GDPRUtils.generateTrackingId.mockReturnValue('gdpr-compliance-report-123-abc')

			const report = await gdprIntegration.generateComplianceReport({
				start: '2024-01-01T00:00:00Z',
				end: '2024-01-31T23:59:59Z',
			})

			expect(report.reportId).toBe('gdpr-compliance-report-123-abc')
			expect(report.summary.totalRecords).toBe(3)
			expect(report.summary.dataClassifications).toEqual({
				PHI: 2,
				INTERNAL: 1,
			})
			expect(report.summary.retentionPolicies).toEqual({
				healthcare: 1,
				gdpr_compliance: 1,
				standard: 1,
			})
			expect(report.summary.gdprOperations).toEqual({
				'gdpr.data.export': 1,
			})
			expect(report.recommendations).toBeInstanceOf(Array)
		})

		it('should generate recommendations based on data analysis', async () => {
			const mockRecords = [
				{
					timestamp: '2024-01-01T10:00:00Z',
					action: 'fhir.patient.read',
					dataClassification: 'PHI',
					retentionPolicy: 'standard', // Not healthcare-specific
				},
			]

			mockDb.then.mockResolvedValue(mockRecords)

			const report = await gdprIntegration.generateComplianceReport()

			expect(report.recommendations).toContain(
				'Consider implementing healthcare-specific retention policy for PHI data'
			)
			expect(report.recommendations).toContain(
				'No GDPR operations detected - ensure compliance processes are being used'
			)
		})

		it('should recommend archival for large datasets', async () => {
			// Create a large mock dataset
			const mockRecords = Array.from({ length: 150000 }, (_, i) => ({
				timestamp: '2024-01-01T10:00:00Z',
				action: 'test.action',
				dataClassification: 'INTERNAL',
				retentionPolicy: 'standard',
			}))

			mockDb.then.mockResolvedValue(mockRecords)

			const report = await gdprIntegration.generateComplianceReport()

			expect(report.recommendations).toContain(
				'Large audit dataset detected - consider implementing data archival policies'
			)
		})
	})
})
