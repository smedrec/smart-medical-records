import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Worker } from 'bullmq'
import { Hono } from 'hono'
// import { Redis } from 'ioredis' // Removed ioredis import
import { pino } from 'pino'

import { AuditDb, auditLog as auditLogTableSchema } from '@repo/audit-db'
import {
	closeSharedRedisConnection,
	getRedisConnectionStatus,
	getSharedRedisConnection,
} from '@repo/redis-client'

// Added import for shared connection

import type { Job } from 'bullmq'
// import type { RedisOptions } from 'ioredis' // Removed ioredis import
import type { LogLevel } from 'workers-tagged-logger'
import type { AuditLogEvent } from '@repo/audit'

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

// Simple healthcheck server for audit worker
const port = parseInt(process.env.AUDIT_WORKER_PORT!, 10) || 5600
const app = new Hono()
app.get('/healthz', (c) => c.text('OK'))
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

	// 2. Define the job processor
	const processJob = async (job: Job<AuditLogEvent, any, string>): Promise<void> => {
		logger.info(`Processing job ${job.id} for action: ${job.data.action}`)
		const eventData = job.data

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
			...additionalDetails // Captures all other properties
		} = eventData

		try {
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
				details: Object.keys(additionalDetails).length > 0 ? additionalDetails : null,
			})
			logger.info(
				`✅ Job ${job.id} processed successfully. Audit log for action '${action}' stored.`
			)
		} catch (error) {
			logger.error(`❌ Error processing job ${job.id} for action '${action}':`, error)
			// Depending on the error, you might want to:
			// - Let BullMQ handle retries (default behavior for unhandled promise rejections)
			// - Implement custom retry logic
			// - Move the job to a dead-letter queue if it's consistently failing
			// For now, re-throwing the error to let BullMQ handle it based on its configuration.
			throw error
		}
	}

	// 3. Create and start the BullMQ worker
	const worker = new Worker<AuditLogEvent>(AUDIT_QUEUE_NAME, processJob, {
		connection,
		concurrency: process.env.WORKER_CONCURRENCY ? parseInt(process.env.WORKER_CONCURRENCY, 10) : 5,
		removeOnComplete: { count: 1000 }, // Keep last 1000 completed jobs
		removeOnFail: { count: 5000 }, // Keep last 5000 failed jobs
	})

	worker.on('completed', (job) => {
		logger.debug(`Job ${job.id} has completed.`)
	})

	worker.on('failed', (job, err) => {
		logger.error(`Job ${job?.id} has failed with error: ${err.message}`, err)
	})

	worker.on('error', (err) => {
		logger.error('🚨 BullMQ worker encountered an error:', err)
	})

	logger.info(`👂 Worker listening for jobs on queue: "${AUDIT_QUEUE_NAME}"`)

	serve({
		fetch: app.fetch,
		port: port,
	})

	logger.info(`👂 Healthcheck server listening on port ${port}`)

	// Graceful shutdown
	const gracefulShutdown = async (signal: string) => {
		logger.info(`🚦 Received ${signal}. Shutting down gracefully...`)
		server.close()
		await worker.close()
		await closeSharedRedisConnection() // Use shared client's close function
		await auditDbService?.end()
		logger.info('🚪 Worker, Postgres and Redis connections closed. Exiting.')
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
