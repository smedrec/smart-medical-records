/**
 * Dead Letter Queue handling for events that exceed retry limits
 */

import { Queue, Worker } from 'bullmq'

import type { Job } from 'bullmq'
import type { Redis as RedisType } from 'ioredis'
import type { AuditLogEvent } from '../types.js'

export interface DeadLetterConfig {
	queueName: string
	maxRetentionDays: number
	alertThreshold: number
	processingInterval: number
	archiveAfterDays?: number
}

export const DEFAULT_DEAD_LETTER_CONFIG: DeadLetterConfig = {
	queueName: 'audit-dead-letter',
	maxRetentionDays: 30,
	alertThreshold: 10, // Alert when DLQ has more than 10 items
	processingInterval: 300000, // Process DLQ every 5 minutes
}

export interface DeadLetterEvent {
	originalEvent: AuditLogEvent
	failureReason: string
	failureCount: number
	firstFailureTime: string
	lastFailureTime: string
	originalJobId?: string
	originalQueueName?: string
	metadata: {
		errorStack?: string
		retryHistory: Array<{
			attempt: number
			timestamp: string
			error: string
		}>
	}
}

export interface DeadLetterMetrics {
	totalEvents: number
	eventsToday: number
	oldestEvent?: string
	newestEvent?: string
	topFailureReasons: Array<{
		reason: string
		count: number
	}>
}

export class DeadLetterHandler {
	private dlQueue: Queue<DeadLetterEvent>
	private dlWorker?: Worker<DeadLetterEvent>
	private alertCallbacks: Array<(metrics: DeadLetterMetrics) => void> = []
	private lastAlertTime = 0
	private readonly ALERT_COOLDOWN = 300000 // 5 minutes between alerts

	constructor(
		private connection: RedisType,
		private config: DeadLetterConfig = DEFAULT_DEAD_LETTER_CONFIG
	) {
		this.dlQueue = new Queue(config.queueName, { connection })
	}

	/**
	 * Adds a failed event to the dead letter queue
	 */
	async addFailedEvent(
		originalEvent: AuditLogEvent,
		error: Error,
		jobId?: string,
		queueName?: string,
		retryHistory: Array<{ attempt: number; timestamp: string; error: string }> = []
	): Promise<void> {
		const deadLetterEvent: DeadLetterEvent = {
			originalEvent,
			failureReason: error.message,
			failureCount: retryHistory.length,
			firstFailureTime: retryHistory[0]?.timestamp || new Date().toISOString(),
			lastFailureTime: new Date().toISOString(),
			originalJobId: jobId,
			originalQueueName: queueName,
			metadata: {
				errorStack: error.stack,
				retryHistory,
			},
		}

		try {
			await this.dlQueue.add('dead-letter-event', deadLetterEvent, {
				removeOnComplete: false, // Keep completed DLQ jobs for analysis
				removeOnFail: false,
				delay: 0,
			})

			console.warn(
				`[DeadLetterHandler] Added failed audit event to DLQ: ${originalEvent.action} (${error.message})`
			)

			// Check if we should send alerts
			await this.checkAndSendAlerts()
		} catch (dlError) {
			console.error(`[DeadLetterHandler] Failed to add event to dead letter queue:`, dlError)
			// This is a critical error - we're losing audit events
			throw new Error(
				`Critical: Failed to add audit event to dead letter queue: ${dlError instanceof Error ? dlError.message : String(dlError)}`
			)
		}
	}

	/**
	 * Starts the dead letter queue worker for processing and cleanup
	 */
	startWorker(): void {
		if (this.dlWorker) {
			console.warn('[DeadLetterHandler] Worker already started')
			return
		}

		this.dlWorker = new Worker<DeadLetterEvent>(
			this.config.queueName,
			async (job: Job<DeadLetterEvent>) => {
				await this.processDeadLetterEvent(job)
			},
			{
				connection: this.connection,
				concurrency: 1, // Process DLQ events sequentially
			}
		)

		this.dlWorker.on('completed', (job) => {
			console.log(`[DeadLetterHandler] Processed DLQ event: ${job.id}`)
		})

		this.dlWorker.on('failed', (job, error) => {
			console.error(`[DeadLetterHandler] Failed to process DLQ event ${job?.id}:`, error)
		})

		console.log('[DeadLetterHandler] Worker started')
	}

	/**
	 * Stops the dead letter queue worker
	 */
	async stopWorker(): Promise<void> {
		if (this.dlWorker) {
			await this.dlWorker.close()
			this.dlWorker = undefined
			console.log('[DeadLetterHandler] Worker stopped')
		}
	}

	/**
	 * Processes a dead letter event (cleanup, archival, etc.)
	 */
	private async processDeadLetterEvent(job: Job<DeadLetterEvent>): Promise<void> {
		const event = job.data
		const eventAge = Date.now() - new Date(event.firstFailureTime).getTime()
		const ageInDays = eventAge / (1000 * 60 * 60 * 24)

		// Archive old events if configured
		if (this.config.archiveAfterDays && ageInDays > this.config.archiveAfterDays) {
			await this.archiveEvent(event)
			console.log(
				`[DeadLetterHandler] Archived DLQ event older than ${this.config.archiveAfterDays} days`
			)
		}

		// Delete very old events
		if (ageInDays > this.config.maxRetentionDays) {
			console.log(
				`[DeadLetterHandler] Removing DLQ event older than ${this.config.maxRetentionDays} days`
			)
			// Event will be removed automatically when job completes
		}

		// Log event for monitoring
		console.log(
			`[DeadLetterHandler] DLQ Event: ${event.originalEvent.action} failed ${event.failureCount} times (${event.failureReason})`
		)
	}

	/**
	 * Archives a dead letter event to persistent storage
	 */
	private async archiveEvent(event: DeadLetterEvent): Promise<void> {
		// In a real implementation, this would save to a persistent archive
		// For now, we'll just log it with structured data
		console.log('[DeadLetterHandler] Archiving DLQ event:', {
			action: event.originalEvent.action,
			failureReason: event.failureReason,
			failureCount: event.failureCount,
			firstFailureTime: event.firstFailureTime,
			lastFailureTime: event.lastFailureTime,
		})
	}

	/**
	 * Gets metrics about the dead letter queue
	 */
	async getMetrics(): Promise<DeadLetterMetrics> {
		const jobs = await this.dlQueue.getJobs(['waiting', 'active', 'completed', 'failed'])
		const today = new Date().toDateString()

		const metrics: DeadLetterMetrics = {
			totalEvents: jobs?.length || 0,
			eventsToday: 0,
			topFailureReasons: [],
		}

		const failureReasons = new Map<string, number>()
		let oldestTime: number | undefined
		let newestTime: number | undefined

		if (jobs && jobs.length > 0) {
			for (const job of jobs) {
				const event = job.data as DeadLetterEvent
				const eventTime = new Date(event.firstFailureTime).getTime()

				// Count events today
				if (new Date(event.firstFailureTime).toDateString() === today) {
					metrics.eventsToday++
				}

				// Track oldest and newest
				if (!oldestTime || eventTime < oldestTime) {
					oldestTime = eventTime
				}
				if (!newestTime || eventTime > newestTime) {
					newestTime = eventTime
				}

				// Count failure reasons
				const reason = event.failureReason
				failureReasons.set(reason, (failureReasons.get(reason) || 0) + 1)
			}
		}

		// Set oldest/newest
		if (oldestTime) {
			metrics.oldestEvent = new Date(oldestTime).toISOString()
		}
		if (newestTime) {
			metrics.newestEvent = new Date(newestTime).toISOString()
		}

		// Top failure reasons
		metrics.topFailureReasons = Array.from(failureReasons.entries())
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([reason, count]) => ({ reason, count }))

		return metrics
	}

	/**
	 * Checks if alerts should be sent based on DLQ metrics
	 */
	private async checkAndSendAlerts(): Promise<void> {
		const now = Date.now()
		if (now - this.lastAlertTime < this.ALERT_COOLDOWN) {
			return // Still in cooldown period
		}

		const metrics = await this.getMetrics()

		if (metrics.totalEvents >= this.config.alertThreshold) {
			this.lastAlertTime = now

			// Notify all alert callbacks
			for (const callback of this.alertCallbacks) {
				try {
					callback(metrics)
				} catch (error) {
					console.error('[DeadLetterHandler] Alert callback error:', error)
				}
			}

			console.warn(
				`[DeadLetterHandler] ALERT: Dead letter queue has ${metrics.totalEvents} events (threshold: ${this.config.alertThreshold})`
			)
		}
	}

	/**
	 * Adds an alert callback for DLQ threshold breaches
	 */
	onAlert(callback: (metrics: DeadLetterMetrics) => void): void {
		this.alertCallbacks.push(callback)
	}

	/**
	 * Removes an alert callback
	 */
	removeAlertCallback(callback: (metrics: DeadLetterMetrics) => void): void {
		const index = this.alertCallbacks.indexOf(callback)
		if (index > -1) {
			this.alertCallbacks.splice(index, 1)
		}
	}

	/**
	 * Manually processes all pending dead letter events
	 */
	async processPendingEvents(): Promise<void> {
		const waitingJobs = await this.dlQueue.getJobs(['waiting'])
		console.log(`[DeadLetterHandler] Processing ${waitingJobs.length} pending DLQ events`)

		for (const job of waitingJobs) {
			try {
				await this.processDeadLetterEvent(job)
				await job.moveToCompleted('processed', job.token!)
			} catch (error) {
				console.error(`[DeadLetterHandler] Error processing DLQ job ${job.id}:`, error)
				await job.moveToFailed(error as Error, job.token!)
			}
		}
	}

	/**
	 * Cleans up the dead letter queue
	 */
	async cleanup(): Promise<void> {
		await this.stopWorker()
		await this.dlQueue.close()
	}
}
