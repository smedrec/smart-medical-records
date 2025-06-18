import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, apiKey, openAPI, organization } from 'better-auth/plugins'
import { env } from 'cloudflare:workers'
import { eq } from 'drizzle-orm'

import { activeOrganization, db, organization as organizationDb, user as userDb } from '@repo/db'
import { email } from '@repo/mailer'

import {
	getActiveMemberRole,
	getActiveOrganization,
	setupOrganizationResource,
	setupPersonResource,
} from './functions'
import { betterAuthOptions } from './options'
import {
	ac as appAc,
	admin as appAdmin,
	owner,
	patient,
	practitioner,
	user,
} from './permissions/admin'

/**import {
	member,
	ac as orgAc,
	admin as orgAdmin,
	owner,
	practitioner,
} from './permissions/organization'*/

type Permissions = {
	[resourceType: string]: string[]
}

/**
 * Better Auth Instance
 */
//export const auth = async () => {
//	const db = await WorkerDb.getInstance()

//	return betterAuth({
export const auth = betterAuth({
	...betterAuthOptions,
	/**session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},*/
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,

	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await email.send({
				to: { name: user.name, email: user.email },
				subject: 'Reset your password',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to reset your password:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			})
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			// TO DO: redirect to APP
			await email.send({
				to: { name: user.name, email: user.email },
				subject: 'Verify your email address',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to verify your email address:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			})
		},
	},
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
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url }) => {
				await email.send({
					to: { name: user.name, email: newEmail },
					subject: 'Verify your email change',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your email change:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this change, you can ignore this email.</p>
					`,
				})
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				await email.send({
					to: { name: user.name, email: user.email },
					subject: 'Verify your account deletion',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your account deletion:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this deletion, you can ignore this email.</p>
					`,
				})
			},
		},
	},
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const organizationId = await getActiveOrganization(session.userId)
					return {
						data: {
							...session,
							activeOrganizationId: organizationId,
						},
					}
				},
			},
		},
		user: {
			create: {
				before: async (user, ctx) => {
					// Modify the user object before it is created
					/**  return {
              data: {
                ...user,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1],
              },
            };*/
				},
				after: async (user) => {
					//perform additional actions, like creating a stripe customer or send welcome email
					const id = await setupPersonResource(user.name, user.email)
					await db.update(userDb).set({ personId: id }).where(eq(userDb.id, user.id))
				},
			},
		},
	},
	secondaryStorage: {
		get: async (key) => {
			const value = await env.KV.get(key)
			return value ? value : null
		},
		set: async (key, value, ttl) => {
			if (ttl) await env.KV.put(key, value, { expirationTtl: ttl })
			else await env.KV.put(key, value)
		},
		delete: async (key) => {
			await env.KV.delete(key)
		},
	},
	rateLimit: {
		enabled: true,
		storage: 'secondary-storage',
	},
	// Additional options that depend on env ...
	plugins: [
		admin({
			defaultRole: 'user',
			ac: appAc,
			roles: {
				admin: appAdmin,
				owner,
				user,
				patient,
				practitioner,
			},
		}),
		organization({
			/**ac: orgAc,
			roles: {
				owner,
				admin: orgAdmin,
				member,
				practitioner,
			},*/
			teams: {
				enabled: true,
				maximumTeams: 10, // Optional: limit teams per organization
				allowRemovingAllTeams: false, // Optional: prevent removing the last team
			},
			async sendInvitationEmail(data) {
				const inviteLink = `${env.APP_PUBLIC_URL}/auth/accept-invitation?invitationId=${data.id}`
				await email.send({
					to: { name: data.email, email: data.email },
					subject: `Invite to join to the ${data.organization.name} team!`,
					html: `
            <p>Hi,</p>
            <p>${data.inviter.user.name} sen you a invite to join the ${data.organization.name} team!
            <p>Click the link below to accept:</p>
            <p><a href="${inviteLink}">${inviteLink}</a></p>
            <p>If you have any doubt please send a email to: ${data.inviter.user.email}.</p>
          `,
				})
			},
			organizationCreation: {
				disabled: false, // Set to true to disable organization creation
				beforeCreate: async ({ organization, user }, request) => {
					// Run custom logic before organization is created
					// Optionally modify the organization data
					const id = await setupOrganizationResource(organization.name, user.id)
					return {
						data: {
							...organization,
							metadata: {
								organizationId: id,
							},
						},
					}
				},
				/**afterCreate: async ({ organization, member, user }, request) => {
					// Run custom logic after organization is created
					// e.g., create default resources, send notifications
					const id = await setupOrganizationResource(organization.id, organization.name, user.id)
					await db
						.update(organizationDb)
						.set({ metadata: `{ "organizationId": ${id} }` })
						.where(eq(organizationDb.id, organization.id))
				},*/
			},
			organizationLimit: 1,
		}),
		apiKey({
			rateLimit: {
				enabled: true,
				timeWindow: 1000 * 60 * 60 * 24, // 1 day
				maxRequests: 10, // 10 requests per day
			},
			enableMetadata: true,
			permissions: {
				defaultPermissions: async (userId, ctx) => {
					let permissions: Permissions = {} // Initialize with empty object
					// Fetch user role or other data to determine permissions
					const organizationId = ctx.context.session?.session.activeOrganizationId
					const role = await getActiveMemberRole(userId, organizationId)

					if (role === 'owner' || role === 'admin')
						permissions = {
							patient: ['read', 'create', 'update', 'delete'],
							practitioner: ['read', 'create', 'update', 'delete', 'recreate'],
						}

					if (role === 'member')
						permissions = {
							patient: ['read'],
						}

					return permissions
				},
			},
		}),
		/**customSession(async ({ user, session }) => {
			const organizationId = await getActiveOrganization(session.userId)
			return {
				user: user,
				session: {
					...session,
					activeOrganizationId: organizationId,
				},
			}
		}),*/
		openAPI(),
	],
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	trustedOrigins: [
		`${env.BETTER_AUTH_URL}/auth`,
		`${env.BETTER_AUTH_URL}`,
		'https://localhost:8801',
		'http://localhost:3000',
		'http://localhost:8787',
		'http://localhost:4111',
	],
})
//}
export type Session = typeof auth.$Infer.Session

/**export type Session = {
	session: {
		ipAddress: string
		userAgent: string
		expiresAt: Date
		userId: string
		token: string
		createdAt: Date
		updatedAt: Date
		activeOrganizationId: string
	}
	user: {
		name: string
		email: string
		emailVerified: boolean
		image: null
		createdAt: Date
		updatedAt: Date
		role: string
		banned: boolean
		banReason: string
		banExpires: Date
		lang: string
		personId: string
		id: string
	}
}*/
