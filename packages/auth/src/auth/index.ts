import { betterAuth, unknown } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, apiKey, mcp, oidcProvider, openAPI, organization } from 'better-auth/plugins'
import Redis from 'ioredis'

import { Audit } from '@repo/audit'
import { AuthDb } from '@repo/auth-db'
import { SendMail } from '@repo/send-mail'

import { mastra } from '../utils/mastra.js'
import { getEnvConfig } from './environment.js'
import { getActiveOrganization } from './functions.js'
import { betterAuthOptions } from './options.js'
import {
	member,
	ac as orgAc,
	admin as orgAdmin,
	owner,
	patient,
	practitioner,
} from './permissions/organization.js'

import type { RedisOptions } from 'ioredis'
import type { MailerSendOptions } from '@repo/mailer'
import type { EnvConfig } from './environment.js'

class Auth {
	private auth: ReturnType<typeof betterAuth>
	/**
	 * Constructs an Better Auth instance
	 * @param config Optional. The environment variables. If not provided, it attempts to use
	 *                    the process.env environment variables.
	 * @throws Error if the config not provided and cannot be found in environment variables.
	 */
	constructor(config?: EnvConfig) {
		const effectiveConfig = config || getEnvConfig()

		if (!effectiveConfig) {
			throw new Error('Auth: Better auth environment variables not found.')
		}

		const defaultOptions: RedisOptions = { maxRetriesPerRequest: null }
		const redis = new Redis(effectiveConfig.BETTER_AUTH_REDIS_URL, {
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

		// Using environment variable AUTH_DB_URL
		const authDbService = new AuthDb(effectiveConfig.AUTH_DB_URL)
		const db = authDbService.getDrizzleInstance()

		//if (await authDbService.checkAuthDbConnection()) {
		console.info('🟢 Connected to Postgres for Better Auth service.')
		//} else {
		//	console.error('🔴 Postgres connection error for Better Auth service')
		//}

		const email = new SendMail('mail', effectiveConfig.MAIL_REDIS_URL!)

		const audit = new Audit('audit', effectiveConfig.AUDIT_REDIS_URL)

		this.auth = betterAuth({
			...betterAuthOptions,
			/**session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // Cache duration in seconds
        },
      },*/
			database: drizzleAdapter(db, { provider: 'pg' }),
			baseURL: effectiveConfig.BETTER_AUTH_URL,
			secret: effectiveConfig.BETTER_AUTH_SECRET,

			emailAndPassword: {
				enabled: true,
				minPasswordLength: 8,
				maxPasswordLength: 128,
				requireEmailVerification: true,
				sendResetPassword: async ({ user, url }) => {
					const org = await getActiveOrganization(user.id)
					// TODO - return a error to user
					if (!org) return
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
					await email.send({
						principalId: user.id,
						organizationId: org.organizationId,
						action: 'sendResetPassword',
						emailDetails,
					})
				},
			},
			emailVerification: {
				sendOnSignUp: true,
				autoSignInAfterVerification: true,
				sendVerificationEmail: async ({ user, url }) => {
					// TODO: redirect to APP
					const emailDetails: MailerSendOptions = {
						from: 'SMEDREC <no-reply@smedrec.com>',
						to: user.email,
						subject: 'Verify your email address',
						html: `
							<p>Hi ${user.name},</p>
							<p>Click the link below to verify your email address:</p>
							<p><a href="${url}">${url}</a></p>
						`,
					}
					await email.send({
						principalId: user.id,
						organizationId: '',
						action: 'sendVerificationEmail',
						emailDetails,
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
						const org = await getActiveOrganization(user.id)
						// TODO - return a error to user
						if (!org) return
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
						await email.send({
							principalId: user.id,
							organizationId: org.organizationId,
							action: 'sendChangeEmailVerification',
							emailDetails,
						})
					},
				},
				deleteUser: {
					enabled: true,
					sendDeleteAccountVerification: async ({ user, url }) => {
						const org = await getActiveOrganization(user.id)
						// TODO - return a error to user
						if (!org) return
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
						await email.send({
							principalId: user.id,
							organizationId: org.organizationId,
							action: 'sendDeleteAccountVerification',
							emailDetails,
						})
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
						/**after: async (session) => {
							const workflow = mastra.getWorkflow('newLoginWorkflow')
							const { runId } = await workflow.createRun()
							try {
								void workflow.start({
									runId: runId,
									inputData: {
										userId: session.userId,
										ipAddress: session.ipAddress || 'unknown',
										userAgent: session.userAgent || 'unknown',
									},
								})
							} catch (e) {
								console.log(e)
							}
						},*/
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
						after: async (user) => {
							//perform additional actions, like creating a fhir resource and send welcome email
							const workflow = mastra.getWorkflow('newUserWorkflow')
							const { runId } = await workflow.createRun()
							try {
								void workflow.start({
									runId: runId,
									inputData: { name: user.name, email: user.email },
								})
							} catch (e) {
								console.log(e)
							}
						},
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
						const inviteLink = `${effectiveConfig.APP_PUBLIC_URL}/auth/accept-invitation?invitationId=${data.id}`
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
						await email.send({
							principalId: data.inviter.user.id,
							organizationId: data.organization.id,
							action: 'sendInvitationEmail',
							emailDetails,
						})
					},
					organizationCreation: {
						disabled: false, // Set to true to disable organization creation
						afterCreate: async ({ organization, member, user }, request) => {
							// Run custom logic after organization is created
							// e.g., create default resources, send notifications
							const workflow = mastra.getWorkflow('newOrganizationWorkflow')
							const { runId } = await workflow.createRun()
							try {
								void workflow.start({
									runId: runId,
									inputData: {
										orgId: organization.id,
										orgName: organization.name,
										name: user.name,
										email: user.email,
									},
								})
							} catch (e) {
								console.log(e)
							}
						},
					},
					organizationLimit: 1,
				}),
				oidcProvider({
					allowDynamicClientRegistration: true,
					loginPage: `${effectiveConfig.APP_PUBLIC_URL}/auth/sign-in`,
					metadata: {
						issuer: `${effectiveConfig.APP_PUBLIC_URL}`,
						authorization_endpoint: '/auth/oauth2/authorize',
						token_endpoint: '/auth/oauth2/token',
						// ...other custom metadata
					},
				}),
				mcp({
					loginPage: `${effectiveConfig.APP_PUBLIC_URL}/auth/sign-in`,
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
				`${effectiveConfig.BETTER_AUTH_URL}/auth`,
				`${effectiveConfig.BETTER_AUTH_URL}`,
				'https://localhost:8801',
				'http://localhost:3000',
				'http://localhost:8787',
				'http://localhost:4111',
			],
		})
	}

	/**
	 * Provides access to the Auth instance for auth operations.
	 * @returns The auth instance typed with the ReturnType<typeof betterAuth> schema.
	 */
	public getAuthInstance(): ReturnType<typeof betterAuth> {
		return this.auth
	}
}

export { Auth }

export type Session = {
	id: string
	token: string
	userId: string
	expiresAt: Date
	createdAt: Date
	updatedAt: Date
	ipAddress?: string | null | undefined
	userAgent?: string | null | undefined
	activeOrganizationId?: string | null | undefined
	activeOrganizationRole?: string | null | undefined
	smartClientAccessToken?: string | null | undefined
}

export type User = {
	id: string
	name: string
	emailVerified: boolean
	email: string
	createdAt: Date
	updatedAt: Date
	image?: string | null | undefined
	role: 'user' | 'admin'
	banned: boolean
	banReason?: string | null | undefined
	banExpires?: Date | null
	lang: string
	personId?: string | null | undefined
}
