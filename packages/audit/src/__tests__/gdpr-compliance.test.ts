import { createHash } from 'crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GDPRComplianceService } from '../gdpr/gdpr-compliance.js'

import type { AuditLogEvent } from '../types.js'

// Mock database and tables
const mockDb = {
	select: vi.fn(),
	insert: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
}

const mockAuditLogTable = {
	principalId: 'principalId',
	timestamp: 'timestamp',
	action: 'action',
	status: 'status',
	dataClassification: 'dataClassification',
	retentionPolicy: 'retentionPolicy',
	archivedAt: 'archivedAt',
	details: 'details',
}

const mockRetentionPolicyTable = {
	policyName: 'policyName',
	dataClassification: 'dataClassification',
	retentionDays: 'retentionDays',
	archiveAfterDays: 'archiveAfterDays',
	deleteAfterDays: 'deleteAfterDays',
	isActive: 'isActive',
}

// Mock query builder
const createMockQueryBuilder = (returnValue: any) => {
	const mockBuilder = {
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		offset: vi.fn().mockReturnThis(),
		set: vi.fn().mockReturnThis(),
		values: vi.fn().mockReturnThis(),
		execute: vi.fn().mockResolvedValue(returnValue),
		rowCount: returnValue?.rowCount || (Array.isArray(returnValue) ? returnValue.length : 0),
	}

	// Make the builder thenable so it can be awaited directly
	mockBuilder.then = vi.fn((resolve) => {
		resolve(returnValue)
		return Promise.resolve(returnValue)
	})

	return mockBuilder
}

describe('GDPRComplianceService', () => {
	let gdprService: GDPRComplianceService
	let mockAuditLogs: any[]

	beforeEach(() => {
		vi.clearAllMocks()

		// Sample audit logs for testing
		mockAuditLogs = [
			{
				id: 1,
				timestamp: '2024-01-01T10:00:00Z',
				principalId: 'user-123',
				action: 'fhir.patient.read',
				status: 'success',
				dataClassification: 'PHI',
				retentionPolicy: 'standard',
				details: { patientId: 'pat-456' },
			},
			{
				id: 2,
				timestamp: '2024-01-02T11:00:00Z',
				principalId: 'user-123',
				action: 'auth.login.success',
				status: 'success',
				dataClassification: 'INTERNAL',
				retentionPolicy: 'extended',
				details: { ipAddress: '192.168.1.1' },
			},
			{
				id: 3,
				timestamp: '2024-01-03T12:00:00Z',
				principalId: 'user-123',
				action: 'data.export',
				status: 'success',
				dataClassification: 'PHI',
				retentionPolicy: 'standard',
				details: { exportType: 'patient-data' },
			},
		]

		gdprService = new GDPRComplianceService(
			mockDb as any,
			mockAuditLogTable,
			mockRetentionPolicyTable
		)
	})

	describe('exportUserData', () => {
		it('should export user audit data in JSON format', async () => {
			// Setup mock
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'json' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.principalId).toBe('user-123')
			expect(result.format).toBe('json')
			expect(result.recordCount).toBe(3)
			expect(result.data).toBeInstanceOf(Buffer)
			expect(result.metadata.categories).toContain('fhir.patient.read')
			expect(result.metadata.categories).toContain('auth.login.success')
			expect(result.metadata.retentionPolicies).toContain('standard')
			expect(result.metadata.exportedBy).toBe('admin-user')

			// Verify the exported data is valid JSON
			const exportedData = JSON.parse(result.data.toString())
			expect(exportedData.auditLogs).toHaveLength(3)
		})

		it('should export user audit data in CSV format', async () => {
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'portability' as const,
				format: 'csv' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.format).toBe('csv')
			const csvContent = result.data.toString()
			expect(csvContent).toContain('id,timestamp,principalId')
			expect(csvContent).toContain('user-123')
			expect(csvContent).toContain('fhir.patient.read')
		})

		it('should export user audit data in XML format', async () => {
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'xml' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.format).toBe('xml')
			const xmlContent = result.data.toString()
			expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
			expect(xmlContent).toContain('<gdprExport>')
			expect(xmlContent).toContain('<auditLogs>')
		})

		it('should filter export data by date range', async () => {
			const filteredLogs = mockAuditLogs.slice(1, 2) // Only middle log
			const mockQueryBuilder = createMockQueryBuilder(filteredLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'json' as const,
				dateRange: {
					start: '2024-01-02T00:00:00Z',
					end: '2024-01-02T23:59:59Z',
				},
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.recordCount).toBe(1)
			const exportedData = JSON.parse(result.data.toString())
			expect(exportedData.auditLogs[0].action).toBe('auth.login.success')
		})

		it('should include metadata when requested', async () => {
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'json' as const,
				includeMetadata: true,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			const exportedData = JSON.parse(result.data.toString())
			expect(exportedData.exportMetadata).toBeDefined()
			expect(exportedData.exportMetadata.gdprCompliant).toBe(true)
			expect(exportedData.exportMetadata.recordCount).toBe(3)
		})
	})

	describe('pseudonymizeUserData', () => {
		it('should pseudonymize user data with hash strategy', async () => {
			const mockUpdateResult = { rowCount: 3 }
			const mockQueryBuilder = createMockQueryBuilder(mockUpdateResult)
			mockDb.update.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.pseudonymizeUserData('user-123', 'hash', 'admin-user')

			expect(result.pseudonymId).toMatch(/^pseudo-[a-f0-9]{16}$/)
			expect(result.recordsAffected).toBe(3)
			expect(gdprService.getPseudonymMapping('user-123')).toBe(result.pseudonymId)
		})

		it('should pseudonymize user data with token strategy', async () => {
			const mockUpdateResult = { rowCount: 2 }
			const mockQueryBuilder = createMockQueryBuilder(mockUpdateResult)
			mockDb.update.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.pseudonymizeUserData('user-456', 'token', 'admin-user')

			expect(result.pseudonymId).toMatch(/^pseudo-[a-f0-9]{32}$/)
			expect(result.recordsAffected).toBe(2)
		})

		it('should pseudonymize user data with encryption strategy', async () => {
			const mockUpdateResult = { rowCount: 1 }
			const mockQueryBuilder = createMockQueryBuilder(mockUpdateResult)
			mockDb.update.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.pseudonymizeUserData('user-789', 'encryption', 'admin-user')

			expect(result.pseudonymId).toMatch(/^pseudo-enc-[a-zA-Z0-9]{16}$/)
			expect(result.recordsAffected).toBe(1)
		})

		it('should maintain referential integrity mapping', async () => {
			const mockUpdateResult = { rowCount: 3 }
			const mockQueryBuilder = createMockQueryBuilder(mockUpdateResult)
			mockDb.update.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.pseudonymizeUserData('user-123', 'hash', 'admin-user')

			// Test forward mapping
			expect(gdprService.getPseudonymMapping('user-123')).toBe(result.pseudonymId)

			// Test reverse mapping
			expect(gdprService.getOriginalId(result.pseudonymId)).toBe('user-123')
		})
	})

	describe('applyRetentionPolicies', () => {
		it('should apply active retention policies', async () => {
			const mockPolicies = [
				{
					policyName: 'standard',
					dataClassification: 'PHI',
					retentionDays: 365,
					archiveAfterDays: 90,
					deleteAfterDays: 2555, // 7 years
					isActive: 'true',
				},
				{
					policyName: 'extended',
					dataClassification: 'INTERNAL',
					retentionDays: 1095, // 3 years
					archiveAfterDays: 365,
					isActive: 'true',
				},
			]

			const mockRecordsToArchive = [
				{ ...mockAuditLogs[0], dataClassification: 'PHI' },
				{ ...mockAuditLogs[2], dataClassification: 'PHI' },
			]

			// Mock policy query
			const policyQueryBuilder = createMockQueryBuilder(mockPolicies)
			mockDb.select.mockReturnValueOnce(policyQueryBuilder)

			// Mock records to archive query
			const recordsQueryBuilder = createMockQueryBuilder(mockRecordsToArchive)
			mockDb.select.mockReturnValue(recordsQueryBuilder)

			// Mock update operations
			const updateQueryBuilder = createMockQueryBuilder({ rowCount: 2 })
			mockDb.update.mockReturnValue(updateQueryBuilder)

			// Mock delete operations
			const deleteQueryBuilder = createMockQueryBuilder({ rowCount: 0 })
			mockDb.delete.mockReturnValue(deleteQueryBuilder)

			// Mock audit logging
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const results = await gdprService.applyRetentionPolicies()

			expect(results).toHaveLength(2)
			expect(results[0].policy).toBe('standard')
			expect(results[0].recordsArchived).toBe(2)
			expect(results[1].policy).toBe('extended')
		})

		it('should handle policies with deletion criteria', async () => {
			const mockPolicy = {
				policyName: 'minimal',
				dataClassification: 'PUBLIC',
				retentionDays: 30,
				archiveAfterDays: 7,
				deleteAfterDays: 30,
				isActive: 'true',
			}

			// Mock policy query
			const policyQueryBuilder = createMockQueryBuilder([mockPolicy])
			mockDb.select.mockReturnValueOnce(policyQueryBuilder)

			// Mock records queries
			mockDb.select.mockReturnValue(createMockQueryBuilder([]))

			// Mock operations
			const updateQueryBuilder = createMockQueryBuilder({ rowCount: 1 })
			mockDb.update.mockReturnValue(updateQueryBuilder)

			const deleteQueryBuilder = createMockQueryBuilder({ rowCount: 2 })
			mockDb.delete.mockReturnValue(deleteQueryBuilder)

			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const results = await gdprService.applyRetentionPolicies()

			expect(results).toHaveLength(1)
			expect(results[0].recordsDeleted).toBe(2)
		})
	})

	describe('deleteUserDataWithAuditTrail', () => {
		it('should delete user data while preserving compliance audits', async () => {
			const complianceRecords = [mockAuditLogs[1]] // auth.login.success
			const nonComplianceRecords = [mockAuditLogs[0], mockAuditLogs[2]]

			// Mock compliance records query
			const complianceQueryBuilder = createMockQueryBuilder(complianceRecords)
			mockDb.select.mockReturnValueOnce(complianceQueryBuilder)

			// Mock pseudonymization update
			const pseudoUpdateBuilder = createMockQueryBuilder({ rowCount: 1 })
			mockDb.update.mockReturnValue(pseudoUpdateBuilder)

			// Mock deletion
			const deleteQueryBuilder = createMockQueryBuilder({ rowCount: 2 })
			mockDb.delete.mockReturnValue(deleteQueryBuilder)

			// Mock audit logging
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.deleteUserDataWithAuditTrail('user-123', 'admin-user', true)

			expect(result.recordsDeleted).toBe(2)
			expect(result.complianceRecordsPreserved).toBe(1)
		})

		it('should delete all user data when compliance preservation is disabled', async () => {
			// Mock deletion of all records
			const deleteQueryBuilder = createMockQueryBuilder({ rowCount: 3 })
			mockDb.delete.mockReturnValue(deleteQueryBuilder)

			// Mock audit logging
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const result = await gdprService.deleteUserDataWithAuditTrail('user-123', 'admin-user', false)

			expect(result.recordsDeleted).toBe(3)
			expect(result.complianceRecordsPreserved).toBe(0)
		})
	})

	describe('Data format validation', () => {
		it('should handle empty audit logs gracefully', async () => {
			const mockQueryBuilder = createMockQueryBuilder([])
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-nonexistent',
				requestType: 'access' as const,
				format: 'json' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.recordCount).toBe(0)
			const exportedData = JSON.parse(result.data.toString())
			expect(exportedData.auditLogs).toHaveLength(0)
		})

		it('should handle CSV export with empty data', async () => {
			const mockQueryBuilder = createMockQueryBuilder([])
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-nonexistent',
				requestType: 'portability' as const,
				format: 'csv' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			expect(result.data.toString()).toBe('No data to export')
		})

		it('should properly escape CSV special characters', async () => {
			const specialCharLogs = [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00Z',
					principalId: 'user-123',
					action: 'test,action',
					status: 'success',
					outcomeDescription: 'Description with "quotes" and, commas',
				},
			]

			const mockQueryBuilder = createMockQueryBuilder(specialCharLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'csv' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			const csvContent = result.data.toString()
			expect(csvContent).toContain('"test,action"')
			expect(csvContent).toContain('"Description with ""quotes"" and, commas"')
		})

		it('should properly escape XML special characters', async () => {
			const specialCharLogs = [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00Z',
					principalId: 'user-123',
					action: 'test<action>',
					status: 'success',
					outcomeDescription: 'Description with <tags> & "quotes"',
				},
			]

			const mockQueryBuilder = createMockQueryBuilder(specialCharLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)
			mockDb.insert.mockReturnValue(createMockQueryBuilder([]))

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'xml' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			const result = await gdprService.exportUserData(request)

			const xmlContent = result.data.toString()
			expect(xmlContent).toContain('test&lt;action&gt;')
			expect(xmlContent).toContain('&lt;tags&gt; &amp; &quot;quotes&quot;')
		})
	})

	describe('Error handling', () => {
		it('should throw error for unsupported export format', async () => {
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'pdf' as any, // Unsupported format
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			await expect(gdprService.exportUserData(request)).rejects.toThrow(
				'Unsupported export format: pdf'
			)
		})

		it('should throw error for unsupported pseudonymization strategy', async () => {
			await expect(
				gdprService.pseudonymizeUserData('user-123', 'unsupported' as any, 'admin-user')
			).rejects.toThrow('Unsupported pseudonymization strategy: unsupported')
		})
	})

	describe('Audit trail logging', () => {
		it('should log GDPR export activities', async () => {
			const mockQueryBuilder = createMockQueryBuilder(mockAuditLogs)
			mockDb.select.mockReturnValue(mockQueryBuilder)

			const insertSpy = vi.fn().mockReturnValue(createMockQueryBuilder([]))
			mockDb.insert.mockReturnValue(insertSpy)

			const request = {
				principalId: 'user-123',
				requestType: 'access' as const,
				format: 'json' as const,
				requestedBy: 'admin-user',
				requestTimestamp: '2024-01-15T10:00:00Z',
			}

			await gdprService.exportUserData(request)

			expect(mockDb.insert).toHaveBeenCalled()
			const loggedEvent = insertSpy.mock.calls[0][0].values
			expect(loggedEvent.action).toBe('gdpr.data.export')
			expect(loggedEvent.principalId).toBe('admin-user')
			expect(loggedEvent.targetResourceId).toBe('user-123')
			expect(loggedEvent.hash).toBeDefined()
		})

		it('should log pseudonymization activities', async () => {
			const mockUpdateResult = { rowCount: 3 }
			const mockQueryBuilder = createMockQueryBuilder(mockUpdateResult)
			mockDb.update.mockReturnValue(mockQueryBuilder)

			const insertSpy = vi.fn().mockReturnValue(createMockQueryBuilder([]))
			mockDb.insert.mockReturnValue(insertSpy)

			await gdprService.pseudonymizeUserData('user-123', 'hash', 'admin-user')

			expect(mockDb.insert).toHaveBeenCalled()
			const loggedEvent = insertSpy.mock.calls[0][0].values
			expect(loggedEvent.action).toBe('gdpr.data.pseudonymize')
			expect(loggedEvent.details.originalId).toBe('user-123')
			expect(loggedEvent.details.strategy).toBe('hash')
		})

		it('should log deletion activities', async () => {
			const deleteQueryBuilder = createMockQueryBuilder({ rowCount: 3 })
			mockDb.delete.mockReturnValue(deleteQueryBuilder)

			const insertSpy = vi.fn().mockReturnValue(createMockQueryBuilder([]))
			mockDb.insert.mockReturnValue(insertSpy)

			await gdprService.deleteUserDataWithAuditTrail('user-123', 'admin-user', false)

			expect(mockDb.insert).toHaveBeenCalled()
			const loggedEvent = insertSpy.mock.calls[0][0].values
			expect(loggedEvent.action).toBe('gdpr.data.delete')
			expect(loggedEvent.details.recordsDeleted).toBe(3)
		})
	})
})
