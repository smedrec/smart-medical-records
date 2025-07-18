import { createHash, randomBytes } from 'crypto'

/**
 * GDPR utility functions for data processing and compliance
 */
export class GDPRUtils {
	/**
	 * Generate a deterministic pseudonym ID that can be consistently reproduced
	 */
	static generateDeterministicPseudonym(originalId: string, salt?: string): string {
		const effectiveSalt = salt || process.env.GDPR_PSEUDONYM_SALT || 'default-gdpr-salt'
		const hash = createHash('sha256')
			.update(originalId + effectiveSalt)
			.digest('hex')
		return `pseudo-${hash.substring(0, 16)}`
	}

	/**
	 * Generate a random pseudonym ID for non-deterministic pseudonymization
	 */
	static generateRandomPseudonym(): string {
		return `pseudo-${randomBytes(16).toString('hex')}`
	}

	/**
	 * Validate GDPR export request parameters
	 */
	static validateExportRequest(request: any): { valid: boolean; errors: string[] } {
		const errors: string[] = []

		if (!request.principalId) {
			errors.push('Principal ID is required')
		}

		if (!request.requestType) {
			errors.push('Request type is required')
		} else if (
			!['access', 'rectification', 'erasure', 'portability', 'restriction'].includes(
				request.requestType
			)
		) {
			errors.push('Invalid request type')
		}

		if (!request.format) {
			errors.push('Export format is required')
		} else if (!['json', 'csv', 'xml'].includes(request.format)) {
			errors.push('Invalid export format')
		}

		if (!request.requestedBy) {
			errors.push('Requested by field is required')
		}

		if (request.dateRange) {
			if (!request.dateRange.start || !request.dateRange.end) {
				errors.push('Date range must include both start and end dates')
			} else {
				const start = new Date(request.dateRange.start)
				const end = new Date(request.dateRange.end)
				if (start >= end) {
					errors.push('Date range start must be before end')
				}
			}
		}

		return {
			valid: errors.length === 0,
			errors,
		}
	}

	/**
	 * Sanitize data for export by removing sensitive system fields
	 */
	static sanitizeForExport(data: any[]): any[] {
		return data.map((record) => {
			const sanitized = { ...record }

			// Remove internal system fields that shouldn't be exported
			delete sanitized.hash
			delete sanitized.hashAlgorithm
			delete sanitized.signature
			delete sanitized.processingLatency
			delete sanitized.queueDepth

			// Sanitize details object if present
			if (sanitized.details && typeof sanitized.details === 'object') {
				const sanitizedDetails = { ...sanitized.details }
				delete sanitizedDetails.internalSystemId
				delete sanitizedDetails.debugInfo
				delete sanitizedDetails.performanceMetrics
				sanitized.details = sanitizedDetails
			}

			return sanitized
		})
	}

	/**
	 * Check if an audit action is compliance-critical and should be preserved
	 */
	static isComplianceCriticalAction(action: string): boolean {
		const complianceCriticalActions = [
			'auth.login.success',
			'auth.login.failure',
			'auth.logout',
			'data.access.unauthorized',
			'data.breach.detected',
			'gdpr.data.export',
			'gdpr.data.pseudonymize',
			'gdpr.data.delete',
			'gdpr.retention.apply',
			'security.alert.generated',
			'compliance.audit.performed',
			'system.backup.created',
			'system.backup.restored',
		]

		return (
			complianceCriticalActions.includes(action) ||
			action.includes('security.') ||
			action.includes('compliance.') ||
			action.includes('gdpr.')
		)
	}

	/**
	 * Calculate data retention expiry date based on policy
	 */
	static calculateRetentionExpiry(createdDate: string, retentionDays: number): string {
		const created = new Date(createdDate)
		const expiry = new Date(created.getTime() + retentionDays * 24 * 60 * 60 * 1000)
		return expiry.toISOString()
	}

	/**
	 * Check if data is eligible for archival based on policy
	 */
	static isEligibleForArchival(
		createdDate: string,
		archiveAfterDays: number,
		currentDate?: string
	): boolean {
		const created = new Date(createdDate)
		const current = new Date(currentDate || new Date().toISOString())
		const archiveThreshold = new Date(created.getTime() + archiveAfterDays * 24 * 60 * 60 * 1000)

		return current >= archiveThreshold
	}

	/**
	 * Check if data is eligible for deletion based on policy
	 */
	static isEligibleForDeletion(
		createdDate: string,
		deleteAfterDays: number,
		currentDate?: string
	): boolean {
		const created = new Date(createdDate)
		const current = new Date(currentDate || new Date().toISOString())
		const deleteThreshold = new Date(created.getTime() + deleteAfterDays * 24 * 60 * 60 * 1000)

		return current >= deleteThreshold
	}

	/**
	 * Generate GDPR compliance report metadata
	 */
	static generateComplianceMetadata(
		operation: string,
		principalId: string,
		requestedBy: string,
		additionalData?: Record<string, any>
	): Record<string, any> {
		return {
			gdprOperation: operation,
			timestamp: new Date().toISOString(),
			principalId,
			requestedBy,
			complianceVersion: '1.0',
			regulatoryBasis: 'GDPR Article 17, 20',
			...additionalData,
		}
	}

	/**
	 * Validate data classification for GDPR processing
	 */
	static validateDataClassification(classification: string): boolean {
		const validClassifications = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI']
		return validClassifications.includes(classification)
	}

	/**
	 * Get recommended retention policy based on data classification
	 */
	static getRecommendedRetentionPolicy(dataClassification: string): {
		retentionDays: number
		archiveAfterDays: number
		deleteAfterDays: number
		policyName: string
	} {
		switch (dataClassification) {
			case 'PHI':
				return {
					retentionDays: 2555, // 7 years for healthcare data
					archiveAfterDays: 365, // 1 year
					deleteAfterDays: 2555,
					policyName: 'healthcare_phi',
				}
			case 'CONFIDENTIAL':
				return {
					retentionDays: 1095, // 3 years
					archiveAfterDays: 365, // 1 year
					deleteAfterDays: 1095,
					policyName: 'confidential_data',
				}
			case 'INTERNAL':
				return {
					retentionDays: 730, // 2 years
					archiveAfterDays: 180, // 6 months
					deleteAfterDays: 730,
					policyName: 'internal_data',
				}
			case 'PUBLIC':
				return {
					retentionDays: 365, // 1 year
					archiveAfterDays: 90, // 3 months
					deleteAfterDays: 365,
					policyName: 'public_data',
				}
			default:
				return {
					retentionDays: 365, // Default 1 year
					archiveAfterDays: 90, // 3 months
					deleteAfterDays: 365,
					policyName: 'default',
				}
		}
	}

	/**
	 * Create audit trail entry for GDPR operations
	 */
	static createGDPRAuditEntry(
		operation: string,
		principalId: string,
		targetId: string,
		requestedBy: string,
		outcome: 'success' | 'failure',
		details?: Record<string, any>
	): any {
		return {
			timestamp: new Date().toISOString(),
			principalId: requestedBy,
			action: `gdpr.${operation}`,
			status: outcome,
			targetResourceType: 'AuditLog',
			targetResourceId: targetId,
			outcomeDescription: `GDPR ${operation} ${outcome} for ${principalId}`,
			dataClassification: 'PHI',
			retentionPolicy: 'gdpr_compliance',
			eventVersion: '1.0',
			details: {
				gdprOperation: operation,
				targetPrincipalId: principalId,
				complianceTimestamp: new Date().toISOString(),
				...details,
			},
		}
	}

	/**
	 * Mask sensitive data for logging purposes
	 */
	static maskSensitiveData(data: string, visibleChars: number = 4): string {
		if (!data || data.length <= visibleChars) {
			return '*'.repeat(data?.length || 0)
		}

		const visible = data.substring(0, visibleChars)
		const masked = '*'.repeat(data.length - visibleChars)
		return visible + masked
	}

	/**
	 * Generate GDPR request tracking ID
	 */
	static generateTrackingId(operation: string): string {
		const timestamp = Date.now()
		const random = randomBytes(4).toString('hex')
		return `gdpr-${operation}-${timestamp}-${random}`
	}
}
