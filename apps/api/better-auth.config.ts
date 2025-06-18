/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, apiKey, customSession, openAPI, organization } from 'better-auth/plugins'
import { drizzle } from 'drizzle-orm/d1'

import type { Env } from './src/lib/hono/context'

const db = (env: Env) => drizzle(env.DB)

export const auth: ReturnType<typeof betterAuth> = betterAuth({
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	// Additional options that depend on env ...
	user: {
		additionalFields: {
			lang: {
				type: 'string',
				required: false,
				defaultValue: 'en',
			},
			personId: {
				type: 'string',
				required: false,
			},
		},
	},
	plugins: [
		admin({
			defaultRole: 'user',
		}),
		organization({
			teams: {
				enabled: true,
				maximumTeams: 10, // Optional: limit teams per organization
				allowRemovingAllTeams: false, // Optional: prevent removing the last team
			},
		}),
		apiKey({
			rateLimit: {
				enabled: true,
				timeWindow: 1000 * 60 * 60 * 24, // 1 day
				maxRequests: 10, // 10 requests per day
			},
			enableMetadata: true,
		}),
		customSession(async ({ user, session }) => {
			let role: string | null = null
			const organizationId: string | null = 'string'
			if (organizationId) {
				role = 'string'
			}
			return {
				user: user,
				session: {
					...session,
					activeOrganizationId: organizationId,
					activeOrganizationRole: role,
				},
			}
		}),
		openAPI(),
	],
	account: {
		accountLinking: {
			enabled: true,
		},
	},
})
