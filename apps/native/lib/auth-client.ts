import { expoClient } from '@better-auth/expo/client'
import {
	adminClient,
	apiKeyClient,
	oidcClient,
	organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import * as SecureStore from 'expo-secure-store'

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8801/auth',
	plugins: [
		expoClient({
			storagePrefix: 'smedrec-app',
			storage: SecureStore,
		}),
		organizationClient(),
		adminClient(),
		apiKeyClient(),
		oidcClient(),
	],
})
