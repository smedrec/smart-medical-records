import { adminClient, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { env } from 'cloudflare:workers'

export const authClient = createAuthClient({
	baseURL: env.BETTER_AUTH_URL,
	plugins: [organizationClient(), adminClient()],
})
