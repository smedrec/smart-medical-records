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

export function createCatalogEntrySchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('CatalogEntry', [contained], () => {
		const baseSchema: z.ZodType<types.CatalogEntry<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('CatalogEntry'),
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
			type: createCodeableConceptSchema().optional(),
			orderable: primitives.getBooleanSchema(),
			_orderable: createElementSchema().optional(),
			referencedItem: createReferenceSchema(),
			additionalIdentifier: z.array(createIdentifierSchema()).optional(),
			classification: z.array(createCodeableConceptSchema()).optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']).optional(),
			_status: createElementSchema().optional(),
			validityPeriod: createPeriodSchema().optional(),
			validTo: primitives.getDateTimeSchema().optional(),
			_validTo: createElementSchema().optional(),
			lastUpdated: primitives.getDateTimeSchema().optional(),
			_lastUpdated: createElementSchema().optional(),
			additionalCharacteristic: z.array(createCodeableConceptSchema()).optional(),
			additionalClassification: z.array(createCodeableConceptSchema()).optional(),
			relatedEntry: z.array(createCatalogEntryRelatedEntrySchema()).optional(),
		})

		return baseSchema
	})
}

export function createCatalogEntryRelatedEntrySchema() {
	return getCachedSchema('CatalogEntryRelatedEntry', [], () => {
		const baseSchema: z.ZodType<types.CatalogEntryRelatedEntry> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			relationtype: z.enum(['triggers', 'is-replaced-by']),
			_relationtype: createElementSchema().optional(),
			item: createReferenceSchema(),
		})

		return baseSchema
	})
}
