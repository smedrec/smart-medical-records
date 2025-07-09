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

export function createCodeSystemSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('CodeSystem', [contained], () => {
		const baseSchema: z.ZodType<types.CodeSystem<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('CodeSystem'),
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
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
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
			caseSensitive: primitives.getBooleanSchema().optional(),
			_caseSensitive: createElementSchema().optional(),
			valueSet: primitives.getCanonicalSchema().optional(),
			hierarchyMeaning: z.enum(['grouped-by', 'is-a', 'part-of', 'classified-with']).optional(),
			_hierarchyMeaning: createElementSchema().optional(),
			compositional: primitives.getBooleanSchema().optional(),
			_compositional: createElementSchema().optional(),
			versionNeeded: primitives.getBooleanSchema().optional(),
			_versionNeeded: createElementSchema().optional(),
			content: z.enum(['not-present', 'example', 'fragment', 'complete', 'supplement']),
			_content: createElementSchema().optional(),
			supplements: primitives.getCanonicalSchema().optional(),
			count: primitives.getUnsignedIntSchema().optional(),
			_count: createElementSchema().optional(),
			filter: z.array(createCodeSystemFilterSchema()).optional(),
			property: z.array(createCodeSystemPropertySchema()).optional(),
			concept: z.array(createCodeSystemConceptSchema()).optional(),
		})

		return baseSchema
	})
}

export function createCodeSystemFilterSchema() {
	return getCachedSchema('CodeSystemFilter', [], () => {
		const baseSchema: z.ZodType<types.CodeSystemFilter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema(),
			_code: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			operator: z.array(primitives.getCodeSchema()),
			_operator: z.array(createElementSchema()).optional(),
			value: primitives.getStringSchema(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createCodeSystemPropertySchema() {
	return getCachedSchema('CodeSystemProperty', [], () => {
		const baseSchema: z.ZodType<types.CodeSystemProperty> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema(),
			_code: createElementSchema().optional(),
			uri: primitives.getUriSchema().optional(),
			_uri: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			type: z.enum(['code', 'Coding', 'string', 'integer', 'boolean', 'dateTime', 'decimal']),
			_type: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createCodeSystemConceptSchema() {
	return getCachedSchema('CodeSystemConcept', [], () => {
		const baseSchema: z.ZodType<types.CodeSystemConcept> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			definition: primitives.getStringSchema().optional(),
			_definition: createElementSchema().optional(),
			designation: z.array(createCodeSystemDesignationSchema()).optional(),
			property: z.array(createCodeSystemProperty1Schema()).optional(),
			concept: z.array(createCodeSystemConceptSchema()).optional(),
		})

		return baseSchema
	})
}

export function createCodeSystemDesignationSchema() {
	return getCachedSchema('CodeSystemDesignation', [], () => {
		const baseSchema: z.ZodType<types.CodeSystemDesignation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			language: primitives.getCodeSchema().optional(),
			_language: createElementSchema().optional(),
			use: createCodingSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createCodeSystemProperty1Schema() {
	return getCachedSchema('CodeSystemProperty1', [], () => {
		const baseSchema: z.ZodType<types.CodeSystemProperty1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			valueCode: z.string().optional(),
			_valueCode: createElementSchema().optional(),
			valueCoding: createCodingSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
		})

		return baseSchema
	})
}
