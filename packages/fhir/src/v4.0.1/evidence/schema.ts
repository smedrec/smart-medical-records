import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createContactDetailSchema,
	createDataRequirementSchema,
	createDurationSchema,
	createElementSchema,
	createExpressionSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
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

export function createEvidenceSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Evidence', [contained], () => {
		const baseSchema: z.ZodType<types.Evidence<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Evidence'),
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
			shortTitle: primitives.getStringSchema().optional(),
			_shortTitle: createElementSchema().optional(),
			subtitle: primitives.getStringSchema().optional(),
			_subtitle: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			approvalDate: primitives.getDateSchema().optional(),
			_approvalDate: createElementSchema().optional(),
			lastReviewDate: primitives.getDateSchema().optional(),
			_lastReviewDate: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			topic: z.array(createCodeableConceptSchema()).optional(),
			author: z.array(createContactDetailSchema()).optional(),
			editor: z.array(createContactDetailSchema()).optional(),
			reviewer: z.array(createContactDetailSchema()).optional(),
			endorser: z.array(createContactDetailSchema()).optional(),
			relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
			exposureBackground: createReferenceSchema(),
			exposureVariant: z.array(createReferenceSchema()).optional(),
			outcome: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createEvidenceVariableSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('EvidenceVariable', [contained], () => {
		const baseSchema: z.ZodType<types.EvidenceVariable<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('EvidenceVariable'),
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
			shortTitle: primitives.getStringSchema().optional(),
			_shortTitle: createElementSchema().optional(),
			subtitle: primitives.getStringSchema().optional(),
			_subtitle: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			approvalDate: primitives.getDateSchema().optional(),
			_approvalDate: createElementSchema().optional(),
			lastReviewDate: primitives.getDateSchema().optional(),
			_lastReviewDate: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			topic: z.array(createCodeableConceptSchema()).optional(),
			author: z.array(createContactDetailSchema()).optional(),
			editor: z.array(createContactDetailSchema()).optional(),
			reviewer: z.array(createContactDetailSchema()).optional(),
			endorser: z.array(createContactDetailSchema()).optional(),
			relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
			type: z.enum(['dichotomous', 'continuous', 'descriptive']).optional(),
			_type: createElementSchema().optional(),
			characteristic: z.array(createEvidenceVariableCharacteristicSchema()),
		})

		return baseSchema
	})
}

export function createEvidenceVariableCharacteristicSchema() {
	return getCachedSchema('EvidenceVariableCharacteristic', [], () => {
		const baseSchema: z.ZodType<types.EvidenceVariableCharacteristic> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			definitionReference: createReferenceSchema().optional(),
			definitionCanonical: z.string().optional(),
			_definitionCanonical: createElementSchema().optional(),
			definitionCodeableConcept: createCodeableConceptSchema().optional(),
			definitionExpression: createExpressionSchema().optional(),
			definitionDataRequirement: createDataRequirementSchema().optional(),
			definitionTriggerDefinition: createTriggerDefinitionSchema().optional(),
			usageContext: z.array(createUsageContextSchema()).optional(),
			exclude: primitives.getBooleanSchema().optional(),
			_exclude: createElementSchema().optional(),
			participantEffectiveDateTime: z.string().optional(),
			_participantEffectiveDateTime: createElementSchema().optional(),
			participantEffectivePeriod: createPeriodSchema().optional(),
			participantEffectiveDuration: createDurationSchema().optional(),
			participantEffectiveTiming: createTimingSchema().optional(),
			timeFromStart: createDurationSchema().optional(),
			groupMeasure: z
				.enum([
					'mean',
					'median',
					'mean-of-mean',
					'mean-of-median',
					'median-of-mean',
					'median-of-median',
				])
				.optional(),
			_groupMeasure: createElementSchema().optional(),
		})

		return baseSchema
	})
}
