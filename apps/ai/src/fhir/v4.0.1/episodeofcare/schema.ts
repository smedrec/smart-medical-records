import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createEpisodeOfCareSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('EpisodeOfCare', [contained], () => {
		const baseSchema: z.ZodType<types.EpisodeOfCare<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('EpisodeOfCare'),
			id: primitives.getIdSchema().optional(),
			meta: createMetaSchema().optional(),
			implicitRules: primitives.getUriSchema().optional(),
			_implicitRules: createElementSchema().optional(),
			language: primitives.getCodeSchema().optional(),
			_language: createElementSchema().optional(),
			text: createNarrativeSchema().optional(),
			contained: z.array(contained).optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			status: z.enum([
				'planned',
				'waitlist',
				'active',
				'onhold',
				'finished',
				'cancelled',
				'entered-in-error',
			]),
			_status: createElementSchema().optional(),
			statusHistory: z.array(createEpisodeOfCareStatusHistorySchema()).optional(),
			type: z.array(createCodeableConceptSchema()).optional(),
			diagnosis: z.array(createEpisodeOfCareDiagnosisSchema()).optional(),
			patient: createReferenceSchema(),
			managingOrganization: createReferenceSchema().optional(),
			period: createPeriodSchema().optional(),
			referralRequest: z.array(createReferenceSchema()).optional(),
			careManager: createReferenceSchema().optional(),
			team: z.array(createReferenceSchema()).optional(),
			account: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createEpisodeOfCareStatusHistorySchema() {
	return getCachedSchema('EpisodeOfCareStatusHistory', [], () => {
		const baseSchema: z.ZodType<types.EpisodeOfCareStatusHistory> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			status: z.enum([
				'planned',
				'waitlist',
				'active',
				'onhold',
				'finished',
				'cancelled',
				'entered-in-error',
			]),
			_status: createElementSchema().optional(),
			period: createPeriodSchema(),
		})

		return baseSchema
	})
}

export function createEpisodeOfCareDiagnosisSchema() {
	return getCachedSchema('EpisodeOfCareDiagnosis', [], () => {
		const baseSchema: z.ZodType<types.EpisodeOfCareDiagnosis> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			condition: createReferenceSchema(),
			role: createCodeableConceptSchema().optional(),
			rank: primitives.getPositiveIntSchema().optional(),
			_rank: createElementSchema().optional(),
		})

		return baseSchema
	})
}
