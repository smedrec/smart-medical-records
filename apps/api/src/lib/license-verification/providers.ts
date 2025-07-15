import {
	APIProvider,
	LicenseInfo,
	LicenseStatus,
	LicenseVerificationError,
	VerificationResult,
} from './types.js'

export class APIProviderManager {
	private providers: Map<string, APIProvider> = new Map()

	constructor() {
		this.initializeProviders()
	}

	private initializeProviders() {
		// NPDB (National Practitioner Data Bank) - US Federal
		this.providers.set('npdb', {
			name: 'npdb',
			baseUrl: 'https://api.npdb.hrsa.gov',
			timeout: 30000,
			retryAttempts: 3,
			supportedJurisdictions: ['US', 'US-*'], // US and all US states
		})

		// State Medical Board APIs (examples)
		this.providers.set('california', {
			name: 'california',
			baseUrl: 'https://api.mbc.ca.gov',
			timeout: 15000,
			retryAttempts: 2,
			supportedJurisdictions: ['US-CA'],
		})

		this.providers.set('texas', {
			name: 'texas',
			baseUrl: 'https://api.tmb.state.tx.us',
			timeout: 15000,
			retryAttempts: 2,
			supportedJurisdictions: ['US-TX'],
		})

		this.providers.set('florida', {
			name: 'florida',
			baseUrl: 'https://api.flboardofmedicine.gov',
			timeout: 15000,
			retryAttempts: 2,
			supportedJurisdictions: ['US-FL'],
		})

		// International providers (examples)
		this.providers.set('gmc_uk', {
			name: 'gmc_uk',
			baseUrl: 'https://api.gmc-uk.org',
			timeout: 20000,
			retryAttempts: 2,
			supportedJurisdictions: ['GB', 'UK'],
		})

		this.providers.set('cpso_ontario', {
			name: 'cpso_ontario',
			baseUrl: 'https://api.cpso.on.ca',
			timeout: 20000,
			retryAttempts: 2,
			supportedJurisdictions: ['CA-ON'],
		})
	}

	getProviderForJurisdiction(jurisdiction: string): APIProvider | null {
		// First try exact match
		for (const provider of this.providers.values()) {
			if (provider.supportedJurisdictions.includes(jurisdiction)) {
				return provider
			}
		}

		// Try wildcard match (e.g., US-* for US states)
		for (const provider of this.providers.values()) {
			for (const supported of provider.supportedJurisdictions) {
				if (supported.endsWith('*') && jurisdiction.startsWith(supported.slice(0, -1))) {
					return provider
				}
			}
		}

		return null
	}

	async verifyLicense(licenseInfo: LicenseInfo, providerName: string): Promise<VerificationResult> {
		const provider = this.providers.get(providerName)
		if (!provider) {
			throw new LicenseVerificationError(
				`Provider ${providerName} not found`,
				'PROVIDER_NOT_FOUND',
				providerName
			)
		}

		try {
			switch (providerName) {
				case 'npdb':
					return await this.verifyWithNPDB(licenseInfo, provider)
				case 'california':
					return await this.verifyWithCalifornia(licenseInfo, provider)
				case 'texas':
					return await this.verifyWithTexas(licenseInfo, provider)
				case 'florida':
					return await this.verifyWithFlorida(licenseInfo, provider)
				case 'gmc_uk':
					return await this.verifyWithGMC(licenseInfo, provider)
				case 'cpso_ontario':
					return await this.verifyWithCPSO(licenseInfo, provider)
				default:
					throw new LicenseVerificationError(
						`Verification method not implemented for provider: ${providerName}`,
						'METHOD_NOT_IMPLEMENTED',
						providerName
					)
			}
		} catch (error) {
			if (error instanceof LicenseVerificationError) {
				throw error
			}
			throw new LicenseVerificationError(
				`API call failed for provider ${providerName}`,
				'API_ERROR',
				providerName,
				{ originalError: error }
			)
		}
	}

	async getLicenseStatus(
		licenseNumber: string,
		jurisdiction: string,
		providerName: string
	): Promise<LicenseStatus | null> {
		const provider = this.providers.get(providerName)
		if (!provider) {
			return null
		}

		// Implementation would depend on specific provider APIs
		// For now, return a mock response
		return {
			isValid: true,
			isActive: true,
			expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
			practitionerName: 'Mock Practitioner',
			licenseType: 'Medical Doctor',
			specialties: ['Internal Medicine'],
			lastUpdated: new Date(),
		}
	}

	private async verifyWithNPDB(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation - in real scenario, this would make actual API calls
		const mockResponse = {
			status: 'active',
			practitioner: {
				name: licenseInfo.practitionerName,
				licenseNumber: licenseInfo.licenseNumber,
			},
			expiryDate: licenseInfo.expiryDate?.toISOString(),
		}

		const matchScore = this.calculateMatchScore(licenseInfo, mockResponse)

		return {
			status: matchScore > 0.8 ? 'verified' : 'manual_review',
			details: {
				apiResponse: mockResponse,
				matchScore,
				provider: provider.name,
				confidence: matchScore,
			},
			timestamp: new Date(),
		}
	}

	private async verifyWithCalifornia(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation for California Medical Board
		return this.createMockVerificationResult(licenseInfo, provider)
	}

	private async verifyWithTexas(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation for Texas Medical Board
		return this.createMockVerificationResult(licenseInfo, provider)
	}

	private async verifyWithFlorida(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation for Florida Board of Medicine
		return this.createMockVerificationResult(licenseInfo, provider)
	}

	private async verifyWithGMC(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation for UK General Medical Council
		return this.createMockVerificationResult(licenseInfo, provider)
	}

	private async verifyWithCPSO(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): Promise<VerificationResult> {
		// Mock implementation for College of Physicians and Surgeons of Ontario
		return this.createMockVerificationResult(licenseInfo, provider)
	}

	private createMockVerificationResult(
		licenseInfo: LicenseInfo,
		provider: APIProvider
	): VerificationResult {
		const mockResponse = {
			status: 'active',
			practitioner: {
				name: licenseInfo.practitionerName,
				licenseNumber: licenseInfo.licenseNumber,
			},
			expiryDate: licenseInfo.expiryDate?.toISOString(),
		}

		const matchScore = this.calculateMatchScore(licenseInfo, mockResponse)

		return {
			status: matchScore > 0.8 ? 'verified' : 'manual_review',
			details: {
				apiResponse: mockResponse,
				matchScore,
				provider: provider.name,
				confidence: matchScore,
			},
			timestamp: new Date(),
		}
	}

	private calculateMatchScore(licenseInfo: LicenseInfo, apiResponse: any): number {
		let score = 0
		let factors = 0

		// License number match
		if (apiResponse.practitioner?.licenseNumber === licenseInfo.licenseNumber) {
			score += 0.4
		}
		factors++

		// Name match (simple comparison - in real implementation, use fuzzy matching)
		if (
			apiResponse.practitioner?.name?.toLowerCase() === licenseInfo.practitionerName.toLowerCase()
		) {
			score += 0.4
		}
		factors++

		// Status check
		if (apiResponse.status === 'active') {
			score += 0.2
		}
		factors++

		return score
	}

	getAllProviders(): APIProvider[] {
		return Array.from(this.providers.values())
	}

	getSupportedJurisdictions(): string[] {
		const jurisdictions = new Set<string>()
		for (const provider of this.providers.values()) {
			provider.supportedJurisdictions.forEach((j) => jurisdictions.add(j))
		}
		return Array.from(jurisdictions)
	}
}
