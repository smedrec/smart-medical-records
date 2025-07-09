import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Worker } from 'bullmq'
import { BullMQOtel } from 'bullmq-otel'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
// import { Redis } from 'ioredis' // Removed ioredis import
import { pino } from 'pino'

import { Audit } from '@repo/audit'
import { AuthDb, emailProvider } from '@repo/auth-db'
import { InfisicalKmsClient } from '@repo/infisical-kms'
import { NodeMailer, ResendMailer, SendGridMailer } from '@repo/mailer'
import {
	getSharedRedisConnection,
	closeSharedRedisConnection,
	getRedisConnectionStatus,
} from '@repo/redis-client' // Added import for shared connection

import type { Job } from 'bullmq'
// import type { RedisOptions } from 'ioredis' // Removed ioredis import
import type { LogLevel } from 'workers-tagged-logger'
import type { NodeMailerSmtpOptions } from '@repo/mailer'
import type { SendMailEvent } from '@repo/send-mail'

interface Mailer {
	from: string | null
	mailer: NodeMailer | ResendMailer | SendGridMailer | null
}

const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel
const MAIL_QUEUE_NAME = process.env.MAIL_QUEUE_NAME || 'mail'
// const REDIS_URL = process.env.MAIL_REDIS_URL // No longer needed directly
const AUTH_DB_URL = process.env.AUTH_DB_URL

// Check for REDIS_URL (used by shared client) is implicitly handled by the shared client.
// We still need to check for AUTH_DB_URL for this specific worker.
/*
if (!process.env.REDIS_URL) { // Optional: Check if REDIS_URL (used by shared client) is set
	console.error(
		'🔴 REDIS_URL environment variable is not set for the shared Redis client. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}
*/

if (!AUTH_DB_URL) {
	console.error(
		'🔴 AUTH_DB_URL environment variable is not set. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}

const logger = pino({ name: 'mail-worker', level: LOG_LEVEL })

// Initialize Redis connection using the shared client
// The shared client's default options include maxRetriesPerRequest: null.
const connection = getSharedRedisConnection()

// Optional: Log connection status from the shared client
logger.info(`Shared Redis connection status: ${getRedisConnectionStatus()}`)

// Events 'connect' and 'error' are handled within the shared client.
// Adding a specific error handler for this worker if needed.
connection.on('error', (err) => {
	logger.error('🔴 Shared Redis connection error impacting BullMQ mail worker:', err)
	// Consider if process should exit or if shared client's reconnection logic is sufficient.
})

let authDbService: AuthDb | undefined = undefined
export { authDbService }

let audit: Audit | undefined = undefined
export { audit }

const kms = new InfisicalKmsClient({
	baseUrl: process.env.INFISICAL_URL!,
	keyId: process.env.KMS_KEY_ID!,
	accessToken: process.env.INFISICAL_ACCESS_TOKEN!,
})

const mailerConfig: NodeMailerSmtpOptions = {
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT!, 10), // Or 465 for SSL
	secure: parseInt(process.env.SMTP_PORT!, 10) === 465, // true for 465, false for other ports like 587 (STARTTLS)
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
	// Other nodemailer options can be added here
}

const mailer = new NodeMailer(mailerConfig)

// Simple healthcheck server for mail worker
const port = process.env.MAIL_WORKER_PORT
const app = new Hono()
app.get('/healthz', (c) => c.text('OK'))
const server = serve(app)

async function getEmailProvider(organizationId: string, action: string): Promise<Mailer> {
	const transport: Mailer = { from: null, mailer: null }

	if (action === 'sendVerificationEmail')
		return { from: 'SMEDREC <no-reply@smedrec.com>', mailer: mailer }

	if (!authDbService) {
		authDbService = new AuthDb(AUTH_DB_URL)
	}

	const db = authDbService.getDrizzleInstance()

	const provider = await db.query.emailProvider.findFirst({
		where: eq(emailProvider.organizationId, organizationId),
	})

	if (!provider) {
		throw Error('Mailer connection details from database error.')
	}

	// TODO - improve the possible error
	if (provider.password) {
		const password = await kms.decrypt(provider.password!)
		provider.password = password.plaintext
	}

	if (provider.apiKey) {
		const apiKey = await kms.decrypt(provider.apiKey!)
		provider.apiKey = apiKey.plaintext
	}

	transport.from = `${provider.fromName} <${provider.fromEmail}>`

	switch (provider?.provider) {
		case 'smtp':
			transport.mailer = new NodeMailer({
				host: provider.host!,
				port: provider.port as number,
				secure: provider.secure as boolean,
				auth: {
					user: provider.user!,
					pass: provider.password!,
				},
			})
			break
		case 'resend':
			transport.mailer = new ResendMailer({
				apiKey: provider.apiKey!,
			})
			break
		case 'sendgrid':
			transport.mailer = new SendGridMailer({
				apiKey: provider.apiKey!,
			})
			break

		default:
			break
	}

	return transport
}

// Main function to start the worker
async function main() {
	logger.info('🏁 Mail worker starting...')

	if (!audit) {
		audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)
	}

	if (!authDbService) {
		authDbService = new AuthDb(process.env.AUTH_DB_URL)
	}

	// 1. Check database connection
	const dbConnected = await authDbService.checkAuthDbConnection()
	if (!dbConnected) {
		logger.error('🔴 Halting worker start due to database connection failure.')
		// Optionally, implement retry logic here or ensure process exits.
		// For simplicity, exiting if DB is not available on startup.
		await closeSharedRedisConnection() // Use shared client's close function
		process.exit(1)
	}

	// 2. Define the job processor
	const processJob = async (job: Job<SendMailEvent, any, string>): Promise<void> => {
		logger.info(`Processing job ${job.id} for action: ${job.data.action}`)
		const eventData = job.data
		let email: Mailer

		// Extract known fields and prepare 'details' for the rest
		const { principalId, organizationId, action, emailDetails } = eventData

		try {
			email = await getEmailProvider(organizationId, action)
		} catch (error) {
			await audit?.log({
				principalId,
				organizationId,
				action: `${action}GetProvider`,
				status: 'failure',
				outcomeDescription: `Mailer send error: Mailer connection error for Email service`,
			})
			logger.error(`❌ Error processing job ${job.id} for action '${action}':`, error)
			// Depending on the error, you might want to:
			// - Let BullMQ handle retries (default behavior for unhandled promise rejections)
			// - Implement custom retry logic
			// - Move the job to a dead-letter queue if it's consistently failing
			// For now, re-throwing the error to let BullMQ handle it based on its configuration.
			throw error
		}

		try {
			await email.mailer?.send({
				...emailDetails,
				from: email.from!,
			})
			await audit?.log({
				principalId,
				organizationId: action !== 'sendVerificationEmail' ? organizationId : null,
				action: `${action}Send`,
				status: 'success',
				outcomeDescription: 'Email sent successfully using Mailer!',
			})
			logger.info(
				`✅ Job ${job.id} processed successfully. Mail worker log for action '${action}' stored.`
			)
		} catch (error) {
			await audit?.log({
				principalId,
				organizationId: action !== 'sendVerificationEmail' ? organizationId : null,
				action: `${action}Send`,
				status: 'failure',
				outcomeDescription: `Mailer send error: ${error}`,
			})
			logger.error(`❌ Error processing job ${job.id} for action '${action}':`, error)
			throw error
		}
	}

	// 3. Create and start the BullMQ worker
	const worker = new Worker<SendMailEvent>(MAIL_QUEUE_NAME, processJob, {
		connection,
		concurrency: process.env.WORKER_CONCURRENCY ? parseInt(process.env.WORKER_CONCURRENCY, 10) : 5,
		removeOnComplete: { count: 1000 }, // Keep last 1000 completed jobs
		removeOnFail: { count: 5000 }, // Keep last 5000 failed jobs
		telemetry: new BullMQOtel(MAIL_QUEUE_NAME, '0.1.0'),
	})

	worker.on('completed', (job) => {
		logger.debug(`Job ${job.id} has completed.`)
	})

	worker.on('failed', (job, err) => {
		logger.error(`Job ${job?.id} has failed with error: ${err.message}`, err)
	})

	worker.on('error', (err) => {
		logger.error('🚨 BullMQ mail worker encountered an error:', err)
	})

	logger.info(`👂 Worker listening for jobs on queue: "${MAIL_QUEUE_NAME}"`)

	serve({
		fetch: app.fetch,
		port: 5601,
	})

	logger.info(`👂 Healthcheck server listening on port ${port}`)

	// Graceful shutdown
	const gracefulShutdown = async (signal: string) => {
		logger.info(`🚦 Received ${signal}. Shutting down gracefully...`)
		server.close()
		await worker.close()
		await closeSharedRedisConnection() // Use shared client's close function
		await authDbService?.end()
		logger.info('🚪 Mail Worker, Redis and Postgres connections closed. Exiting.')
		process.exit(0)
	}

	process.on('SIGINT', () => gracefulShutdown('SIGINT')) // Ctrl+C
	process.on('SIGTERM', () => gracefulShutdown('SIGTERM')) // kill
}

// Start the application
main().catch(async (error) => {
	logger.error('💥 Unhandled error in main application scope:', error)
	await authDbService?.end()
	// Ensure shared Redis connection is closed on fatal error
	closeSharedRedisConnection().finally(() => process.exit(1))
})
