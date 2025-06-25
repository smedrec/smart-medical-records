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

export function createFlagSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Flag', [contained], () => {
		const baseSchema: z.ZodType<types.Flag<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Flag'),
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
			status: z.enum(['active', 'inactive', 'entered-in-error']),
			_status: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			code: createCodeableConceptSchema(),
			subject: createReferenceSchema(),
			period: createPeriodSchema().optional(),
			encounter: createReferenceSchema().optional(),
			author: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}
