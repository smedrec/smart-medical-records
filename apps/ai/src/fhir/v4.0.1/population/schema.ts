import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createExtensionSchema,
	createRangeSchema,
} from '../core/schema'
import * as primitives from '../primitives'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createPopulationSchema() {
	return getCachedSchema('Population', [], () => {
		const baseSchema: z.ZodType<types.Population> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			ageRange: createRangeSchema().optional(),
			ageCodeableConcept: createCodeableConceptSchema().optional(),
			gender: createCodeableConceptSchema().optional(),
			race: createCodeableConceptSchema().optional(),
			physiologicalCondition: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}
