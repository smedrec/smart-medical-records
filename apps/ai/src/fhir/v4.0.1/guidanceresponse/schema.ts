import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createDataRequirementSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createGuidanceResponseSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('GuidanceResponse', [contained], () => {
		const baseSchema: z.ZodType<types.GuidanceResponse<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('GuidanceResponse'),
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
			requestIdentifier: createIdentifierSchema().optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			moduleUri: z.string().optional(),
			_moduleUri: createElementSchema().optional(),
			moduleCanonical: z.string().optional(),
			_moduleCanonical: createElementSchema().optional(),
			moduleCodeableConcept: createCodeableConceptSchema().optional(),
			status: z.enum([
				'success',
				'data-requested',
				'data-required',
				'in-progress',
				'failure',
				'entered-in-error',
			]),
			_status: createElementSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			occurrenceDateTime: primitives.getDateTimeSchema().optional(),
			_occurrenceDateTime: createElementSchema().optional(),
			performer: createReferenceSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			evaluationMessage: z.array(createReferenceSchema()).optional(),
			outputParameters: createReferenceSchema().optional(),
			result: createReferenceSchema().optional(),
			dataRequirement: z.array(createDataRequirementSchema()).optional(),
		})

		return baseSchema
	})
}
