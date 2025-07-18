import type {
	AuditEventStatus,
	AuditLogEvent,
	DataClassification,
	SessionContext,
} from './types.js'

/**
 * Validation error class for audit event schema violations
 */
export class AuditValidationError extends Error {
	public readonly field: string
	public readonly value: any
	public readonly code: string

	constructor(message: string, field: string, value: any, code: string) {
		super(message)
		this.name = 'AuditValidationError'
		this.field = field
		this.value = value
		this.code = code
	}
}

/**
 * Sanitization error class for security violations
 */
export class AuditSanitizationError extends Error {
	public readonly field: string
	public readonly originalValue: any
	public readonly sanitizedValue: any

	constructor(message: string, field: string, originalValue: any, sanitizedValue: any) {
		super(message)
		this.name = 'AuditSanitizationError'
		this.field = field
		this.originalValue = originalValue
		this.sanitizedValue = sanitizedValue
	}
}

/**
 * Validation result interface
 */
export interface ValidationResult {
	isValid: boolean
	errors: AuditValidationError[]
	warnings: string[]
}

/**
 * Sanitization result interface
 */
export interface SanitizationResult {
	sanitizedEvent: AuditLogEvent
	warnings: AuditSanitizationError[]
	modified: boolean
}

/**
 * Configuration for validation rules
 */
export interface ValidationConfig {
	maxStringLength: number
	allowedDataClassifications: DataClassification[]
	requiredFields: Array<keyof AuditLogEvent>
	maxCustomFieldDepth: number
	allowedEventVersions: string[]
}

/**
 * Default validation configuration
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
	maxStringLength: 10000,
	allowedDataClassifications: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI'],
	requiredFields: ['timestamp', 'action', 'status'],
	maxCustomFieldDepth: 3,
	allowedEventVersions: ['1.0', '1.1', '2.0'],
}

/**
 * Validates an audit log event against the schema
 */
export function validateAuditEvent(
	event: Partial<AuditLogEvent>,
	config: ValidationConfig = DEFAULT_VALIDATION_CONFIG
): ValidationResult {
	const errors: AuditValidationError[] = []
	const warnings: string[] = []

	// Check required fields
	for (const field of config.requiredFields) {
		if (event[field] === undefined || event[field] === null) {
			errors.push(
				new AuditValidationError(
					`Required field '${String(field)}' is missing`,
					String(field),
					event[field],
					'REQUIRED_FIELD_MISSING'
				)
			)
		}
	}

	// Validate timestamp format
	if (event.timestamp) {
		if (typeof event.timestamp !== 'string') {
			errors.push(
				new AuditValidationError(
					'Timestamp must be a string',
					'timestamp',
					event.timestamp,
					'INVALID_TYPE'
				)
			)
		} else if (!isValidISO8601(event.timestamp)) {
			errors.push(
				new AuditValidationError(
					'Timestamp must be a valid ISO 8601 string',
					'timestamp',
					event.timestamp,
					'INVALID_FORMAT'
				)
			)
		}
	}

	// Validate action
	if (event.action !== undefined && event.action !== null) {
		if (typeof event.action !== 'string') {
			errors.push(
				new AuditValidationError('Action must be a string', 'action', event.action, 'INVALID_TYPE')
			)
		} else if (event.action.length === 0) {
			errors.push(
				new AuditValidationError('Action cannot be empty', 'action', event.action, 'EMPTY_VALUE')
			)
		} else if (event.action.length > config.maxStringLength) {
			errors.push(
				new AuditValidationError(
					`Action exceeds maximum length of ${config.maxStringLength}`,
					'action',
					event.action,
					'EXCEEDS_MAX_LENGTH'
				)
			)
		}
	}

	// Validate status
	if (event.status) {
		const validStatuses: AuditEventStatus[] = ['attempt', 'success', 'failure']
		if (!validStatuses.includes(event.status as AuditEventStatus)) {
			errors.push(
				new AuditValidationError(
					`Status must be one of: ${validStatuses.join(', ')}`,
					'status',
					event.status,
					'INVALID_VALUE'
				)
			)
		}
	}

	// Validate data classification
	if (event.dataClassification) {
		if (!config.allowedDataClassifications.includes(event.dataClassification)) {
			errors.push(
				new AuditValidationError(
					`Data classification must be one of: ${config.allowedDataClassifications.join(', ')}`,
					'dataClassification',
					event.dataClassification,
					'INVALID_VALUE'
				)
			)
		}
	}

	// Validate event version
	if (event.eventVersion) {
		if (!config.allowedEventVersions.includes(event.eventVersion)) {
			warnings.push(
				`Event version '${event.eventVersion}' is not in the list of known versions: ${config.allowedEventVersions.join(', ')}`
			)
		}
	}

	// Validate hash algorithm
	if (event.hashAlgorithm && event.hashAlgorithm !== 'SHA-256') {
		errors.push(
			new AuditValidationError(
				'Hash algorithm must be SHA-256',
				'hashAlgorithm',
				event.hashAlgorithm,
				'INVALID_VALUE'
			)
		)
	}

	// Validate session context
	if (event.sessionContext) {
		const sessionErrors = validateSessionContext(event.sessionContext)
		errors.push(...sessionErrors)
	}

	// Validate string fields for length
	const stringFields = [
		'principalId',
		'organizationId',
		'targetResourceType',
		'targetResourceId',
		'outcomeDescription',
		'correlationId',
		'retentionPolicy',
	] as const

	for (const field of stringFields) {
		const value = event[field]
		if (value && typeof value === 'string' && value.length > config.maxStringLength) {
			errors.push(
				new AuditValidationError(
					`Field '${field}' exceeds maximum length of ${config.maxStringLength}`,
					field,
					value,
					'EXCEEDS_MAX_LENGTH'
				)
			)
		}
	}

	// Validate numeric fields
	if (event.processingLatency !== undefined) {
		if (typeof event.processingLatency !== 'number' || event.processingLatency < 0) {
			errors.push(
				new AuditValidationError(
					'Processing latency must be a non-negative number',
					'processingLatency',
					event.processingLatency,
					'INVALID_VALUE'
				)
			)
		}
	}

	if (event.queueDepth !== undefined) {
		if (typeof event.queueDepth !== 'number' || event.queueDepth < 0) {
			errors.push(
				new AuditValidationError(
					'Queue depth must be a non-negative number',
					'queueDepth',
					event.queueDepth,
					'INVALID_VALUE'
				)
			)
		}
	}

	// Validate custom fields depth
	const customFieldErrors = validateCustomFieldsDepth(event, config.maxCustomFieldDepth)
	errors.push(...customFieldErrors)

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	}
}

/**
 * Validates session context structure
 */
function validateSessionContext(sessionContext: SessionContext): AuditValidationError[] {
	const errors: AuditValidationError[] = []

	if (!sessionContext.sessionId || typeof sessionContext.sessionId !== 'string') {
		errors.push(
			new AuditValidationError(
				'Session context sessionId must be a non-empty string',
				'sessionContext.sessionId',
				sessionContext.sessionId,
				'INVALID_VALUE'
			)
		)
	}

	if (!sessionContext.ipAddress || typeof sessionContext.ipAddress !== 'string') {
		errors.push(
			new AuditValidationError(
				'Session context ipAddress must be a non-empty string',
				'sessionContext.ipAddress',
				sessionContext.ipAddress,
				'INVALID_VALUE'
			)
		)
	} else if (!isValidIPAddress(sessionContext.ipAddress)) {
		errors.push(
			new AuditValidationError(
				'Session context ipAddress must be a valid IP address',
				'sessionContext.ipAddress',
				sessionContext.ipAddress,
				'INVALID_FORMAT'
			)
		)
	}

	if (!sessionContext.userAgent || typeof sessionContext.userAgent !== 'string') {
		errors.push(
			new AuditValidationError(
				'Session context userAgent must be a non-empty string',
				'sessionContext.userAgent',
				sessionContext.userAgent,
				'INVALID_VALUE'
			)
		)
	}

	return errors
}

/**
 * Validates custom fields depth to prevent deeply nested objects
 */
function validateCustomFieldsDepth(
	obj: any,
	maxDepth: number,
	currentDepth: number = 0,
	path: string = ''
): AuditValidationError[] {
	const errors: AuditValidationError[] = []

	if (currentDepth > maxDepth) {
		errors.push(
			new AuditValidationError(
				`Object depth exceeds maximum allowed depth of ${maxDepth}`,
				path,
				obj,
				'EXCEEDS_MAX_DEPTH'
			)
		)
		return errors
	}

	if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
		for (const [key, value] of Object.entries(obj)) {
			const newPath = path ? `${path}.${key}` : key
			if (typeof value === 'object' && value !== null) {
				errors.push(...validateCustomFieldsDepth(value, maxDepth, currentDepth + 1, newPath))
			}
		}
	}

	return errors
}

/**
 * Sanitizes an audit event to prevent injection attacks and normalize data
 */
export function sanitizeAuditEvent(event: AuditLogEvent): SanitizationResult {
	const warnings: AuditSanitizationError[] = []
	let modified = false
	const sanitizedEvent = { ...event }

	// Sanitize string fields
	const stringFields = [
		'action',
		'principalId',
		'organizationId',
		'targetResourceType',
		'targetResourceId',
		'outcomeDescription',
		'correlationId',
		'retentionPolicy',
	] as const

	for (const field of stringFields) {
		const value = sanitizedEvent[field]
		if (typeof value === 'string') {
			const sanitized = sanitizeString(value)
			if (sanitized !== value) {
				warnings.push(
					new AuditSanitizationError(
						`Field '${field}' was sanitized to prevent injection attacks`,
						field,
						value,
						sanitized
					)
				)
				sanitizedEvent[field] = sanitized
				modified = true
			}
		}
	}

	// Sanitize session context
	if (sanitizedEvent.sessionContext) {
		const sessionResult = sanitizeSessionContext(sanitizedEvent.sessionContext)
		if (sessionResult.modified) {
			sanitizedEvent.sessionContext = sessionResult.sanitizedContext
			warnings.push(...sessionResult.warnings)
			modified = true
		}
	}

	// Sanitize custom fields
	const customFieldResult = sanitizeCustomFields(sanitizedEvent)
	if (customFieldResult.modified) {
		Object.assign(sanitizedEvent, customFieldResult.sanitizedFields)
		warnings.push(...customFieldResult.warnings)
		modified = true
	}

	// Normalize data classification
	if (sanitizedEvent.dataClassification) {
		const normalized = sanitizedEvent.dataClassification.toUpperCase() as DataClassification
		if (normalized !== sanitizedEvent.dataClassification) {
			sanitizedEvent.dataClassification = normalized
			modified = true
		}
	}

	return {
		sanitizedEvent,
		warnings,
		modified,
	}
}

/**
 * Sanitizes session context
 */
function sanitizeSessionContext(sessionContext: SessionContext): {
	sanitizedContext: SessionContext
	warnings: AuditSanitizationError[]
	modified: boolean
} {
	const warnings: AuditSanitizationError[] = []
	let modified = false
	const sanitizedContext = { ...sessionContext }

	// Sanitize string fields
	const stringFields = ['sessionId', 'userAgent', 'geolocation'] as const
	for (const field of stringFields) {
		const value = sanitizedContext[field]
		if (typeof value === 'string') {
			const sanitized = sanitizeString(value)
			if (sanitized !== value) {
				warnings.push(
					new AuditSanitizationError(
						`Session context field '${field}' was sanitized`,
						`sessionContext.${field}`,
						value,
						sanitized
					)
				)
				sanitizedContext[field] = sanitized
				modified = true
			}
		}
	}

	// Validate and normalize IP address
	if (sanitizedContext.ipAddress) {
		const normalizedIP = normalizeIPAddress(sanitizedContext.ipAddress)
		if (normalizedIP !== sanitizedContext.ipAddress) {
			sanitizedContext.ipAddress = normalizedIP
			modified = true
		}
	}

	return {
		sanitizedContext,
		warnings,
		modified,
	}
}

/**
 * Sanitizes custom fields recursively
 */
function sanitizeCustomFields(obj: any): {
	sanitizedFields: any
	warnings: AuditSanitizationError[]
	modified: boolean
} {
	const warnings: AuditSanitizationError[] = []
	let modified = false
	const sanitizedFields = { ...obj }

	// Known audit event fields that should not be sanitized as custom fields
	const knownFields = new Set([
		'timestamp',
		'ttl',
		'principalId',
		'organizationId',
		'action',
		'targetResourceType',
		'targetResourceId',
		'status',
		'outcomeDescription',
		'hash',
		'hashAlgorithm',
		'signature',
		'eventVersion',
		'correlationId',
		'sessionContext',
		'dataClassification',
		'retentionPolicy',
		'processingLatency',
		'queueDepth',
	])

	for (const [key, value] of Object.entries(obj)) {
		if (!knownFields.has(key)) {
			const sanitized = sanitizeValue(value, key)
			if (sanitized !== value) {
				warnings.push(
					new AuditSanitizationError(`Custom field '${key}' was sanitized`, key, value, sanitized)
				)
				sanitizedFields[key] = sanitized
				modified = true
			}
		}
	}

	return {
		sanitizedFields,
		warnings,
		modified,
	}
}

/**
 * Sanitizes a value recursively with circular reference protection
 */
function sanitizeValue(value: any, path: string, visited: WeakSet<object> = new WeakSet()): any {
	if (typeof value === 'string') {
		return sanitizeString(value)
	}

	if (Array.isArray(value)) {
		// Check for circular reference
		if (visited.has(value)) {
			return '[Circular Reference]'
		}
		visited.add(value)

		const result = value.map((item, index) => sanitizeValue(item, `${path}[${index}]`, visited))
		visited.delete(value)
		return result
	}

	if (typeof value === 'object' && value !== null) {
		// Check for circular reference
		if (visited.has(value)) {
			return '[Circular Reference]'
		}
		visited.add(value)

		const sanitized: any = {}
		for (const [key, val] of Object.entries(value)) {
			sanitized[key] = sanitizeValue(val, `${path}.${key}`, visited)
		}
		visited.delete(value)
		return sanitized
	}

	return value
}

/**
 * Sanitizes a string to prevent injection attacks
 */
function sanitizeString(input: string): string {
	if (typeof input !== 'string') {
		return input
	}

	// Remove null bytes
	let sanitized = input.replace(/\0/g, '')

	// Remove or escape potentially dangerous characters
	sanitized = sanitized
		.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except \t, \n, \r
		.replace(/[<>]/g, '') // Remove angle brackets to prevent HTML/XML injection
		.replace(/['"]/g, (match) => (match === '"' ? '&quot;' : '&#x27;')) // Escape quotes
		.replace(/[\\]/g, '\\\\') // Escape backslashes
		.trim() // Remove leading/trailing whitespace

	// Limit length to prevent DoS
	if (sanitized.length > 10000) {
		sanitized = sanitized.substring(0, 10000) + '...[truncated]'
	}

	return sanitized
}

/**
 * Validates ISO 8601 timestamp format
 */
function isValidISO8601(timestamp: string): boolean {
	const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
	if (!iso8601Regex.test(timestamp)) {
		return false
	}

	const date = new Date(timestamp)
	return !isNaN(date.getTime()) && date.toISOString().startsWith(timestamp.substring(0, 19))
}

/**
 * Validates IP address format (IPv4 and IPv6)
 */
function isValidIPAddress(ip: string): boolean {
	// IPv4 regex
	const ipv4Regex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

	// IPv6 regex (simplified)
	const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/

	return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Normalizes IP address format
 */
function normalizeIPAddress(ip: string): string {
	// For IPv4, ensure no leading zeros
	if (ip.includes('.') && !ip.includes(':')) {
		return ip
			.split('.')
			.map((octet) => parseInt(octet, 10).toString())
			.join('.')
	}

	// For IPv6, convert to lowercase
	if (ip.includes(':')) {
		return ip.toLowerCase()
	}

	return ip
}

/**
 * Creates a comprehensive validation and sanitization pipeline
 */
export function validateAndSanitizeAuditEvent(
	event: Partial<AuditLogEvent>,
	config: ValidationConfig = DEFAULT_VALIDATION_CONFIG
): {
	isValid: boolean
	sanitizedEvent: AuditLogEvent | null
	validationErrors: AuditValidationError[]
	sanitizationWarnings: AuditSanitizationError[]
	validationWarnings: string[]
} {
	// First sanitize the event
	const sanitizationResult = sanitizeAuditEvent(event as AuditLogEvent)

	// Then validate the sanitized event
	const validationResult = validateAuditEvent(sanitizationResult.sanitizedEvent, config)

	return {
		isValid: validationResult.isValid,
		sanitizedEvent: validationResult.isValid ? sanitizationResult.sanitizedEvent : null,
		validationErrors: validationResult.errors,
		sanitizationWarnings: sanitizationResult.warnings,
		validationWarnings: validationResult.warnings,
	}
}
