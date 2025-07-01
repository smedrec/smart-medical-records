import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Worker } from 'bullmq'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { Redis } from 'ioredis'
import { pino } from 'pino'

import { Audit } from '@repo/audit'
import { AuthDb, emailProvider } from '@repo/auth-db'
import { NodeMailer, NodeMailerSmtpOptions, ResendMailer, SendGridMailer } from '@repo/mailer'

import type { Job } from 'bullmq'
import type { RedisOptions } from 'ioredis'
import type { LogLevel } from 'workers-tagged-logger'
import type { SendMailEvent } from '@repo/send-mail'

interface Mailer {
	from: string | null
	mailer: NodeMailer | ResendMailer | SendGridMailer | null
}

const LOG_LEVEL = (process.env.LOG_LEVEL || 'info') as LogLevel
const MAIL_QUEUE_NAME = process.env.MAIL_QUEUE_NAME || 'mail'
const REDIS_URL = process.env.MAIL_REDIS_URL
const AUTH_DB_URL = process.env.AUTH_DB_URL

if (!REDIS_URL) {
	console.error(
		'🔴 MAIL_REDIS_URL environment variable is not set. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}

if (!AUTH_DB_URL) {
	console.error(
		'🔴 AUTH_DB_URL environment variable is not set. Please check your .env file or environment configuration.'
	)
	process.exit(1)
}

const logger = pino({ name: 'mail-worker', level: LOG_LEVEL })

// TODO - see the question maxRetriesPerRequest
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
	logger.info('🟢 Connected to Redis for BullMQ email worker.')
})

connection.on('error', (err) => {
	logger.error('🔴 Redis connection error for BullMQ email worker:', err)
	// Depending on the error, you might want to exit or implement a retry mechanism for the worker itself.
	// For now, this will prevent the worker from starting or stop it if the connection is lost later.
})

let authDbService: AuthDb | undefined = undefined
export { authDbService }

const audit = new Audit('audit', process.env.AUDIT_REDIS_URL!)

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
const app = new Hono()
app.get('/healthz', (c) => c.text('OK'))
const server = serve(app)

async function getEmailProvider(organizationId: string): Promise<Mailer> {
	const transport: Mailer = { from: null, mailer: null }

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

	transport.from = `${provider.fromName} <${provider.fromEmail}>`

	switch (provider?.providerType) {
		case 'nodemailer':
			transport.mailer = new NodeMailer({
				host: provider.smtpHost!,
				port: provider.smtpPort as number,
				secure: provider.smtpSecure as boolean,
				auth: {
					user: provider.smtpUser!,
					pass: provider.smtpPass!,
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

	if (!authDbService) {
		authDbService = new AuthDb(process.env.AUTH_DB_URL)
	}

	// 1. Check database connection
	const dbConnected = await authDbService.checkAuthDbConnection()
	if (!dbConnected) {
		logger.error('🔴 Halting worker start due to database connection failure.')
		// Optionally, implement retry logic here or ensure process exits.
		// For simplicity, exiting if DB is not available on startup.
		await connection.quit() // Close Redis connection before exiting
		process.exit(1)
	}

	// 2. Define the job processor
	const processJob = async (job: Job<SendMailEvent, any, string>): Promise<void> => {
		logger.info(`Processing job ${job.id} for action: ${job.data.action}`)
		const eventData = job.data
		let email: Mailer

		// Extract known fields and prepare 'details' for the rest
		const { principalId, organizationId, action, emailDetails } = eventData

		if (action === 'sendVerificationEmail') {
			await mailer.send(emailDetails)
			await audit.log({
				principalId,
				action: `${action}Send`,
				status: 'success',
				outcomeDescription: 'Email sent successfully using Mailer!',
			})
		}

		try {
			email =
				action !== 'sendVerificationEmail'
					? await getEmailProvider(organizationId)
					: { from: emailDetails.from, mailer: mailer }
		} catch (error) {
			await audit.log({
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
			await audit.log({
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
			await audit.log({
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
		await connection.quit()
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
	void connection.quit().finally(() => process.exit(1))
})
