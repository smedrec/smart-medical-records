import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GDPRUtils } from '../gdpr/gdpr-utils.js'

describe('GDPRUtils', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('generateDeterministicPseudonym', () => {
		it('should generate consistent pseudonyms for the same input', () => {
			const originalId = 'user-123'
			const pseudonym1 = GDPRUtils.generateDeterministicPseudonym(originalId)
			const pseudonym2 = GDPRUtils.generateDeterministicPseudonym(originalId)

			expect(pseudonym1).toBe(pseudonym2)
			expect(pseudonym1).toMatch(/^pseudo-[a-f0-9]{16}$/)
		})

		it('should generate different pseudonyms for different inputs', () => {
			const pseudonym1 = GDPRUtils.generateDeterministicPseudonym('user-123')
			const pseudonym2 = GDPRUtils.generateDeterministicPseudonym('user-456')

			expect(pseudonym1).not.toBe(pseudonym2)
		})

		it('should use custom salt when provided', () => {
			const originalId = 'user-123'
			const pseudonym1 = GDPRUtils.generateDeterministicPseudonym(originalId, 'salt1')
			const pseudonym2 = GDPRUtils.generateDeterministicPseudonym(originalId, 'salt2')

			expect(pseudonym1).not.toBe(pseudonym2)
		})
	})

	describe('generateRandomPseudonym', () => {
		it('should generate unique random pseudonyms', () => {
			const pseudonym1 = GDPRUtils.generateRandomPseudonym()
			const pseudonym2 = GDPRUtils.generateRandomPseudonym()

			expect(pseudonym1).not.toBe(pseudonym2)
			expect(pseudonym1).toMatch(/^pseudo-[a-f0-9]{32}$/)
			expect(pseudonym2).toMatch(/^pseudo-[a-f0-9]{32}$/)
		})
	})

	describe('validateExportRequest', () => {
		it('should validate a correct export request', () => {
			const request = {
				principalId: 'user-123',
				requestType: 'access',
				format: 'json',
				requestedBy: 'admin-user',
				dateRange: {
					start: '2024-01-01T00:00:00Z',
					end: '2024-01-31T23:59:59Z',
				},
			}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(true)
			expect(result.errors).toHaveLength(0)
		})

		it('should reject request without required fields', () => {
			const request = {}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Principal ID is required')
			expect(result.errors).toContain('Request type is required')
			expect(result.errors).toContain('Export format is required')
			expect(result.errors).toContain('Requested by field is required')
		})

		it('should reject invalid request type', () => {
			const request = {
				principalId: 'user-123',
				requestType: 'invalid',
				format: 'json',
				requestedBy: 'admin-user',
			}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Invalid request type')
		})

		it('should reject invalid export format', () => {
			const request = {
				principalId: 'user-123',
				requestType: 'access',
				format: 'pdf',
				requestedBy: 'admin-user',
			}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Invalid export format')
		})

		it('should validate date range', () => {
			const request = {
				principalId: 'user-123',
				requestType: 'access',
				format: 'json',
				requestedBy: 'admin-user',
				dateRange: {
					start: '2024-01-31T00:00:00Z',
					end: '2024-01-01T23:59:59Z', // End before start
				},
			}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Date range start must be before end')
		})

		it('should require both start and end dates in range', () => {
			const request = {
				principalId: 'user-123',
				requestType: 'access',
				format: 'json',
				requestedBy: 'admin-user',
				dateRange: {
					start: '2024-01-01T00:00:00Z',
					// Missing end date
				},
			}

			const result = GDPRUtils.validateExportRequest(request)
			expect(result.valid).toBe(false)
			expect(result.errors).toContain('Date range must include both start and end dates')
		})
	})

	describe('sanitizeForExport', () => {
		it('should remove sensitive system fields', () => {
			const data = [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00Z',
					principalId: 'user-123',
					action: 'test.action',
					hash: 'sensitive-hash',
					hashAlgorithm: 'SHA-256',
					signature: 'sensitive-signature',
					processingLatency: 100,
					queueDepth: 5,
					details: {
						publicInfo: 'visible',
						internalSystemId: 'sensitive',
						debugInfo: 'sensitive',
						performanceMetrics: 'sensitive',
					},
				},
			]

			const sanitized = GDPRUtils.sanitizeForExport(data)

			expect(sanitized[0]).not.toHaveProperty('hash')
			expect(sanitized[0]).not.toHaveProperty('hashAlgorithm')
			expect(sanitized[0]).not.toHaveProperty('signature')
			expect(sanitized[0]).not.toHaveProperty('processingLatency')
			expect(sanitized[0]).not.toHaveProperty('queueDepth')

			expect(sanitized[0].details).toHaveProperty('publicInfo')
			expect(sanitized[0].details).not.toHaveProperty('internalSystemId')
			expect(sanitized[0].details).not.toHaveProperty('debugInfo')
			expect(sanitized[0].details).not.toHaveProperty('performanceMetrics')
		})

		it('should handle data without details object', () => {
			const data = [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00Z',
					principalId: 'user-123',
					action: 'test.action',
					hash: 'sensitive-hash',
				},
			]

			const sanitized = GDPRUtils.sanitizeForExport(data)

			expect(sanitized[0]).not.toHaveProperty('hash')
			expect(sanitized[0]).toHaveProperty('id')
			expect(sanitized[0]).toHaveProperty('timestamp')
		})
	})

	describe('isComplianceCriticalAction', () => {
		it('should identify compliance-critical actions', () => {
			const criticalActions = [
				'auth.login.success',
				'auth.login.failure',
				'data.access.unauthorized',
				'gdpr.data.export',
				'security.alert.generated',
				'compliance.audit.performed',
			]

			for (const action of criticalActions) {
				expect(GDPRUtils.isComplianceCriticalAction(action)).toBe(true)
			}
		})

		it('should identify non-critical actions', () => {
			const nonCriticalActions = [
				'fhir.patient.read',
				'data.create',
				'user.profile.update',
				'system.health.check',
			]

			for (const action of nonCriticalActions) {
				expect(GDPRUtils.isComplianceCriticalAction(action)).toBe(false)
			}
		})

		it('should identify actions by prefix', () => {
			expect(GDPRUtils.isComplianceCriticalAction('security.custom.action')).toBe(true)
			expect(GDPRUtils.isComplianceCriticalAction('compliance.custom.check')).toBe(true)
			expect(GDPRUtils.isComplianceCriticalAction('gdpr.custom.operation')).toBe(true)
		})
	})

	describe('calculateRetentionExpiry', () => {
		it('should calculate correct expiry date', () => {
			const createdDate = '2024-01-01T00:00:00Z'
			const retentionDays = 365

			const expiry = GDPRUtils.calculateRetentionExpiry(createdDate, retentionDays)
			const expiryDate = new Date(expiry)
			const createdDateObj = new Date(createdDate)
			const expectedDate = new Date(createdDateObj.getTime() + retentionDays * 24 * 60 * 60 * 1000)

			expect(expiryDate.getTime()).toBe(expectedDate.getTime())
		})

		it('should handle leap years correctly', () => {
			const createdDate = '2024-02-29T00:00:00Z' // Leap year
			const retentionDays = 365

			const expiry = GDPRUtils.calculateRetentionExpiry(createdDate, retentionDays)
			const expiryDate = new Date(expiry)

			// Should be Feb 28, 2025 (non-leap year)
			expect(expiryDate.getFullYear()).toBe(2025)
			expect(expiryDate.getMonth()).toBe(1) // February (0-indexed)
			expect(expiryDate.getDate()).toBe(28)
		})
	})

	describe('isEligibleForArchival', () => {
		it('should return true when data is eligible for archival', () => {
			const createdDate = '2024-01-01T00:00:00Z'
			const archiveAfterDays = 90
			const currentDate = '2024-04-01T00:00:00Z' // 91 days later

			const eligible = GDPRUtils.isEligibleForArchival(createdDate, archiveAfterDays, currentDate)
			expect(eligible).toBe(true)
		})

		it('should return false when data is not yet eligible for archival', () => {
			const createdDate = '2024-01-01T00:00:00Z'
			const archiveAfterDays = 90
			const currentDate = '2024-03-01T00:00:00Z' // 59 days later

			const eligible = GDPRUtils.isEligibleForArchival(createdDate, archiveAfterDays, currentDate)
			expect(eligible).toBe(false)
		})

		it('should use current date when not provided', () => {
			const createdDate = '2020-01-01T00:00:00Z' // Very old date
			const archiveAfterDays = 90

			const eligible = GDPRUtils.isEligibleForArchival(createdDate, archiveAfterDays)
			expect(eligible).toBe(true)
		})
	})

	describe('isEligibleForDeletion', () => {
		it('should return true when data is eligible for deletion', () => {
			const createdDate = '2024-01-01T00:00:00Z'
			const deleteAfterDays = 365
			const currentDate = '2025-01-02T00:00:00Z' // 366 days later

			const eligible = GDPRUtils.isEligibleForDeletion(createdDate, deleteAfterDays, currentDate)
			expect(eligible).toBe(true)
		})

		it('should return false when data is not yet eligible for deletion', () => {
			const createdDate = '2024-01-01T00:00:00Z'
			const deleteAfterDays = 365
			const currentDate = '2024-12-30T00:00:00Z' // 363 days later

			const eligible = GDPRUtils.isEligibleForDeletion(createdDate, deleteAfterDays, currentDate)
			expect(eligible).toBe(false)
		})
	})

	describe('generateComplianceMetadata', () => {
		it('should generate complete compliance metadata', () => {
			const metadata = GDPRUtils.generateComplianceMetadata('export', 'user-123', 'admin-user', {
				recordCount: 5,
			})

			expect(metadata.gdprOperation).toBe('export')
			expect(metadata.principalId).toBe('user-123')
			expect(metadata.requestedBy).toBe('admin-user')
			expect(metadata.complianceVersion).toBe('1.0')
			expect(metadata.regulatoryBasis).toBe('GDPR Article 17, 20')
			expect(metadata.recordCount).toBe(5)
			expect(metadata.timestamp).toBeDefined()
		})
	})

	describe('validateDataClassification', () => {
		it('should validate correct data classifications', () => {
			const validClassifications = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI']

			for (const classification of validClassifications) {
				expect(GDPRUtils.validateDataClassification(classification)).toBe(true)
			}
		})

		it('should reject invalid data classifications', () => {
			const invalidClassifications = ['INVALID', 'SECRET', 'private', '']

			for (const classification of invalidClassifications) {
				expect(GDPRUtils.validateDataClassification(classification)).toBe(false)
			}
		})
	})

	describe('getRecommendedRetentionPolicy', () => {
		it('should return correct policy for PHI data', () => {
			const policy = GDPRUtils.getRecommendedRetentionPolicy('PHI')

			expect(policy.retentionDays).toBe(2555) // 7 years
			expect(policy.archiveAfterDays).toBe(365) // 1 year
			expect(policy.deleteAfterDays).toBe(2555)
			expect(policy.policyName).toBe('healthcare_phi')
		})

		it('should return correct policy for CONFIDENTIAL data', () => {
			const policy = GDPRUtils.getRecommendedRetentionPolicy('CONFIDENTIAL')

			expect(policy.retentionDays).toBe(1095) // 3 years
			expect(policy.archiveAfterDays).toBe(365) // 1 year
			expect(policy.deleteAfterDays).toBe(1095)
			expect(policy.policyName).toBe('confidential_data')
		})

		it('should return default policy for unknown classification', () => {
			const policy = GDPRUtils.getRecommendedRetentionPolicy('UNKNOWN')

			expect(policy.retentionDays).toBe(365) // 1 year
			expect(policy.archiveAfterDays).toBe(90) // 3 months
			expect(policy.deleteAfterDays).toBe(365)
			expect(policy.policyName).toBe('default')
		})
	})

	describe('createGDPRAuditEntry', () => {
		it('should create complete GDPR audit entry', () => {
			const entry = GDPRUtils.createGDPRAuditEntry(
				'export',
				'user-123',
				'target-456',
				'admin-user',
				'success',
				{ recordCount: 10 }
			)

			expect(entry.action).toBe('gdpr.export')
			expect(entry.status).toBe('success')
			expect(entry.principalId).toBe('admin-user')
			expect(entry.targetResourceId).toBe('target-456')
			expect(entry.dataClassification).toBe('PHI')
			expect(entry.retentionPolicy).toBe('gdpr_compliance')
			expect(entry.details.gdprOperation).toBe('export')
			expect(entry.details.targetPrincipalId).toBe('user-123')
			expect(entry.details.recordCount).toBe(10)
		})
	})

	describe('maskSensitiveData', () => {
		it('should mask data correctly with default visible chars', () => {
			const masked = GDPRUtils.maskSensitiveData('sensitive-data-123')
			expect(masked).toBe('sens**************') // 18 chars total, 4 visible, 14 masked
		})

		it('should mask data with custom visible chars', () => {
			const masked = GDPRUtils.maskSensitiveData('sensitive-data-123', 8)
			expect(masked).toBe('sensitiv**********') // 18 chars total, 8 visible, 10 masked
		})

		it('should handle short data', () => {
			const masked = GDPRUtils.maskSensitiveData('abc', 4)
			expect(masked).toBe('***')
		})

		it('should handle empty data', () => {
			const masked = GDPRUtils.maskSensitiveData('')
			expect(masked).toBe('')
		})
	})

	describe('generateTrackingId', () => {
		it('should generate unique tracking IDs', () => {
			const id1 = GDPRUtils.generateTrackingId('export')
			const id2 = GDPRUtils.generateTrackingId('export')

			expect(id1).not.toBe(id2)
			expect(id1).toMatch(/^gdpr-export-\d+-[a-f0-9]{8}$/)
			expect(id2).toMatch(/^gdpr-export-\d+-[a-f0-9]{8}$/)
		})

		it('should include operation in tracking ID', () => {
			const exportId = GDPRUtils.generateTrackingId('export')
			const deleteId = GDPRUtils.generateTrackingId('delete')

			expect(exportId).toContain('gdpr-export-')
			expect(deleteId).toContain('gdpr-delete-')
		})
	})
})
