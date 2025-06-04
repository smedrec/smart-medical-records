import { z } from '@hono/zod-openapi'

export const TherapistInsertSchema = z
	.object({
		type: z.string().optional().openapi({
			description: 'The therapist type.',
			example: '...',
		}),
		title: z.string().optional().openapi({
			description: 'The therapist title.',
			example: '...',
		}),
		telephone: z.string().min(9).openapi({
			description: 'The therapist telephone.',
			example: '+351962539448',
		}),
		dob: z.string().min(8).openapi({
			description: 'The therapist date of bird.',
			example: '1966-07-03',
		}),
		gender: z.enum(['MALE', 'FEMALE']).openapi({
			description: 'The therapist gender.',
			example: 'MALE',
		}),
		user: z.string().openapi({
			description: 'The therapist user id.',
			example: '',
		}),
	})
	.openapi('TherapistInsert')

export const TherapistSelectSchema = z
	.object({
		id: z.string().openapi({
			description: 'The id of the therapist',
			example: 'jkashaj_jdasj',
		}),
		type: z.string().openapi({
			description: 'The therapist type.',
			example: '...',
		}),
		title: z.string().openapi({
			description: 'The therapist type.',
			example: '...',
		}),
		telephone: z.string().min(9).openapi({}),
		dob: z.string().min(3).openapi({}),
		gender: z.enum(['MALE', 'FEMALE']).openapi({}),
		user: z.string().openapi({}),
		organization: z.string().openapi({}),
		createdBy: z.string().optional().openapi({}),
		updatedBy: z.string().optional().openapi({}),
		createdAt: z.string().optional().openapi({}),
		updatedAt: z.string().optional().openapi({}),
	})
	.openapi('TherapistSchema')

export const patchTherapistSchema = TherapistInsertSchema.partial()
