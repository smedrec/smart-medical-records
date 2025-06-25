import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createContactPointSchema,
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

export function createCareTeamSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('CareTeam', [contained], () => {
		const baseSchema: z.ZodType<types.CareTeam<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('CareTeam'),
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
			status: z
				.enum(['proposed', 'active', 'suspended', 'inactive', 'entered-in-error'])
				.optional(),
			_status: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			period: createPeriodSchema().optional(),
			participant: z.array(createCareTeamParticipantSchema()).optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			managingOrganization: z.array(createReferenceSchema()).optional(),
			telecom: z.array(createContactPointSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createCareTeamParticipantSchema() {
	return getCachedSchema('CareTeamParticipant', [], () => {
		const baseSchema: z.ZodType<types.CareTeamParticipant> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			role: z.array(createCodeableConceptSchema()).optional(),
			member: createReferenceSchema().optional(),
			onBehalfOf: createReferenceSchema().optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}
