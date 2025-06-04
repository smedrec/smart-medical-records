export interface ClientOptions {
	/** Base URL for API requests */
	baseUrl: string
	/** Number of retry attempts for failed requests */
	retries?: number
	/** Initial backoff time in milliseconds between retries */
	backoffMs?: number
	/** Maximum backoff time in milliseconds between retries */
	maxBackoffMs?: number
	/** Custom headers to include with requests */
	headers?: Record<string, string>
	/** Abort signal for request */
}

export interface RequestOptions {
	method?: string
	headers?: Record<string, string>
	body?: any
	credentials?: string
	stream?: boolean
	signal?: AbortSignal
}

export interface Assistant {
	id: string
	telephone: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	user: string
	organization: string
	createdBy: string
	updatedBy: string
	createdAt: string
	updatedAt: string
}

export interface Therapist {
	id: string
	type: string | null
	title: string | null
	telephone: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	disabled: boolean
	user: string
	organization: string
	createdBy: string
	updatedBy: string
	createdAt: string
	updatedAt: string
}

export interface Patient {
	id: string
	name: string
	telephone: string
	email: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	city: string
	address: string
	note: string | null
	discrete: boolean
	organization: string
	createdBy: string
	updatedBy: string
	createdAt: string
	updatedAt: string
}

interface User {
	id: string
	name: string
	email: string
	emailVerified: boolean
	image: string | null
	createdAt: string
	updatedAt: string
	role: 'user' | 'admin'
	banned: boolean | null
	banReason: string | null
	banExpires: string | null
}

export interface PatientToTherapist {
	patient: string
	therapist: string
	disabled: boolean
	createdBy: string
	updatedBy: string
	createdAt: string
	updatedAt: string
}

interface Pagination {
	current: number
	pageSize: number
	totalPages: number
	count: number
}

export interface PaginationParams {
	limit?: number
	page?: number
}

export interface DeleteObjectResponse {
	message: string
	success: boolean
}

export interface GetAllAssistantResponse {
	result: Array<{
		assistant: Assistant
		user: User
	}>
	pagination: Pagination
}

export interface FindOneAssistantResponse {
	assistant: Assistant
	user: User
}

export interface CreateAssistantParams {
	telephone: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	user: string
}

export interface UpdateAssistantParams {
	telephone?: string
	dob?: string
	gender?: 'MALE' | 'FEMALE' | 'OTHER'
	user?: string
}

export interface GetAllTherapistResponse {
	result: Array<{
		assistant: Therapist
		user: User
	}>
	pagination: Pagination
}

export interface FindOneTherapistResponse {
	assistant: Therapist
	user: User
}

export interface CreateTherapistParams {
	type?: string
	title?: string
	telephone: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	user: string
}

export interface UpdateTherapistParams {
	type?: string
	title?: string
	telephone?: string
	dob?: string
	gender?: 'MALE' | 'FEMALE' | 'OTHER'
	user?: string
}

export interface GetAllPatientResponse {
	result: Patient[]
	pagination: Pagination
}

export interface CreatePatientParams {
	name: string
	telephone: string
	email: string
	dob: string
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	city: string
	address: string
	note?: string
}

export interface UpdatePatientParams {
	name?: string
	telephone?: string
	email?: string
	dob?: string
	gender?: 'MALE' | 'FEMALE' | 'OTHER'
	city?: string
	address?: string
	note?: string
}

export interface PatientToTherapistParams {
	patientId: string
	therapistId: string
}
