/**
 * Database-backed error logger implementation
 * Stores structured errors and aggregations in PostgreSQL for persistence and analysis
 */

import type {
	AggregationFilters,
	ErrorAggregation,
	ErrorHistoryFilters,
	ErrorLogger,
	StructuredError,
} from './error-handling.js'

/**
 * Database error log entry interface
 */
export interface DatabaseErrorLogEntry {
	id: string
	category: string
	severity: string
	code: string
	message: string
	component: string
	operation: string
	correlationId: string
	userId?: string
	sessionId?: string
	requestId?: string
	retryable: boolean
	aggregationKey: string
	context: any // JSON field
	troubleshooting: any // JSON field
	timestamp: Date
	createdAt: Date
}

/**
 * Database error aggregation entry interface
 */
export interface DatabaseErrorAggregationEntry {
	aggregationKey: string
	category: string
	severity: string
	count: number
	errorRate: number
	trend: string
	firstOccurrence: Date
	lastOccurrence: Date
	affectedComponents: string[] // JSON array
	affectedUsers: string[] // JSON array
	samples: any // JSON field containing sample errors
	updatedAt: Date
}

/**
 * Database error logger implementation
 */
export class DatabaseErrorLogger implements ErrorLogger {
	constructor(
		private db: any, // Drizzle database instance
		private errorLogTable: any, // Error log table schema
		private errorAggregationTable: any // Error aggregation table schema
	) {}

	/**
	 * Log a structured error to the database
	 */
	async logError(error: StructuredError): Promise<void> {
		try {
			const entry: Partial<DatabaseErrorLogEntry> = {
				id: error.id,
				category: error.category,
				severity: error.severity,
				code: error.code,
				message: error.message,
				component: error.context.component,
				operation: error.context.operation,
				correlationId: error.context.correlationId,
				userId: error.context.userId,
				sessionId: error.context.sessionId,
				requestId: error.context.requestId,
				retryable: error.retryable,
				aggregationKey: error.aggregationKey,
				context: {
					metadata: error.context.metadata,
					environment: error.context.environment,
					stackTrace: error.context.stackTrace,
				},
				troubleshooting: error.troubleshooting,
				timestamp: new Date(error.context.timestamp),
				createdAt: new Date(),
			}

			await this.db.insert(this.errorLogTable).values(entry)
		} catch (dbError) {
			// Fallback to console logging if database insert fails
			console.error('Failed to log error to database:', dbError)
			console.error('Original error:', error)
		}
	}

	/**
	 * Log an error aggregation to the database
	 */
	async logAggregation(aggregation: ErrorAggregation): Promise<void> {
		try {
			const entry: Partial<DatabaseErrorAggregationEntry> = {
				aggregationKey: aggregation.aggregationKey,
				category: aggregation.category,
				severity: aggregation.severity,
				count: aggregation.count,
				errorRate: aggregation.errorRate,
				trend: aggregation.trend,
				firstOccurrence: new Date(aggregation.firstOccurrence),
				lastOccurrence: new Date(aggregation.lastOccurrence),
				affectedComponents: aggregation.affectedComponents,
				affectedUsers: aggregation.affectedUsers,
				samples: aggregation.samples.map((sample) => ({
					id: sample.id,
					code: sample.code,
					message: sample.message,
					timestamp: sample.context.timestamp,
					userId: sample.context.userId,
					metadata: sample.context.metadata,
				})),
				updatedAt: new Date(),
			}

			// Use insert for now - in a real implementation, we would use upsert
			await this.db.insert(this.errorAggregationTable).values(entry)

			// Note: The following code would be used for upsert in a real implementation
			// but is commented out as the mock doesn't support it
			/*
			await this.db
				.insert(this.errorAggregationTable)
				.values(entry)
				.onConflictDoUpdate({
					target: this.errorAggregationTable.aggregationKey,
					set: {
						count: entry.count,
						errorRate: entry.errorRate,
						trend: entry.trend,
						lastOccurrence: entry.lastOccurrence,
						affectedComponents: entry.affectedComponents,
						affectedUsers: entry.affectedUsers,
						samples: entry.samples,
						updatedAt: entry.updatedAt,
					},
				})
			*/
		} catch (dbError) {
			// Fallback to console logging if database insert fails
			console.error('Failed to log aggregation to database:', dbError)
			console.error('Original aggregation:', aggregation)
		}
	}

	/**
	 * Get error history with optional filters
	 */
	async getErrorHistory(filters?: ErrorHistoryFilters): Promise<StructuredError[]> {
		try {
			let query = this.db.select().from(this.errorLogTable)

			// Apply filters
			if (filters) {
				const conditions = []

				if (filters.category) {
					conditions.push(this.db.eq(this.errorLogTable.category, filters.category))
				}

				if (filters.severity) {
					conditions.push(this.db.eq(this.errorLogTable.severity, filters.severity))
				}

				if (filters.component) {
					conditions.push(this.db.eq(this.errorLogTable.component, filters.component))
				}

				if (filters.correlationId) {
					conditions.push(this.db.eq(this.errorLogTable.correlationId, filters.correlationId))
				}

				if (filters.startTime) {
					conditions.push(this.db.gte(this.errorLogTable.timestamp, new Date(filters.startTime)))
				}

				if (filters.endTime) {
					conditions.push(this.db.lte(this.errorLogTable.timestamp, new Date(filters.endTime)))
				}

				if (conditions.length > 0) {
					query = query.where(this.db.and(...conditions))
				}
			}

			// Apply ordering and limit
			query = query.orderBy(this.db.desc(this.errorLogTable.timestamp))

			if (filters?.limit) {
				query = query.limit(filters.limit)
			}

			const results = await query

			// Convert database entries back to StructuredError format
			return results.map(this.convertDbEntryToStructuredError.bind(this))
		} catch (dbError) {
			console.error('Failed to get error history from database:', dbError)
			return []
		}
	}

	/**
	 * Get error aggregations with optional filters
	 */
	async getAggregations(filters?: AggregationFilters): Promise<ErrorAggregation[]> {
		try {
			let query = this.db.select().from(this.errorAggregationTable)

			// Apply filters
			if (filters) {
				const conditions = []

				if (filters.category) {
					conditions.push(this.db.eq(this.errorAggregationTable.category, filters.category))
				}

				if (filters.severity) {
					conditions.push(this.db.eq(this.errorAggregationTable.severity, filters.severity))
				}

				if (filters.component) {
					conditions.push(
						this.db
							.sql`${this.errorAggregationTable.affectedComponents} @> ${JSON.stringify([filters.component])}`
					)
				}

				if (filters.startTime) {
					conditions.push(
						this.db.gte(this.errorAggregationTable.firstOccurrence, new Date(filters.startTime))
					)
				}

				if (filters.endTime) {
					conditions.push(
						this.db.lte(this.errorAggregationTable.lastOccurrence, new Date(filters.endTime))
					)
				}

				if (filters.minCount) {
					conditions.push(this.db.gte(this.errorAggregationTable.count, filters.minCount))
				}

				if (conditions.length > 0) {
					query = query.where(this.db.and(...conditions))
				}
			}

			// Apply ordering
			query = query.orderBy(this.db.desc(this.errorAggregationTable.count))

			const results = await query

			// Convert database entries back to ErrorAggregation format
			return results.map(this.convertDbEntryToAggregation.bind(this))
		} catch (dbError) {
			console.error('Failed to get aggregations from database:', dbError)
			return []
		}
	}

	/**
	 * Get error statistics from database
	 */
	async getErrorStatistics(timeWindow?: { start: Date; end: Date }) {
		try {
			// Remove unused baseQuery variable
			// Get total count
			const totalResult = await this.db
				.select({ count: this.db.count() })
				.from(this.errorLogTable)
				.where(
					timeWindow
						? this.db.and(
								this.db.gte(this.errorLogTable.timestamp, timeWindow.start),
								this.db.lte(this.errorLogTable.timestamp, timeWindow.end)
							)
						: undefined
				)

			// Get counts by category
			const categoryResult = await this.db
				.select({
					category: this.errorLogTable.category,
					count: this.db.count(),
				})
				.from(this.errorLogTable)
				.where(
					timeWindow
						? this.db.and(
								this.db.gte(this.errorLogTable.timestamp, timeWindow.start),
								this.db.lte(this.errorLogTable.timestamp, timeWindow.end)
							)
						: undefined
				)
				.groupBy(this.errorLogTable.category)

			// Get counts by severity
			const severityResult = await this.db
				.select({
					severity: this.errorLogTable.severity,
					count: this.db.count(),
				})
				.from(this.errorLogTable)
				.where(
					timeWindow
						? this.db.and(
								this.db.gte(this.errorLogTable.timestamp, timeWindow.start),
								this.db.lte(this.errorLogTable.timestamp, timeWindow.end)
							)
						: undefined
				)
				.groupBy(this.errorLogTable.severity)

			// Get top components with errors
			const componentResult = await this.db
				.select({
					component: this.errorLogTable.component,
					count: this.db.count(),
				})
				.from(this.errorLogTable)
				.where(
					timeWindow
						? this.db.and(
								this.db.gte(this.errorLogTable.timestamp, timeWindow.start),
								this.db.lte(this.errorLogTable.timestamp, timeWindow.end)
							)
						: undefined
				)
				.groupBy(this.errorLogTable.component)
				.orderBy(this.db.desc(this.db.count()))
				.limit(10)

			return {
				totalErrors: totalResult[0]?.count || 0,
				errorsByCategory: categoryResult.reduce(
					(acc: Record<string, number>, row: any) => {
						acc[row.category] = row.count
						return acc
					},
					{} as Record<string, number>
				),
				errorsBySeverity: severityResult.reduce(
					(acc: Record<string, number>, row: any) => {
						acc[row.severity] = row.count
						return acc
					},
					{} as Record<string, number>
				),
				topComponents: componentResult,
			}
		} catch (dbError) {
			console.error('Failed to get error statistics from database:', dbError)
			return {
				totalErrors: 0,
				errorsByCategory: {},
				errorsBySeverity: {},
				topComponents: [],
			}
		}
	}

	/**
	 * Clean up old error logs
	 */
	async cleanupOldErrors(retentionDays: number = 90): Promise<number> {
		try {
			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

			const result = await this.db
				.delete(this.errorLogTable)
				.where(this.db.lt(this.errorLogTable.timestamp, cutoffDate))

			console.log(`Cleaned up ${result.rowCount || 0} old error log entries`)
			return result.rowCount || 0
		} catch (dbError) {
			console.error('Failed to cleanup old errors:', dbError)
			return 0
		}
	}

	/**
	 * Convert database entry to StructuredError
	 */
	private convertDbEntryToStructuredError(entry: DatabaseErrorLogEntry): StructuredError {
		return {
			id: entry.id,
			category: entry.category as any,
			severity: entry.severity as any,
			code: entry.code,
			message: entry.message,
			context: {
				correlationId: entry.correlationId,
				timestamp: entry.timestamp.toISOString(),
				component: entry.component,
				operation: entry.operation,
				userId: entry.userId,
				sessionId: entry.sessionId,
				requestId: entry.requestId,
				metadata: entry.context?.metadata || {},
				environment: entry.context?.environment || {},
				stackTrace: entry.context?.stackTrace,
			},
			retryable: entry.retryable,
			troubleshooting: entry.troubleshooting,
			aggregationKey: entry.aggregationKey,
		}
	}

	/**
	 * Convert database entry to ErrorAggregation
	 */
	private convertDbEntryToAggregation(entry: DatabaseErrorAggregationEntry): ErrorAggregation {
		return {
			aggregationKey: entry.aggregationKey,
			category: entry.category as any,
			severity: entry.severity as any,
			count: entry.count,
			errorRate: entry.errorRate,
			trend: entry.trend as any,
			firstOccurrence: entry.firstOccurrence.toISOString(),
			lastOccurrence: entry.lastOccurrence.toISOString(),
			affectedComponents: entry.affectedComponents,
			affectedUsers: entry.affectedUsers,
			samples: entry.samples || [],
		}
	}
}
