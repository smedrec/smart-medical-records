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
import { createElementDefinitionSchema } from '../elementdefinition/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createStructureDefinitionSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('StructureDefinition', [contained], () => {
		const baseSchema: z.ZodType<types.StructureDefinition<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('StructureDefinition'),
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
			url: primitives.getUriSchema(),
			_url: createElementSchema().optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			name: primitives.getStringSchema(),
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
			keyword: z.array(createCodingSchema()).optional(),
			fhirVersion: z
				.enum([
					'0.01',
					'0.05',
					'0.06',
					'0.11',
					'0.0.80',
					'0.0.81',
					'0.0.82',
					'0.4.0',
					'0.5.0',
					'1.0.0',
					'1.0.1',
					'1.0.2',
					'1.1.0',
					'1.4.0',
					'1.6.0',
					'1.8.0',
					'3.0.0',
					'3.0.1',
					'3.3.0',
					'3.5.0',
					'4.0.0',
					'4.0.1',
				])
				.optional(),
			_fhirVersion: createElementSchema().optional(),
			mapping: z.array(createStructureDefinitionMappingSchema()).optional(),
			kind: z.enum(['primitive-type', 'complex-type', 'resource', 'logical']),
			_kind: createElementSchema().optional(),
			abstract: primitives.getBooleanSchema(),
			_abstract: createElementSchema().optional(),
			context: z.array(createStructureDefinitionContextSchema()).optional(),
			contextInvariant: z.array(primitives.getStringSchema()).optional(),
			_contextInvariant: z.array(createElementSchema()).optional(),
			type: primitives.getUriSchema(),
			_type: createElementSchema().optional(),
			baseDefinition: primitives.getCanonicalSchema().optional(),
			derivation: z.enum(['specialization', 'constraint']).optional(),
			_derivation: createElementSchema().optional(),
			snapshot: createStructureDefinitionSnapshotSchema().optional(),
			differential: createStructureDefinitionDifferentialSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureDefinitionMappingSchema() {
	return getCachedSchema('StructureDefinitionMapping', [], () => {
		const baseSchema: z.ZodType<types.StructureDefinitionMapping> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identity: primitives.getIdSchema(),
			_identity: createElementSchema().optional(),
			uri: primitives.getUriSchema().optional(),
			_uri: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureDefinitionContextSchema() {
	return getCachedSchema('StructureDefinitionContext', [], () => {
		const baseSchema: z.ZodType<types.StructureDefinitionContext> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: z.enum(['fhirpath', 'element', 'extension']),
			_type: createElementSchema().optional(),
			expression: primitives.getStringSchema(),
			_expression: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureDefinitionSnapshotSchema() {
	return getCachedSchema('StructureDefinitionSnapshot', [], () => {
		const baseSchema: z.ZodType<types.StructureDefinitionSnapshot> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			element: z.array(createElementDefinitionSchema()),
		})

		return baseSchema
	})
}

export function createStructureDefinitionDifferentialSchema() {
	return getCachedSchema('StructureDefinitionDifferential', [], () => {
		const baseSchema: z.ZodType<types.StructureDefinitionDifferential> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			element: z.array(createElementDefinitionSchema()),
		})

		return baseSchema
	})
}
