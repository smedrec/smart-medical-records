import type { AuditLogEvent } from '@repo/audit'

/**
 * Utility functions for the Audit SDK
 */

/**
 * Create a correlation ID for tracking related events
 */
export function createCorrelationId(prefix?: string): string {
	const timestamp = Date.now().toString(36)
	const random = Math.random().toString(36).substring(2, 8)
	return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}

/**
 * Mask sensitive data in audit events
 */
export function maskSensitiveData(
	event: AuditLogEvent,
	sensitiveFields: string[] = ['password', 'token', 'secret', 'key']
): AuditLogEvent {
	const maskedEvent = { ...event }

	function maskObject(obj: any, path: string = ''): any {
		if (typeof obj !== 'object' || obj === null) {
			return obj
		}

		if (Array.isArray(obj)) {
			return obj.map((item, index) => maskObject(item, `${path}[${index}]`))
		}

		const masked: any = {}
		for (const [key, value] of Object.entries(obj)) {
			const fieldPath = path ? `${path}.${key}` : key

			if (
				sensitiveFields.some(
					(field) =>
						key.toLowerCase().includes(field.toLowerCase()) ||
						fieldPath.toLowerCase().includes(field.toLowerCase())
				)
			) {
				masked[key] = '***MASKED***'
			} else {
				masked[key] = maskObject(value, fieldPath)
			}
		}

		return masked
	}

	// Mask the entire event object
	return maskObject(maskedEvent)
}

/**
 * Extract user context from various authentication schemes
 */
export function extractUserContext(req: any): {
	principalId?: string
	organizationId?: string
	roles?: string[]
	permissions?: string[]
} {
	// JWT token
	if (req.user) {
		return {
			principalId: req.user.id || req.user.sub || req.user.userId,
			organizationId: req.user.organizationId || req.user.org,
			roles: req.user.roles || [],
			permissions: req.user.permissions || [],
		}
	}

	// API Key
	if (req.apiKey) {
		return {
			principalId: req.apiKey.id || req.apiKey.name,
			organizationId: req.apiKey.organizationId,
		}
	}

	// Session
	if (req.session?.user) {
		return {
			principalId: req.session.user.id,
			organizationId: req.session.user.organizationId,
			roles: req.session.user.roles || [],
		}
	}

	return {}
}

/**
 * Generate a hash for event deduplication
 */
export function generateEventHash(event: Partial<AuditLogEvent>): string {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const crypto = require('crypto')

	// Create a normalized version for hashing
	const normalized = {
		principalId: event.principalId,
		action: event.action,
		targetResourceType: event.targetResourceType,
		targetResourceId: event.targetResourceId,
		status: event.status,
		// Round timestamp to nearest second to handle minor timing differences
		timestamp: event.timestamp
			? new Date(event.timestamp).toISOString().substring(0, 19) + 'Z'
			: undefined,
	}

	const hashString = JSON.stringify(normalized, Object.keys(normalized).sort())
	return crypto.createHash('sha256').update(hashString).digest('hex')
}

/**
 * Batch audit events for efficient processing
 */
export class AuditEventBatcher {
	private events: AuditLogEvent[] = []
	private batchSize: number
	private flushInterval: number
	private onFlush: (events: AuditLogEvent[]) => Promise<void>
	private timer?: ReturnType<typeof setInterval>

	constructor(
		batchSize: number = 100,
		flushInterval: number = 5000,
		onFlush: (events: AuditLogEvent[]) => Promise<void>
	) {
		this.batchSize = batchSize
		this.flushInterval = flushInterval
		this.onFlush = onFlush
		this.startTimer()
	}

	add(event: AuditLogEvent): void {
		this.events.push(event)

		if (this.events.length >= this.batchSize) {
			this.flush()
		}
	}

	async flush(): Promise<void> {
		if (this.events.length === 0) return

		const eventsToFlush = [...this.events]
		this.events = []

		try {
			await this.onFlush(eventsToFlush)
		} catch (error) {
			console.error('Failed to flush audit events:', error)
			// Re-add events to the beginning of the queue for retry
			this.events.unshift(...eventsToFlush)
		}
	}

	private startTimer(): void {
		this.timer = setInterval(() => {
			this.flush()
		}, this.flushInterval)
	}

	stop(): void {
		if (this.timer) {
			clearInterval(this.timer)
		}
		this.flush() // Flush remaining events
	}
}

/**
 * Rate limiter for audit events to prevent spam
 */
export class AuditRateLimiter {
	private eventCounts: Map<string, { count: number; resetTime: number }> = new Map()
	private maxEvents: number
	private windowMs: number

	constructor(maxEvents: number = 100, windowMs: number = 60000) {
		this.maxEvents = maxEvents
		this.windowMs = windowMs
	}

	isAllowed(key: string): boolean {
		const now = Date.now()
		const record = this.eventCounts.get(key)

		if (!record || now > record.resetTime) {
			this.eventCounts.set(key, { count: 1, resetTime: now + this.windowMs })
			return true
		}

		if (record.count >= this.maxEvents) {
			return false
		}

		record.count++
		return true
	}

	cleanup(): void {
		const now = Date.now()
		const keysToDelete: string[] = []

		this.eventCounts.forEach((record, key) => {
			if (now > record.resetTime) {
				keysToDelete.push(key)
			}
		})

		keysToDelete.forEach((key) => {
			this.eventCounts.delete(key)
		})
	}
}

/**
 * Event enricher for adding contextual information
 */
export class AuditEventEnricher {
	private enrichers: Array<(event: AuditLogEvent) => AuditLogEvent | Promise<AuditLogEvent>> = []

	addEnricher(enricher: (event: AuditLogEvent) => AuditLogEvent | Promise<AuditLogEvent>): void {
		this.enrichers.push(enricher)
	}

	async enrich(event: AuditLogEvent): Promise<AuditLogEvent> {
		let enrichedEvent = { ...event }

		for (const enricher of this.enrichers) {
			enrichedEvent = await enricher(enrichedEvent)
		}

		return enrichedEvent
	}
}

/**
 * Common enrichers
 */
export const commonEnrichers = {
	/**
	 * Add geolocation based on IP address
	 */
	geolocation: (geoService: (ip: string) => Promise<string>) => {
		return async (event: AuditLogEvent): Promise<AuditLogEvent> => {
			if (event.sessionContext?.ipAddress && !event.sessionContext.geolocation) {
				try {
					const location = await geoService(event.sessionContext.ipAddress)
					event.sessionContext.geolocation = location
				} catch (error) {
					// Ignore geolocation errors
				}
			}
			return event
		}
	},

	/**
	 * Add organization context
	 */
	organizationContext: (orgService: (userId: string) => Promise<{ id: string; name: string }>) => {
		return async (event: AuditLogEvent): Promise<AuditLogEvent> => {
			if (event.principalId && !event.organizationId) {
				try {
					const org = await orgService(event.principalId)
					event.organizationId = org.id
					event.organizationName = org.name
				} catch (error) {
					// Ignore organization lookup errors
				}
			}
			return event
		}
	},

	/**
	 * Add performance metrics
	 */
	performanceMetrics: () => {
		return (event: AuditLogEvent): AuditLogEvent => {
			if (!event.performanceMetrics) {
				event.performanceMetrics = {
					memoryUsage: process.memoryUsage(),
					cpuUsage: process.cpuUsage(),
					timestamp: Date.now(),
				}
			}
			return event
		}
	},
}

/**
 * Validate event structure
 */
export function validateEventStructure(event: Partial<AuditLogEvent>): string[] {
	const errors: string[] = []

	if (!event.action) {
		errors.push('Action is required')
	}

	if (!event.status) {
		errors.push('Status is required')
	}

	if (event.status && !['attempt', 'success', 'failure'].includes(event.status)) {
		errors.push('Status must be one of: attempt, success, failure')
	}

	if (
		event.dataClassification &&
		!['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'PHI'].includes(event.dataClassification)
	) {
		errors.push('Data classification must be one of: PUBLIC, INTERNAL, CONFIDENTIAL, PHI')
	}

	return errors
}

/**
 * Format event for display
 */
export function formatEventForDisplay(event: AuditLogEvent): string {
	const timestamp = new Date(event.timestamp).toLocaleString()
	const user = event.principalId || 'Unknown'
	const action = event.action
	const resource =
		event.targetResourceType && event.targetResourceId
			? `${event.targetResourceType}/${event.targetResourceId}`
			: 'N/A'
	const status = event.status.toUpperCase()

	return `[${timestamp}] ${user} ${action} on ${resource} - ${status}`
}

/**
 * Convert event to CSV row
 */
export function eventToCSV(event: AuditLogEvent): string {
	const fields = [
		event.timestamp,
		event.principalId || '',
		event.organizationId || '',
		event.action,
		event.targetResourceType || '',
		event.targetResourceId || '',
		event.status,
		event.outcomeDescription || '',
		event.dataClassification || '',
		event.sessionContext?.ipAddress || '',
		event.hash || '',
		event.signature || '',
	]

	return fields.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',')
}

/**
 * Get CSV header
 */
export function getCSVHeader(): string {
	return [
		'Timestamp',
		'Principal ID',
		'Organization ID',
		'Action',
		'Resource Type',
		'Resource ID',
		'Status',
		'Description',
		'Data Classification',
		'IP Address',
		'Hash',
		'Signature',
	]
		.map((header) => `"${header}"`)
		.join(',')
}
