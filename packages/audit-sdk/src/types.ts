import type { RedisOptions } from 'ioredis'
import type { ValidationConfig } from '@repo/audit'

/**
 * Configuration for the Audit SDK
 */
export interface AuditSDKConfig {
	/** Queue name for audit events */
	queueName: string

	/** Redis connection configuration */
	redis?: {
		url?: string
		options?: RedisOptions
	}

	/** Database connection URL */
	databaseUrl?: string

	/** Cryptographic configuration */
	crypto?: {
		secretKey?: string
		algorithm?: 'SHA-256'
		enableSignatures?: boolean
	}

	/** Default validation configuration */
	validation?: ValidationConfig

	/** Compliance settings */
	compliance?: ComplianceConfig

	/** Default event options */
	defaults?: {
		dataClassification?: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'
		retentionPolicy?: string
		generateHash?: boolean
		generateSignature?: boolean
	}
}

/**
 * Compliance configuration for regulatory requirements
 */
export interface ComplianceConfig {
	/** Enable HIPAA compliance features */
	hipaa?: {
		enabled: boolean
		requiredFields?: string[]
		retentionYears?: number
	}

	/** Enable GDPR compliance features */
	gdpr?: {
		enabled: boolean
		defaultLegalBasis?: string
		retentionDays?: number
	}

	/** Custom compliance rules */
	custom?: Array<{
		name: string
		rules: ComplianceRule[]
	}>
}

/**
 * Custom compliance rule definition
 */
export interface ComplianceRule {
	field: string
	required?: boolean
	validator?: (value: any) => boolean
	message?: string
}

/**
 * Comprehensive compliance configuration
 */
//export interface ComplianceConfig {
/** HIPAA compliance configuration */
//hipaa: HIPAAComplianceConfig

/** GDPR compliance configuration */
//gdpr: GDPRComplianceConfig

/** Default data retention period in days */
//defaultRetentionDays: number

/** Enable automatic data archival */
//enableAutoArchival: boolean

/** Enable data pseudonymization */
//enablePseudonymization: boolean

/** Compliance reporting schedule */
//reportingSchedule: {
//enabled: boolean
//frequency: 'daily' | 'weekly' | 'monthly'
//recipients: string[]
//includeHIPAA: boolean
//includeGDPR: boolean
//}

/** Custom compliance rules */
//customRules: ComplianceRule[]
//}
/**
 * Custom compliance rule definition
 */
//export interface ComplianceRule {
/** Rule identifier */
//id: string
/** Rule name */
//name: string
/** Rule description */
//description: string
/** Field path to validate */
//field: string
/** Whether field is required */
//required: boolean
/** Validation function */
//validator?: (value: any) => boolean
/** Error message when validation fails */
//message: string
/** Applicable compliance frameworks */
//frameworks: Array<'HIPAA' | 'GDPR' | 'CUSTOM'>
//}

/**
 * Predefined audit event configurations
 */
export interface AuditPreset {
	name: string
	action: string
	dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'
	requiredFields: string[]
	defaultValues?: Record<string, any>
	validation?: Partial<ValidationConfig>
}

/**
 * Middleware configuration options
 */
export interface MiddlewareOptions {
	/** Skip certain routes or patterns */
	skip?: (req: any) => boolean

	/** Custom event enrichment */
	enrich?: (req: any, res: any, event: any) => any

	/** Error handling */
	onError?: (error: Error, req: any, res: any) => void

	/** Performance settings */
	performance?: {
		sampleRate?: number
		maxLatency?: number
	}
}
