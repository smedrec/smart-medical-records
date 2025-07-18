/**
 * Circuit breaker pattern implementation for database connection failures
 */

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerConfig {
	failureThreshold: number
	recoveryTimeout: number
	monitoringPeriod: number
	minimumThroughput: number
}

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
	failureThreshold: 5, // Number of failures before opening circuit
	recoveryTimeout: 30000, // 30 seconds before attempting recovery
	monitoringPeriod: 60000, // 1 minute monitoring window
	minimumThroughput: 10, // Minimum requests before considering failure rate
}

export interface CircuitBreakerMetrics {
	totalRequests: number
	successfulRequests: number
	failedRequests: number
	failureRate: number
	lastFailureTime?: string
	lastSuccessTime?: string
	stateChanges: Array<{
		from: CircuitBreakerState
		to: CircuitBreakerState
		timestamp: string
		reason: string
	}>
}

export class CircuitBreaker {
	private state: CircuitBreakerState = 'CLOSED'
	private failureCount = 0
	private successCount = 0
	private lastFailureTime?: number
	private lastSuccessTime?: number
	private nextAttemptTime = 0
	private metrics: CircuitBreakerMetrics
	private stateChangeListeners: Array<
		(state: CircuitBreakerState, metrics: CircuitBreakerMetrics) => void
	> = []

	constructor(
		private config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG,
		private name: string = 'default'
	) {
		this.metrics = {
			totalRequests: 0,
			successfulRequests: 0,
			failedRequests: 0,
			failureRate: 0,
			stateChanges: [],
		}
	}

	/**
	 * Executes an operation through the circuit breaker
	 */
	async execute<T>(operation: () => Promise<T>): Promise<T> {
		if (this.state === 'OPEN') {
			if (Date.now() < this.nextAttemptTime) {
				throw new Error(
					`Circuit breaker '${this.name}' is OPEN. Next attempt allowed at ${new Date(this.nextAttemptTime).toISOString()}`
				)
			}
			// Transition to HALF_OPEN to test if service has recovered
			this.changeState('HALF_OPEN', 'Recovery timeout elapsed')
		}

		this.metrics.totalRequests++

		try {
			const result = await operation()
			this.onSuccess()
			return result
		} catch (error) {
			this.onFailure(error instanceof Error ? error : new Error(String(error)))
			throw error
		}
	}

	/**
	 * Handles successful operation
	 */
	private onSuccess(): void {
		this.successCount++
		this.metrics.successfulRequests++
		this.lastSuccessTime = Date.now()
		this.metrics.lastSuccessTime = new Date().toISOString()

		if (this.state === 'HALF_OPEN') {
			// Service has recovered, close the circuit
			this.changeState('CLOSED', 'Successful request in HALF_OPEN state')
			this.reset()
		} else if (this.state === 'CLOSED') {
			// Reset failure count on successful request
			this.failureCount = 0
		}

		this.updateMetrics()
	}

	/**
	 * Handles failed operation
	 */
	private onFailure(error: Error): void {
		this.failureCount++
		this.metrics.failedRequests++
		this.lastFailureTime = Date.now()
		this.metrics.lastFailureTime = new Date().toISOString()

		if (this.state === 'HALF_OPEN') {
			// Service still failing, open the circuit again
			this.changeState('OPEN', `Failure in HALF_OPEN state: ${error.message}`)
			this.nextAttemptTime = Date.now() + this.config.recoveryTimeout
		} else if (this.state === 'CLOSED') {
			// Check if we should open the circuit
			if (this.shouldOpenCircuit()) {
				this.changeState(
					'OPEN',
					`Failure threshold exceeded: ${this.failureCount}/${this.config.failureThreshold}`
				)
				this.nextAttemptTime = Date.now() + this.config.recoveryTimeout
			}
		}

		this.updateMetrics()
	}

	/**
	 * Determines if circuit should be opened based on failure threshold
	 */
	private shouldOpenCircuit(): boolean {
		const totalRequests = this.metrics.totalRequests

		// Need minimum throughput to make decision
		if (totalRequests < this.config.minimumThroughput) {
			return false
		}

		return this.failureCount >= this.config.failureThreshold
	}

	/**
	 * Changes circuit breaker state and notifies listeners
	 */
	private changeState(newState: CircuitBreakerState, reason: string): void {
		const oldState = this.state
		this.state = newState

		const stateChange = {
			from: oldState,
			to: newState,
			timestamp: new Date().toISOString(),
			reason,
		}

		this.metrics.stateChanges.push(stateChange)

		// Keep only last 100 state changes
		if (this.metrics.stateChanges.length > 100) {
			this.metrics.stateChanges = this.metrics.stateChanges.slice(-100)
		}

		// Notify listeners
		this.stateChangeListeners.forEach((listener) => {
			try {
				listener(newState, this.metrics)
			} catch (error) {
				console.error(`Circuit breaker '${this.name}' state change listener error:`, error)
			}
		})

		console.log(
			`Circuit breaker '${this.name}' state changed: ${oldState} -> ${newState} (${reason})`
		)
	}

	/**
	 * Resets circuit breaker counters
	 */
	private reset(): void {
		this.failureCount = 0
		this.successCount = 0
	}

	/**
	 * Updates failure rate metrics
	 */
	private updateMetrics(): void {
		const totalRequests = this.metrics.totalRequests
		this.metrics.failureRate = totalRequests > 0 ? this.metrics.failedRequests / totalRequests : 0
	}

	/**
	 * Gets current circuit breaker state
	 */
	getState(): CircuitBreakerState {
		return this.state
	}

	/**
	 * Gets current metrics
	 */
	getMetrics(): CircuitBreakerMetrics {
		return { ...this.metrics }
	}

	/**
	 * Adds a state change listener
	 */
	onStateChange(
		listener: (state: CircuitBreakerState, metrics: CircuitBreakerMetrics) => void
	): void {
		this.stateChangeListeners.push(listener)
	}

	/**
	 * Removes a state change listener
	 */
	removeStateChangeListener(
		listener: (state: CircuitBreakerState, metrics: CircuitBreakerMetrics) => void
	): void {
		const index = this.stateChangeListeners.indexOf(listener)
		if (index > -1) {
			this.stateChangeListeners.splice(index, 1)
		}
	}

	/**
	 * Manually opens the circuit (for testing or emergency situations)
	 */
	forceOpen(reason: string = 'Manually forced open'): void {
		this.changeState('OPEN', reason)
		this.nextAttemptTime = Date.now() + this.config.recoveryTimeout
	}

	/**
	 * Manually closes the circuit (for testing or recovery situations)
	 */
	forceClose(reason: string = 'Manually forced closed'): void {
		this.changeState('CLOSED', reason)
		this.reset()
	}

	/**
	 * Checks if circuit breaker is healthy (not open)
	 */
	isHealthy(): boolean {
		return this.state !== 'OPEN'
	}
}
