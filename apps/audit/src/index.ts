import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { pino } from 'pino'

import {
	CircuitBreaker,
	DeadLetterHandler,
	DEFAULT_RELIABLE_PROCESSOR_CONFIG,
	ReliableEventProcessor,
} from '@repo/audit'
import { AuditDb, auditLog as auditLogTableSchema } from '@repo/audit-db'
import {
	closeSharedRedisConnection,
	getRedisConnectionStatus,
	getSharedRedisConnection,
} from '@repo/redis-client'

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

// Simple healthcheck server for audit worker
const port = parseInt(process.env.AUDIT_WORKER_PORT!, 10) || 5600
const app = new Hono()

app.get('/healthz', async (c) => {
	if (!auditDbService || !reliableProcessor) {
		logger.warn('Health check called before services are initialized.')
		c.status(503)
		return c.text('Service Unavailable: Services not initialized')
	}

	const redisStatus = getRedisConnectionStatus()
	const dbConnected = await auditDbService.checkAuditDbConnection()
	const processorHealth = await reliableProcessor.getHealthStatus()

	if (
		redisStatus === 'ready' &&
		dbConnected &&
		processorHealth.isRunning &&
		processorHealth.healthScore > 70
	) {
		return c.json({
			status: 'OK',
			redis: redisStatus,
			database: dbConnected,
			processor: {
				running: processorHealth.isRunning,
				healthScore: processorHealth.healthScore,
				circuitBreakerState: processorHealth.circuitBreakerState,
				queueDepth: processorHealth.queueDepth,
			},
		})
	} else {
		logger.warn(
			`Health check failed: Redis: ${redisStatus}, DB: ${dbConnected}, Processor: ${processorHealth.isRunning}, Health Score: ${processorHealth.healthScore}`
		)
		c.status(503)
		return c.json({
			status: 'Service Unavailable',
			redis: redisStatus,
			database: dbConnected,
			processor: processorHealth,
		})
	}
})

app.get('/metrics', async (c) => {
	if (!reliableProcessor) {
		c.status(503)
		return c.json({ error: 'Processor not initialized' })
	}

	const [processorMetrics, cbMetrics, dlMetrics] = await Promise.all([
		reliableProcessor.getMetrics(),
		reliableProcessor.getCircuitBreakerMetrics(),
		reliableProcessor.getDeadLetterMetrics(),
	])

	return c.json({
		processor: processorMetrics,
		circuitBreaker: cbMetrics,
		deadLetter: dlMetrics,
	})
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

	// 2. Define the reliable event processor
	const processAuditEvent = async (eventData: AuditLogEvent): Promise<void> => {
		logger.info(`Processing audit event for action: ${eventData.action}`)

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
			processingLatency,
			archivedAt,
			details: Object.keys(additionalDetails).length > 0 ? additionalDetails : null,
		})

		logger.info(`✅ Audit event processed successfully. Action '${action}' stored.`)
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

	logger.info(`👂 Reliable processor listening for jobs on queue: "${AUDIT_QUEUE_NAME}"`)

	serve({
		fetch: app.fetch,
		port: port,
	})

	logger.info(`👂 Healthcheck server listening on port ${port}`)

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
	logger.error('💥 Unhandled error in main application scope:', error)
	await auditDbService?.end()
	// Ensure shared Redis connection is closed on fatal error
	void closeSharedRedisConnection().finally(() => process.exit(1))
})
