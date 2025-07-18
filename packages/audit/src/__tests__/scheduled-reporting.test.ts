/**
 * @fileoverview Tests for Scheduled Reporting Service
 *
 * Tests scheduled reporting functionality including:
 * - Creating and managing scheduled reports
 * - Report execution and scheduling
 * - Delivery methods and retry logic
 * - Report templates
 * - Execution history tracking
 */

import { beforeEach, describe, expect, it } from 'vitest'

import { ScheduledReportingService } from '../report/scheduled-reporting.js'

import type { ReportCriteria, ScheduledReportConfig } from '../report/compliance-reporting.js'
import type {
	DeliveryConfig,
	ReportExecution,
	ReportTemplate,
} from '../report/scheduled-reporting.js'

describe('ScheduledReportingService', () => {
	let service: ScheduledReportingService
	let mockDeliveryConfig: DeliveryConfig

	beforeEach(() => {
		mockDeliveryConfig = {
			email: {
				smtpConfig: {
					host: 'smtp.test.com',
					port: 587,
					secure: false,
					auth: {
						user: 'test@example.com',
						pass: 'password',
					},
				},
				from: 'audit@test.com',
				subject: 'Test Audit Report',
				bodyTemplate: 'Please find attached audit report.',
			},
			webhook: {
				url: 'https://webhook.test.com/audit',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer test-token',
				},
				timeout: 30000,
				retryConfig: {
					maxRetries: 3,
					backoffMultiplier: 2,
					maxBackoffDelay: 30000,
				},
			},
			storage: {
				provider: 'local',
				config: {
					basePath: './test-reports',
				},
				path: '/audit-reports',
				retention: {
					days: 90,
					autoCleanup: true,
				},
			},
		}

		service = new ScheduledReportingService(mockDeliveryConfig)
	})

	describe('createScheduledReport', () => {
		it('should create a new scheduled report', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Daily HIPAA Report',
				description: 'Daily HIPAA compliance report',
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-01T23:59:59.999Z',
					},
					dataClassifications: ['PHI'],
				},
				format: 'json',
				schedule: {
					frequency: 'daily',
					time: '09:00',
					timezone: 'UTC',
				},
				delivery: {
					method: 'email',
					recipients: ['admin@test.com'],
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const result = await service.createScheduledReport(config)

			expect(result.id).toBeDefined()
			expect(result.name).toBe('Daily HIPAA Report')
			expect(result.createdAt).toBeDefined()
			expect(result.nextRun).toBeDefined()
			expect(result.enabled).toBe(true)
		})

		it('should calculate next run time correctly for daily schedule', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Test Report',
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

			const result = await service.createScheduledReport(config)

			expect(result.nextRun).toBeDefined()
			const nextRun = new Date(result.nextRun!)
			expect(nextRun.getHours()).toBe(9)
			expect(nextRun.getMinutes()).toBe(0)
		})

		it('should calculate next run time correctly for weekly schedule', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Weekly Report',
				criteria: {
					dateRange: {
						startDate: '2024-01-01T00:00:00.000Z',
						endDate: '2024-01-07T23:59:59.999Z',
					},
				},
				format: 'json',
				schedule: {
					frequency: 'weekly',
					dayOfWeek: 1, // Monday
					time: '10:00',
				},
				delivery: {
					method: 'email',
					recipients: ['test@test.com'],
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const result = await service.createScheduledReport(config)

			expect(result.nextRun).toBeDefined()
			const nextRun = new Date(result.nextRun!)
			expect(nextRun.getDay()).toBe(1) // Monday
			expect(nextRun.getHours()).toBe(10)
		})
	})

	describe('updateScheduledReport', () => {
		it('should update an existing scheduled report', async () => {
			// First create a report
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Original Report',
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

			const created = await service.createScheduledReport(config)

			// Update the report
			const updates = {
				name: 'Updated Report',
				enabled: false,
			}

			const updated = await service.updateScheduledReport(created.id, updates)

			expect(updated.name).toBe('Updated Report')
			expect(updated.enabled).toBe(false)
			expect(updated.id).toBe(created.id)
		})

		it('should throw error when updating non-existent report', async () => {
			await expect(service.updateScheduledReport('non-existent', { name: 'Test' })).rejects.toThrow(
				'Scheduled report not found: non-existent'
			)
		})
	})

	describe('deleteScheduledReport', () => {
		it('should delete an existing scheduled report', async () => {
			// Create a report first
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Report to Delete',
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

			const created = await service.createScheduledReport(config)

			// Delete the report
			await service.deleteScheduledReport(created.id)

			// Verify it's deleted
			const retrieved = await service.getScheduledReport(created.id)
			expect(retrieved).toBeNull()
		})

		it('should throw error when deleting non-existent report', async () => {
			await expect(service.deleteScheduledReport('non-existent')).rejects.toThrow(
				'Scheduled report not found: non-existent'
			)
		})
	})

	describe('getScheduledReports', () => {
		it('should return all scheduled reports', async () => {
			// Create multiple reports
			const configs = [
				{
					name: 'Report 1',
					criteria: {
						dateRange: {
							startDate: '2024-01-01T00:00:00.000Z',
							endDate: '2024-01-01T23:59:59.999Z',
						},
					},
					format: 'json' as const,
					schedule: { frequency: 'daily' as const, time: '09:00' },
					delivery: { method: 'email' as const, recipients: ['test1@test.com'] },
					enabled: true,
					createdBy: 'user1',
				},
				{
					name: 'Report 2',
					criteria: {
						dateRange: {
							startDate: '2024-01-01T00:00:00.000Z',
							endDate: '2024-01-01T23:59:59.999Z',
						},
					},
					format: 'csv' as const,
					schedule: { frequency: 'weekly' as const, time: '10:00' },
					delivery: { method: 'webhook' as const, webhookUrl: 'https://test.com/webhook' },
					enabled: true,
					createdBy: 'user2',
				},
			]

			for (const config of configs) {
				await service.createScheduledReport(config)
			}

			const reports = await service.getScheduledReports()
			expect(reports).toHaveLength(2)
			expect(reports.map((r) => r.name)).toContain('Report 1')
			expect(reports.map((r) => r.name)).toContain('Report 2')
		})
	})

	describe('executeReport', () => {
		it('should execute a scheduled report', async () => {
			// Create a report first
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Test Execution',
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

			const created = await service.createScheduledReport(config)

			// Execute the report
			const execution = await service.executeReport(created.id)

			expect(execution.executionId).toBeDefined()
			expect(execution.reportConfigId).toBe(created.id)
			expect(execution.status).toBe('completed')
			expect(execution.duration).toBeGreaterThan(0)
			expect(execution.deliveryAttempts).toHaveLength(1)
			expect(execution.deliveryAttempts[0].status).toBe('delivered')
		})

		it('should throw error when executing non-existent report', async () => {
			await expect(service.executeReport('non-existent')).rejects.toThrow(
				'Scheduled report not found: non-existent'
			)
		})
	})

	describe('getExecutionHistory', () => {
		it('should return execution history for a report', async () => {
			// Create and execute a report
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'History Test',
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

			const created = await service.createScheduledReport(config)
			await service.executeReport(created.id)

			const history = await service.getExecutionHistory(created.id)

			expect(history).toHaveLength(1)
			expect(history[0].reportConfigId).toBe(created.id)
			expect(history[0].status).toBe('completed')
		})

		it('should limit execution history results', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Limit Test',
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

			const created = await service.createScheduledReport(config)

			// Execute multiple times
			await service.executeReport(created.id)
			await service.executeReport(created.id)
			await service.executeReport(created.id)

			const history = await service.getExecutionHistory(created.id, 2)

			expect(history).toHaveLength(2)
		})
	})

	describe('createReportTemplate', () => {
		it('should create a new report template', async () => {
			const template: Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
				name: 'HIPAA Daily Template',
				description: 'Template for daily HIPAA reports',
				reportType: 'HIPAA_AUDIT_TRAIL',
				defaultCriteria: {
					dataClassifications: ['PHI'],
				},
				defaultFormat: 'json',
				defaultExportConfig: {
					includeMetadata: true,
					includeIntegrityReport: true,
				},
				tags: ['hipaa', 'daily', 'phi'],
				createdBy: 'admin',
				updatedBy: 'admin',
				isActive: true,
			}

			const result = await service.createReportTemplate(template)

			expect(result.id).toBeDefined()
			expect(result.name).toBe('HIPAA Daily Template')
			expect(result.reportType).toBe('HIPAA_AUDIT_TRAIL')
			expect(result.createdAt).toBeDefined()
			expect(result.updatedAt).toBeDefined()
			expect(result.isActive).toBe(true)
		})
	})

	describe('createReportFromTemplate', () => {
		it('should create scheduled report from template', async () => {
			// First create a template
			const template: Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt'> = {
				name: 'Test Template',
				reportType: 'GENERAL_COMPLIANCE',
				defaultCriteria: {
					dataClassifications: ['INTERNAL'],
				},
				defaultFormat: 'csv',
				defaultExportConfig: {},
				tags: ['test'],
				createdBy: 'admin',
				updatedBy: 'admin',
				isActive: true,
			}

			const createdTemplate = await service.createReportTemplate(template)

			// Create report from template
			const overrides = {
				schedule: {
					frequency: 'weekly' as const,
					time: '14:00',
				},
				delivery: {
					method: 'email' as const,
					recipients: ['test@test.com'],
				},
				createdBy: 'user',
			}

			const report = await service.createReportFromTemplate(createdTemplate.id, overrides)

			expect(report.name).toContain('Test Template')
			expect(report.format).toBe('csv')
			expect(report.criteria.dataClassifications).toEqual(['INTERNAL'])
			expect(report.schedule.frequency).toBe('weekly')
			expect(report.delivery.method).toBe('email')
		})

		it('should throw error for non-existent template', async () => {
			await expect(service.createReportFromTemplate('non-existent', {})).rejects.toThrow(
				'Report template not found: non-existent'
			)
		})
	})

	describe('processDueReports', () => {
		it('should process reports that are due', async () => {
			// Create a report with a past next run time
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Due Report',
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

			const created = await service.createScheduledReport(config)

			// Manually set next run to past time
			const pastTime = new Date(Date.now() - 60000).toISOString() // 1 minute ago
			await service.updateScheduledReport(created.id, { nextRun: pastTime })

			const executions = await service.processDueReports()

			expect(executions).toHaveLength(1)
			expect(executions[0].reportConfigId).toBe(created.id)
		})

		it('should not process disabled reports', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Disabled Report',
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
				enabled: false, // Disabled
				createdBy: 'test-user',
			}

			await service.createScheduledReport(config)

			const executions = await service.processDueReports()

			expect(executions).toHaveLength(0)
		})
	})

	describe('delivery methods', () => {
		it('should handle email delivery', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Email Test',
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
					recipients: ['test1@test.com', 'test2@test.com'],
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const created = await service.createScheduledReport(config)
			const execution = await service.executeReport(created.id)

			expect(execution.deliveryAttempts).toHaveLength(1)
			expect(execution.deliveryAttempts[0].method).toBe('email')
			expect(execution.deliveryAttempts[0].target).toContain('test1@test.com')
		})

		it('should handle webhook delivery', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Webhook Test',
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
					method: 'webhook',
					webhookUrl: 'https://test.com/webhook',
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const created = await service.createScheduledReport(config)
			const execution = await service.executeReport(created.id)

			expect(execution.deliveryAttempts).toHaveLength(1)
			expect(execution.deliveryAttempts[0].method).toBe('webhook')
			expect(execution.deliveryAttempts[0].target).toBe('https://test.com/webhook')
		})

		it('should handle storage delivery', async () => {
			const config: Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'> = {
				name: 'Storage Test',
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
					method: 'storage',
					storageLocation: '/reports/audit',
				},
				enabled: true,
				createdBy: 'test-user',
			}

			const created = await service.createScheduledReport(config)
			const execution = await service.executeReport(created.id)

			expect(execution.deliveryAttempts).toHaveLength(1)
			expect(execution.deliveryAttempts[0].method).toBe('storage')
			expect(execution.deliveryAttempts[0].target).toBe('/reports/audit')
		})
	})
})
