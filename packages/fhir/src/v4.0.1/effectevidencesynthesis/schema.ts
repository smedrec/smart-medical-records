import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createEffectEvidenceSynthesisSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('EffectEvidenceSynthesis', [contained], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesis<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('EffectEvidenceSynthesis'),
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
			synthesisType: createCodeableConceptSchema().optional(),
			studyType: createCodeableConceptSchema().optional(),
			population: createReferenceSchema(),
			exposure: createReferenceSchema(),
			exposureAlternative: createReferenceSchema(),
			outcome: createReferenceSchema(),
			sampleSize: createEffectEvidenceSynthesisSampleSizeSchema().optional(),
			resultsByExposure: z.array(createEffectEvidenceSynthesisResultsByExposureSchema()).optional(),
			effectEstimate: z.array(createEffectEvidenceSynthesisEffectEstimateSchema()).optional(),
			certainty: z.array(createEffectEvidenceSynthesisCertaintySchema()).optional(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisSampleSizeSchema() {
	return getCachedSchema('EffectEvidenceSynthesisSampleSize', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisSampleSize> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			numberOfStudies: primitives.getIntegerSchema().optional(),
			_numberOfStudies: createElementSchema().optional(),
			numberOfParticipants: primitives.getIntegerSchema().optional(),
			_numberOfParticipants: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisResultsByExposureSchema() {
	return getCachedSchema('EffectEvidenceSynthesisResultsByExposure', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisResultsByExposure> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			exposureState: z.enum(['exposure', 'exposure-alternative']).optional(),
			_exposureState: createElementSchema().optional(),
			variantState: createCodeableConceptSchema().optional(),
			riskEvidenceSynthesis: createReferenceSchema(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisEffectEstimateSchema() {
	return getCachedSchema('EffectEvidenceSynthesisEffectEstimate', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisEffectEstimate> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			variantState: createCodeableConceptSchema().optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			unitOfMeasure: createCodeableConceptSchema().optional(),
			precisionEstimate: z.array(createEffectEvidenceSynthesisPrecisionEstimateSchema()).optional(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisPrecisionEstimateSchema() {
	return getCachedSchema('EffectEvidenceSynthesisPrecisionEstimate', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisPrecisionEstimate> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			level: primitives.getDecimalSchema().optional(),
			_level: createElementSchema().optional(),
			from: primitives.getDecimalSchema().optional(),
			_from: createElementSchema().optional(),
			to: primitives.getDecimalSchema().optional(),
			_to: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisCertaintySchema() {
	return getCachedSchema('EffectEvidenceSynthesisCertainty', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisCertainty> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			rating: z.array(createCodeableConceptSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			certaintySubcomponent: z
				.array(createEffectEvidenceSynthesisCertaintySubcomponentSchema())
				.optional(),
		})

		return baseSchema
	})
}

export function createEffectEvidenceSynthesisCertaintySubcomponentSchema() {
	return getCachedSchema('EffectEvidenceSynthesisCertaintySubcomponent', [], () => {
		const baseSchema: z.ZodType<types.EffectEvidenceSynthesisCertaintySubcomponent> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				type: createCodeableConceptSchema().optional(),
				rating: z.array(createCodeableConceptSchema()).optional(),
				note: z.array(createAnnotationSchema()).optional(),
			})

		return baseSchema
	})
}
