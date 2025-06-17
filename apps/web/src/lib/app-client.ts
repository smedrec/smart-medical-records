import { AppClient } from '@repo/app-client-workers'

export const appClient = new AppClient({
	baseUrl: 'http://localhost:8801',
	retries: 3, // Number of retry attempts
	backoffMs: 300, // Initial backoff time
	maxBackoffMs: 5000, // Maximum backoff time
})
