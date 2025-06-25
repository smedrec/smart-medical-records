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

export function createValueSetSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ValueSet', [contained], () => {
		const baseSchema: z.ZodType<types.ValueSet<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ValueSet'),
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
			immutable: primitives.getBooleanSchema().optional(),
			_immutable: createElementSchema().optional(),
			purpose: primitives.getMarkdownSchema().optional(),
			_purpose: createElementSchema().optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			compose: createValueSetComposeSchema().optional(),
			expansion: createValueSetExpansionSchema().optional(),
		})

		return baseSchema
	})
}

export function createValueSetComposeSchema() {
	return getCachedSchema('ValueSetCompose', [], () => {
		const baseSchema: z.ZodType<types.ValueSetCompose> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			lockedDate: primitives.getDateSchema().optional(),
			_lockedDate: createElementSchema().optional(),
			inactive: primitives.getBooleanSchema().optional(),
			_inactive: createElementSchema().optional(),
			include: z.array(createValueSetIncludeSchema()),
			exclude: z.array(createValueSetIncludeSchema()).optional(),
		})

		return baseSchema
	})
}

export function createValueSetIncludeSchema() {
	return getCachedSchema('ValueSetInclude', [], () => {
		const baseSchema: z.ZodType<types.ValueSetInclude> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			concept: z.array(createValueSetConceptSchema()).optional(),
			filter: z.array(createValueSetFilterSchema()).optional(),
			valueSet: z.array(primitives.getCanonicalSchema()).optional(),
		})

		return baseSchema
	})
}

export function createValueSetConceptSchema() {
	return getCachedSchema('ValueSetConcept', [], () => {
		const baseSchema: z.ZodType<types.ValueSetConcept> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			designation: z.array(createValueSetDesignationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createValueSetDesignationSchema() {
	return getCachedSchema('ValueSetDesignation', [], () => {
		const baseSchema: z.ZodType<types.ValueSetDesignation> = z.strictObject({
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

export function createValueSetFilterSchema() {
	return getCachedSchema('ValueSetFilter', [], () => {
		const baseSchema: z.ZodType<types.ValueSetFilter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			property: primitives.getCodeSchema().optional(),
			_property: createElementSchema().optional(),
			op: z
				.enum([
					'=',
					'is-a',
					'descendent-of',
					'is-not-a',
					'regex',
					'in',
					'not-in',
					'generalizes',
					'exists',
				])
				.optional(),
			_op: createElementSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createValueSetExpansionSchema() {
	return getCachedSchema('ValueSetExpansion', [], () => {
		const baseSchema: z.ZodType<types.ValueSetExpansion> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: primitives.getUriSchema().optional(),
			_identifier: createElementSchema().optional(),
			timestamp: primitives.getDateTimeSchema(),
			_timestamp: createElementSchema().optional(),
			total: primitives.getIntegerSchema().optional(),
			_total: createElementSchema().optional(),
			offset: primitives.getIntegerSchema().optional(),
			_offset: createElementSchema().optional(),
			parameter: z.array(createValueSetParameterSchema()).optional(),
			contains: z.array(createValueSetContainsSchema()).optional(),
		})

		return baseSchema
	})
}

export function createValueSetParameterSchema() {
	return getCachedSchema('ValueSetParameter', [], () => {
		const baseSchema: z.ZodType<types.ValueSetParameter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
			valueUri: z.string().optional(),
			_valueUri: createElementSchema().optional(),
			valueCode: z.string().optional(),
			_valueCode: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createValueSetContainsSchema() {
	return getCachedSchema('ValueSetContains', [], () => {
		const baseSchema: z.ZodType<types.ValueSetContains> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			abstract: primitives.getBooleanSchema().optional(),
			_abstract: createElementSchema().optional(),
			inactive: primitives.getBooleanSchema().optional(),
			_inactive: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			designation: z.array(createValueSetDesignationSchema()).optional(),
			contains: z.array(createValueSetContainsSchema()).optional(),
		})

		return baseSchema
	})
}
