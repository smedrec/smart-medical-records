import { MastraClient } from '@mastra/client-js'

export const aiClient = new MastraClient({
	baseUrl: 'http://localhost:4111',
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: {
		'X-Development': 'true',
	},
})
