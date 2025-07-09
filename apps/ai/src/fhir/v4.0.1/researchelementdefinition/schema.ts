import { z } from 'zod/v4'

import {
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
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createResearchElementDefinitionSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ResearchElementDefinition', [contained], () => {
		const baseSchema: z.ZodType<types.ResearchElementDefinition<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ResearchElementDefinition'),
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
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			subjectCodeableConcept: createCodeableConceptSchema().optional(),
			subjectReference: createReferenceSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			comment: z.array(primitives.getStringSchema()).optional(),
			_comment: z.array(createElementSchema()).optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			purpose: primitives.getMarkdownSchema().optional(),
			_purpose: createElementSchema().optional(),
			usage: primitives.getStringSchema().optional(),
			_usage: createElementSchema().optional(),
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
			library: z.array(primitives.getCanonicalSchema()).optional(),
			type: z.enum(['population', 'exposure', 'outcome']),
			_type: createElementSchema().optional(),
			variableType: z.enum(['dichotomous', 'continuous', 'descriptive']).optional(),
			_variableType: createElementSchema().optional(),
			characteristic: z.array(createResearchElementDefinitionCharacteristicSchema()),
		})

		return baseSchema
	})
}

export function createResearchElementDefinitionCharacteristicSchema() {
	return getCachedSchema('ResearchElementDefinitionCharacteristic', [], () => {
		const baseSchema: z.ZodType<types.ResearchElementDefinitionCharacteristic> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			definitionCodeableConcept: createCodeableConceptSchema().optional(),
			definitionCanonical: z.string().optional(),
			_definitionCanonical: createElementSchema().optional(),
			definitionExpression: createExpressionSchema().optional(),
			definitionDataRequirement: createDataRequirementSchema().optional(),
			usageContext: z.array(createUsageContextSchema()).optional(),
			exclude: primitives.getBooleanSchema().optional(),
			_exclude: createElementSchema().optional(),
			unitOfMeasure: createCodeableConceptSchema().optional(),
			studyEffectiveDescription: primitives.getStringSchema().optional(),
			_studyEffectiveDescription: createElementSchema().optional(),
			studyEffectiveDateTime: z.string().optional(),
			_studyEffectiveDateTime: createElementSchema().optional(),
			studyEffectivePeriod: createPeriodSchema().optional(),
			studyEffectiveDuration: createDurationSchema().optional(),
			studyEffectiveTiming: createTimingSchema().optional(),
			studyEffectiveTimeFromStart: createDurationSchema().optional(),
			studyEffectiveGroupMeasure: z
				.enum([
					'mean',
					'median',
					'mean-of-mean',
					'mean-of-median',
					'median-of-mean',
					'median-of-median',
				])
				.optional(),
			_studyEffectiveGroupMeasure: createElementSchema().optional(),
			participantEffectiveDescription: primitives.getStringSchema().optional(),
			_participantEffectiveDescription: createElementSchema().optional(),
			participantEffectiveDateTime: z.string().optional(),
			_participantEffectiveDateTime: createElementSchema().optional(),
			participantEffectivePeriod: createPeriodSchema().optional(),
			participantEffectiveDuration: createDurationSchema().optional(),
			participantEffectiveTiming: createTimingSchema().optional(),
			participantEffectiveTimeFromStart: createDurationSchema().optional(),
			participantEffectiveGroupMeasure: z
				.enum([
					'mean',
					'median',
					'mean-of-mean',
					'mean-of-median',
					'median-of-mean',
					'median-of-median',
				])
				.optional(),
			_participantEffectiveGroupMeasure: createElementSchema().optional(),
		})

		return baseSchema
	})
}
