import type { HTTPHeaderName } from '@tanstack/react-start/server'

type TransformedHeaders = Record<string, string> | undefined

function processHeaders(
	headers: Partial<Record<HTTPHeaderName, string | undefined>>
): TransformedHeaders {
	if (!headers) return undefined

	// Filters undefined values
	const filtered: Record<string, string> = {}
	for (const [key, value] of Object.entries(headers)) {
		if (value !== undefined) {
			filtered[key] = value
		}
	}
	return filtered
}

export { processHeaders }
