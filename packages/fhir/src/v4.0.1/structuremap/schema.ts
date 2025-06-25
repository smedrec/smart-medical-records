import { z } from 'zod/v4'

import {
	createAddressSchema,
	createAgeSchema,
	createAnnotationSchema,
	createAttachmentSchema,
	createCodeableConceptSchema,
	createCodingSchema,
	createContactDetailSchema,
	createContactPointSchema,
	createContributorSchema,
	createCountSchema,
	createDataRequirementSchema,
	createDistanceSchema,
	createDosageSchema,
	createDurationSchema,
	createElementSchema,
	createExpressionSchema,
	createExtensionSchema,
	createHumanNameSchema,
	createIdentifierSchema,
	createMetaSchema,
	createMoneySchema,
	createParameterDefinitionSchema,
	createPeriodSchema,
	createQuantitySchema,
	createRangeSchema,
	createRatioSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
	createSampledDataSchema,
	createSignatureSchema,
	createTimingSchema,
	createTriggerDefinitionSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createStructureMapSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('StructureMap', [contained], () => {
		const baseSchema: z.ZodType<types.StructureMap<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('StructureMap'),
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
			structure: z.array(createStructureMapStructureSchema()).optional(),
			import: z.array(primitives.getCanonicalSchema()).optional(),
			group: z.array(createStructureMapGroupSchema()),
		})

		return baseSchema
	})
}

export function createStructureMapStructureSchema() {
	return getCachedSchema('StructureMapStructure', [], () => {
		const baseSchema: z.ZodType<types.StructureMapStructure> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			url: primitives.getCanonicalSchema(),
			mode: z.enum(['source', 'queried', 'target', 'produced']),
			_mode: createElementSchema().optional(),
			alias: primitives.getStringSchema().optional(),
			_alias: createElementSchema().optional(),
			documentation: primitives.getStringSchema().optional(),
			_documentation: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureMapGroupSchema() {
	return getCachedSchema('StructureMapGroup', [], () => {
		const baseSchema: z.ZodType<types.StructureMapGroup> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getIdSchema(),
			_name: createElementSchema().optional(),
			extends: primitives.getIdSchema().optional(),
			_extends: createElementSchema().optional(),
			typeMode: z.enum(['none', 'types', 'type-and-types']),
			_typeMode: createElementSchema().optional(),
			documentation: primitives.getStringSchema().optional(),
			_documentation: createElementSchema().optional(),
			input: z.array(createStructureMapInputSchema()),
			rule: z.array(createStructureMapRuleSchema()),
		})

		return baseSchema
	})
}

export function createStructureMapInputSchema() {
	return getCachedSchema('StructureMapInput', [], () => {
		const baseSchema: z.ZodType<types.StructureMapInput> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getIdSchema().optional(),
			_name: createElementSchema().optional(),
			type: primitives.getStringSchema().optional(),
			_type: createElementSchema().optional(),
			mode: z.enum(['source', 'target']).optional(),
			_mode: createElementSchema().optional(),
			documentation: primitives.getStringSchema().optional(),
			_documentation: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureMapRuleSchema() {
	return getCachedSchema('StructureMapRule', [], () => {
		const baseSchema: z.ZodType<types.StructureMapRule> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getIdSchema().optional(),
			_name: createElementSchema().optional(),
			source: z.array(createStructureMapSourceSchema()),
			target: z.array(createStructureMapTargetSchema()).optional(),
			rule: z.array(createStructureMapRuleSchema()).optional(),
			dependent: z.array(createStructureMapDependentSchema()).optional(),
			documentation: primitives.getStringSchema().optional(),
			_documentation: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureMapSourceSchema() {
	return getCachedSchema('StructureMapSource', [], () => {
		const baseSchema: z.ZodType<types.StructureMapSource> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			context: primitives.getIdSchema().optional(),
			_context: createElementSchema().optional(),
			min: primitives.getIntegerSchema().optional(),
			_min: createElementSchema().optional(),
			max: primitives.getStringSchema().optional(),
			_max: createElementSchema().optional(),
			type: primitives.getStringSchema().optional(),
			_type: createElementSchema().optional(),
			defaultValueBase64Binary: z.string().optional(),
			_defaultValueBase64Binary: createElementSchema().optional(),
			defaultValueBoolean: z.boolean().optional(),
			_defaultValueBoolean: createElementSchema().optional(),
			defaultValueCanonical: z.string().optional(),
			_defaultValueCanonical: createElementSchema().optional(),
			defaultValueCode: z.string().optional(),
			_defaultValueCode: createElementSchema().optional(),
			defaultValueDate: z.string().optional(),
			_defaultValueDate: createElementSchema().optional(),
			defaultValueDateTime: z.string().optional(),
			_defaultValueDateTime: createElementSchema().optional(),
			defaultValueDecimal: z.number().optional(),
			_defaultValueDecimal: createElementSchema().optional(),
			defaultValueId: z.string().optional(),
			_defaultValueId: createElementSchema().optional(),
			defaultValueInstant: z.string().optional(),
			_defaultValueInstant: createElementSchema().optional(),
			defaultValueInteger: z.number().optional(),
			_defaultValueInteger: createElementSchema().optional(),
			defaultValueMarkdown: z.string().optional(),
			_defaultValueMarkdown: createElementSchema().optional(),
			defaultValueOid: z.string().optional(),
			_defaultValueOid: createElementSchema().optional(),
			defaultValuePositiveInt: z.number().optional(),
			_defaultValuePositiveInt: createElementSchema().optional(),
			defaultValueString: z.string().optional(),
			_defaultValueString: createElementSchema().optional(),
			defaultValueTime: z.string().optional(),
			_defaultValueTime: createElementSchema().optional(),
			defaultValueUnsignedInt: z.number().optional(),
			_defaultValueUnsignedInt: createElementSchema().optional(),
			defaultValueUri: z.string().optional(),
			_defaultValueUri: createElementSchema().optional(),
			defaultValueUrl: z.string().optional(),
			_defaultValueUrl: createElementSchema().optional(),
			defaultValueUuid: z.string().optional(),
			_defaultValueUuid: createElementSchema().optional(),
			defaultValueAddress: createAddressSchema().optional(),
			defaultValueAge: createAgeSchema().optional(),
			defaultValueAnnotation: createAnnotationSchema().optional(),
			defaultValueAttachment: createAttachmentSchema().optional(),
			defaultValueCodeableConcept: createCodeableConceptSchema().optional(),
			defaultValueCoding: createCodingSchema().optional(),
			defaultValueContactPoint: createContactPointSchema().optional(),
			defaultValueCount: createCountSchema().optional(),
			defaultValueDistance: createDistanceSchema().optional(),
			defaultValueDuration: createDurationSchema().optional(),
			defaultValueHumanName: createHumanNameSchema().optional(),
			defaultValueIdentifier: createIdentifierSchema().optional(),
			defaultValueMoney: createMoneySchema().optional(),
			defaultValuePeriod: createPeriodSchema().optional(),
			defaultValueQuantity: createQuantitySchema().optional(),
			defaultValueRange: createRangeSchema().optional(),
			defaultValueRatio: createRatioSchema().optional(),
			defaultValueReference: createReferenceSchema().optional(),
			defaultValueSampledData: createSampledDataSchema().optional(),
			defaultValueSignature: createSignatureSchema().optional(),
			defaultValueTiming: createTimingSchema().optional(),
			defaultValueContactDetail: createContactDetailSchema().optional(),
			defaultValueContributor: createContributorSchema().optional(),
			defaultValueDataRequirement: createDataRequirementSchema().optional(),
			defaultValueExpression: createExpressionSchema().optional(),
			defaultValueParameterDefinition: createParameterDefinitionSchema().optional(),
			defaultValueRelatedArtifact: createRelatedArtifactSchema().optional(),
			defaultValueTriggerDefinition: createTriggerDefinitionSchema().optional(),
			defaultValueUsageContext: createUsageContextSchema().optional(),
			defaultValueDosage: createDosageSchema().optional(),
			defaultValueMeta: createMetaSchema().optional(),
			element: primitives.getStringSchema().optional(),
			_element: createElementSchema().optional(),
			listMode: z.enum(['first', 'not_first', 'last', 'not_last', 'only_one']).optional(),
			_listMode: createElementSchema().optional(),
			variable: primitives.getIdSchema().optional(),
			_variable: createElementSchema().optional(),
			condition: primitives.getStringSchema().optional(),
			_condition: createElementSchema().optional(),
			check: primitives.getStringSchema().optional(),
			_check: createElementSchema().optional(),
			logMessage: primitives.getStringSchema().optional(),
			_logMessage: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureMapTargetSchema() {
	return getCachedSchema('StructureMapTarget', [], () => {
		const baseSchema: z.ZodType<types.StructureMapTarget> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			context: primitives.getIdSchema().optional(),
			_context: createElementSchema().optional(),
			contextType: z.enum(['type', 'variable']).optional(),
			_contextType: createElementSchema().optional(),
			element: primitives.getStringSchema().optional(),
			_element: createElementSchema().optional(),
			variable: primitives.getIdSchema().optional(),
			_variable: createElementSchema().optional(),
			listMode: z.enum(['first', 'share', 'last', 'collate']).array().optional(),
			_listMode: z.array(createElementSchema()).optional(),
			listRuleId: primitives.getIdSchema().optional(),
			_listRuleId: createElementSchema().optional(),
			transform: z
				.enum([
					'create',
					'copy',
					'truncate',
					'escape',
					'cast',
					'append',
					'translate',
					'reference',
					'dateOp',
					'uuid',
					'pointer',
					'evaluate',
					'cc',
					'c',
					'qty',
					'id',
					'cp',
				])
				.optional(),
			_transform: createElementSchema().optional(),
			parameter: z.array(createStructureMapParameterSchema()).optional(),
		})

		return baseSchema
	})
}

export function createStructureMapParameterSchema() {
	return getCachedSchema('StructureMapParameter', [], () => {
		const baseSchema: z.ZodType<types.StructureMapParameter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			valueId: z.string().optional(),
			_valueId: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createStructureMapDependentSchema() {
	return getCachedSchema('StructureMapDependent', [], () => {
		const baseSchema: z.ZodType<types.StructureMapDependent> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getIdSchema().optional(),
			_name: createElementSchema().optional(),
			variable: z.array(primitives.getStringSchema()).optional(),
			_variable: z.array(createElementSchema()).optional(),
		})

		return baseSchema
	})
}
