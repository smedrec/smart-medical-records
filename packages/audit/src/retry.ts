/**
 * Retry mechanism with exponential backoff for reliable event processing
 */

export interface RetryConfig {
	maxRetries: number
	backoffStrategy: 'exponential' | 'linear' | 'fixed'
	baseDelay: number
	maxDelay: number
	retryableErrors: string[]
	jitter?: boolean
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
	maxRetries: 5,
	backoffStrategy: 'exponential',
	baseDelay: 1000, // 1 second
	maxDelay: 30000, // 30 seconds
	retryableErrors: [
		'ECONNRESET',
		'ETIMEDOUT',
		'ENOTFOUND',
		'ECONNREFUSED',
		'EHOSTUNREACH',
		'ENETUNREACH',
		'EAI_AGAIN',
		'EPIPE',
		'ECONNABORTED',
	],
	jitter: true,
}

export interface RetryAttempt {
	attempt: number
	delay: number
	error: Error
	timestamp: string
}

export interface RetryResult<T> {
	success: boolean
	result?: T
	error?: Error
	attempts: RetryAttempt[]
	totalDuration: number
}

/**
 * Determines if an error is retryable based on configuration
 */
export function isRetryableError(error: Error, config: RetryConfig): boolean {
	const errorCode = (error as any).code
	const errorMessage = error.message.toLowerCase()

	// Check error codes
	if (errorCode && config.retryableErrors.includes(errorCode)) {
		return true
	}

	// Check error messages for common patterns
	const retryablePatterns = [
		'connection',
		'timeout',
		'network',
		'unavailable',
		'temporary',
		'retry',
	]

	return retryablePatterns.some((pattern) => errorMessage.includes(pattern))
}

/**
 * Calculates delay for next retry attempt
 */
export function calculateDelay(attempt: number, config: RetryConfig): number {
	let delay: number

	switch (config.backoffStrategy) {
		case 'exponential':
			delay = config.baseDelay * Math.pow(2, attempt - 1)
			break
		case 'linear':
			delay = config.baseDelay * attempt
			break
		case 'fixed':
		default:
			delay = config.baseDelay
			break
	}

	// Apply maximum delay limit
	delay = Math.min(delay, config.maxDelay)

	// Add jitter to prevent thundering herd
	if (config.jitter) {
		const jitterAmount = delay * 0.1 // 10% jitter
		delay += (Math.random() - 0.5) * 2 * jitterAmount
	}

	return Math.max(delay, 0)
}

/**
 * Executes an operation with retry logic
 */
export async function executeWithRetry<T>(
	operation: () => Promise<T>,
	config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<RetryResult<T>> {
	const attempts: RetryAttempt[] = []
	const startTime = Date.now()

	for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
		try {
			const result = await operation()
			return {
				success: true,
				result,
				attempts,
				totalDuration: Date.now() - startTime,
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error))
			const attemptInfo: RetryAttempt = {
				attempt,
				delay: 0,
				error: err,
				timestamp: new Date().toISOString(),
			}

			attempts.push(attemptInfo)

			// If this is the last attempt or error is not retryable, fail
			if (attempt > config.maxRetries || !isRetryableError(err, config)) {
				return {
					success: false,
					error: err,
					attempts,
					totalDuration: Date.now() - startTime,
				}
			}

			// Calculate and apply delay before next attempt
			const delay = calculateDelay(attempt, config)
			attemptInfo.delay = delay

			if (delay > 0) {
				await new Promise((resolve) => setTimeout(resolve, delay))
			}
		}
	}

	// This should never be reached, but TypeScript requires it
	return {
		success: false,
		error: new Error('Unexpected retry loop exit'),
		attempts,
		totalDuration: Date.now() - startTime,
	}
}

/**
 * Retry decorator for class methods
 */
export function withRetry(config: Partial<RetryConfig> = {}) {
	const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }

	return function <T extends (...args: any[]) => Promise<any>>(
		target: any,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<T>
	) {
		const originalMethod = descriptor.value!

		descriptor.value = async function (this: any, ...args: any[]) {
			const result = await executeWithRetry(() => originalMethod.apply(this, args), retryConfig)

			if (result.success) {
				return result.result
			} else {
				throw result.error
			}
		} as T

		return descriptor
	}
}
