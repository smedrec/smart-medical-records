import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, apiKey, mcp, oidcProvider, openAPI, organization } from 'better-auth/plugins'
//import { eq } from 'drizzle-orm'
import { Redis } from 'ioredis'

import { Audit } from '@repo/audit'
import { AuthDb, user as userDb } from '@repo/auth-db'
import { NodeMailer } from '@repo/mailer'

import { getEnvConfig } from './environment.js'
import { getActiveOrganization } from './functions.js'
import { betterAuthOptions } from './options.js'
/**import {
	ac as appAc,
	admin as appAdmin,
	owner,
	patient,
	practitioner,
	user,
} from './permissions/admin'*/

import {
	member,
	ac as orgAc,
	admin as orgAdmin,
	owner,
	patient,
	practitioner,
} from './permissions/organization.js'

import type { RedisOptions } from 'ioredis'
import type { MailerSendOptions, NodeMailerSmtpOptions } from '@repo/mailer'

type Permissions = {
	[resourceType: string]: string[]
}

type SessionWithAditionalFields<T> = T & {
	activeOrganizationId: string | null
	activeOrganizationRole: string | null
	smartClientAccessToken: string | null
}

const config = getEnvConfig()

const defaultOptions: RedisOptions = { maxRetriesPerRequest: null }
const redis = new Redis(config.BETTER_AUTH_REDIS_URL, {
	...defaultOptions,
	// enableReadyCheck: false, // May be needed depending on Redis setup/version
})

redis.on('connect', () => {
	console.info('🟢 Connected to Redis for Better Auth service.')
})

redis.on('error', (err) => {
	console.error('🔴 Redis connection error for Better Auth service:', err)
	// Depending on the error, you might want to exit or implement a retry mechanism for the worker itself.
	// For now, this will prevent the worker from starting or stop it if the connection is lost later.
})

// Using environment variable AUDIT_DB_URL
const authDbService = new AuthDb(config.AUTH_DB_URL)
const db = authDbService.getDrizzleInstance()

if (await authDbService.checkAuthDbConnection()) {
	console.info('🟢 Connected to Postgres for Better Auth service.')
} else {
	console.error('🔴 Postgres connection error for Better Auth service')
}

const mailerConfig: NodeMailerSmtpOptions = {
	host: config.SMTP_HOST,
	port: config.SMTP_PORT,
	secure: config.SMTP_SECURE,
	auth: {
		user: config.SMTP_USER,
		pass: config.SMTP_PASSWORD,
	},
	// Other nodemailer options can be added here
}

const mailer = new NodeMailer(mailerConfig)

const audit = new Audit('audit', config.AUDIT_REDIS_URL)

/**
 * Better Auth Instance
 */
export const auth: ReturnType<typeof betterAuth> = betterAuth({
	...betterAuthOptions,
	/**session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},*/
	database: drizzleAdapter(db, { provider: 'pg' }),
	baseURL: config.BETTER_AUTH_URL,
	secret: config.BETTER_AUTH_SECRET,

	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			const emailDetails: MailerSendOptions = {
				from: 'no-reply@smedrec.com',
				to: user.email,
				subject: 'Reset your password',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to reset your password:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			}
			await mailer.send(emailDetails)
			/**await email.send({
				to: { name: user.name, email: user.email },
				subject: 'Reset your password',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to reset your password:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			})*/
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			// TO DO: redirect to APP
			const emailDetails: MailerSendOptions = {
				from: 'no-reply@smedrec.com',
				to: user.email,
				subject: 'Verify your email address',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to verify your email address:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			}
			await mailer.send(emailDetails)
			/**await email.send({
				to: { name: user.name, email: user.email },
				subject: 'Verify your email address',
				html: `
					<p>Hi ${user.name},</p>
					<p>Click the link below to verify your email address:</p>
					<p><a href="${url}">${url}</a></p>
				`,
			})*/
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
				const emailDetails: MailerSendOptions = {
					from: 'no-reply@smedrec.com',
					to: newEmail,
					subject: 'Verify your email change',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your email change:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this change, you can ignore this email.</p>
				`,
				}
				await mailer.send(emailDetails)
				/**await email.send({
					to: { name: user.name, email: newEmail },
					subject: 'Verify your email change',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your email change:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this change, you can ignore this email.</p>
					`,
				})*/
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				const emailDetails: MailerSendOptions = {
					from: 'no-reply@smedrec.com',
					to: user.email,
					subject: 'Verify your account deletion',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your account deletion:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this deletion, you can ignore this email.</p>
					`,
				}
				await mailer.send(emailDetails)
				/**await email.send({
					to: { name: user.name, email: user.email },
					subject: 'Verify your account deletion',
					html: `
						<p>Hi ${user.name},</p>
						<p>Click the link below to verify your account deletion:</p>
						<p><a href="${url}">${url}</a></p>
						<p>If you didn't request this deletion, you can ignore this email.</p>
					`,
				})*/
			},
		},
	},
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const activeOrganization = await getActiveOrganization(session.userId)
					//const smartClientAccessToken = await authorizeSmartClient(session.userId)
					if (!activeOrganization) {
						return {
							data: {
								...session,
								activeOrganizationId: null,
								activeOrganizationRole: null,
								smartClientAccessToken: null,
							},
						}
					}

					return {
						data: {
							...session,
							activeOrganizationId: activeOrganization.organizationId,
							activeOrganizationRole: activeOrganization.role,
							//smartClientAccessToken: smartClientAccessToken || null,
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
				// TODO -setupPersonResource as a Mastra Workflow
				/**after: async (user) => {
					//perform additional actions, like creating a stripe customer or send welcome email
					const id = await setupPersonResource(user.name, user.email)
					await db.update(userDb).set({ personId: id }).where(eq(userDb.id, user.id))
				},*/
			},
		},
	},
	secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(key)
			return value ? value : null
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, 'EX', ttl)
			else await redis.set(key, value)
		},
		delete: async (key) => {
			await redis.del(key)
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
			/**ac: appAc,
			roles: {
				admin: appAdmin,
				owner,
				user,
				patient,
				practitioner,
			},*/
		}),
		organization({
			ac: orgAc,
			roles: {
				owner,
				admin: orgAdmin,
				member,
				practitioner,
				patient,
			},
			teams: {
				enabled: true,
				maximumTeams: 10, // Optional: limit teams per organization
				allowRemovingAllTeams: false, // Optional: prevent removing the last team
			},
			async sendInvitationEmail(data) {
				const inviteLink = `${config.APP_PUBLIC_URL}/auth/accept-invitation?invitationId=${data.id}`
				const emailDetails: MailerSendOptions = {
					from: 'no-reply@smedrec.com',
					to: data.email,
					subject: `Invite to join to the ${data.organization.name} team!`,
					html: `
						<p>Hi,</p>
            <p>${data.inviter.user.name} sen you a invite to join the ${data.organization.name} team!
            <p>Click the link below to accept:</p>
            <p><a href="${inviteLink}">${inviteLink}</a></p>
            <p>If you have any doubt please send a email to: ${data.inviter.user.email}.</p>
					`,
				}
				await mailer.send(emailDetails)
				/**await email.send({
					to: { name: '', email: data.email },
					subject: 'Verify your account deletion',
					html: `
						<p>Hi,</p>
            <p>${data.inviter.user.name} sen you a invite to join the ${data.organization.name} team!
            <p>Click the link below to accept:</p>
            <p><a href="${inviteLink}">${inviteLink}</a></p>
            <p>If you have any doubt please send a email to: ${data.inviter.user.email}.</p>
					`,
				})*/
			},
			organizationCreation: {
				disabled: false, // Set to true to disable organization creation
				// TODO -setOrganizationResource as a Mastra Workflow
				/**beforeCreate: async ({ organization, user }, request) => {
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
				afterCreate: async ({ organization, member, user }, request) => {
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
		oidcProvider({
			allowDynamicClientRegistration: true,
			loginPage: `${config.APP_PUBLIC_URL}/auth/sign-in`,
			metadata: {
				issuer: `${config.APP_PUBLIC_URL}`,
				authorization_endpoint: '/auth/oauth2/authorize',
				token_endpoint: '/auth/oauth2/token',
				// ...other custom metadata
			},
		}),
		mcp({
			loginPage: `${config.APP_PUBLIC_URL}/auth/sign-in`,
		}),
		apiKey({
			rateLimit: {
				enabled: true,
				timeWindow: 1000 * 60 * 60 * 24, // 1 day
				maxRequests: 10, // 10 requests per day
			},
			enableMetadata: true,
			/**permissions: {
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
			},*/
		}),
		/**customSession(async ({ user, session }) => {
			let role = null
			const organizationId = await getActiveOrganization(session.userId)
			if (organizationId) {
				role = await getActiveMemberRole(session.userId, organizationId)
			}
			return {
				user: user,
				session: {
					...session,
					activeOrganizationId: organizationId,
					activeOrganizationRole: role,
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
		`${config.BETTER_AUTH_URL}/auth`,
		`${config.BETTER_AUTH_URL}`,
		'https://localhost:8801',
		'http://localhost:3000',
		'http://localhost:8787',
		'http://localhost:4111',
	],
})
//}

export type Session = SessionWithAditionalFields<typeof auth.$Infer.Session.session>
export type User = typeof auth.$Infer.Session.user

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
