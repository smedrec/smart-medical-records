export interface LicenseInfo {
	licenseNumber: string
	jurisdiction: string
	practitionerName: string
	licenseType: string
	expiryDate?: Date
}

export interface VerificationResult {
	status: 'verified' | 'failed' | 'pending' | 'manual_review'
	details: {
		apiResponse?: any
		matchScore?: number
		discrepancies?: string[]
		provider?: string
		confidence?: number
	}
	timestamp: Date
}

export interface LicenseStatus {
	isValid: boolean
	isActive: boolean
	expiryDate?: Date
	practitionerName?: string
	licenseType?: string
	specialties?: string[]
	lastUpdated: Date
}

export interface VerificationHistory {
	id: string
	practitionerId: string
	attemptType: 'api' | 'ocr' | 'manual'
	status: 'verified' | 'failed' | 'pending' | 'manual_review'
	provider?: string
	details: Record<string, any>
	createdAt: Date
}

export interface APIProvider {
	name: string
	baseUrl: string
	apiKey?: string
	timeout: number
	retryAttempts: number
	supportedJurisdictions: string[]
}

export interface ManualVerificationRequest {
	id: string
	practitionerId: string
	licenseInfo: LicenseInfo
	reason: string
	priority: 'low' | 'medium' | 'high'
	createdAt: Date
	assignedTo?: string
	status: 'pending' | 'in_progress' | 'completed'
}

export interface RetryConfig {
	maxAttempts: number
	baseDelay: number
	maxDelay: number
	backoffMultiplier: number
}

export class LicenseVerificationError extends Error {
	constructor(
		message: string,
		public code: string,
		public provider?: string,
		public details?: Record<string, any>
	) {
		super(message)
		this.name = 'LicenseVerificationError'
	}
}
