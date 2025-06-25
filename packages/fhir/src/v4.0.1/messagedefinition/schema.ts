import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createCodingSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createMessageDefinitionSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MessageDefinition', [contained], () => {
		const baseSchema: z.ZodType<types.MessageDefinition<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MessageDefinition'),
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
			url: primitives.getUriSchema().optional(),
			_url: createElementSchema().optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			replaces: z.array(primitives.getCanonicalSchema()).optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			date: primitives.getDateTimeSchema(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			purpose: primitives.getMarkdownSchema().optional(),
			_purpose: createElementSchema().optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			base: primitives.getCanonicalSchema().optional(),
			parent: z.array(primitives.getCanonicalSchema()).optional(),
			eventCoding: createCodingSchema().optional(),
			eventUri: z.string().optional(),
			_eventUri: createElementSchema().optional(),
			category: z.enum(['consequence', 'currency', 'notification']).optional(),
			_category: createElementSchema().optional(),
			focus: z.array(createMessageDefinitionFocusSchema()).optional(),
			responseRequired: z.enum(['always', 'on-error', 'never', 'on-success']).optional(),
			_responseRequired: createElementSchema().optional(),
			allowedResponse: z.array(createMessageDefinitionAllowedResponseSchema()).optional(),
			graph: z.array(primitives.getCanonicalSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMessageDefinitionFocusSchema() {
	return getCachedSchema('MessageDefinitionFocus', [], () => {
		const baseSchema: z.ZodType<types.MessageDefinitionFocus> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema(),
			_code: createElementSchema().optional(),
			profile: primitives.getCanonicalSchema().optional(),
			min: primitives.getUnsignedIntSchema(),
			_min: createElementSchema().optional(),
			max: primitives.getStringSchema().optional(),
			_max: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createMessageDefinitionAllowedResponseSchema() {
	return getCachedSchema('MessageDefinitionAllowedResponse', [], () => {
		const baseSchema: z.ZodType<types.MessageDefinitionAllowedResponse> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			message: primitives.getCanonicalSchema(),
			situation: primitives.getMarkdownSchema().optional(),
			_situation: createElementSchema().optional(),
		})

		return baseSchema
	})
}
