import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
	createSignatureSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createProvenanceSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Provenance', [contained], () => {
		const baseSchema: z.ZodType<types.Provenance<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Provenance'),
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
			target: z.array(createReferenceSchema()),
			occurredPeriod: createPeriodSchema().optional(),
			occurredDateTime: z.string().optional(),
			_occurredDateTime: createElementSchema().optional(),
			recorded: primitives.getInstantSchema(),
			_recorded: createElementSchema().optional(),
			policy: z.array(primitives.getUriSchema()).optional(),
			_policy: z.array(createElementSchema()).optional(),
			location: createReferenceSchema().optional(),
			reason: z.array(createCodeableConceptSchema()).optional(),
			activity: createCodeableConceptSchema().optional(),
			agent: z.array(createProvenanceAgentSchema()),
			entity: z.array(createProvenanceEntitySchema()).optional(),
			signature: z.array(createSignatureSchema()).optional(),
		})

		return baseSchema
	})
}

export function createProvenanceAgentSchema() {
	return getCachedSchema('ProvenanceAgent', [], () => {
		const baseSchema: z.ZodType<types.ProvenanceAgent> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			role: z.array(createCodeableConceptSchema()).optional(),
			who: createReferenceSchema(),
			onBehalfOf: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createProvenanceEntitySchema() {
	return getCachedSchema('ProvenanceEntity', [], () => {
		const baseSchema: z.ZodType<types.ProvenanceEntity> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			role: z.enum(['derivation', 'revision', 'quotation', 'source', 'removal']),
			_role: createElementSchema().optional(),
			what: createReferenceSchema(),
			agent: z.array(createProvenanceAgentSchema()).optional(),
		})

		return baseSchema
	})
}
