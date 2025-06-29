/**
 * Error Handling Module
 *
 * This module provides custom error classes and error handling utilities
 * for the AUTH.
 */

/**
 * AUTH API Error class for handling errors from the FHIR API
 */
export class AUTHError extends Error {
	constructor(message: string, details?: unknown) {
		super(formatErrorMessage(message, 400, details))
	}
}

/**
 * Format an error message with status code and details
 */
function formatErrorMessage(message: string, statusCode?: number, details?: unknown): string {
	let formattedMessage = `🔴 ${message}`

	if (statusCode) {
		formattedMessage += ` (Status: ${statusCode})`
	}

	if (details) {
		try {
			const detailsStr = typeof details === 'string' ? details : JSON.stringify(details, null, 2)
			formattedMessage += `\nDetails: ${detailsStr}`
		} catch (error) {
			// Ignore JSON stringification errors
		}
	}

	return formattedMessage
}

/**
 * Safely parse JSON response from n8n API
 *
 * @param text Text to parse as JSON
 * @returns Parsed JSON object or null if parsing fails
 */
export function safeJsonParse(text: string): any {
	try {
		return JSON.parse(text)
	} catch (error) {
		return null
	}
}

/**
 * Extract a readable error message from an error object
 *
 * @param error Error object
 * @returns Readable error message
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message
	}

	if (typeof error === 'string') {
		return error
	}

	try {
		return JSON.stringify(error)
	} catch {
		return 'Unknown error'
	}
}
