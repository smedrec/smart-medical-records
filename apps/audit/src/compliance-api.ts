/**
 * @fileoverview Compliance API Routes
 *
 * Provides REST API endpoints for compliance reporting and data export:
 * - Generate compliance reports (HIPAA, GDPR, General)
 * - Export audit data in multiple formats
 * - Manage scheduled reports
 * - Verify audit trail integrity
 *
 * Requirements: 4.1, 4.4, 8.1
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { validator } from 'hono/validator'
import { pino } from 'pino'

import {
	ComplianceReportingService,
	DataExportService,
	ScheduledReportingService,
} from '@repo/audit'

import type {
	DeliveryConfig,
	ExportConfig,
	ReportCriteria,
	ScheduledReportConfig,
} from '@repo/audit'
import type { AuditDb } from '@repo/audit-db'

const apiLogger = pino({ name: 'compliance-api' })

/**
 * Create compliance API router
 */
export function createComplianceAPI(auditDb: AuditDb): Hono {
	const app = new Hono()

	// Middleware
	app.use('*', cors())
	app.use('*', logger())

	// Initialize services
	const reportingService = new ComplianceReportingService()
	const exportService = new DataExportService()

	// Placeholder delivery config - in real implementation would come from environment
	const deliveryConfig: DeliveryConfig = {
		email: {
			smtpConfig: {
				host: process.env.SMTP_HOST || 'localhost',
				port: parseInt(process.env.SMTP_PORT || '587'),
				secure: process.env.SMTP_SECURE === 'true',
				auth: {
					user: process.env.SMTP_USER || '',
					pass: process.env.SMTP_PASS || '',
				},
			},
			from: process.env.SMTP_FROM || 'audit@smedrec.com',
			subject: 'Scheduled Audit Report',
			bodyTemplate: 'Please find the attached audit report.',
			attachmentName: 'audit-report',
		},
		webhook: {
			url: process.env.WEBHOOK_URL || '',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.WEBHOOK_TOKEN || ''}`,
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
				basePath: process.env.STORAGE_PATH || './reports',
			},
			path: '/audit-reports',
			retention: {
				days: 90,
				autoCleanup: true,
			},
		},
	}

	const scheduledReportingService = new ScheduledReportingService(deliveryConfig)

	/**
	 * Generate general compliance report
	 * POST /api/compliance/reports/generate
	 */
	app.post(
		'/reports/generate',
		validator('json', (value, c) => {
			const { criteria, reportType } = value
			if (!criteria || typeof criteria !== 'object') {
				return c.text('Invalid criteria', 400)
			}
			return { criteria: criteria as ReportCriteria, reportType: reportType as string }
		}),
		async (c) => {
			try {
				const { criteria, reportType } = c.req.valid('json')

				// Fetch audit events from database based on criteria
				const events = await fetchAuditEvents(auditDb, criteria)

				// Generate report
				const report = await reportingService.generateComplianceReport(events, criteria, reportType)

				apiLogger.info(`Generated compliance report: ${report.metadata.reportId}`)

				return c.json({
					success: true,
					report,
				})
			} catch (error) {
				apiLogger.error('Failed to generate compliance report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Generate HIPAA compliance report
	 * POST /api/compliance/reports/hipaa
	 */
	app.post(
		'/reports/hipaa',
		validator('json', (value, c) => {
			const { criteria } = value
			if (!criteria || typeof criteria !== 'object') {
				return c.text('Invalid criteria', 400)
			}
			return { criteria: criteria as ReportCriteria }
		}),
		async (c) => {
			try {
				const { criteria } = c.req.valid('json')

				// Fetch audit events from database
				const events = await fetchAuditEvents(auditDb, criteria)

				// Generate HIPAA report
				const report = await reportingService.generateHIPAAReport(events, criteria)

				apiLogger.info(`Generated HIPAA report: ${report.metadata.reportId}`)

				return c.json({
					success: true,
					report,
				})
			} catch (error) {
				apiLogger.error('Failed to generate HIPAA report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Generate GDPR compliance report
	 * POST /api/compliance/reports/gdpr
	 */
	app.post(
		'/reports/gdpr',
		validator('json', (value, c) => {
			const { criteria } = value
			if (!criteria || typeof criteria !== 'object') {
				return c.text('Invalid criteria', 400)
			}
			return { criteria: criteria as ReportCriteria }
		}),
		async (c) => {
			try {
				const { criteria } = c.req.valid('json')

				// Fetch audit events from database
				const events = await fetchAuditEvents(auditDb, criteria)

				// Generate GDPR report
				const report = await reportingService.generateGDPRReport(events, criteria)

				apiLogger.info(`Generated GDPR report: ${report.metadata.reportId}`)

				return c.json({
					success: true,
					report,
				})
			} catch (error) {
				apiLogger.error('Failed to generate GDPR report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Generate integrity verification report
	 * POST /api/compliance/reports/integrity
	 */
	app.post(
		'/reports/integrity',
		validator('json', (value, c) => {
			const { criteria, performVerification } = value
			if (!criteria || typeof criteria !== 'object') {
				return c.text('Invalid criteria', 400)
			}
			return {
				criteria: criteria as ReportCriteria,
				performVerification: performVerification as boolean,
			}
		}),
		async (c) => {
			try {
				const { criteria, performVerification = true } = c.req.valid('json')

				// Fetch audit events from database
				const events = await fetchAuditEvents(auditDb, criteria)

				// Generate integrity verification report
				const report = await reportingService.generateIntegrityVerificationReport(
					events,
					performVerification
				)

				apiLogger.info(`Generated integrity verification report: ${report.verificationId}`)

				return c.json({
					success: true,
					report,
				})
			} catch (error) {
				apiLogger.error('Failed to generate integrity verification report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Export compliance report
	 * POST /api/compliance/export/report
	 */
	app.post(
		'/export/report',
		validator('json', (value, c) => {
			const { report, config } = value
			if (!report || !config) {
				return c.text('Missing report or export config', 400)
			}
			return { report, config: config as ExportConfig }
		}),
		async (c) => {
			try {
				const { report, config } = c.req.valid('json')

				// Export the report
				const exportResult = await exportService.exportComplianceReport(report, config)

				apiLogger.info(`Exported report: ${exportResult.exportId}`)

				// Set appropriate headers for file download
				c.header('Content-Type', exportResult.contentType)
				c.header('Content-Disposition', `attachment; filename="${exportResult.filename}"`)
				c.header('Content-Length', exportResult.size.toString())
				c.header('X-Export-ID', exportResult.exportId)
				c.header('X-Checksum', exportResult.checksum)

				return c.body(exportResult.data)
			} catch (error) {
				apiLogger.error('Failed to export report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Export audit events
	 * POST /api/compliance/export/events
	 */
	app.post(
		'/export/events',
		validator('json', (value, c) => {
			const { criteria, config } = value
			if (!criteria || !config) {
				return c.text('Missing criteria or export config', 400)
			}
			return {
				criteria: criteria as ReportCriteria,
				config: config as ExportConfig,
			}
		}),
		async (c) => {
			try {
				const { criteria, config } = c.req.valid('json')

				// Fetch audit events from database
				const events = await fetchAuditEvents(auditDb, criteria)

				// Convert to report events format
				const reportEvents = events.map((event) => ({
					id: event.id,
					timestamp: event.timestamp,
					principalId: event.principalId,
					organizationId: event.organizationId,
					action: event.action,
					targetResourceType: event.targetResourceType,
					targetResourceId: event.targetResourceId,
					status: event.status,
					outcomeDescription: event.outcomeDescription,
					dataClassification: event.dataClassification,
					sessionContext: event.sessionContext,
					integrityStatus: (event.hash ? 'verified' : 'not_checked') as
						| 'verified'
						| 'not_checked'
						| 'failed',
					correlationId: event.correlationId,
				}))

				// Export the events
				const exportResult = await exportService.exportAuditEvents(reportEvents, config, {
					criteria,
				})

				apiLogger.info(`Exported ${reportEvents.length} audit events: ${exportResult.exportId}`)

				// Set appropriate headers for file download
				c.header('Content-Type', exportResult.contentType)
				c.header('Content-Disposition', `attachment; filename="${exportResult.filename}"`)
				c.header('Content-Length', exportResult.size.toString())
				c.header('X-Export-ID', exportResult.exportId)
				c.header('X-Checksum', exportResult.checksum)

				return c.body(exportResult.data)
			} catch (error) {
				apiLogger.error('Failed to export audit events:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Create scheduled report
	 * POST /api/compliance/scheduled-reports
	 */
	app.post(
		'/scheduled-reports',
		validator('json', (value, c) => {
			const config = value as Omit<ScheduledReportConfig, 'id' | 'createdAt' | 'nextRun'>
			if (!config.name || !config.criteria || !config.schedule || !config.delivery) {
				return c.text('Missing required fields', 400)
			}
			return config
		}),
		async (c) => {
			try {
				const config = c.req.valid('json')

				const scheduledReport = await scheduledReportingService.createScheduledReport(config)

				apiLogger.info(`Created scheduled report: ${scheduledReport.id}`)

				return c.json({
					success: true,
					scheduledReport,
				})
			} catch (error) {
				apiLogger.error('Failed to create scheduled report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Get all scheduled reports
	 * GET /api/compliance/scheduled-reports
	 */
	app.get('/scheduled-reports', async (c) => {
		try {
			const scheduledReports = await scheduledReportingService.getScheduledReports()

			return c.json({
				success: true,
				scheduledReports,
			})
		} catch (error) {
			apiLogger.error('Failed to get scheduled reports:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	/**
	 * Get specific scheduled report
	 * GET /api/compliance/scheduled-reports/:id
	 */
	app.get('/scheduled-reports/:id', async (c) => {
		try {
			const reportId = c.req.param('id')
			const scheduledReport = await scheduledReportingService.getScheduledReport(reportId)

			if (!scheduledReport) {
				return c.json(
					{
						success: false,
						error: 'Scheduled report not found',
					},
					404
				)
			}

			return c.json({
				success: true,
				scheduledReport,
			})
		} catch (error) {
			apiLogger.error('Failed to get scheduled report:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	/**
	 * Update scheduled report
	 * PUT /api/compliance/scheduled-reports/:id
	 */
	app.put(
		'/scheduled-reports/:id',
		validator('json', (value, c) => {
			return value as Partial<ScheduledReportConfig>
		}),
		async (c) => {
			try {
				const reportId = c.req.param('id')
				const updates = c.req.valid('json')

				const updatedReport = await scheduledReportingService.updateScheduledReport(
					reportId,
					updates
				)

				apiLogger.info(`Updated scheduled report: ${reportId}`)

				return c.json({
					success: true,
					scheduledReport: updatedReport,
				})
			} catch (error) {
				apiLogger.error('Failed to update scheduled report:', error)
				return c.json(
					{
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					500
				)
			}
		}
	)

	/**
	 * Delete scheduled report
	 * DELETE /api/compliance/scheduled-reports/:id
	 */
	app.delete('/scheduled-reports/:id', async (c) => {
		try {
			const reportId = c.req.param('id')

			await scheduledReportingService.deleteScheduledReport(reportId)

			apiLogger.info(`Deleted scheduled report: ${reportId}`)

			return c.json({
				success: true,
				message: 'Scheduled report deleted successfully',
			})
		} catch (error) {
			apiLogger.error('Failed to delete scheduled report:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	/**
	 * Execute scheduled report immediately
	 * POST /api/compliance/scheduled-reports/:id/execute
	 */
	app.post('/scheduled-reports/:id/execute', async (c) => {
		try {
			const reportId = c.req.param('id')

			const execution = await scheduledReportingService.executeReport(reportId)

			apiLogger.info(`Executed scheduled report: ${reportId}`)

			return c.json({
				success: true,
				execution,
			})
		} catch (error) {
			apiLogger.error('Failed to execute scheduled report:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	/**
	 * Get execution history for scheduled report
	 * GET /api/compliance/scheduled-reports/:id/executions
	 */
	app.get('/scheduled-reports/:id/executions', async (c) => {
		try {
			const reportId = c.req.param('id')
			const limit = parseInt(c.req.query('limit') || '50')

			const executions = await scheduledReportingService.getExecutionHistory(reportId, limit)

			return c.json({
				success: true,
				executions,
			})
		} catch (error) {
			apiLogger.error('Failed to get execution history:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	/**
	 * Get report templates
	 * GET /api/compliance/templates
	 */
	app.get('/templates', async (c) => {
		try {
			const templates = await scheduledReportingService.getReportTemplates()

			return c.json({
				success: true,
				templates,
			})
		} catch (error) {
			apiLogger.error('Failed to get report templates:', error)
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				500
			)
		}
	})

	return app
}

/**
 * Helper function to fetch audit events from database based on criteria
 */
async function fetchAuditEvents(auditDb: AuditDb, criteria: ReportCriteria): Promise<any[]> {
	// This is a simplified implementation
	// In a real implementation, would use proper database queries with the criteria

	const db = auditDb.getDrizzleInstance()

	// Placeholder query - would implement proper filtering based on criteria
	// Import the audit log table schema
	const { auditLog } = await import('@repo/audit-db/src/db/schema.js')

	const events = await db
		.select()
		.from(auditLog)
		.limit(criteria.limit || 1000)

	return events
}
