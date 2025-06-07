import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin as adminPlugin, openAPI, organization } from 'better-auth/plugins'
import { env } from 'cloudflare:workers'

import { db } from '@repo/db'

import { emailService } from '../email'
import { getActiveOrganization } from './functions'
import { betterAuthOptions } from './options'
import { ac as appAc, admin as appAdmin, user } from './permissions/admin'
import {
	assistant,
	member,
	ac as orgAc,
	admin as orgAdmin,
	owner,
} from './permissions/organization'

/**
 * Better Auth Instance
 */
export const auth = betterAuth({
	...betterAuthOptions,
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,

	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 128,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await emailService.send({
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
			await emailService.send({
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
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, newEmail, url }) => {
				await emailService.send({
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
				await emailService.send({
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
		adminPlugin({
			defaultRole: 'user',
			ac: appAc,
			roles: {
				admin: appAdmin,
				user,
			},
		}),
		organization({
			ac: orgAc,
			roles: {
				owner,
				admin: orgAdmin,
				member,
				assistant,
			},
			teams: {
				enabled: true,
				maximumTeams: 10, // Optional: limit teams per organization
				allowRemovingAllTeams: false, // Optional: prevent removing the last team
			},
			async sendInvitationEmail(data) {
				const inviteLink = `${env.APP_PUBLIC_URL}/accept-invitation/${data.id}`
				await emailService.send({
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
		}),
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
	],
})

export type Session = typeof auth.$Infer.Session
