import 'dotenv/config'

import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { pino } from 'pino'

import { AuditDb, auditLog as auditLogTableSchema } from '@repo/auditdb'

import type { Job } from 'bullmq'
import type { RedisOptions } from 'ioredis'
import type { LogLevel } from 'workers-tagged-logger'
import type { AuditLogEvent } from '@repo/audit'

const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel
const AUDIT_QUEUE_NAME = process.env.AUDIT_QUEUE_NAME || 'audit'
const REDIS_URL = process.env.AUDIT_REDIS_URL

if (!REDIS_URL) {
	console.error(
		'🔴 REDIS_URL environment variable is not set. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}

const logger = pino({ name: 'AuditWorker', level: LOG_LEVEL })

// Initialize Redis connection for BullMQ
// BullMQ recommends not using maxRetriesPerRequest: null in newer versions,
// but rather relying on built-in retry mechanisms or handling errors appropriately.
// For now, keeping it simple as per existing patterns in the repo.
const defaultOptions: RedisOptions = { maxRetriesPerRequest: null }
const connection = new Redis(REDIS_URL!, {
	...defaultOptions, // Consistent with package/audit but consider BullMQ best practices
	// enableReadyCheck: false, // May be needed depending on Redis setup/version
})

connection.on('connect', () => {
	logger.info('🟢 Connected to Redis for BullMQ worker.')
})

connection.on('error', (err) => {
	logger.error('🔴 Redis connection error for BullMQ worker:', err)
	// Depending on the error, you might want to exit or implement a retry mechanism for the worker itself.
	// For now, this will prevent the worker from starting or stop it if the connection is lost later.
})

// Using environment variable AUDIT_DB_URL
let auditDbService: AuditDb | undefined = undefined
export { auditDbService }

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
		await connection.quit() // Close Redis connection before exiting
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

	// Graceful shutdown
	const gracefulShutdown = async (signal: string) => {
		logger.info(`🚦 Received ${signal}. Shutting down gracefully...`)
		await worker.close()
		await connection.quit()
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
	void connection.quit().finally(() => process.exit(1))
})
