import { z } from '@hono/zod-openapi'

export const ConfigMailInsertSchema = z
	.object({
		provider: z.enum(['smtp', 'resend', 'sendgrid']).openapi({
			description: 'Mail provider',
		}),
		host: z.string().optional().openapi({
			description: 'The smtp host.',
			example: 'smtp.example.com',
		}),
		port: z.number().optional().openapi({
			description: 'The smtp port.',
			example: 465,
		}),
		secure: z.boolean().optional().openapi({
			description: 'Secure.',
			example: true,
		}),
		user: z.string().optional().openapi({
			description: 'The smtp username.',
			example: 'user',
		}),
		password: z.string().optional().openapi({
			description: 'The smtp password.',
			example: 'password',
		}),
		apiKey: z.string().optional().openapi({
			description: 'The api key for resend or sendgrid password.',
			example: 'kjafhdoiuadmkkpom',
		}),
		fromName: z.string().optional().openapi({
			description: 'The name .',
			example: 'SMEDREC',
		}),
		fromEmail: z.string().email().optional().openapi({
			description: 'The email .',
			example: 'no-reply@example.com',
		}),
	})
	.openapi('ConfigMailInsertSchema')

export const ConfigMailSelectSchema = z
	.object({
		organizationId: z.string().openapi({}),
		provider: z.enum(['smtp', 'resend', 'sendgrid']).openapi({
			description: 'Mail provider',
		}),
		host: z.string().optional().openapi({
			description: 'The smtp host.',
			example: 'smtp.example.com',
		}),
		port: z.number().optional().openapi({
			description: 'The smtp port.',
			example: 465,
		}),
		secure: z.boolean().optional().openapi({
			description: 'Secure.',
			example: true,
		}),
		user: z.string().optional().openapi({
			description: 'The smtp username.',
			example: 'user',
		}),
		password: z.string().optional().openapi({
			description: 'The smtp password.',
			example: 'password',
		}),
		apiKey: z.string().optional().openapi({
			description: 'The api key for resend or sendgrid password.',
			example: 'kjafhdoiuadmkkpom',
		}),
		fromName: z.string().optional().openapi({
			description: 'The name .',
			example: 'SMEDREC',
		}),
		fromEmail: z.string().email().optional().openapi({
			description: 'The email .',
			example: 'no-reply@example.com',
		}),
	})
	.openapi('ConfigMailSelectSchema')

export const ConfigMailPatchSchema = ConfigMailInsertSchema.partial()
