/**
 * @fileoverview Errors API Routes
 *
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { validator } from 'hono/validator'
import { pino } from 'pino'

import type { DatabaseErrorLogger, ErrorHandler } from '@repo/audit'

const apiLogger = pino({ name: 'errors-api' })

/**
 * Create errors API router
 */
export async function createErrorsAPI(
	errorHandler: ErrorHandler,
	databaseErrorLogger: DatabaseErrorLogger
): Promise<Hono> {
	const app = new Hono()

	// Middleware
	app.use('*', cors())
	app.use('*', logger())

	// Error handling and logging endpoints
	app.get('/statistics', async (c) => {
		if (!errorHandler) {
			c.status(503)
			return c.json({ error: 'Error handler not initialized' })
		}

		try {
			const statistics = errorHandler.getErrorStatistics()
			return c.json({
				...statistics,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			apiLogger.error('Failed to get error statistics:', error)
			c.status(500)
			return c.json({
				error: 'Failed to get error statistics',
				message: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})

	app.get('/aggregations', async (c) => {
		if (!errorHandler) {
			c.status(503)
			return c.json({ error: 'Error handler not initialized' })
		}

		try {
			const aggregations = errorHandler.getAggregations()
			return c.json({
				aggregations,
				count: aggregations.length,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			apiLogger.error('Failed to get error aggregations:', error)
			c.status(500)
			return c.json({
				error: 'Failed to get error aggregations',
				message: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})

	app.get('/history', async (c) => {
		if (!databaseErrorLogger) {
			c.status(503)
			return c.json({ error: 'Database error logger not initialized' })
		}

		try {
			const query = c.req.query()
			const filters: any = {
				category: query.category as any,
				severity: query.severity as any,
				component: query.component,
				correlationId: query.correlationId,
				startTime: query.startTime,
				endTime: query.endTime,
				limit: query.limit ? parseInt(query.limit, 10) : 50,
			}

			// Remove undefined values
			Object.keys(filters).forEach((key) => {
				if (filters[key as keyof typeof filters] === undefined) {
					delete filters[key as keyof typeof filters]
				}
			})

			const history = await databaseErrorLogger.getErrorHistory(filters)
			return c.json({
				errors: history,
				count: history.length,
				filters,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			apiLogger.error('Failed to get error history:', error)
			c.status(500)
			return c.json({
				error: 'Failed to get error history',
				message: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})

	app.get('/database-statistics', async (c) => {
		if (!databaseErrorLogger) {
			c.status(503)
			return c.json({ error: 'Database error logger not initialized' })
		}

		try {
			const query = c.req.query()
			let timeWindow: { start: Date; end: Date } | undefined

			if (query.startTime && query.endTime) {
				timeWindow = {
					start: new Date(query.startTime),
					end: new Date(query.endTime),
				}
			}

			const statistics = await databaseErrorLogger.getErrorStatistics(timeWindow)
			return c.json({
				...statistics,
				timeWindow,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			apiLogger.error('Failed to get database error statistics:', error)
			c.status(500)
			return c.json({
				error: 'Failed to get database error statistics',
				message: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})

	app.post('/cleanup', async (c) => {
		if (!databaseErrorLogger) {
			c.status(503)
			return c.json({ error: 'Database error logger not initialized' })
		}

		try {
			const body = await c.req.json().catch(() => ({}))
			const retentionDays = body.retentionDays || 90

			const deletedCount = await databaseErrorLogger.cleanupOldErrors(retentionDays)
			return c.json({
				success: true,
				message: `Cleaned up ${deletedCount} old error log entries`,
				deletedCount,
				retentionDays,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			apiLogger.error('Failed to cleanup old errors:', error)
			c.status(500)
			return c.json({
				error: 'Failed to cleanup old errors',
				message: error instanceof Error ? error.message : 'Unknown error',
			})
		}
	})

	return app
}
