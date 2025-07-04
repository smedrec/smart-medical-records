import { MastraClient } from '@mastra/client-js'
import { getHeaders } from '@tanstack/react-start/server'

const headers = getHeaders()

const ai = new MastraClient({
	baseUrl: 'http://localhost:4111',
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: {
		'X-Development': 'true',
		...headers,
	},
})

export { ai }
