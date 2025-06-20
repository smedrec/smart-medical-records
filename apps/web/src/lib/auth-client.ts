import { adminClient, apiKeyClient, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	baseURL: 'http://localhost:8801/auth',
	plugins: [organizationClient(), adminClient(), apiKeyClient()],
})
