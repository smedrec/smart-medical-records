import { z } from '@hono/zod-openapi'

export const AssistantInsertSchema = z
	.object({
		telephone: z.string().min(9).openapi({
			description: 'The assistant telephone.',
			example: '+351962539448',
		}),
		dob: z.string().min(8).openapi({
			description: 'The assistant date of birth.',
			example: '1966-07-03',
		}),
		gender: z.enum(['MALE', 'FEMALE', 'OTHER']).openapi({
			description: 'The assistant gender.',
			example: 'MALE',
		}),
		user: z.string().openapi({
			description: 'The assistant user id.',
			example: '',
		}),
	})
	.openapi('AssistantInsert')

export const AssistantSelectSchema = z
	.object({
		id: z.string().openapi({
			description: 'The id of the assistant',
			example: 'jkashaj_jdasj',
		}),
		telephone: z.string().min(9).openapi({}),
		dob: z.string().min(8).openapi({}),
		gender: z.enum(['MALE', 'FEMALE', 'OTHER']).openapi({}),
		user: z.string().openapi({}),
		organization: z.string().openapi({}),
		createdBy: z.string().optional().openapi({}),
		updatedBy: z.string().optional().openapi({}),
		createdAt: z.string().optional().openapi({}),
		updatedAt: z.string().optional().openapi({}),
	})
	.openapi('AssistantSchema')

export const patchAssistantSchema = AssistantInsertSchema.partial()
