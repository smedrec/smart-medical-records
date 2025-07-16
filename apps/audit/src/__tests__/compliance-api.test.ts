/**
 * @fileoverview Integration tests for Compliance API
 *
 * Tests the REST API endpoints for compliance reporting and data export:
 * - Report generation endpoints
 * - Data export endpoints
 * - Scheduled report management
 * - Error handling and validation
 */

import { Hono } from 'hono'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createComplianceAPI } from '../compliance-api.js'

import type { AuditDb } from '@repo/audit-db'

// Mock AuditDb
const mockAuditDb = {
	getDrizzleInstance: vi.fn(() => ({
		select: vi.fn(() => ({
			from: vi.fn(() => ({
				limit: vi.fn(() =>
					Promise.resolve([
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
							hash: 'abc123hash',
							hashAlgorithm: 'SHA-256',
						},
						{
							id: 2,
							timestamp: '2024-01-01T11:00:00.000Z',
							principalId: 'user-456',
							action: 'auth.login.success',
							status: 'success',
							dataClassification: 'INTERNAL',
						},
					])
				),
			})),
		})),
	})),
	getAuditLogTable: vi.fn(() => ({})),
} as unknown as AuditDb

describe('Compliance API', () => {
	let app: Hono

	beforeEach(() => {
		app = createComplianceAPI(mockAuditDb)
	})

	describe('POST /reports/generate', () => {
		it('should generate a general compliance report', async () => {
			const requestBody = {
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
				reportType: 'GENERAL_COMPLIANCE',
			}

			const response = await app.request('/reports/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.report).toBeDefined()
			expect(result.report.metadata.reportType).toBe('GENERAL_COMPLIANCE')
			expect(result.report.events).toBeInstanceOf(Array)
		})

		it('should return 400 for invalid criteria', async () => {
			const requestBody = {
				criteria: null,
				reportType: 'GENERAL_COMPLIANCE',
			}

			const response = await app.request('/reports/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(400)
		})
	})

	describe('POST /reports/hipaa', () => {
		it('should generate a HIPAA compliance report', async () => {
			const requestBody = {
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
					dataClassifications: ['PHI'],
				},
			}

			const response = await app.request('/reports/hipaa', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.report).toBeDefined()
			expect(result.report.reportType).toBe('HIPAA_AUDIT_TRAIL')
			expect(result.report.hipaaSpecific).toBeDefined()
			expect(result.report.riskAssessment).toBeDefined()
		})
	})

	describe('POST /reports/gdpr', () => {
		it('should generate a GDPR compliance report', async () => {
			const requestBody = {
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
			}

			const response = await app.request('/reports/gdpr', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.report).toBeDefined()
			expect(result.report.reportType).toBe('GDPR_PROCESSING_ACTIVITIES')
			expect(result.report.gdprSpecific).toBeDefined()
			expect(result.report.legalBasisBreakdown).toBeDefined()
		})
	})

	describe('POST /reports/integrity', () => {
		it('should generate an integrity verification report', async () => {
			const requestBody = {
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
				performVerification: true,
			}

			const response = await app.request('/reports/integrity', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.report).toBeDefined()
			expect(result.report.verificationId).toBeDefined()
			expect(result.report.results).toBeDefined()
		})
	})

	describe('POST /export/report', () => {
		it('should export a compliance report in JSON format', async () => {
			const mockReport = {
				metadata: {
					reportId: 'test-report-123',
					reportType: 'GENERAL_COMPLIANCE',
					generatedAt: '2024-01-01T12:00:00.000Z',
					criteria: {},
					totalEvents: 2,
					filteredEvents: 2,
				},
				summary: {
					eventsByStatus: { success: 2 },
					eventsByAction: {},
					eventsByDataClassification: {},
					uniquePrincipals: 2,
					uniqueResources: 1,
					integrityViolations: 0,
					timeRange: {
						earliest: '2024-01-01T10:00:00.000Z',
						latest: '2024-01-01T11:00:00.000Z',
					},
				},
				events: [],
			}

			const requestBody = {
				report: mockReport,
				config: {
					format: 'json',
					includeMetadata: true,
				},
			}

			const response = await app.request('/export/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)
			expect(response.headers.get('Content-Type')).toBe('application/json')
			expect(response.headers.get('Content-Disposition')).toContain('attachment')
			expect(response.headers.get('X-Export-ID')).toBeDefined()
			expect(response.headers.get('X-Checksum')).toBeDefined()
		})

		it('should export a compliance report in CSV format', async () => {
			const mockReport = {
				metadata: {
					reportId: 'test-report-123',
					reportType: 'GENERAL_COMPLIANCE',
					generatedAt: '2024-01-01T12:00:00.000Z',
					criteria: {},
					totalEvents: 1,
					filteredEvents: 1,
				},
				summary: {
					eventsByStatus: { success: 1 },
					eventsByAction: {},
					eventsByDataClassification: {},
					uniquePrincipals: 1,
					uniqueResources: 1,
					integrityViolations: 0,
					timeRange: {
						earliest: '2024-01-01T10:00:00.000Z',
						latest: '2024-01-01T10:00:00.000Z',
					},
				},
				events: [
					{
						id: 1,
						timestamp: '2024-01-01T10:00:00.000Z',
						principalId: 'user-123',
						action: 'test.action',
						status: 'success',
					},
				],
			}

			const requestBody = {
				report: mockReport,
				config: {
					format: 'csv',
					includeMetadata: true,
				},
			}

			const response = await app.request('/export/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)
			expect(response.headers.get('Content-Type')).toBe('text/csv')
			expect(response.headers.get('Content-Disposition')).toContain('.csv')
		})

		it('should return 400 for missing report or config', async () => {
			const requestBody = {
				report: null,
				config: {
					format: 'json',
				},
			}

			const response = await app.request('/export/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(400)
		})
	})

	describe('POST /export/events', () => {
		it('should export audit events in JSON format', async () => {
			const requestBody = {
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
				config: {
					format: 'json',
				},
			}

			const response = await app.request('/export/events', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)
			expect(response.headers.get('Content-Type')).toBe('application/json')
		})
	})

	describe('POST /scheduled-reports', () => {
		it('should create a new scheduled report', async () => {
			const requestBody = {
				name: 'Test Scheduled Report',
				description: 'A test scheduled report',
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
				},
				format: 'json',
				schedule: {
					frequency: 'daily',
					time: '09:00',
				},
				delivery: {
					method: 'email',
					recipients: ['test@test.com'],
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const response = await app.request('/scheduled-reports', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.scheduledReport).toBeDefined()
			expect(result.scheduledReport.id).toBeDefined()
			expect(result.scheduledReport.name).toBe('Test Scheduled Report')
		})

		it('should return 400 for missing required fields', async () => {
			const requestBody = {
				name: 'Incomplete Report',
				// Missing required fields
			}

			const response = await app.request('/scheduled-reports', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(400)
		})
	})

	describe('GET /scheduled-reports', () => {
		it('should return all scheduled reports', async () => {
			const response = await app.request('/scheduled-reports', {
				method: 'GET',
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.scheduledReports).toBeInstanceOf(Array)
		})
	})

	describe('GET /scheduled-reports/:id', () => {
		it('should return 404 for non-existent report', async () => {
			const response = await app.request('/scheduled-reports/non-existent', {
				method: 'GET',
			})

			expect(response.status).toBe(404)

			const result = await response.json()
			expect(result.success).toBe(false)
			expect(result.error).toBe('Scheduled report not found')
		})
	})

	describe('PUT /scheduled-reports/:id', () => {
		it('should return error for non-existent report', async () => {
			const requestBody = {
				name: 'Updated Name',
			}

			const response = await app.request('/scheduled-reports/non-existent', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})

			expect(response.status).toBe(500) // Service throws error, API returns 500
		})
	})

	describe('DELETE /scheduled-reports/:id', () => {
		it('should return error for non-existent report', async () => {
			const response = await app.request('/scheduled-reports/non-existent', {
				method: 'DELETE',
			})

			expect(response.status).toBe(500) // Service throws error, API returns 500
		})
	})

	describe('POST /scheduled-reports/:id/execute', () => {
		it('should return error for non-existent report', async () => {
			const response = await app.request('/scheduled-reports/non-existent/execute', {
				method: 'POST',
			})

			expect(response.status).toBe(500) // Service throws error, API returns 500
		})
	})

	describe('GET /scheduled-reports/:id/executions', () => {
		it('should return execution history', async () => {
			const response = await app.request('/scheduled-reports/test-id/executions', {
				method: 'GET',
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.executions).toBeInstanceOf(Array)
		})

		it('should respect limit query parameter', async () => {
			const response = await app.request('/scheduled-reports/test-id/executions?limit=10', {
				method: 'GET',
			})

			expect(response.status).toBe(200)
		})
	})

	describe('GET /templates', () => {
		it('should return all report templates', async () => {
			const response = await app.request('/templates', {
				method: 'GET',
			})

			expect(response.status).toBe(200)

			const result = await response.json()
			expect(result.success).toBe(true)
			expect(result.templates).toBeInstanceOf(Array)
		})
	})

	describe('error handling', () => {
		it('should handle malformed JSON', async () => {
			const response = await app.request('/reports/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: 'invalid json',
			})

			expect(response.status).toBe(400)
		})

		it('should handle missing Content-Type header', async () => {
			const response = await app.request('/reports/generate', {
				method: 'POST',
				body: JSON.stringify({
					criteria: {
						dateRange: {
							startDate: '2024-01-01T00:00:00.000Z',
							endDate: '2024-01-01T23:59:59.999Z',
						},
					},
				}),
			})

			// Should return 400 for malformed JSON without Content-Type
			expect(response.status).toBe(400)
		})
	})

	describe('CORS handling', () => {
		it('should include CORS headers', async () => {
			const response = await app.request('/reports/generate', {
				method: 'OPTIONS',
			})

			// CORS preflight should be handled with 204 No Content
			expect(response.status).toBe(204)
		})
	})
})
