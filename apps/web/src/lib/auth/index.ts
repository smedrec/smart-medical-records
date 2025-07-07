import 'dotenv/config'

//import { getConfigInstance } from '@/lib/config'
import {
	adminClient,
	apiKeyClient,
	oidcClient,
	organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

//const config = getConfigInstance()

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8801/auth',
	plugins: [organizationClient(), adminClient(), apiKeyClient(), oidcClient()],
})
