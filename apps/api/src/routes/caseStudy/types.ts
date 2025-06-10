import { z } from '@hono/zod-openapi'

export const CaseStudyInsertSchema = z
	.object({
		patient: z.string().length(32).openapi({
			description: 'The patient id.',
			example: '+351962539448',
		}),
		title: z.string().max(132).openapi({
			description: 'The caseStudy title, max 132 characters.',
			example: 'Case study for José',
		}),
		therapist: z.string().length(32).openapi({
			description: 'The therapist id.',
			example: '',
		}),
		careTeam: z.string().length(32).optional().openapi({
			description: 'The care team id.',
			example: '',
		}),
	})
	.openapi('CaseStudyInsert')

export const CaseStudySelectSchema = z
	.object({
		id: z.string().length(32).openapi({
			description: 'The id of the assistant',
			example: 'jkashaj_jdasj',
		}),
		patient: z.string().length(32).openapi({}),
		title: z.string().openapi({}),
		careTeam: z.string().openapi({}),
		createdBy: z.string().optional().openapi({}),
		updatedBy: z.string().optional().openapi({}),
		createdAt: z.string().optional().openapi({}),
		updatedAt: z.string().optional().openapi({}),
	})
	.openapi('CaseStudySchema')

export const CaseStudyPatchSchema = z
	.object({
		title: z.string().max(132).openapi({
			description: 'The caseStudy title, max 132 characters.',
			example: 'Case study for José',
		}),
	})
	.openapi('CaseStudyPatchSchema')

export const CaseStudySelectByPatientSchema = z
	.object({
		patientId: z.string().length(32).openapi({
			description: 'The patient id.',
			example: '',
		}),
	})
	.openapi('CaseStudySelectByPatientSchema')
