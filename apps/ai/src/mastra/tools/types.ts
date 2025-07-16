import { z } from 'zod'

import type { Databases } from '@/db'
import type { AuditSDK } from '@repo/audit-sdk'
import type { Cerbos } from '@repo/cerbos'
import type { InfisicalKmsClient } from '@repo/infisical-kms'
import type { SendMail } from '@repo/send-mail'

// Tool call result for MCP tool responses
export interface ToolCallResult {
	content: Array<{
		type: string
		text: string
	}>
	isError?: boolean
}

export const IToolCallResult = z.object({
	content: z.array({
		type: z.enum(['text', 'json']),
		text: z.string(),
	}),
	isError: z.boolean().optional(),
})

export interface RuntimeServices {
	db: Databases
	audit: AuditSDK
	email: SendMail
	cerbos: Cerbos
	kms: InfisicalKmsClient
}
