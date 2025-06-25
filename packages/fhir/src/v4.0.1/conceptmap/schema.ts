import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
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

export function createConceptMapSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ConceptMap', [contained], () => {
		const baseSchema: z.ZodType<types.ConceptMap<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ConceptMap'),
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
			identifier: createIdentifierSchema().optional(),
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
			sourceUri: z.string().optional(),
			_sourceUri: createElementSchema().optional(),
			sourceCanonical: z.string().optional(),
			_sourceCanonical: createElementSchema().optional(),
			targetUri: z.string().optional(),
			_targetUri: createElementSchema().optional(),
			targetCanonical: z.string().optional(),
			_targetCanonical: createElementSchema().optional(),
			group: z.array(createConceptMapGroupSchema()).optional(),
		})

		return baseSchema
	})
}

export function createConceptMapGroupSchema() {
	return getCachedSchema('ConceptMapGroup', [], () => {
		const baseSchema: z.ZodType<types.ConceptMapGroup> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			source: primitives.getUriSchema().optional(),
			_source: createElementSchema().optional(),
			sourceVersion: primitives.getStringSchema().optional(),
			_sourceVersion: createElementSchema().optional(),
			target: primitives.getUriSchema().optional(),
			_target: createElementSchema().optional(),
			targetVersion: primitives.getStringSchema().optional(),
			_targetVersion: createElementSchema().optional(),
			element: z.array(createConceptMapElementSchema()),
			unmapped: createConceptMapUnmappedSchema().optional(),
		})

		return baseSchema
	})
}

export function createConceptMapElementSchema() {
	return getCachedSchema('ConceptMapElement', [], () => {
		const baseSchema: z.ZodType<types.ConceptMapElement> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			target: z.array(createConceptMapTargetSchema()).optional(),
		})

		return baseSchema
	})
}

export function createConceptMapTargetSchema() {
	return getCachedSchema('ConceptMapTarget', [], () => {
		const baseSchema: z.ZodType<types.ConceptMapTarget> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			equivalence: z
				.enum([
					'relatedto',
					'equivalent',
					'equal',
					'wider',
					'subsumes',
					'narrower',
					'specializes',
					'inexact',
					'unmatched',
					'disjoint',
				])
				.optional(),
			_equivalence: createElementSchema().optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
			dependsOn: z.array(createConceptMapDependsOnSchema()).optional(),
			product: z.array(createConceptMapDependsOnSchema()).optional(),
		})

		return baseSchema
	})
}

export function createConceptMapDependsOnSchema() {
	return getCachedSchema('ConceptMapDependsOn', [], () => {
		const baseSchema: z.ZodType<types.ConceptMapDependsOn> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			property: primitives.getUriSchema().optional(),
			_property: createElementSchema().optional(),
			system: primitives.getCanonicalSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createConceptMapUnmappedSchema() {
	return getCachedSchema('ConceptMapUnmapped', [], () => {
		const baseSchema: z.ZodType<types.ConceptMapUnmapped> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			mode: z.enum(['provided', 'fixed', 'other-map']).optional(),
			_mode: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			url: primitives.getCanonicalSchema().optional(),
		})

		return baseSchema
	})
}
