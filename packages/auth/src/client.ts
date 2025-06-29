import {
	adminClient,
	apiKeyClient,
	oidcClient,
	organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { getEnv } from './auth/environment.js'

export const authClient = createAuthClient({
	baseURL: getEnv('BETTER_AUTH_URL')!,
	plugins: [organizationClient(), adminClient(), apiKeyClient(), oidcClient()],
})
