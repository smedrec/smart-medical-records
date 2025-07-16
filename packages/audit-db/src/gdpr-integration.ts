import { and, eq, gte, lte, sql } from 'drizzle-orm'

import { GDPRComplianceService, GDPRUtils } from '@repo/audit'

import { AuditDb } from './db/index.js'
import { auditLog, auditRetentionPolicy } from './db/schema.js'

import type {
	ArchivalResult,
	GDPRDataExport,
	GDPRDataExportRequest,
	RetentionPolicy,
} from '@repo/audit'

/**
 * GDPR Integration Service for Audit Database
 * Provides high-level GDPR compliance operations for the audit system
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
export class AuditGDPRIntegration {
	private gdprService: GDPRComplianceService
	private auditDb: AuditDb

	constructor(auditDb: AuditDb) {
		this.auditDb = auditDb
		const db = auditDb.getDrizzleInstance()
		this.gdprService = new GDPRComplianceService(db, auditLog, auditRetentionPolicy)
	}

	/**
	 * Process GDPR data subject access request (Article 15)
	 * Export all audit data for a specific user in requested format
	 */
	async processDataAccessRequest(request: GDPRDataExportRequest): Promise<GDPRDataExport> {
		// Validate the request
		const validation = GDPRUtils.validateExportRequest(request)
		if (!validation.valid) {
			throw new Error(`Invalid GDPR request: ${validation.errors.join(', ')}`)
		}

		// Log the access request
		console.log(
			`Processing GDPR data access request for user: ${GDPRUtils.maskSensitiveData(request.principalId)}`
		)

		// Export the data
		const exportResult = await this.gdprService.exportUserData(request)

		// Generate compliance metadata
		const metadata = GDPRUtils.generateComplianceMetadata(
			'access_request',
			request.principalId,
			request.requestedBy,
			{
				format: request.format,
				recordCount: exportResult.recordCount,
				dataSize: exportResult.dataSize,
				requestId: exportResult.requestId,
			}
		)

		console.log(`GDPR data access request completed:`, metadata)

		return exportResult
	}

	/**
	 * Process GDPR right to erasure request (Article 17)
	 * Delete or pseudonymize user data while preserving compliance audit trails
	 */
	async processDataErasureRequest(
		principalId: string,
		requestedBy: string,
		preserveComplianceAudits: boolean = true
	): Promise<{ success: boolean; summary: any }> {
		console.log(
			`Processing GDPR data erasure request for user: ${GDPRUtils.maskSensitiveData(principalId)}`
		)

		try {
			// Check if user has compliance-critical audit records
			const hasComplianceRecords = await this.hasComplianceCriticalRecords(principalId)

			let result
			if (hasComplianceRecords && preserveComplianceAudits) {
				// Pseudonymize compliance records, delete others
				result = await this.gdprService.deleteUserDataWithAuditTrail(principalId, requestedBy, true)
				console.log(`Data erasure completed with compliance preservation:`, result)
			} else {
				// Delete all records
				result = await this.gdprService.deleteUserDataWithAuditTrail(
					principalId,
					requestedBy,
					false
				)
				console.log(`Complete data erasure completed:`, result)
			}

			return {
				success: true,
				summary: {
					principalId: GDPRUtils.maskSensitiveData(principalId),
					recordsDeleted: result.recordsDeleted,
					complianceRecordsPreserved: result.complianceRecordsPreserved,
					hasComplianceRecords,
					preserveComplianceAudits,
					processedBy: requestedBy,
					processedAt: new Date().toISOString(),
				},
			}
		} catch (error) {
			console.error('GDPR data erasure failed:', error)
			return {
				success: false,
				summary: {
					error: error instanceof Error ? error.message : 'Unknown error',
					principalId: GDPRUtils.maskSensitiveData(principalId),
					processedBy: requestedBy,
					processedAt: new Date().toISOString(),
				},
			}
		}
	}

	/**
	 * Process GDPR data portability request (Article 20)
	 * Export user data in a structured, machine-readable format
	 */
	async processDataPortabilityRequest(
		principalId: string,
		requestedBy: string,
		format: 'json' | 'csv' | 'xml' = 'json'
	): Promise<GDPRDataExport> {
		const request: GDPRDataExportRequest = {
			principalId,
			requestType: 'portability',
			format,
			requestedBy,
			requestTimestamp: new Date().toISOString(),
			includeMetadata: true,
		}

		return await this.processDataAccessRequest(request)
	}

	/**
	 * Pseudonymize user data while maintaining referential integrity
	 * Used for GDPR compliance when complete deletion is not appropriate
	 */
	async pseudonymizeUserData(
		principalId: string,
		requestedBy: string,
		strategy: 'hash' | 'token' | 'encryption' = 'hash'
	): Promise<{ success: boolean; pseudonymId?: string; recordsAffected?: number }> {
		try {
			console.log(`Pseudonymizing data for user: ${GDPRUtils.maskSensitiveData(principalId)}`)

			const result = await this.gdprService.pseudonymizeUserData(principalId, strategy, requestedBy)

			console.log(`Pseudonymization completed:`, {
				originalId: GDPRUtils.maskSensitiveData(principalId),
				pseudonymId: result.pseudonymId,
				recordsAffected: result.recordsAffected,
				strategy,
			})

			return {
				success: true,
				pseudonymId: result.pseudonymId,
				recordsAffected: result.recordsAffected,
			}
		} catch (error) {
			console.error('Pseudonymization failed:', error)
			return {
				success: false,
			}
		}
	}

	/**
	 * Apply data retention policies automatically
	 * Archive or delete data based on configured retention policies
	 */
	async applyDataRetentionPolicies(): Promise<ArchivalResult[]> {
		console.log('Applying data retention policies...')

		try {
			const results = await this.gdprService.applyRetentionPolicies()

			console.log(`Data retention policies applied:`, {
				policiesProcessed: results.length,
				totalRecordsArchived: results.reduce((sum, r) => sum + r.recordsArchived, 0),
				totalRecordsDeleted: results.reduce((sum, r) => sum + r.recordsDeleted, 0),
			})

			return results
		} catch (error) {
			console.error('Failed to apply retention policies:', error)
			throw error
		}
	}

	/**
	 * Create a new retention policy
	 */
	async createRetentionPolicy(policy: Omit<RetentionPolicy, 'isActive'>): Promise<void> {
		const db = this.auditDb.getDrizzleInstance()

		// Validate data classification
		if (!GDPRUtils.validateDataClassification(policy.dataClassification)) {
			throw new Error(`Invalid data classification: ${policy.dataClassification}`)
		}

		// Get recommended policy if not fully specified
		const recommended = GDPRUtils.getRecommendedRetentionPolicy(policy.dataClassification)

		const finalPolicy = {
			...recommended,
			...policy,
			isActive: true,
		}

		await db.insert(auditRetentionPolicy).values({
			policyName: finalPolicy.policyName,
			retentionDays: finalPolicy.retentionDays,
			archiveAfterDays: finalPolicy.archiveAfterDays,
			deleteAfterDays: finalPolicy.deleteAfterDays,
			dataClassification: finalPolicy.dataClassification as any,
			description: `Auto-generated retention policy for ${finalPolicy.dataClassification} data`,
			isActive: 'true',
			createdBy: 'system',
		})

		console.log(`Created retention policy: ${finalPolicy.policyName}`)
	}

	/**
	 * Get GDPR compliance status for a user
	 */
	async getComplianceStatus(principalId: string): Promise<{
		hasData: boolean
		recordCount: number
		dataClassifications: string[]
		retentionPolicies: string[]
		oldestRecord?: string
		newestRecord?: string
		complianceCriticalRecords: number
	}> {
		const db = this.auditDb.getDrizzleInstance()

		// Get all records for the user
		const records = await db.select().from(auditLog).where(eq(auditLog.principalId, principalId))

		if (records.length === 0) {
			return {
				hasData: false,
				recordCount: 0,
				dataClassifications: [],
				retentionPolicies: [],
				complianceCriticalRecords: 0,
			}
		}

		// Analyze the records
		const dataClassifications = new Set<string>()
		const retentionPolicies = new Set<string>()
		let oldestRecord = records[0].timestamp
		let newestRecord = records[0].timestamp
		let complianceCriticalRecords = 0

		for (const record of records) {
			if (record.dataClassification) dataClassifications.add(record.dataClassification)
			if (record.retentionPolicy) retentionPolicies.add(record.retentionPolicy)

			if (record.timestamp < oldestRecord) oldestRecord = record.timestamp
			if (record.timestamp > newestRecord) newestRecord = record.timestamp

			if (GDPRUtils.isComplianceCriticalAction(record.action)) {
				complianceCriticalRecords++
			}
		}

		return {
			hasData: true,
			recordCount: records.length,
			dataClassifications: Array.from(dataClassifications),
			retentionPolicies: Array.from(retentionPolicies),
			oldestRecord,
			newestRecord,
			complianceCriticalRecords,
		}
	}

	/**
	 * Check if user has compliance-critical audit records
	 */
	private async hasComplianceCriticalRecords(principalId: string): Promise<boolean> {
		const db = this.auditDb.getDrizzleInstance()

		const complianceActions = [
			'auth.login.success',
			'auth.login.failure',
			'data.access.unauthorized',
			'gdpr.data.export',
			'gdpr.data.pseudonymize',
			'gdpr.data.delete',
		]

		const records = await db
			.select({ id: auditLog.id })
			.from(auditLog)
			.where(
				and(
					eq(auditLog.principalId, principalId),
					sql`${auditLog.action} = ANY(${complianceActions})`
				)
			)
			.limit(1)

		return records.length > 0
	}

	/**
	 * Generate GDPR compliance report
	 */
	async generateComplianceReport(dateRange?: { start: string; end: string }): Promise<{
		reportId: string
		generatedAt: string
		dateRange: { start: string; end: string }
		summary: {
			totalRecords: number
			dataClassifications: Record<string, number>
			retentionPolicies: Record<string, number>
			gdprOperations: Record<string, number>
		}
		recommendations: string[]
	}> {
		const db = this.auditDb.getDrizzleInstance()
		const reportId = GDPRUtils.generateTrackingId('compliance-report')

		// Build query conditions
		const conditions = []
		if (dateRange) {
			conditions.push(
				and(gte(auditLog.timestamp, dateRange.start), lte(auditLog.timestamp, dateRange.end))
			)
		}

		// Get all records in range
		const records =
			conditions.length > 0
				? await db
						.select()
						.from(auditLog)
						.where(and(...conditions))
				: await db.select().from(auditLog)

		// Analyze records
		const dataClassifications: Record<string, number> = {}
		const retentionPolicies: Record<string, number> = {}
		const gdprOperations: Record<string, number> = {}

		for (const record of records) {
			// Count by data classification
			if (record.dataClassification) {
				dataClassifications[record.dataClassification] =
					(dataClassifications[record.dataClassification] || 0) + 1
			}

			// Count by retention policy
			if (record.retentionPolicy) {
				retentionPolicies[record.retentionPolicy] =
					(retentionPolicies[record.retentionPolicy] || 0) + 1
			}

			// Count GDPR operations
			if (record.action.startsWith('gdpr.')) {
				gdprOperations[record.action] = (gdprOperations[record.action] || 0) + 1
			}
		}

		// Generate recommendations
		const recommendations: string[] = []

		if (dataClassifications.PHI && !retentionPolicies.healthcare_phi) {
			recommendations.push(
				'Consider implementing healthcare-specific retention policy for PHI data'
			)
		}

		if (Object.keys(gdprOperations).length === 0) {
			recommendations.push(
				'No GDPR operations detected - ensure compliance processes are being used'
			)
		}

		const totalRecords = records.length
		if (totalRecords > 100000) {
			recommendations.push(
				'Large audit dataset detected - consider implementing data archival policies'
			)
		}

		return {
			reportId,
			generatedAt: new Date().toISOString(),
			dateRange: dateRange || {
				start:
					records.length > 0
						? Math.min(...records.map((r) => new Date(r.timestamp).getTime())).toString()
						: '',
				end:
					records.length > 0
						? Math.max(...records.map((r) => new Date(r.timestamp).getTime())).toString()
						: '',
			},
			summary: {
				totalRecords,
				dataClassifications,
				retentionPolicies,
				gdprOperations,
			},
			recommendations,
		}
	}
}

// Helper function to create AuditGDPRIntegration instance
export function createAuditGDPRIntegration(postgresUrl?: string): AuditGDPRIntegration {
	const auditDb = new AuditDb(postgresUrl)
	return new AuditGDPRIntegration(auditDb)
}
