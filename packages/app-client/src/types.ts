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

export interface VersionResponse {
	version: string
}
