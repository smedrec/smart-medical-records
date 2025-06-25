import { z } from 'zod/v4'

import {
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

export function createEnrollmentResponseSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('EnrollmentResponse', [contained], () => {
		const baseSchema: z.ZodType<types.EnrollmentResponse<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('EnrollmentResponse'),
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
			status: primitives.getCodeSchema().optional(),
			_status: createElementSchema().optional(),
			request: createReferenceSchema().optional(),
			outcome: z.enum(['queued', 'complete', 'error', 'partial']).optional(),
			_outcome: createElementSchema().optional(),
			disposition: primitives.getStringSchema().optional(),
			_disposition: createElementSchema().optional(),
			created: primitives.getDateTimeSchema().optional(),
			_created: createElementSchema().optional(),
			organization: createReferenceSchema().optional(),
			requestProvider: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}
