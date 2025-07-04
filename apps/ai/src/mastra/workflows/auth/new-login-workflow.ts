import { emailSendTool } from '@/mastra/tools/mail/email-tools'
import { createStep, createWorkflow } from '@mastra/core'
import z from 'zod'

import type { RuntimeContextSession } from '@/hono/types'
import type { ToolCallResult } from '@/mastra/tools/types'
import type { Audit } from '@repo/audit'

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
				const session = runtimeContext.get('session') as RuntimeContextSession
				const audit = runtimeContext.get('audit') as Audit
				if (!session.user) {
					return {
						success: false,
						message: `User with the id: ${userId} not found on session, something is wrong!`,
					}
				}
				await audit.log({
					principalId: userId,
					organizationId: session.activeOrganizationId,
					action: `userLogin`,
					status: 'success',
				})
				const result = (await emailSendTool.execute({
					context: {
						to: session.user.email,
						subject: 'Successful login from new device',
						html: `
							<p>Hello ${session.user?.name},</p>
							<p>We're verifying a recent login for <b>${session.user.email}</b></P>
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
