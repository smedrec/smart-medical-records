import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createQuantitySchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createImmunizationSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Immunization', [contained], () => {
		const baseSchema: z.ZodType<types.Immunization<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Immunization'),
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
			identifier: z.array(createIdentifierSchema()).optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			statusReason: createCodeableConceptSchema().optional(),
			vaccineCode: createCodeableConceptSchema(),
			patient: createReferenceSchema(),
			encounter: createReferenceSchema().optional(),
			occurrenceDateTime: z.string().optional(),
			_occurrenceDateTime: createElementSchema().optional(),
			occurrenceString: z.string().optional(),
			_occurrenceString: createElementSchema().optional(),
			recorded: primitives.getDateTimeSchema().optional(),
			_recorded: createElementSchema().optional(),
			primarySource: primitives.getBooleanSchema().optional(),
			_primarySource: createElementSchema().optional(),
			reportOrigin: createCodeableConceptSchema().optional(),
			location: createReferenceSchema().optional(),
			manufacturer: createReferenceSchema().optional(),
			lotNumber: primitives.getStringSchema().optional(),
			_lotNumber: createElementSchema().optional(),
			expirationDate: primitives.getDateSchema().optional(),
			_expirationDate: createElementSchema().optional(),
			site: createCodeableConceptSchema().optional(),
			route: createCodeableConceptSchema().optional(),
			doseQuantity: createQuantitySchema().optional(),
			performer: z.array(createImmunizationPerformerSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			isSubpotent: primitives.getBooleanSchema().optional(),
			_isSubpotent: createElementSchema().optional(),
			subpotentReason: z.array(createCodeableConceptSchema()).optional(),
			education: z.array(createImmunizationEducationSchema()).optional(),
			programEligibility: z.array(createCodeableConceptSchema()).optional(),
			fundingSource: createCodeableConceptSchema().optional(),
			reaction: z.array(createImmunizationReactionSchema()).optional(),
			protocolApplied: z.array(createImmunizationProtocolAppliedSchema()).optional(),
		})

		return baseSchema
	})
}

export function createImmunizationPerformerSchema() {
	return getCachedSchema('ImmunizationPerformer', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationPerformer> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			function: createCodeableConceptSchema().optional(),
			actor: createReferenceSchema(),
		})

		return baseSchema
	})
}

export function createImmunizationEducationSchema() {
	return getCachedSchema('ImmunizationEducation', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationEducation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			documentType: primitives.getStringSchema().optional(),
			_documentType: createElementSchema().optional(),
			reference: primitives.getUriSchema().optional(),
			_reference: createElementSchema().optional(),
			publicationDate: primitives.getDateTimeSchema().optional(),
			_publicationDate: createElementSchema().optional(),
			presentationDate: primitives.getDateTimeSchema().optional(),
			_presentationDate: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImmunizationReactionSchema() {
	return getCachedSchema('ImmunizationReaction', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationReaction> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			detail: createReferenceSchema().optional(),
			reported: primitives.getBooleanSchema().optional(),
			_reported: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImmunizationProtocolAppliedSchema() {
	return getCachedSchema('ImmunizationProtocolApplied', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationProtocolApplied> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			series: primitives.getStringSchema().optional(),
			_series: createElementSchema().optional(),
			authority: createReferenceSchema().optional(),
			targetDisease: z.array(createCodeableConceptSchema()).optional(),
			doseNumberPositiveInt: z.number().optional(),
			_doseNumberPositiveInt: createElementSchema().optional(),
			doseNumberString: z.string().optional(),
			_doseNumberString: createElementSchema().optional(),
			seriesDosesPositiveInt: z.number().optional(),
			_seriesDosesPositiveInt: createElementSchema().optional(),
			seriesDosesString: z.string().optional(),
			_seriesDosesString: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImmunizationEvaluationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ImmunizationEvaluation', [contained], () => {
		const baseSchema: z.ZodType<types.ImmunizationEvaluation<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ImmunizationEvaluation'),
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
			identifier: z.array(createIdentifierSchema()).optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			patient: createReferenceSchema(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			authority: createReferenceSchema().optional(),
			targetDisease: createCodeableConceptSchema(),
			immunizationEvent: createReferenceSchema(),
			doseStatus: createCodeableConceptSchema(),
			doseStatusReason: z.array(createCodeableConceptSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			series: primitives.getStringSchema().optional(),
			_series: createElementSchema().optional(),
			doseNumberPositiveInt: z.number().optional(),
			_doseNumberPositiveInt: createElementSchema().optional(),
			doseNumberString: z.string().optional(),
			_doseNumberString: createElementSchema().optional(),
			seriesDosesPositiveInt: z.number().optional(),
			_seriesDosesPositiveInt: createElementSchema().optional(),
			seriesDosesString: z.string().optional(),
			_seriesDosesString: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImmunizationRecommendationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ImmunizationRecommendation', [contained], () => {
		const baseSchema: z.ZodType<types.ImmunizationRecommendation<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ImmunizationRecommendation'),
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
			identifier: z.array(createIdentifierSchema()).optional(),
			patient: createReferenceSchema(),
			date: primitives.getDateTimeSchema(),
			_date: createElementSchema().optional(),
			authority: createReferenceSchema().optional(),
			recommendation: z.array(createImmunizationRecommendationRecommendationSchema()),
		})

		return baseSchema
	})
}

export function createImmunizationRecommendationRecommendationSchema() {
	return getCachedSchema('ImmunizationRecommendationRecommendation', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationRecommendationRecommendation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			vaccineCode: z.array(createCodeableConceptSchema()).optional(),
			targetDisease: createCodeableConceptSchema().optional(),
			contraindicatedVaccineCode: z.array(createCodeableConceptSchema()).optional(),
			forecastStatus: createCodeableConceptSchema(),
			forecastReason: z.array(createCodeableConceptSchema()).optional(),
			dateCriterion: z.array(createImmunizationRecommendationDateCriterionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			series: primitives.getStringSchema().optional(),
			_series: createElementSchema().optional(),
			doseNumberPositiveInt: z.number().optional(),
			_doseNumberPositiveInt: createElementSchema().optional(),
			doseNumberString: z.string().optional(),
			_doseNumberString: createElementSchema().optional(),
			seriesDosesPositiveInt: z.number().optional(),
			_seriesDosesPositiveInt: createElementSchema().optional(),
			seriesDosesString: z.string().optional(),
			_seriesDosesString: createElementSchema().optional(),
			supportingImmunization: z.array(createReferenceSchema()).optional(),
			supportingPatientInformation: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createImmunizationRecommendationDateCriterionSchema() {
	return getCachedSchema('ImmunizationRecommendationDateCriterion', [], () => {
		const baseSchema: z.ZodType<types.ImmunizationRecommendationDateCriterion> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: createCodeableConceptSchema(),
			value: primitives.getDateTimeSchema().optional(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}
