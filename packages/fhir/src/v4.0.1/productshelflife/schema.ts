import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createQuantitySchema,
} from '../core/schema'
import * as primitives from '../primitives'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createProductShelfLifeSchema() {
	return getCachedSchema('ProductShelfLife', [], () => {
		const baseSchema: z.ZodType<types.ProductShelfLife> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: createIdentifierSchema().optional(),
			type: createCodeableConceptSchema(),
			period: createQuantitySchema(),
			specialPrecautionsForStorage: z.array(createCodeableConceptSchema()).optional(),
		})

		return baseSchema
	})
}
