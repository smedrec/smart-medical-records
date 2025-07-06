import { MastraClient } from '@mastra/client-js'
import { headers } from 'next/headers'

const nextHeaders = await headers()

const ai = new MastraClient({
	baseUrl: 'http://localhost:4111',
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: {
		...nextHeaders.entries,
	},
})

export { ai }
