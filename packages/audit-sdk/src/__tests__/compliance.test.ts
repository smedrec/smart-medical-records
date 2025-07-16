import { describe, expect, it } from 'vitest'

import { generateComplianceData, validateCompliance } from '../compliance.js'

import type { AuditLogEvent } from '@repo/audit'
import type { ComplianceConfig } from '../types.js'

describe('Compliance Validation', () => {
	describe('HIPAA Compliance', () => {
		const hipaaConfig: ComplianceConfig = {
			hipaa: {
				enabled: true,
				requiredFields: ['principalId', 'action', 'targetResourceType', 'sessionContext'],
				retentionYears: 6,
			},
		}

		it('should validate HIPAA compliant event', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'EMR/1.0',
				},
			}

			expect(() => validateCompliance(event, 'hipaa', hipaaConfig)).not.toThrow()
		})

		it('should require PHI classification for PHI resources', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'INTERNAL', // Should be PHI
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'EMR/1.0',
				},
			}

			expect(() => validateCompliance(event, 'hipaa', hipaaConfig)).toThrow(
				'HIPAA Compliance Error: PHI resources must have dataClassification set to "PHI"'
			)
		})

		it('should require session context for PHI access', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'PHI',
				// Missing sessionContext
			}

			expect(() => validateCompliance(event, 'hipaa', hipaaConfig)).toThrow(
				'HIPAA Compliance Error: PHI access events must include sessionContext'
			)
		})

		it('should require all specified fields', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				status: 'success',
				// Missing targetResourceType and sessionContext
			}

			expect(() => validateCompliance(event, 'hipaa', hipaaConfig)).toThrow(
				"HIPAA Compliance Error: Required field 'targetResourceType' is missing"
			)
		})

		it('should set default retention policy for PHI', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'EMR/1.0',
				},
			}

			validateCompliance(event, 'hipaa', hipaaConfig)
			expect(event.retentionPolicy).toBe('hipaa-6-years')
		})
	})

	describe('GDPR Compliance', () => {
		const gdprConfig: ComplianceConfig = {
			gdpr: {
				enabled: true,
				defaultLegalBasis: 'legitimate_interest',
				retentionDays: 365,
			},
		}

		it('should validate GDPR compliant personal data processing', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'processor-123',
				action: 'data.process',
				status: 'success',
				gdprContext: {
					dataSubjectId: 'subject-456',
					legalBasis: 'consent',
					processingPurpose: 'healthcare-treatment',
					dataCategories: ['health-data'],
				},
			}

			expect(() => validateCompliance(event, 'gdpr', gdprConfig)).not.toThrow()
		})

		it('should set default legal basis when missing', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'processor-123',
				action: 'data.create',
				status: 'success',
			}

			validateCompliance(event, 'gdpr', gdprConfig)
			expect(event.gdprContext?.legalBasis).toBe('legitimate_interest')
		})

		it('should require legal basis for personal data processing', () => {
			const gdprConfigNoDefault: ComplianceConfig = {
				gdpr: {
					enabled: true,
					retentionDays: 365,
				},
			}

			const event: Partial<AuditLogEvent> = {
				principalId: 'processor-123',
				action: 'data.create',
				status: 'success',
			}

			expect(() => validateCompliance(event, 'gdpr', gdprConfigNoDefault)).toThrow(
				'GDPR Compliance Error: Legal basis required for personal data processing'
			)
		})

		it('should require data subject ID for rights actions', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'processor-123',
				action: 'data.export', // Data subject rights action
				status: 'success',
				gdprContext: {
					legalBasis: 'consent',
					// Missing dataSubjectId
				},
			}

			expect(() => validateCompliance(event, 'gdpr', gdprConfig)).toThrow(
				'GDPR Compliance Error: Data subject ID required for rights-related actions'
			)
		})

		it('should set default retention policy', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'processor-123',
				action: 'data.process',
				status: 'success',
			}

			validateCompliance(event, 'gdpr', gdprConfig)
			expect(event.retentionPolicy).toBe('gdpr-365-days')
		})
	})

	describe('Custom Compliance', () => {
		const customConfig: ComplianceConfig = {
			custom: [
				{
					name: 'custom-rule',
					rules: [
						{
							field: 'organizationId',
							required: true,
						},
						{
							field: 'customField',
							validator: (value) => typeof value === 'string' && value.length > 5,
							message: 'Custom field must be a string longer than 5 characters',
						},
					],
				},
			],
		}

		it('should validate custom compliance rules', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'user-123',
				action: 'custom.action',
				status: 'success',
				organizationId: 'org-456',
				customField: 'valid-value',
			}

			expect(() => validateCompliance(event, 'custom-rule', customConfig)).not.toThrow()
		})

		it('should require custom required fields', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'user-123',
				action: 'custom.action',
				status: 'success',
				// Missing organizationId
			}

			expect(() => validateCompliance(event, 'custom-rule', customConfig)).toThrow(
				"Custom Compliance Error: Required field 'organizationId' is missing"
			)
		})

		it('should validate custom field validators', () => {
			const event: Partial<AuditLogEvent> = {
				principalId: 'user-123',
				action: 'custom.action',
				status: 'success',
				organizationId: 'org-456',
				customField: 'short', // Too short
			}

			expect(() => validateCompliance(event, 'custom-rule', customConfig)).toThrow(
				'Custom field must be a string longer than 5 characters'
			)
		})
	})

	describe('Compliance Reporting', () => {
		const sampleEvents: AuditLogEvent[] = [
			{
				timestamp: '2024-01-01T10:00:00Z',
				principalId: 'practitioner-123',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-123',
					ipAddress: '192.168.1.100',
					userAgent: 'EMR/1.0',
				},
			},
			{
				timestamp: '2024-01-01T11:00:00Z',
				principalId: 'practitioner-123',
				action: 'fhir.patient.update',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-456',
				status: 'success',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-124',
					ipAddress: '192.168.1.100',
					userAgent: 'EMR/1.0',
				},
			},
			{
				timestamp: '2024-01-01T12:00:00Z',
				principalId: 'practitioner-456',
				action: 'fhir.patient.read',
				targetResourceType: 'Patient',
				targetResourceId: 'patient-789',
				status: 'failure',
				dataClassification: 'PHI',
				sessionContext: {
					sessionId: 'sess-125',
					ipAddress: '192.168.1.101',
					userAgent: 'EMR/1.0',
				},
			},
		]

		it('should generate HIPAA compliance report', () => {
			const report = generateComplianceData(sampleEvents, 'hipaa')

			expect(report.reportType).toBe('HIPAA Audit Log')
			expect(report.totalEvents).toBe(3)
			expect(report.phiEvents).toBe(3)
			expect(report.summary.accessEvents).toBe(2) // read events
			expect(report.summary.modificationEvents).toBe(1) // update event
			expect(report.summary.failedAttempts).toBe(1) // failure event
			expect(report.events).toHaveLength(3)
		})

		it('should generate GDPR compliance report', () => {
			const gdprEvents: AuditLogEvent[] = [
				{
					timestamp: '2024-01-01T10:00:00Z',
					principalId: 'processor-123',
					action: 'data.process',
					status: 'success',
					gdprContext: {
						dataSubjectId: 'subject-456',
						legalBasis: 'consent',
						processingPurpose: 'healthcare-treatment',
						dataCategories: ['health-data'],
					},
				},
				{
					timestamp: '2024-01-01T11:00:00Z',
					principalId: 'processor-123',
					action: 'data.export',
					status: 'success',
					gdprContext: {
						dataSubjectId: 'subject-789',
						legalBasis: 'legitimate_interest',
						processingPurpose: 'research',
						dataCategories: ['contact-info'],
					},
				},
			]

			const report = generateComplianceData(gdprEvents, 'gdpr')

			expect(report.reportType).toBe('GDPR Processing Activities')
			expect(report.totalEvents).toBe(2)
			expect(report.personalDataEvents).toBe(2)
			expect(report.legalBasisBreakdown).toEqual({
				consent: 1,
				legitimate_interest: 1,
			})
			expect(report.dataSubjectRights).toHaveLength(1) // export is a rights action
		})

		it('should throw error for unsupported compliance type', () => {
			expect(() => generateComplianceData(sampleEvents, 'unsupported' as any)).toThrow(
				'Unsupported compliance type: unsupported'
			)
		})
	})
})
