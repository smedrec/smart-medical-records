import 'dotenv/config'

import { getHeaders } from '@tanstack/react-start/server'

import { AppClient } from '@repo/app-client'

const headers = getHeaders()

const app = new AppClient({
	baseUrl: process.env.API_PUBLIC_URL || 'http://localhost:8801',
	retries: 3,
	backoffMs: 300,
	maxBackoffMs: 5000,
	headers: {
		'X-Development': 'true',
		...headers,
	},
})

export { app }
