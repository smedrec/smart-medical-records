import { Audit } from '@repo/audit'
import { AuditDb } from '@repo/audit-db'

import { validateCompliance } from './compliance.js'
import { AUDIT_PRESETS } from './presets.js'

import type { AuditLogEvent } from '@repo/audit'
import type { AuditSDKConfig } from './types.js'

/**
 * Main SDK class that provides a high-level interface for audit logging
 * with built-in compliance, security, and healthcare-specific features.
 */
export class AuditSDK {
	private audit: Audit
	private auditDb?: AuditDb
	private config: AuditSDKConfig

	constructor(config: AuditSDKConfig) {
		this.config = config

		// Initialize core audit service
		this.audit = new Audit(
			config.queueName,
			config.redis?.url || config.redis,
			config.redis?.options,
			config.crypto
		)

		// Initialize database if URL provided
		if (config.databaseUrl) {
			this.auditDb = new AuditDb(config.databaseUrl)
		}
	}

	/**
	 * Log an audit event with SDK enhancements
	 */
	async log(
		eventDetails: Omit<AuditLogEvent, 'timestamp'>,
		options: {
			preset?: string
			compliance?: string[]
			skipValidation?: boolean
		} = {}
	): Promise<void> {
		let enrichedEvent = { ...eventDetails }

		// Apply preset if specified
		if (options.preset) {
			const preset = AUDIT_PRESETS[options.preset]
			if (preset) {
				enrichedEvent = {
					...preset.defaultValues,
					...enrichedEvent,
					action: preset.action,
					dataClassification: enrichedEvent.dataClassification || preset.dataClassification,
				}
			}
		}

		// Apply default values from config
		if (this.config.defaults) {
			enrichedEvent = {
				dataClassification: this.config.defaults.dataClassification,
				retentionPolicy: this.config.defaults.retentionPolicy,
				...enrichedEvent,
			}
		}

		// Add timestamp before compliance validation
		const timestamp = new Date().toISOString()
		enrichedEvent = {
			timestamp,
			...enrichedEvent,
		}

		// Validate compliance if specified
		if (options.compliance && this.config.compliance) {
			for (const complianceType of options.compliance) {
				validateCompliance(enrichedEvent, complianceType, this.config.compliance)
			}
		}

		// Log the event
		await this.audit.log(enrichedEvent, {
			generateHash: this.config.defaults?.generateHash ?? true,
			generateSignature: this.config.defaults?.generateSignature ?? false,
			skipValidation: options.skipValidation,
			validationConfig: this.config.validation,
		})
	}

	/**
	 * Log a healthcare-specific FHIR event
	 */
	async logFHIR(details: {
		principalId: string
		action: string
		resourceType: string
		resourceId: string
		status: 'attempt' | 'success' | 'failure'
		outcomeDescription?: string
		organizationId?: string
		sessionContext?: any
		fhirContext?: {
			version?: string
			interaction?: string
			compartment?: string
		}
	}): Promise<void> {
		await this.log(
			{
				principalId: details.principalId,
				organizationId: details.organizationId,
				action: `fhir.${details.resourceType.toLowerCase()}.${details.action}`,
				targetResourceType: details.resourceType,
				targetResourceId: details.resourceId,
				status: details.status,
				outcomeDescription: details.outcomeDescription,
				sessionContext: details.sessionContext,
				dataClassification: 'PHI',
				fhirContext: details.fhirContext,
			},
			{
				compliance: ['hipaa'],
			}
		)
	}

	/**
	 * Log an authentication event
	 */
	async logAuth(details: {
		principalId?: string
		action: 'login' | 'logout' | 'password_change' | 'mfa_enable' | 'mfa_disable'
		status: 'attempt' | 'success' | 'failure'
		sessionContext?: any
		reason?: string
	}): Promise<void> {
		await this.log(
			{
				principalId: details.principalId,
				action: `auth.${details.action}.${details.status}`,
				status: details.status,
				outcomeDescription: details.reason || `User ${details.action} ${details.status}`,
				sessionContext: details.sessionContext,
				dataClassification: 'INTERNAL',
			},
			{
				preset: 'authentication',
			}
		)
	}

	/**
	 * Log a system event
	 */
	async logSystem(details: {
		action: string
		status: 'attempt' | 'success' | 'failure'
		component?: string
		outcomeDescription?: string
		systemContext?: any
	}): Promise<void> {
		await this.log(
			{
				principalId: `system-${details.component || 'unknown'}`,
				action: `system.${details.action}`,
				status: details.status,
				outcomeDescription: details.outcomeDescription,
				dataClassification: 'INTERNAL',
				systemContext: details.systemContext,
			},
			{
				preset: 'system',
			}
		)
	}

	/**
	 * Log a data operation event
	 */
	async logData(details: {
		principalId: string
		action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import'
		resourceType: string
		resourceId: string
		status: 'attempt' | 'success' | 'failure'
		dataClassification?: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'
		changes?: any
		outcomeDescription?: string
	}): Promise<void> {
		await this.log({
			principalId: details.principalId,
			action: `data.${details.action}`,
			targetResourceType: details.resourceType,
			targetResourceId: details.resourceId,
			status: details.status,
			outcomeDescription: details.outcomeDescription,
			dataClassification: details.dataClassification || 'INTERNAL',
			changes: details.changes,
		})
	}

	/**
	 * Log with guaranteed delivery for critical events
	 */
	async logCritical(
		eventDetails: Omit<AuditLogEvent, 'timestamp'>,
		options: {
			priority?: number
			preset?: string
			compliance?: string[]
		} = {}
	): Promise<void> {
		let enrichedEvent = { ...eventDetails }

		// Apply preset if specified
		if (options.preset) {
			const preset = AUDIT_PRESETS[options.preset]
			if (preset) {
				enrichedEvent = {
					...preset.defaultValues,
					...enrichedEvent,
					action: preset.action,
					dataClassification: enrichedEvent.dataClassification || preset.dataClassification,
				}
			}
		}

		// Add timestamp before compliance validation
		const timestamp = new Date().toISOString()
		enrichedEvent = {
			timestamp,
			...enrichedEvent,
		}

		// Validate compliance if specified
		if (options.compliance && this.config.compliance) {
			for (const complianceType of options.compliance) {
				validateCompliance(enrichedEvent, complianceType, this.config.compliance)
			}
		}

		await this.audit.logWithGuaranteedDelivery(enrichedEvent, {
			priority: options.priority || 1,
			durabilityGuarantees: true,
			generateHash: true,
			generateSignature: true,
		})
	}

	/**
	 * Query audit logs from the database
	 */
	async query(
		filters: {
			principalId?: string
			action?: string
			resourceType?: string
			resourceId?: string
			status?: string
			startDate?: Date
			endDate?: Date
			limit?: number
		} = {}
	) {
		if (!this.auditDb) {
			throw new Error('Database not configured. Provide databaseUrl in config.')
		}

		const db = this.auditDb.getDrizzleInstance()
		// Implementation would use Drizzle ORM to query with filters
		// This is a placeholder for the actual query implementation
		throw new Error('Query implementation pending')
	}

	/**
	 * Generate compliance report
	 */
	async generateComplianceReport(
		type: 'hipaa' | 'gdpr' | 'custom',
		options: {
			startDate: Date
			endDate: Date
			format?: 'json' | 'csv' | 'pdf'
		}
	) {
		if (!this.auditDb) {
			throw new Error('Database not configured for reporting')
		}

		// Implementation would generate compliance-specific reports
		throw new Error('Compliance reporting implementation pending')
	}

	/**
	 * Verify audit log integrity
	 */
	async verifyIntegrity(
		options: {
			startDate?: Date
			endDate?: Date
			limit?: number
		} = {}
	) {
		if (!this.auditDb) {
			throw new Error('Database not configured for integrity verification')
		}

		// Implementation would verify hashes and signatures
		throw new Error('Integrity verification implementation pending')
	}

	/**
	 * Get audit service health status
	 */
	async getHealth() {
		const redisStatus = this.audit ? 'connected' : 'disconnected'
		let dbStatus = 'not_configured'

		if (this.auditDb) {
			try {
				const isConnected = await this.auditDb.checkAuditDbConnection()
				dbStatus = isConnected ? 'connected' : 'disconnected'
			} catch (error) {
				dbStatus = 'error'
			}
		}

		return {
			redis: redisStatus,
			database: dbStatus,
			timestamp: new Date().toISOString(),
		}
	}

	/**
	 * Close all connections
	 */
	async close(): Promise<void> {
		if (this.audit) {
			await this.audit.closeConnection()
		}
	}
}
