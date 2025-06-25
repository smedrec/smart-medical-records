import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createPeriodSchema,
} from '../core/schema'
import * as primitives from '../primitives'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createMarketingStatusSchema() {
	return getCachedSchema('MarketingStatus', [], () => {
		const baseSchema: z.ZodType<types.MarketingStatus> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			country: createCodeableConceptSchema(),
			jurisdiction: createCodeableConceptSchema().optional(),
			status: createCodeableConceptSchema(),
			dateRange: createPeriodSchema(),
			restoreDate: primitives.getDateTimeSchema().optional(),
			_restoreDate: createElementSchema().optional(),
		})

		return baseSchema
	})
}
