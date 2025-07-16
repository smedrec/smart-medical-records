/**
 * Health check service for audit system components
 * Provides comprehensive health monitoring for all audit system components
 */

// Types are defined locally to avoid circular dependencies

/**
 * Audit metrics interface
 */
export interface AuditMetrics {
	eventsProcessed: number
	processingLatency: number
	queueDepth: number
	errorRate: number
	integrityViolations: number
	timestamp: string
	alertsGenerated: number
	suspiciousPatterns: number
}

/**
 * Health status interface
 */
export interface HealthStatus {
	status: 'OK' | 'WARNING' | 'CRITICAL'
	components: {
		[key: string]: ComponentHealth
	}
	timestamp: string
}

/**
 * Component health check interface
 */
export interface ComponentHealthCheck {
	name: string
	check(): Promise<ComponentHealth>
}

/**
 * Individual component health status
 */
export interface ComponentHealth {
	status: 'OK' | 'WARNING' | 'CRITICAL'
	message?: string
	details?: Record<string, any>
	responseTime?: number
	lastCheck: string
}

/**
 * Health check configuration
 */
export interface HealthCheckConfig {
	timeout: number // milliseconds
	retryAttempts: number
	retryDelay: number // milliseconds
	warningThresholds: {
		responseTime: number // milliseconds
		errorRate: number // percentage (0-1)
		queueDepth: number
	}
	criticalThresholds: {
		responseTime: number // milliseconds
		errorRate: number // percentage (0-1)
		queueDepth: number
	}
}

/**
 * Default health check configuration
 */
export const DEFAULT_HEALTH_CONFIG: HealthCheckConfig = {
	timeout: 5000, // 5 seconds
	retryAttempts: 3,
	retryDelay: 1000, // 1 second
	warningThresholds: {
		responseTime: 2000, // 2 seconds
		errorRate: 0.05, // 5%
		queueDepth: 100,
	},
	criticalThresholds: {
		responseTime: 5000, // 5 seconds
		errorRate: 0.1, // 10%
		queueDepth: 500,
	},
}

/**
 * Database health check
 */
export class DatabaseHealthCheck implements ComponentHealthCheck {
	name = 'database'

	constructor(private checkConnection: () => Promise<boolean>) {}

	async check(): Promise<ComponentHealth> {
		const startTime = Date.now()

		try {
			const isConnected = await this.checkConnection()
			const responseTime = Date.now() - startTime

			if (!isConnected) {
				return {
					status: 'CRITICAL',
					message: 'Database connection failed',
					responseTime,
					lastCheck: new Date().toISOString(),
				}
			}

			const status =
				responseTime > DEFAULT_HEALTH_CONFIG.criticalThresholds.responseTime
					? 'CRITICAL'
					: responseTime > DEFAULT_HEALTH_CONFIG.warningThresholds.responseTime
						? 'WARNING'
						: 'OK'

			return {
				status,
				message: `Database connection ${status.toLowerCase()}`,
				responseTime,
				details: {
					connected: true,
				},
				lastCheck: new Date().toISOString(),
			}
		} catch (error) {
			return {
				status: 'CRITICAL',
				message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				responseTime: Date.now() - startTime,
				details: {
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				lastCheck: new Date().toISOString(),
			}
		}
	}
}

/**
 * Redis health check
 */
export class RedisHealthCheck implements ComponentHealthCheck {
	name = 'redis'

	constructor(private getConnectionStatus: () => string) {}

	async check(): Promise<ComponentHealth> {
		const startTime = Date.now()

		try {
			const connectionStatus = this.getConnectionStatus()
			const responseTime = Date.now() - startTime

			const isHealthy = connectionStatus === 'ready'
			const status = isHealthy ? 'OK' : 'CRITICAL'

			return {
				status,
				message: `Redis connection ${connectionStatus}`,
				responseTime,
				details: {
					connectionStatus,
				},
				lastCheck: new Date().toISOString(),
			}
		} catch (error) {
			return {
				status: 'CRITICAL',
				message: `Redis health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				responseTime: Date.now() - startTime,
				details: {
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				lastCheck: new Date().toISOString(),
			}
		}
	}
}

/**
 * Queue health check
 */
export class QueueHealthCheck implements ComponentHealthCheck {
	name = 'queue'

	constructor(
		private getQueueDepth: () => Promise<number>,
		private getProcessingRate: () => Promise<number>
	) {}

	async check(): Promise<ComponentHealth> {
		const startTime = Date.now()

		try {
			const [queueDepth, processingRate] = await Promise.all([
				this.getQueueDepth(),
				this.getProcessingRate(),
			])

			const responseTime = Date.now() - startTime

			let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'
			let message = 'Queue processing normally'

			if (queueDepth >= DEFAULT_HEALTH_CONFIG.criticalThresholds.queueDepth) {
				status = 'CRITICAL'
				message = `Queue depth critically high: ${queueDepth}`
			} else if (queueDepth >= DEFAULT_HEALTH_CONFIG.warningThresholds.queueDepth) {
				status = 'WARNING'
				message = `Queue depth elevated: ${queueDepth}`
			}

			return {
				status,
				message,
				responseTime,
				details: {
					queueDepth,
					processingRate,
				},
				lastCheck: new Date().toISOString(),
			}
		} catch (error) {
			return {
				status: 'CRITICAL',
				message: `Queue health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				responseTime: Date.now() - startTime,
				details: {
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				lastCheck: new Date().toISOString(),
			}
		}
	}
}

/**
 * Processing health check
 */
export class ProcessingHealthCheck implements ComponentHealthCheck {
	name = 'processing'

	constructor(private getMetrics: () => Promise<AuditMetrics>) {}

	async check(): Promise<ComponentHealth> {
		const startTime = Date.now()

		try {
			const metrics = await this.getMetrics()
			const responseTime = Date.now() - startTime

			let status: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'
			let message = 'Processing healthy'

			// Check error rate
			if (metrics.errorRate >= DEFAULT_HEALTH_CONFIG.criticalThresholds.errorRate) {
				status = 'CRITICAL'
				message = `Critical error rate: ${(metrics.errorRate * 100).toFixed(2)}%`
			} else if (metrics.errorRate >= DEFAULT_HEALTH_CONFIG.warningThresholds.errorRate) {
				status = 'WARNING'
				message = `Elevated error rate: ${(metrics.errorRate * 100).toFixed(2)}%`
			}

			// Check processing latency
			if (metrics.processingLatency >= DEFAULT_HEALTH_CONFIG.criticalThresholds.responseTime) {
				status = 'CRITICAL'
				message = `Critical processing latency: ${metrics.processingLatency}ms`
			} else if (
				metrics.processingLatency >= DEFAULT_HEALTH_CONFIG.warningThresholds.responseTime
			) {
				if (status === 'OK') {
					status = 'WARNING'
					message = `Elevated processing latency: ${metrics.processingLatency}ms`
				}
			}

			return {
				status,
				message,
				responseTime,
				details: {
					eventsProcessed: metrics.eventsProcessed,
					processingLatency: metrics.processingLatency,
					errorRate: metrics.errorRate,
					integrityViolations: metrics.integrityViolations,
				},
				lastCheck: new Date().toISOString(),
			}
		} catch (error) {
			return {
				status: 'CRITICAL',
				message: `Processing health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				responseTime: Date.now() - startTime,
				details: {
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				lastCheck: new Date().toISOString(),
			}
		}
	}
}

/**
 * Circuit breaker health check
 */
export class CircuitBreakerHealthCheck implements ComponentHealthCheck {
	name = 'circuitBreaker'

	constructor(private getCircuitBreakerState: () => Promise<string>) {}

	async check(): Promise<ComponentHealth> {
		const startTime = Date.now()

		try {
			const state = await this.getCircuitBreakerState()
			const responseTime = Date.now() - startTime

			let status: 'OK' | 'WARNING' | 'CRITICAL'
			let message: string

			switch (state) {
				case 'CLOSED':
					status = 'OK'
					message = 'Circuit breaker closed (normal operation)'
					break
				case 'HALF_OPEN':
					status = 'WARNING'
					message = 'Circuit breaker half-open (testing recovery)'
					break
				case 'OPEN':
					status = 'CRITICAL'
					message = 'Circuit breaker open (blocking requests)'
					break
				default:
					status = 'WARNING'
					message = `Circuit breaker in unknown state: ${state}`
			}

			return {
				status,
				message,
				responseTime,
				details: {
					state,
				},
				lastCheck: new Date().toISOString(),
			}
		} catch (error) {
			return {
				status: 'CRITICAL',
				message: `Circuit breaker health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
				responseTime: Date.now() - startTime,
				details: {
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				lastCheck: new Date().toISOString(),
			}
		}
	}
}

/**
 * Comprehensive health check service
 */
export class HealthCheckService {
	private healthChecks: ComponentHealthCheck[] = []
	private config: HealthCheckConfig

	constructor(config: HealthCheckConfig = DEFAULT_HEALTH_CONFIG) {
		this.config = config
	}

	/**
	 * Register a health check component
	 */
	registerHealthCheck(healthCheck: ComponentHealthCheck): void {
		this.healthChecks.push(healthCheck)
	}

	/**
	 * Remove a health check component
	 */
	unregisterHealthCheck(name: string): void {
		this.healthChecks = this.healthChecks.filter((hc) => hc.name !== name)
	}

	/**
	 * Perform health check on a specific component
	 */
	async checkComponent(name: string): Promise<ComponentHealth | null> {
		const healthCheck = this.healthChecks.find((hc) => hc.name === name)
		if (!healthCheck) {
			return null
		}

		return this.performHealthCheckWithRetry(healthCheck)
	}

	/**
	 * Perform health check on all components
	 */
	async checkAllComponents(): Promise<HealthStatus> {
		const componentResults: { [key: string]: ComponentHealth } = {}

		// Run all health checks in parallel
		const healthCheckPromises = this.healthChecks.map(async (healthCheck) => {
			const result = await this.performHealthCheckWithRetry(healthCheck)
			componentResults[healthCheck.name] = result
		})

		await Promise.all(healthCheckPromises)

		// Determine overall status
		const componentStatuses = Object.values(componentResults).map((c) => c.status)
		let overallStatus: 'OK' | 'WARNING' | 'CRITICAL' = 'OK'

		if (componentStatuses.includes('CRITICAL')) {
			overallStatus = 'CRITICAL'
		} else if (componentStatuses.includes('WARNING')) {
			overallStatus = 'WARNING'
		}

		return {
			status: overallStatus,
			components: componentResults,
			timestamp: new Date().toISOString(),
		}
	}

	/**
	 * Perform health check with retry logic
	 */
	private async performHealthCheckWithRetry(
		healthCheck: ComponentHealthCheck
	): Promise<ComponentHealth> {
		let lastError: Error | null = null

		for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
			try {
				// Set timeout for health check
				const timeoutPromise = new Promise<ComponentHealth>((_, reject) => {
					setTimeout(() => reject(new Error('Health check timeout')), this.config.timeout)
				})

				const healthCheckPromise = healthCheck.check()
				const result = await Promise.race([healthCheckPromise, timeoutPromise])

				// If we get a result, return it
				return result
			} catch (error) {
				lastError = error instanceof Error ? error : new Error('Unknown error')

				// If this is the last attempt, don't wait
				if (attempt < this.config.retryAttempts) {
					await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay))
				}
			}
		}

		// All attempts failed
		return {
			status: 'CRITICAL',
			message: `Health check failed after ${this.config.retryAttempts} attempts: ${lastError?.message || 'Unknown error'}`,
			details: {
				error: lastError?.message || 'Unknown error',
				attempts: this.config.retryAttempts,
			},
			lastCheck: new Date().toISOString(),
		}
	}

	/**
	 * Get health check configuration
	 */
	getConfig(): HealthCheckConfig {
		return { ...this.config }
	}

	/**
	 * Update health check configuration
	 */
	updateConfig(config: Partial<HealthCheckConfig>): void {
		this.config = { ...this.config, ...config }
	}
}
