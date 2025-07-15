import { APIProviderManager } from './providers.js'
import { VerificationQueue } from './queue.js'
import {
	LicenseInfo,
	LicenseStatus,
	LicenseVerificationError,
	RetryConfig,
	VerificationResult,
} from './types.js'

export class LicenseVerificationService {
	private providerManager: APIProviderManager
	private queue: VerificationQueue
	private retryConfig: RetryConfig

	constructor() {
		this.providerManager = new APIProviderManager()
		this.queue = new VerificationQueue()
		this.retryConfig = {
			maxAttempts: 3,
			baseDelay: 1000,
			maxDelay: 10000,
			backoffMultiplier: 2,
		}
	}

	async verifyLicense(licenseInfo: LicenseInfo): Promise<VerificationResult> {
		try {
			// First attempt: API verification
			const apiResult = await this.attemptAPIVerification(licenseInfo)
			if (apiResult.status === 'verified') {
				return apiResult
			}

			// If API fails, queue for manual review
			await this.queue.addManualReview({
				practitionerId: '', // Will be set by caller
				licenseInfo,
				reason: 'API verification failed',
				priority: 'medium',
			})

			return {
				status: 'manual_review',
				details: {
					provider: 'manual',
					confidence: 0,
				},
				timestamp: new Date(),
			}
		} catch (error) {
			throw new LicenseVerificationError(
				'License verification failed',
				'VERIFICATION_ERROR',
				undefined,
				{ originalError: error }
			)
		}
	}

	private async attemptAPIVerification(licenseInfo: LicenseInfo): Promise<VerificationResult> {
		const provider = this.providerManager.getProviderForJurisdiction(licenseInfo.jurisdiction)

		if (!provider) {
			// Return manual review result for unsupported jurisdictions instead of throwing
			return {
				status: 'manual_review',
				details: {
					provider: 'manual',
					confidence: 0,
					reason: `No provider available for jurisdiction: ${licenseInfo.jurisdiction}`,
				},
				timestamp: new Date(),
			}
		}

		return await this.verifyWithRetry(licenseInfo, provider.name)
	}

	private async verifyWithRetry(
		licenseInfo: LicenseInfo,
		providerName: string
	): Promise<VerificationResult> {
		let lastError: Error | null = null

		for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
			try {
				const result = await this.providerManager.verifyLicense(licenseInfo, providerName)
				return result
			} catch (error) {
				lastError = error as Error

				if (attempt < this.retryConfig.maxAttempts) {
					const delay = Math.min(
						this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
						this.retryConfig.maxDelay
					)
					await this.sleep(delay)
				}
			}
		}

		throw new LicenseVerificationError(
			`API verification failed after ${this.retryConfig.maxAttempts} attempts`,
			'API_RETRY_EXHAUSTED',
			providerName,
			{ lastError: lastError?.message }
		)
	}

	async getLicenseStatus(
		licenseNumber: string,
		jurisdiction: string
	): Promise<LicenseStatus | null> {
		try {
			const provider = this.providerManager.getProviderForJurisdiction(jurisdiction)
			if (!provider) {
				return null
			}

			return await this.providerManager.getLicenseStatus(licenseNumber, jurisdiction, provider.name)
		} catch (error) {
			throw new LicenseVerificationError(
				'Failed to get license status',
				'STATUS_ERROR',
				undefined,
				{ originalError: error }
			)
		}
	}

	async bulkVerify(licenses: LicenseInfo[]): Promise<VerificationResult[]> {
		const results: VerificationResult[] = []

		// Process in batches to avoid overwhelming APIs
		const batchSize = 5
		for (let i = 0; i < licenses.length; i += batchSize) {
			const batch = licenses.slice(i, i + batchSize)
			const batchPromises = batch.map((license) => this.verifyLicense(license))
			const batchResults = await Promise.allSettled(batchPromises)

			for (const result of batchResults) {
				if (result.status === 'fulfilled') {
					results.push(result.value)
				} else {
					results.push({
						status: 'failed',
						details: {
							provider: 'bulk_error',
						},
						timestamp: new Date(),
					})
				}
			}
		}

		return results
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}
