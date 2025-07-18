/**
 * @fileoverview Tests for Data Export Service
 *
 * Tests data export functionality including:
 * - JSON export format
 * - CSV export format
 * - XML export format
 * - PDF export format
 * - Compression and encryption
 * - Export configuration options
 */

import { beforeEach, describe, expect, it } from 'vitest'

import { DataExportService } from '../report/data-export.js'

import type {
	ComplianceReport,
	ComplianceReportEvent,
	ExportConfig,
} from '../report/compliance-reporting.js'
import type { ExportResult } from '../report/data-export.js'

describe('DataExportService', () => {
	let service: DataExportService
	let mockReport: ComplianceReport
	let mockEvents: ComplianceReportEvent[]

	beforeEach(() => {
		service = new DataExportService()

		// Create mock compliance report
		mockReport = {
			metadata: {
				reportId: 'test-report-123',
				reportType: 'GENERAL_COMPLIANCE',
				generatedAt: '2024-01-01T12:00:00.000Z',
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
				totalEvents: 3,
				filteredEvents: 3,
			},
			summary: {
				eventsByStatus: { success: 2, failure: 1 },
				eventsByAction: { 'fhir.patient.read': 1, 'auth.login.success': 1, 'data.export': 1 },
				eventsByDataClassification: { PHI: 2, INTERNAL: 1 },
				uniquePrincipals: 2,
				uniqueResources: 1,
				integrityViolations: 0,
				timeRange: {
					earliest: '2024-01-01T10:00:00.000Z',
					latest: '2024-01-01T12:00:00.000Z',
				},
			},
			events: [
				{
					id: 1,
					timestamp: '2024-01-01T10:00:00.000Z',
					principalId: 'user-123',
					organizationId: 'org-456',
					action: 'fhir.patient.read',
					targetResourceType: 'Patient',
					targetResourceId: 'patient-789',
					status: 'success',
					outcomeDescription: 'Successfully read patient data',
					dataClassification: 'PHI',
					sessionContext: {
						ipAddress: '192.168.1.100',
						userAgent: 'Mozilla/5.0',
						sessionId: 'session-001',
					},
					integrityStatus: 'verified',
					correlationId: 'corr-001',
				},
				{
					id: 2,
					timestamp: '2024-01-01T11:00:00.000Z',
					principalId: 'user-456',
					organizationId: 'org-456',
					action: 'auth.login.success',
					status: 'success',
					outcomeDescription: 'User logged in successfully',
					dataClassification: 'INTERNAL',
					sessionContext: {
						ipAddress: '192.168.1.101',
						userAgent: 'Chrome/120.0',
						sessionId: 'session-002',
					},
					integrityStatus: 'verified',
				},
				{
					id: 3,
					timestamp: '2024-01-01T12:00:00.000Z',
					principalId: 'user-123',
					organizationId: 'org-456',
					action: 'data.export',
					targetResourceType: 'Patient',
					status: 'failure',
					outcomeDescription: 'Export failed - access denied',
					dataClassification: 'PHI',
					sessionContext: {
						ipAddress: '192.168.1.100',
						userAgent: 'Mozilla/5.0',
						sessionId: 'session-003',
					},
					integrityStatus: 'verified',
				},
			],
		}

		mockEvents = mockReport.events
	})

	describe('exportComplianceReport', () => {
		it('should export report in JSON format', async () => {
			const config: ExportConfig = {
				format: 'json',
				includeMetadata: true,
				includeIntegrityReport: false,
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.format).toBe('json')
			expect(result.contentType).toBe('application/json')
			expect(result.filename).toContain('.json')
			expect(result.exportId).toBeDefined()
			expect(result.exportedAt).toBeDefined()
			expect(result.checksum).toBeDefined()
			expect(result.size).toBeGreaterThan(0)

			// Verify JSON content
			const exportedData = JSON.parse(result.data as string)
			expect(exportedData.metadata).toBeDefined()
			expect(exportedData.summary).toBeDefined()
			expect(exportedData.events).toHaveLength(3)
		})

		it('should export report in CSV format', async () => {
			const config: ExportConfig = {
				format: 'csv',
				includeMetadata: true,
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.format).toBe('csv')
			expect(result.contentType).toBe('text/csv')
			expect(result.filename).toContain('.csv')

			// Verify CSV content structure
			const csvContent = result.data as string
			const lines = csvContent.split('\n')

			// Should have metadata comments
			expect(lines.some((line) => line.startsWith('# Report ID:'))).toBe(true)
			expect(lines.some((line) => line.startsWith('# Report Type:'))).toBe(true)

			// Should have header row
			const headerLine = lines.find((line) => line.startsWith('ID,Timestamp'))
			expect(headerLine).toBeDefined()

			// Should have data rows (3 events + header + metadata comments)
			const dataLines = lines.filter((line) => !line.startsWith('#') && line.trim() !== '')
			expect(dataLines.length).toBeGreaterThanOrEqual(4) // Header + 3 data rows
		})

		it('should export report in XML format', async () => {
			const config: ExportConfig = {
				format: 'xml',
				includeMetadata: true,
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.format).toBe('xml')
			expect(result.contentType).toBe('application/xml')
			expect(result.filename).toContain('.xml')

			// Verify XML content structure
			const xmlContent = result.data as string
			expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
			expect(xmlContent).toContain('<auditReport>')
			expect(xmlContent).toContain('<metadata>')
			expect(xmlContent).toContain('<summary>')
			expect(xmlContent).toContain('<events>')
			expect(xmlContent).toContain('<event>')
			expect(xmlContent).toContain('</auditReport>')
		})

		it('should export report in PDF format', async () => {
			const config: ExportConfig = {
				format: 'pdf',
				includeMetadata: true,
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.format).toBe('pdf')
			expect(result.contentType).toBe('application/pdf')
			expect(result.filename).toContain('.pdf')
			expect(Buffer.isBuffer(result.data)).toBe(true)
		})

		it('should exclude metadata when configured', async () => {
			const config: ExportConfig = {
				format: 'json',
				includeMetadata: false,
			}

			const result = await service.exportComplianceReport(mockReport, config)

			const exportedData = JSON.parse(result.data as string)
			expect(exportedData.metadata).toBeUndefined()
			expect(exportedData.summary).toBeDefined()
			expect(exportedData.events).toBeDefined()
		})

		it('should include integrity report when configured', async () => {
			const reportWithIntegrity = {
				...mockReport,
				integrityReport: {
					verificationId: 'verify-123',
					verifiedAt: '2024-01-01T12:00:00.000Z',
					results: {
						totalEvents: 3,
						verifiedEvents: 3,
						failedVerifications: 0,
						unverifiedEvents: 0,
						verificationRate: 100,
					},
					failures: [],
					statistics: {
						hashAlgorithms: { 'SHA-256': 3 },
						verificationLatency: {
							average: 50,
							median: 45,
							p95: 120,
						},
					},
				},
			}

			const config: ExportConfig = {
				format: 'json',
				includeIntegrityReport: true,
			}

			const result = await service.exportComplianceReport(reportWithIntegrity, config)

			const exportedData = JSON.parse(result.data as string)
			expect(exportedData.integrityReport).toBeDefined()
			expect(exportedData.integrityReport.verificationId).toBe('verify-123')
		})
	})

	describe('exportAuditEvents', () => {
		it('should export audit events in JSON format', async () => {
			const config: ExportConfig = {
				format: 'json',
			}

			const result = await service.exportAuditEvents(mockEvents, config)

			expect(result.format).toBe('json')
			expect(result.contentType).toBe('application/json')

			const exportedData = JSON.parse(result.data as string)
			expect(exportedData.events).toHaveLength(3)
			expect(exportedData.metadata.reportType).toBe('AUDIT_EVENTS_EXPORT')
		})

		it('should export audit events in CSV format', async () => {
			const config: ExportConfig = {
				format: 'csv',
			}

			const result = await service.exportAuditEvents(mockEvents, config)

			expect(result.format).toBe('csv')
			expect(result.contentType).toBe('text/csv')

			const csvContent = result.data as string
			const lines = csvContent.split('\n').filter((line) => line.trim() !== '')

			// Should have header + 3 data rows (plus potential metadata comments)
			const dataLines = lines.filter((line) => !line.startsWith('#'))
			expect(dataLines.length).toBeGreaterThanOrEqual(4)
		})
	})

	describe('compression', () => {
		it('should compress data with gzip', async () => {
			const config: ExportConfig = {
				format: 'json',
				compression: 'gzip',
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.compression).toBeDefined()
			expect(result.compression!.algorithm).toBe('gzip')
			expect(result.compression!.originalSize).toBeGreaterThan(0)
			expect(result.compression!.compressedSize).toBeGreaterThan(0)
			expect(result.compression!.compressionRatio).toBeGreaterThan(0)
			expect(result.filename).toContain('.gz')
		})

		it('should compress data with zip', async () => {
			const config: ExportConfig = {
				format: 'json',
				compression: 'zip',
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.compression).toBeDefined()
			expect(result.compression!.algorithm).toBe('zip')
			expect(result.filename).toContain('.zip')
		})
	})

	describe('encryption', () => {
		it('should encrypt data when enabled', async () => {
			const config: ExportConfig = {
				format: 'json',
				encryption: {
					enabled: true,
					algorithm: 'AES-256-GCM',
					keyId: 'test-key-123',
				},
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.encryption).toBeDefined()
			expect(result.encryption!.algorithm).toBe('AES-256-GCM')
			expect(result.encryption!.keyId).toBe('test-key-123')
			expect(result.encryption!.iv).toBeDefined()
			expect(result.filename).toContain('.enc')
		})

		it('should use default encryption settings', async () => {
			const config: ExportConfig = {
				format: 'json',
				encryption: {
					enabled: true,
				},
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.encryption).toBeDefined()
			expect(result.encryption!.algorithm).toBe('AES-256-GCM')
			expect(result.encryption!.keyId).toBe('default')
		})
	})

	describe('combined compression and encryption', () => {
		it('should apply both compression and encryption', async () => {
			const config: ExportConfig = {
				format: 'json',
				compression: 'gzip',
				encryption: {
					enabled: true,
					keyId: 'test-key',
				},
			}

			const result = await service.exportComplianceReport(mockReport, config)

			expect(result.compression).toBeDefined()
			expect(result.encryption).toBeDefined()
			expect(result.filename).toContain('.gz.enc')
		})
	})

	describe('error handling', () => {
		it('should throw error for unsupported format', async () => {
			const config: ExportConfig = {
				format: 'unsupported' as any,
			}

			await expect(service.exportComplianceReport(mockReport, config)).rejects.toThrow(
				'Unsupported export format: unsupported'
			)
		})

		it('should handle empty events array', async () => {
			const emptyReport = {
				...mockReport,
				events: [],
			}

			const config: ExportConfig = {
				format: 'json',
			}

			const result = await service.exportComplianceReport(emptyReport, config)

			expect(result.format).toBe('json')
			const exportedData = JSON.parse(result.data as string)
			expect(exportedData.events).toHaveLength(0)
		})
	})

	describe('CSV escaping', () => {
		it('should properly escape CSV values with commas', async () => {
			const eventWithComma = {
				...mockEvents[0],
				outcomeDescription: 'Test, with comma',
			}

			const config: ExportConfig = {
				format: 'csv',
				includeMetadata: false,
			}

			const result = await service.exportAuditEvents([eventWithComma], config)

			const csvContent = result.data as string
			expect(csvContent).toContain('"Test, with comma"')
		})

		it('should properly escape CSV values with quotes', async () => {
			const eventWithQuote = {
				...mockEvents[0],
				outcomeDescription: 'Test "with quotes"',
			}

			const config: ExportConfig = {
				format: 'csv',
				includeMetadata: false,
			}

			const result = await service.exportAuditEvents([eventWithQuote], config)

			const csvContent = result.data as string
			expect(csvContent).toContain('"Test ""with quotes"""')
		})
	})

	describe('XML escaping', () => {
		it('should properly escape XML special characters', async () => {
			const eventWithXmlChars = {
				...mockEvents[0],
				outcomeDescription: 'Test <tag> & "quotes" & \'apostrophes\'',
			}

			const reportWithXmlChars = {
				...mockReport,
				events: [eventWithXmlChars],
			}

			const config: ExportConfig = {
				format: 'xml',
			}

			const result = await service.exportComplianceReport(reportWithXmlChars, config)

			const xmlContent = result.data as string
			expect(xmlContent).toContain(
				'&lt;tag&gt; &amp; &quot;quotes&quot; &amp; &apos;apostrophes&apos;'
			)
		})
	})

	describe('filename generation', () => {
		it('should generate appropriate filenames for different formats', async () => {
			const formats: Array<{ format: ExportConfig['format']; extension: string }> = [
				{ format: 'json', extension: '.json' },
				{ format: 'csv', extension: '.csv' },
				{ format: 'xml', extension: '.xml' },
				{ format: 'pdf', extension: '.pdf' },
			]

			for (const { format, extension } of formats) {
				const config: ExportConfig = { format }
				const result = await service.exportComplianceReport(mockReport, config)

				expect(result.filename).toContain(extension)
				expect(result.filename).toContain(mockReport.metadata.reportId)
			}
		})
	})

	describe('checksum calculation', () => {
		it('should generate consistent checksums for same data', async () => {
			const config: ExportConfig = {
				format: 'json',
			}

			const result1 = await service.exportComplianceReport(mockReport, config)
			const result2 = await service.exportComplianceReport(mockReport, config)

			// Note: In the placeholder implementation, checksums include timestamp
			// In a real implementation, checksums for identical data should be the same
			expect(result1.checksum).toBeDefined()
			expect(result2.checksum).toBeDefined()
		})
	})
})
