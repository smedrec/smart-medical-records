/**
 * @fileoverview Tests for Compliance Reporting Service
 *
 * Tests compliance report generation functionality including:
 * - General compliance reports
 * - HIPAA-specific reports
 * - GDPR-specific reports
 * - Integrity verification reports
 * - Report filtering and criteria
 */

import { beforeEach, describe, expect, it } from 'vitest'

import { ComplianceReportingService } from '../report/compliance-reporting.js'

import type {
	ComplianceReport,
	GDPRComplianceReport,
	HIPAAComplianceReport,
	IntegrityVerificationReport,
	ReportCriteria,
} from '../report/compliance-reporting.js'
import type { AuditLogEvent } from '../types.js'

describe('ComplianceReportingService', () => {
	let service: ComplianceReportingService
	let mockEvents: AuditLogEvent[]

	beforeEach(() => {
		service = new ComplianceReportingService()

		// Create mock audit events for testing
		mockEvents = [
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
				eventVersion: '1.0',
				correlationId: 'corr-001',
				sessionContext: {
					sessionId: 'session-001',
					ipAddress: '192.168.1.100',
					userAgent: 'Mozilla/5.0',
				},
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
				hash: 'def456hash',
				hashAlgorithm: 'SHA-256',
				eventVersion: '1.0',
				sessionContext: {
					sessionId: 'session-002',
					ipAddress: '192.168.1.101',
					userAgent: 'Chrome/120.0',
				},
			},
			{
				id: 3,
				timestamp: '2024-01-01T12:00:00.000Z',
				principalId: 'user-789',
				organizationId: 'org-456',
				action: 'data.export',
				targetResourceType: 'Patient',
				status: 'success',
				outcomeDescription: 'Exported patient data for research',
				dataClassification: 'PHI',
				hash: 'ghi789hash',
				hashAlgorithm: 'SHA-256',
				eventVersion: '1.0',
				gdprContext: {
					legalBasis: 'consent',
					dataSubjectId: 'patient-789',
					processingPurpose: 'research',
				},
			},
			{
				id: 4,
				timestamp: '2024-01-02T09:00:00.000Z',
				principalId: 'user-123',
				organizationId: 'org-456',
				action: 'fhir.patient.update',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-789',
				status: 'failure',
				outcomeDescription: 'Failed to update patient - access denied',
				dataClassification: 'PHI',
				hash: 'jkl012hash',
				hashAlgorithm: 'SHA-256',
				eventVersion: '1.0',
			},
		]
	})

	describe('generateComplianceReport', () => {
		it('should generate a basic compliance report', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report).toBeDefined()
			expect(report.metadata.reportType).toBe('GENERAL_COMPLIANCE')
			expect(report.metadata.totalEvents).toBe(4)
			expect(report.metadata.filteredEvents).toBe(4)
			expect(report.events).toHaveLength(4)
			expect(report.summary.uniquePrincipals).toBe(3)
			expect(report.summary.eventsByStatus.success).toBe(3)
			expect(report.summary.eventsByStatus.failure).toBe(1)
		})

		it('should filter events by principal ID', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				principalIds: ['user-123'],
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(2)
			expect(report.events.every((event) => event.principalId === 'user-123')).toBe(true)
		})

		it('should filter events by data classification', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				dataClassifications: ['PHI'],
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(3)
			expect(report.events.every((event) => event.dataClassification === 'PHI')).toBe(true)
		})

		it('should apply limit and offset', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				limit: 2,
				offset: 1,
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(2)
			expect(report.events).toHaveLength(2)
		})

		it('should filter by verified events only', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				verifiedOnly: true,
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(4) // All mock events have hashes
			expect(report.events.every((event) => event.integrityStatus === 'verified')).toBe(true)
		})
	})

	describe('generateHIPAAReport', () => {
		it('should generate HIPAA-specific compliance report', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateHIPAAReport(mockEvents, criteria)

			expect(report.reportType).toBe('HIPAA_AUDIT_TRAIL')
			expect(report.hipaaSpecific).toBeDefined()
			expect(report.hipaaSpecific.phiAccessEvents).toBe(1) // One read event
			expect(report.hipaaSpecific.phiModificationEvents).toBe(1) // One export (update event is failure)
			expect(report.hipaaSpecific.unauthorizedAttempts).toBe(1) // One failure
			expect(report.riskAssessment).toBeDefined()
			expect(report.riskAssessment.recommendations).toBeInstanceOf(Array)
		})

		it('should identify high-risk events', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateHIPAAReport(mockEvents, criteria)

			expect(report.riskAssessment.highRiskEvents).toHaveLength(1) // One failure event
			expect(report.riskAssessment.highRiskEvents[0].status).toBe('failure')
		})
	})

	describe('generateGDPRReport', () => {
		it('should generate GDPR-specific compliance report', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateGDPRReport(mockEvents, criteria)

			expect(report.reportType).toBe('GDPR_PROCESSING_ACTIVITIES')
			expect(report.gdprSpecific).toBeDefined()
			expect(report.gdprSpecific.personalDataEvents).toBeGreaterThan(0)
			expect(report.legalBasisBreakdown).toBeDefined()
			expect(report.legalBasisBreakdown.consent).toBe(1)
			expect(report.dataSubjectRights).toBeDefined()
		})

		it('should track data subject rights activities', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateGDPRReport(mockEvents, criteria)

			expect(report.dataSubjectRights.portabilityRequests).toBe(1) // One export event
		})
	})

	describe('generateIntegrityVerificationReport', () => {
		it('should generate integrity verification report without performing verification', async () => {
			const report = await service.generateIntegrityVerificationReport(mockEvents, false)

			expect(report.verificationId).toBeDefined()
			expect(report.verifiedAt).toBeDefined()
			expect(report.results.totalEvents).toBe(4)
			expect(report.results.verifiedEvents).toBe(0) // No verification performed
			expect(report.results.unverifiedEvents).toBe(0)
			expect(report.failures).toHaveLength(0)
		})

		it('should generate integrity verification report with verification', async () => {
			const report = await service.generateIntegrityVerificationReport(mockEvents, true)

			expect(report.results.totalEvents).toBe(4)
			expect(report.results.verifiedEvents).toBe(4) // All events have hashes
			expect(report.results.verificationRate).toBe(100)
			expect(report.statistics.hashAlgorithms['SHA-256']).toBe(4)
		})

		it('should track hash algorithms used', async () => {
			const report = await service.generateIntegrityVerificationReport(mockEvents, true)

			expect(report.statistics.hashAlgorithms).toBeDefined()
			expect(report.statistics.hashAlgorithms['SHA-256']).toBe(4)
		})
	})

	describe('event filtering', () => {
		it('should filter by date range correctly', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T10:30:00.000Z',
					endDate: '2024-01-01T11:30:00.000Z',
				},
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(1) // Only the 11:00 event
			expect(report.events[0].timestamp).toBe('2024-01-01T11:00:00.000Z')
		})

		it('should filter by multiple actions', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				actions: ['fhir.patient.read', 'fhir.patient.update'],
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(2)
			expect(
				report.events.every(
					(event) => event.action === 'fhir.patient.read' || event.action === 'fhir.patient.update'
				)
			).toBe(true)
		})

		it('should filter by resource types', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				resourceTypes: ['Patient'],
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(3) // Three Patient-related events
			expect(
				report.events.every(
					(event) => event.targetResourceType === 'Patient' || !event.targetResourceType
				)
			).toBe(true)
		})

		it('should filter by status', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
				statuses: ['failure'],
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(1)
			expect(report.events[0].status).toBe('failure')
		})
	})

	describe('summary generation', () => {
		it('should generate accurate summary statistics', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.summary.eventsByStatus.success).toBe(3)
			expect(report.summary.eventsByStatus.failure).toBe(1)
			expect(report.summary.eventsByAction['fhir.patient.read']).toBe(1)
			expect(report.summary.eventsByAction['auth.login.success']).toBe(1)
			expect(report.summary.eventsByDataClassification.PHI).toBe(3)
			expect(report.summary.eventsByDataClassification.INTERNAL).toBe(1)
			expect(report.summary.uniquePrincipals).toBe(3)
			expect(report.summary.uniqueResources).toBe(1) // Only one Patient/patient-789
		})

		it('should calculate time range correctly', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateComplianceReport(mockEvents, criteria)

			expect(report.summary.timeRange.earliest).toBe('2024-01-01T10:00:00.000Z')
			expect(report.summary.timeRange.latest).toBe('2024-01-02T09:00:00.000Z')
		})
	})

	describe('error handling', () => {
		it('should handle empty event arrays', async () => {
			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateComplianceReport([], criteria)

			expect(report.metadata.totalEvents).toBe(0)
			expect(report.metadata.filteredEvents).toBe(0)
			expect(report.events).toHaveLength(0)
			expect(report.summary.uniquePrincipals).toBe(0)
		})

		it('should handle events without optional fields', async () => {
			const minimalEvents: AuditLogEvent[] = [
				{
					timestamp: '2024-01-01T10:00:00.000Z',
					action: 'test.action',
					status: 'success',
				},
			]

			const criteria: ReportCriteria = {
				dateRange: {
					startDate: '2024-01-01T00:00:00.000Z',
					endDate: '2024-01-02T23:59:59.999Z',
				},
			}

			const report = await service.generateComplianceReport(minimalEvents, criteria)

			expect(report.metadata.filteredEvents).toBe(1)
			expect(report.events[0].principalId).toBeUndefined()
			expect(report.events[0].targetResourceType).toBeUndefined()
		})
	})
})
