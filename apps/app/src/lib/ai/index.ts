'use server'

import { MastraClient } from '@mastra/client-js'
import { headers } from 'next/headers'

const MASTRA_URL = process.env.MASTRA_PUBLIC_URL || 'http://localhost:4111'

const ai = async () => {
	const nextHeaders = await headers()
	return new MastraClient({
		baseUrl: MASTRA_URL,
		retries: 3,
		backoffMs: 300,
		maxBackoffMs: 5000,
		headers: {
			...nextHeaders.entries,
		},
	})
}

export { ai }
