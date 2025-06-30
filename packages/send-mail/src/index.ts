/**
 * SendMailEvent
 *
 * @example
 *
 * Use from other apps/packages:
 *
 * ```ts
 * import { SendMail } from '@repo/send-mail'
 *
 * const mail = new SendMail(queueName)
 * ```
 */
import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

import type { RedisOptions } from 'ioredis'
import type { MailerSendOptions } from '@repo/mailer'

// Helper to try and get env variables from Cloudflare Workers or Node.js process.env
function getEnv(variableName: string): string | undefined {
	// Check Cloudflare Workers env
	// @ts-expect-error Hides `Cannot find name 'env'.` when not in CF Worker context.
	if (typeof env !== 'undefined' && env[variableName]) {
		// @ts-expect-error
		return env[variableName]
	}
	// Check Node.js process.env
	if (typeof process !== 'undefined' && process.env && process.env[variableName]) {
		return process.env[variableName]
	}
	return undefined
}

export interface SendMailEvent {
	principalId: string
	organizationId: string
	action: string
	emailDetails: MailerSendOptions
}

export class SendMail {
	private connection: Redis
	private queueName: string
	private bullmq_queue: Queue

	/**
	 * Constructs an Send Mail instance.
	 * @param queueName The name of the BullMQ queue.
	 * @param redisUrl Optional. The Redis connection URL. If not provided, it attempts to use
	 *                 `env.MAIL_REDIS_URL` (for Cloudflare Workers) or `process.env.MAIL_REDIS_URL` (for Node.js).
	 * @param redisConnectionOptions Optional. Additional options for IORedis connection.
	 */
	constructor(queueName: string, redisUrl?: string, redisConnectionOptions?: RedisOptions) {
		this.queueName = queueName
		const effectiveRedisUrl = redisUrl || getEnv('MAIL_REDIS_URL')

		if (!effectiveRedisUrl) {
			throw new Error(
				'Send Mail Service: Redis URL not provided and could not be found in environment variables (AUDIT_REDIS_URL).'
			)
		}

		const defaultOptions: RedisOptions = { maxRetriesPerRequest: null }
		this.connection = new Redis(effectiveRedisUrl, {
			...defaultOptions,
			...redisConnectionOptions,
		})

		this.bullmq_queue = new Queue(this.queueName, { connection: this.connection })

		this.connection.on('error', (err) => {
			// It's good to log this, but throwing here might be too disruptive for client apps.
			// Consider a more robust error handling or status reporting mechanism.
			console.error(`[SendMailPackage] Redis connection error for queue ${this.queueName}:`, err)
		})
	}

	/**
	 * Send an email event to the queue.
	 *
	 * @param eventDetails Partial details of the event. Timestamp is added automatically.
	 */
	async send(eventDetails: SendMailEvent): Promise<void> {
		// Use the queueName passed in the constructor for adding jobs
		await this.bullmq_queue.add(this.queueName, eventDetails, {
			removeOnComplete: true, // These could also be configurable
			removeOnFail: true,
		})
	}

	/**
	 * Closes the Redis connection.
	 * Call this when the application using the Send Mail service is shutting down.
	 */
	async closeConnection(): Promise<void> {
		if (this.connection && this.connection.status === 'ready') {
			await this.connection.quit()
		}
	}
}
// Example Usage (for illustration, not part of the actual file logic):
/*
import { auditResource } from '@repo/send-mail'

const email = new SendMailEvent('email')
email.send({
  principalId: 'user-123',
	organizationId: 'org-123',
  action: 'sendMail',
  emailDetails: {
	  from: 'fromName <fromemail@example.com>'
		to: 'mail@example,
		subject: 'The subject',
		html: '<p>The html for the body email</p>,
		text: 'The email body in text format, optional'
	},
})

*/
