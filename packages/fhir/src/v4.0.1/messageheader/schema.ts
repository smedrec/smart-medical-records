import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createCodingSchema,
	createContactPointSchema,
	createElementSchema,
	createExtensionSchema,
	createMetaSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createMessageHeaderSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MessageHeader', [contained], () => {
		const baseSchema: z.ZodType<types.MessageHeader<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MessageHeader'),
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
			eventCoding: createCodingSchema().optional(),
			eventUri: z.string().optional(),
			_eventUri: createElementSchema().optional(),
			destination: z.array(createMessageHeaderDestinationSchema()).optional(),
			sender: createReferenceSchema().optional(),
			enterer: createReferenceSchema().optional(),
			author: createReferenceSchema().optional(),
			source: createMessageHeaderSourceSchema(),
			responsible: createReferenceSchema().optional(),
			reason: createCodeableConceptSchema().optional(),
			response: createMessageHeaderResponseSchema().optional(),
			focus: z.array(createReferenceSchema()).optional(),
			definition: primitives.getCanonicalSchema().optional(),
		})

		return baseSchema
	})
}

export function createMessageHeaderDestinationSchema() {
	return getCachedSchema('MessageHeaderDestination', [], () => {
		const baseSchema: z.ZodType<types.MessageHeaderDestination> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			target: createReferenceSchema().optional(),
			endpoint: primitives.getUrlSchema(),
			_endpoint: createElementSchema().optional(),
			receiver: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createMessageHeaderSourceSchema() {
	return getCachedSchema('MessageHeaderSource', [], () => {
		const baseSchema: z.ZodType<types.MessageHeaderSource> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			software: primitives.getStringSchema().optional(),
			_software: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			contact: createContactPointSchema().optional(),
			endpoint: primitives.getUrlSchema(),
			_endpoint: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createMessageHeaderResponseSchema() {
	return getCachedSchema('MessageHeaderResponse', [], () => {
		const baseSchema: z.ZodType<types.MessageHeaderResponse> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: primitives.getIdSchema(),
			_identifier: createElementSchema().optional(),
			code: z.enum(['ok', 'transient-error', 'fatal-error']),
			_code: createElementSchema().optional(),
			details: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}
