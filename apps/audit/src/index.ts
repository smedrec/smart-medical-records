import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { pino } from 'pino'

import {
	CircuitBreakerHealthCheck,
	ConsoleAlertHandler,
	DatabaseErrorLogger,
	DatabaseHealthCheck,
	DEFAULT_RELIABLE_PROCESSOR_CONFIG,
	ErrorHandler,
	HealthCheckService,
	MonitoringService,
	ProcessingHealthCheck,
	QueueHealthCheck,
	RedisHealthCheck,
	ReliableEventProcessor,
} from '@repo/audit'
import {
	AuditDb,
	auditLog as auditLogTableSchema,
	errorAggregation,
	errorLog,
} from '@repo/audit-db'
import {
	closeSharedRedisConnection,
	getRedisConnectionStatus,
	getSharedRedisConnection,
} from '@repo/redis-client'

import { createComplianceAPI } from './compliance-api.js'
import { createErrorsAPI } from './errors-api.js'

import type { LogLevel } from 'workers-tagged-logger'
import type { AuditLogEvent, ReliableProcessorConfig } from '@repo/audit'

const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel
const AUDIT_QUEUE_NAME = process.env.AUDIT_QUEUE_NAME || 'audit'
// const REDIS_URL = process.env.AUDIT_REDIS_URL // No longer needed directly, shared client handles REDIS_URL

// Check for REDIS_URL is now handled by the shared client,
// but we might want a specific check for AUDIT_REDIS_URL if it were different.
// For now, assuming REDIS_URL is the one used by the shared client.
/*
if (!process.env.REDIS_URL) { // Optional: Check if REDIS_URL (used by shared client) is set
	console.error(
		'🔴 REDIS_URL environment variable is not set for the shared Redis client. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}
*/

const logger = pino({ name: 'audit-worker', level: LOG_LEVEL })

// Initialize Redis connection using the shared client
// BullMQ recommends not using maxRetriesPerRequest: null in newer versions,
// but rather relying on built-in retry mechanisms or handling errors appropriately.
// The shared client's default options include maxRetriesPerRequest: null.
const connection = getSharedRedisConnection()

// Optional: Log connection status from the shared client
logger.info(`Shared Redis connection status: ${getRedisConnectionStatus()}`)

// Events 'connect' and 'error' are handled within the shared client.
// We can add listeners here too, but it might be redundant if the shared client's logging is sufficient.
// For example, if specific actions for this worker are needed on 'error':
connection.on('error', (err) => {
	logger.error('🔴 Shared Redis connection error impacting BullMQ worker:', err)
	// Consider if process should exit or if shared client's reconnection logic is sufficient.
})

// Using environment variable AUDIT_DB_URL
let auditDbService: AuditDb | undefined = undefined
export { auditDbService }

// Reliable event processor instance
let reliableProcessor: ReliableEventProcessor<AuditLogEvent> | undefined = undefined

// Monitoring and health check services
let monitoringService: MonitoringService | undefined = undefined
let healthCheckService: HealthCheckService | undefined = undefined

// Error handling services
let errorHandler: ErrorHandler | undefined = undefined
let databaseErrorLogger: DatabaseErrorLogger | undefined = undefined

// Simple healthcheck server for audit worker
const port = parseInt(process.env.AUDIT_WORKER_PORT!, 10) || 5600
const app = new Hono()

app.get('/healthz', async (c) => {
	if (!healthCheckService) {
		logger.warn('Health check called before services are initialized.')
		c.status(503)
		return c.text('Service Unavailable: Services not initialized')
	}

	try {
		const healthStatus = await healthCheckService.checkAllComponents()

		if (healthStatus.status === 'OK') {
			return c.json(healthStatus)
		} else {
			logger.warn(`Health check failed with status: ${healthStatus.status}`)
			c.status(healthStatus.status === 'CRITICAL' ? 503 : 200)
			return c.json(healthStatus)
		}
	} catch (error) {
		logger.error('Health check failed with error:', error)
		c.status(503)
		return c.json({
			status: 'CRITICAL',
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
		})
	}
})

app.get('/metrics', async (c) => {
	if (!reliableProcessor || !monitoringService) {
		c.status(503)
		return c.json({ error: 'Services not initialized' })
	}

	try {
		const [processorMetrics, cbMetrics, dlMetrics, auditMetrics] = await Promise.all([
			reliableProcessor.getMetrics(),
			reliableProcessor.getCircuitBreakerMetrics(),
			reliableProcessor.getDeadLetterMetrics(),
			Promise.resolve(monitoringService.getMetrics()),
		])

		return c.json({
			processor: processorMetrics,
			circuitBreaker: cbMetrics,
			deadLetter: dlMetrics,
			monitoring: auditMetrics,
		})
	} catch (error) {
		logger.error('Failed to collect metrics:', error)
		c.status(500)
		return c.json({
			error: 'Failed to collect metrics',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})

app.get('/alerts', async (c) => {
	if (!monitoringService) {
		c.status(503)
		return c.json({ error: 'Monitoring service not initialized' })
	}

	try {
		const activeAlerts = monitoringService.getActiveAlerts()
		return c.json({
			alerts: activeAlerts,
			count: activeAlerts.length,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		logger.error('Failed to get alerts:', error)
		c.status(500)
		return c.json({
			error: 'Failed to get alerts',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})

app.post('/alerts/:alertId/resolve', async (c) => {
	if (!monitoringService) {
		c.status(503)
		return c.json({ error: 'Monitoring service not initialized' })
	}

	const alertId = c.req.param('alertId')
	const body = await c.req.json().catch(() => ({}))
	const resolvedBy = body.resolvedBy || 'system'

	try {
		await monitoringService.resolveAlert(alertId, resolvedBy)
		return c.json({
			success: true,
			message: `Alert ${alertId} resolved by ${resolvedBy}`,
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		logger.error('Failed to resolve alert:', error)
		c.status(500)
		return c.json({
			error: 'Failed to resolve alert',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})

app.get('/health/:component', async (c) => {
	if (!healthCheckService) {
		c.status(503)
		return c.json({ error: 'Health check service not initialized' })
	}

	const componentName = c.req.param('component')

	try {
		const componentHealth = await healthCheckService.checkComponent(componentName)

		if (!componentHealth) {
			c.status(404)
			return c.json({
				error: 'Component not found',
				component: componentName,
			})
		}

		const statusCode =
			componentHealth.status === 'CRITICAL' ? 503 : componentHealth.status === 'WARNING' ? 200 : 200

		c.status(statusCode)
		return c.json(componentHealth)
	} catch (error) {
		logger.error('Failed to check component health:', error)
		c.status(500)
		return c.json({
			error: 'Failed to check component health',
			message: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})

const server = serve(app)

// Main function to start the worker
async function main() {
	logger.info('🏁 Audit worker starting...')

	if (!auditDbService) {
		auditDbService = new AuditDb(process.env.AUTH_DB_URL)
	}

	// 1. Check database connection
	const dbConnected = await auditDbService.checkAuditDbConnection()
	if (!dbConnected) {
		logger.error('🔴 Halting worker start due to database connection failure.')
		// Optionally, implement retry logic here or ensure process exits.
		// For simplicity, exiting if DB is not available on startup.
		await closeSharedRedisConnection() // Use shared client's close function
		process.exit(1)
	}

	const db = auditDbService.getDrizzleInstance()

	// 2. Initialize error handling services

	databaseErrorLogger = new DatabaseErrorLogger(db, errorLog, errorAggregation)
	errorHandler = new ErrorHandler(undefined, undefined, databaseErrorLogger)

	// 3. Initialize monitoring and health check services
	monitoringService = new MonitoringService()
	monitoringService.addAlertHandler(new ConsoleAlertHandler())

	healthCheckService = new HealthCheckService()

	// Register health checks
	healthCheckService.registerHealthCheck(
		new DatabaseHealthCheck(() => auditDbService!.checkAuditDbConnection())
	)
	healthCheckService.registerHealthCheck(new RedisHealthCheck(() => getRedisConnectionStatus()))

	// 3. Define the reliable event processor with monitoring integration
	const processAuditEvent = async (eventData: AuditLogEvent): Promise<void> => {
		const startTime = Date.now()
		logger.info(`Processing audit event for action: ${eventData.action}`)

		try {
			// Process event through monitoring service for pattern detection
			await monitoringService!.processEvent(eventData)

			// Extract known fields and prepare 'details' for the rest
			const {
				timestamp,
				ttl,
				principalId,
				organizationId,
				action,
				targetResourceType,
				targetResourceId,
				status,
				outcomeDescription,
				hash,
				hashAlgorithm,
				eventVersion,
				correlationId,
				dataClassification,
				retentionPolicy,
				processingLatency,
				archivedAt,
				...additionalDetails // Captures all other properties including practitioner-specific fields
			} = eventData

			// This will throw an error if database operation fails, which will be caught by the retry mechanism
			await db.insert(auditLogTableSchema).values({
				timestamp, // This comes from the event, should be an ISO string
				ttl,
				principalId,
				organizationId,
				action,
				targetResourceType,
				targetResourceId,
				status,
				outcomeDescription,
				hash,
				hashAlgorithm,
				eventVersion,
				correlationId,
				dataClassification,
				retentionPolicy,
				processingLatency: processingLatency || Date.now() - startTime,
				archivedAt,
				details: Object.keys(additionalDetails).length > 0 ? additionalDetails : null,
			})

			logger.info(`✅ Audit event processed successfully. Action '${action}' stored.`)
		} catch (error) {
			// Use comprehensive error handling for better error tracking and logging
			const err = error instanceof Error ? error : new Error(String(error))

			if (errorHandler) {
				await errorHandler.handleError(
					err,
					{
						correlationId: eventData.correlationId,
						userId: eventData.principalId,
						sessionId: eventData.sessionContext?.sessionId,
						metadata: {
							action: eventData.action,
							targetResourceType: eventData.targetResourceType,
							targetResourceId: eventData.targetResourceId,
							eventData: eventData,
						},
					},
					'audit-processor',
					'processAuditEvent'
				)
			}

			logger.error(`❌ Failed to process audit event: ${err.message}`)
			throw err // Re-throw to trigger retry mechanism
		}
	}

	// 3. Configure reliable processor
	const processorConfig: ReliableProcessorConfig = {
		...DEFAULT_RELIABLE_PROCESSOR_CONFIG,
		queueName: AUDIT_QUEUE_NAME,
		concurrency: process.env.WORKER_CONCURRENCY ? parseInt(process.env.WORKER_CONCURRENCY, 10) : 5,
		retryConfig: {
			...DEFAULT_RELIABLE_PROCESSOR_CONFIG.retryConfig,
			maxRetries: parseInt(process.env.MAX_RETRIES || '5', 10),
			baseDelay: parseInt(process.env.RETRY_BASE_DELAY || '1000', 10),
			maxDelay: parseInt(process.env.RETRY_MAX_DELAY || '30000', 10),
		},
		circuitBreakerConfig: {
			...DEFAULT_RELIABLE_PROCESSOR_CONFIG.circuitBreakerConfig,
			failureThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
			recoveryTimeout: parseInt(process.env.CIRCUIT_BREAKER_RECOVERY_TIMEOUT || '30000', 10),
		},
		deadLetterConfig: {
			...DEFAULT_RELIABLE_PROCESSOR_CONFIG.deadLetterConfig,
			queueName: `${AUDIT_QUEUE_NAME}-dead-letter`,
			alertThreshold: parseInt(process.env.DEAD_LETTER_ALERT_THRESHOLD || '10', 10),
		},
	}

	// 4. Create and start the reliable event processor
	reliableProcessor = new ReliableEventProcessor<AuditLogEvent>(
		connection,
		processAuditEvent,
		processorConfig
	)

	await reliableProcessor.start()

	// 5. Register additional health checks that depend on the processor
	healthCheckService.registerHealthCheck(
		new QueueHealthCheck(
			async () => {
				const metrics = await reliableProcessor!.getMetrics()
				return metrics.queueDepth || 0
			},
			async () => {
				const metrics = await reliableProcessor!.getMetrics()
				return metrics.totalProcessed || 0
			}
		)
	)

	healthCheckService.registerHealthCheck(
		new ProcessingHealthCheck(async () => monitoringService!.getMetrics())
	)

	healthCheckService.registerHealthCheck(
		new CircuitBreakerHealthCheck(async () => {
			const healthStatus = await reliableProcessor!.getHealthStatus()
			return healthStatus.circuitBreakerState || 'UNKNOWN'
		})
	)

	logger.info(`👂 Reliable processor listening for jobs on queue: "${AUDIT_QUEUE_NAME}"`)

	// 6. Mount compliance API routes
	const complianceAPI = createComplianceAPI(auditDbService)
	app.route('/api/compliance', complianceAPI)

	// 7. Mount errors API routes
	const errorsAPI = await createErrorsAPI(errorHandler, databaseErrorLogger)
	app.route('/api/errors', errorsAPI)

	logger.info('📊 Compliance API routes mounted at /api/compliance')

	serve({
		fetch: app.fetch,
		port: port,
	})

	logger.info(`👂 Healthcheck server, Compliance API and Errors API listening on port ${port}`)

	// Graceful shutdown
	const gracefulShutdown = async (signal: string) => {
		logger.info(`🚦 Received ${signal}. Shutting down gracefully...`)
		server.close()
		if (reliableProcessor) {
			await reliableProcessor.stop()
		}
		await closeSharedRedisConnection() // Use shared client's close function
		await auditDbService?.end()
		logger.info('🚪 Reliable processor, Postgres and Redis connections closed. Exiting.')
		process.exit(0)
	}

	process.on('SIGINT', () => gracefulShutdown('SIGINT')) // Ctrl+C
	process.on('SIGTERM', () => gracefulShutdown('SIGTERM')) // kill
}

// Start the application
main().catch(async (error) => {
	logger.error('💥 Unhandled error in main application scope:', error.message)
	await auditDbService?.end()
	// Ensure shared Redis connection is closed on fatal error
	void closeSharedRedisConnection().finally(() => process.exit(1))
})
