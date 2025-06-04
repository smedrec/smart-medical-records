import { z } from '@hono/zod-openapi'

export const PatientInsertSchema = z
	.object({
		name: z.string().min(9).openapi({
			description: 'The patient telephone.',
			example: 'John Homes',
		}),
		telephone: z.string().min(9).openapi({
			description: 'The patient telephone.',
			example: '+351962539448',
		}),
		email: z.string().email().openapi({
			description: 'The patient email.',
			example: 'john@example.com',
		}),
		dob: z.string().min(8).openapi({
			description: 'The patient date of bird.',
			example: '1966-07-03',
		}),
		gender: z.enum(['MALE', 'FEMALE', 'OTHER']).openapi({
			description: 'The patient gender.',
			example: 'MALE',
		}),
		city: z.string().min(3).openapi({
			description: 'The patient city.',
			example: 'Lisbon',
		}),
		address: z.string().min(9).openapi({
			description: 'The patient address.',
			example: 'Lisbon',
		}),
		note: z.string().optional().openapi({
			description: 'The patient note.',
			example: 'New patient from ...',
		}),
	})
	.openapi('PatientInsert')

export const PatientSelectSchema = z
	.object({
		id: z.string().openapi({
			description: 'The id of the patient',
			example: 'jkashaj_jdasj',
		}),
		name: z.string().min(9).openapi({
			description: 'The patient name.',
			example: 'John Homes',
		}),
		telephone: z.string().min(9).openapi({}),
		email: z.string().email().openapi({
			description: 'The patient email.',
			example: 'john@example.com',
		}),
		dob: z.string().min(3).openapi({}),
		gender: z.enum(['MALE', 'FEMALE', 'OTHER']).openapi({}),
		city: z.string().min(3).openapi({
			description: 'The patient city.',
			example: 'Lisbon',
		}),
		address: z.string().min(9).openapi({
			description: 'The patient address.',
			example: 'Lisbon',
		}),
		note: z.string().optional().openapi({
			description: 'The patient note.',
			example: 'New patient from ...',
		}),
		organization: z.string().openapi({}),
		createdBy: z.string().optional().openapi({}),
		updatedBy: z.string().optional().openapi({}),
		createdAt: z.string().optional().openapi({}),
		updatedAt: z.string().optional().openapi({}),
	})
	.openapi('PatientSchema')

export const patchPatientSchema = PatientInsertSchema.partial()
