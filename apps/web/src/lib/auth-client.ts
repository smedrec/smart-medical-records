import {
	adminClient,
	apiKeyClient,
	oidcClient,
	organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

//import { env } from 'cloudflare:workers'

export const authClient = createAuthClient({
	//baseURL: env.BETTER_AUTH_URL,
	baseURL: 'http://localhost:8801/auth',
	plugins: [organizationClient(), adminClient(), apiKeyClient(), oidcClient()],
})
