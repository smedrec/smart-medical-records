import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
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

export function createListSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('List', [contained], () => {
		const baseSchema: z.ZodType<types.List<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('List'),
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
			status: z.enum(['current', 'retired', 'entered-in-error']),
			_status: createElementSchema().optional(),
			mode: z.enum(['working', 'snapshot', 'changes']),
			_mode: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			source: createReferenceSchema().optional(),
			orderedBy: createCodeableConceptSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
			entry: z.array(createListEntrySchema()).optional(),
			emptyReason: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createListEntrySchema() {
	return getCachedSchema('ListEntry', [], () => {
		const baseSchema: z.ZodType<types.ListEntry> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			flag: createCodeableConceptSchema().optional(),
			deleted: primitives.getBooleanSchema().optional(),
			_deleted: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			item: createReferenceSchema(),
		})

		return baseSchema
	})
}
