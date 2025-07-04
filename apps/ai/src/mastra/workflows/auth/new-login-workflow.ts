import { emailSendTool } from '@/mastra/tools/mail/email-tools'
import { createStep, createWorkflow } from '@mastra/core'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { user } from '@repo/auth-db'

import type { Databases } from '@/db'
import type { ToolCallResult } from '@/mastra/tools/types'

const newLoginWorkflow = createWorkflow({
	id: 'new-login-workflow',
	description: 'Send a Sends new login detected email',
	inputSchema: z.object({
		userId: z.string().describe('The user id'),
		ipAddress: z.string().describe('The ip address'),
		userAgent: z.string().describe('The user agent'),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
})
	.then(
		createStep({
			id: 'send-new-login-email',
			description: 'Sends new login detected email',
			inputSchema: z.object({
				userId: z.string().describe('The user id'),
				ipAddress: z.string().describe('The ip address'),
				userAgent: z.string().describe('The user agent'),
			}),
			outputSchema: z.object({
				success: z.boolean(),
				message: z.string(),
			}),
			execute: async ({ inputData, runtimeContext }) => {
				const { userId, ipAddress, userAgent } = inputData

				const db = runtimeContext.get('db') as Databases
				const userResult = await db.auth.query.user.findFirst({
					columns: {
						name: true,
						email: true,
					},
					where: eq(user.id, userId),
				})
				if (!userResult) {
					return {
						success: false,
						message: `User with the id: ${userId} not found on database, something is wrong!`,
					}
				}
				const { name, email } = userResult
				const result = (await emailSendTool.execute({
					context: {
						to: email,
						subject: 'Successful login from new device',
						html: `
							<p><b>Hello ${name},</p>
							<p>We're verifying a recent login for ${email}</P>
              <p><b>IP Address:</b> ${ipAddress}</p>
              <p><b>User Agent:</b> ${userAgent}</p>
							<p>If you believe that this login is suspicious, please contact your administrator or reset your password immediately.</p>
							<p>All the best</p>
							<p>The team</p>
						`,
					},
					runtimeContext,
				})) as ToolCallResult
				return {
					success: !result.isError,
					message: result.content[0].text,
				}
			},
		})
	)
	.commit()

export { newLoginWorkflow }
