import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type {
	documentVerificationStatusEnum,
	licenseCertificate,
	ocrStatusEnum,
	practitioner,
	user,
	userRoleEnum,
	verificationAttempt,
	verificationAttemptTypeEnum,
	verificationStatusEnum,
} from './schema.js'

// Base types from schema
export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>

export type Practitioner = InferSelectModel<typeof practitioner>
export type NewPractitioner = InferInsertModel<typeof practitioner>

export type LicenseCertificate = InferSelectModel<typeof licenseCertificate>
export type NewLicenseCertificate = InferInsertModel<typeof licenseCertificate>

export type VerificationAttempt = InferSelectModel<typeof verificationAttempt>
export type NewVerificationAttempt = InferInsertModel<typeof verificationAttempt>

// Enum types
export type VerificationStatus = (typeof verificationStatusEnum.enumValues)[number]
export type OCRStatus = (typeof ocrStatusEnum.enumValues)[number]
export type DocumentVerificationStatus = (typeof documentVerificationStatusEnum.enumValues)[number]
export type VerificationAttemptType = (typeof verificationAttemptTypeEnum.enumValues)[number]
export type UserRole = (typeof userRoleEnum.enumValues)[number]

// Extended user type that includes practitioner information
export interface UserWithPractitioner extends User {
	practitioner?: Practitioner | null
}

// Practitioner with related data
export interface PractitionerWithCertificates extends Practitioner {
	certificates: LicenseCertificate[]
	verificationAttempts: VerificationAttempt[]
	verifiedByUser?: User | null
}

// License information for verification
export interface LicenseInfo {
	licenseNumber: string
	jurisdiction: string
	practitionerName: string
	licenseType: string
	expiryDate?: Date
}

// Verification result from external APIs
export interface VerificationResult {
	status: VerificationStatus
	details: {
		apiResponse?: any
		matchScore?: number
		discrepancies?: string[]
	}
	timestamp: Date
}

// OCR processing result
export interface OCRResult {
	success: boolean
	extractedText: string
	confidence: number
	processingTime: number
	error?: string
}

// Extracted license data from OCR
export interface ExtractedLicenseData {
	licenseNumber?: string
	practitionerName?: string
	expiryDate?: Date
	issuingAuthority?: string
	confidence: {
		licenseNumber: number
		name: number
		date: number
	}
}

// Validation result for OCR vs input data
export interface ValidationResult {
	isValid: boolean
	matchScore: number
	discrepancies: string[]
	confidence: number
}

// Processing status for async operations
export interface ProcessingStatus {
	jobId: string
	status: 'pending' | 'processing' | 'completed' | 'failed'
	progress?: number
	error?: string
	result?: any
}

// License status from external APIs
export interface LicenseStatus {
	isValid: boolean
	isActive: boolean
	expiryDate?: Date
	practitionerName?: string
	specialties?: string[]
	lastUpdated: Date
}

// Verification history entry
export interface VerificationHistory {
	id: string
	attemptType: VerificationAttemptType
	status: VerificationStatus
	timestamp: Date
	details: Record<string, any>
	reviewedBy?: string
}

// Better Auth integration types
export interface BetterAuthUser extends User {
	// Additional fields that Better Auth might expect
	emailVerified: boolean
}

// Extended session data for practitioners
export interface PractitionerSession {
	userId: string
	email: string
	name: string
	role: UserRole
	organizationId?: string
	practitioner?: {
		id: string
		licenseNumber: string
		jurisdiction: string
		verificationStatus: VerificationStatus
		specialties: string[]
		credentials: string[]
	} | null
}

// Onboarding workflow status
export interface OnboardingStatus {
	userId: string
	currentStep: 'license_info' | 'certificate_upload' | 'verification' | 'approval' | 'completed'
	licenseInfoCompleted: boolean
	certificateUploaded: boolean
	verificationStatus: VerificationStatus
	approvalStatus: 'pending' | 'approved' | 'rejected'
	completedAt?: Date
}

// Admin dashboard data types
export interface PendingApproval {
	practitioner: PractitionerWithCertificates
	user: User
	submittedAt: Date
	verificationResults: VerificationAttempt[]
}

export interface ComplianceReport {
	reportId: string
	generatedAt: Date
	dateRange: {
		start: Date
		end: Date
	}
	summary: {
		totalPractitioners: number
		verifiedPractitioners: number
		pendingVerifications: number
		failedVerifications: number
		expiredLicenses: number
	}
	details: {
		practitioners: Array<{
			id: string
			name: string
			licenseNumber: string
			jurisdiction: string
			verificationStatus: VerificationStatus
			lastVerified?: Date
			expiryDate?: Date
		}>
	}
}

// Error types for practitioner management
export class PractitionerManagementError extends Error {
	constructor(
		public code: string,
		message: string,
		public statusCode: number = 500,
		public details?: Record<string, any>
	) {
		super(message)
		this.name = 'PractitionerManagementError'
	}
}

// Common error codes
export const ERROR_CODES = {
	INVALID_LICENSE_FORMAT: 'INVALID_LICENSE_FORMAT',
	LICENSE_VERIFICATION_FAILED: 'LICENSE_VERIFICATION_FAILED',
	OCR_PROCESSING_FAILED: 'OCR_PROCESSING_FAILED',
	CERTIFICATE_UPLOAD_FAILED: 'CERTIFICATE_UPLOAD_FAILED',
	UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
	PRACTITIONER_NOT_FOUND: 'PRACTITIONER_NOT_FOUND',
	VERIFICATION_API_UNAVAILABLE: 'VERIFICATION_API_UNAVAILABLE',
	INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
	FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
