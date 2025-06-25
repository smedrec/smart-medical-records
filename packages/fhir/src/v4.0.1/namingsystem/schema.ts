import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createMetaSchema,
	createPeriodSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createNamingSystemSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('NamingSystem', [contained], () => {
		const baseSchema: z.ZodType<types.NamingSystem<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('NamingSystem'),
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
			name: primitives.getStringSchema(),
			_name: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			kind: z.enum(['codesystem', 'identifier', 'root']),
			_kind: createElementSchema().optional(),
			date: primitives.getDateTimeSchema(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			responsible: primitives.getStringSchema().optional(),
			_responsible: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			usage: primitives.getStringSchema().optional(),
			_usage: createElementSchema().optional(),
			uniqueId: z.array(createNamingSystemUniqueIdSchema()),
		})

		return baseSchema
	})
}

export function createNamingSystemUniqueIdSchema() {
	return getCachedSchema('NamingSystemUniqueId', [], () => {
		const baseSchema: z.ZodType<types.NamingSystemUniqueId> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: z.enum(['oid', 'uuid', 'uri', 'other']),
			_type: createElementSchema().optional(),
			value: primitives.getStringSchema(),
			_value: createElementSchema().optional(),
			preferred: primitives.getBooleanSchema().optional(),
			_preferred: createElementSchema().optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}
