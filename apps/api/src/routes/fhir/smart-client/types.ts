import { z } from '@hono/zod-openapi'

export const SmartFhirClientInsertSchema = z
	.object({
		clientId: z.string().openapi({
			description: 'Smart fhir client id',
		}),
		clientSecret: z.string().optional().openapi({
			description: 'Smart fhir client secret (optional',
		}),
		scope: z.string().openapi({
			description: 'The scope.',
			example: 'System/*',
		}),
		iss: z.string().url().openapi({
			description: 'The iss.',
			example: 'https://',
		}),
		redirectUri: z.string().url().openapi({
			description: 'The redirectUri.',
			example: '',
		}),
		fhirBaseUrl: z.string().url().optional().openapi({
			description: 'The FHIR rest api endpoint.',
			example: '',
		}),
		privateKey: z.string().openapi({
			description: 'The private key',
			example: '',
		}),
		provider: z.enum(['demo', 'azure', 'aws', 'gcp']).openapi({}),
		environment: z.enum(['development', 'production']).openapi({}),
	})
	.openapi('SmartFhirClientInsertSchema')

export const AssistantSelectSchema = z
	.object({
		organizationId: z.string().openapi({
			description: 'The organization id',
		}),
		clientId: z.string().openapi({
			description: 'Smart fhir client id',
		}),
		scope: z.string().openapi({
			description: 'The scope.',
			example: 'System/*',
		}),
		iss: z.string().url().openapi({
			description: 'The iss.',
			example: 'https://',
		}),
		redirectUri: z.string().url().openapi({
			description: 'The redirectUri.',
			example: '',
		}),
		fhirBaseUrl: z.string().url().optional().openapi({
			description: 'The FHIR rest api endpoint.',
			example: '',
		}),
		provider: z.enum(['demo', 'azure', 'aws', 'gcp']).openapi({}),
		environment: z.enum(['development', 'production']).openapi({}),
		createdBy: z.string().optional().openapi({}),
		updatedBy: z.string().optional().openapi({}),
		createdAt: z.string().optional().openapi({}),
		updatedAt: z.string().optional().openapi({}),
	})
	.openapi('AssistantSchema')

export const SmartFhirClientPatchSchema = SmartFhirClientInsertSchema.partial()
