import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createQuantitySchema,
	createRangeSchema,
	createRatioSchema,
	createReferenceSchema,
	createSampledDataSchema,
	createTimingSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createObservationSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Observation', [contained], () => {
		const baseSchema: z.ZodType<types.Observation<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Observation'),
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
			basedOn: z.array(createReferenceSchema()).optional(),
			partOf: z.array(createReferenceSchema()).optional(),
			status: z.enum([
				'registered',
				'preliminary',
				'final',
				'amended',
				'corrected',
				'cancelled',
				'entered-in-error',
				'unknown',
			]),
			_status: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			code: createCodeableConceptSchema(),
			subject: createReferenceSchema().optional(),
			focus: z.array(createReferenceSchema()).optional(),
			encounter: createReferenceSchema().optional(),
			effectiveDateTime: z.string().optional(),
			_effectiveDateTime: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			effectiveTiming: createTimingSchema().optional(),
			effectiveInstant: z.string().optional(),
			_effectiveInstant: createElementSchema().optional(),
			issued: primitives.getInstantSchema().optional(),
			_issued: createElementSchema().optional(),
			performer: z.array(createReferenceSchema()).optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueCodeableConcept: createCodeableConceptSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueRange: createRangeSchema().optional(),
			valueRatio: createRatioSchema().optional(),
			valueSampledData: createSampledDataSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valuePeriod: createPeriodSchema().optional(),
			dataAbsentReason: createCodeableConceptSchema().optional(),
			interpretation: z.array(createCodeableConceptSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			bodySite: createCodeableConceptSchema().optional(),
			method: createCodeableConceptSchema().optional(),
			specimen: createReferenceSchema().optional(),
			device: createReferenceSchema().optional(),
			referenceRange: z.array(createObservationReferenceRangeSchema()).optional(),
			hasMember: z.array(createReferenceSchema()).optional(),
			derivedFrom: z.array(createReferenceSchema()).optional(),
			component: z.array(createObservationComponentSchema()).optional(),
		})

		return baseSchema
	})
}

export function createObservationReferenceRangeSchema() {
	return getCachedSchema('ObservationReferenceRange', [], () => {
		const baseSchema: z.ZodType<types.ObservationReferenceRange> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			low: createQuantitySchema().optional(),
			high: createQuantitySchema().optional(),
			type: createCodeableConceptSchema().optional(),
			appliesTo: z.array(createCodeableConceptSchema()).optional(),
			age: createRangeSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createObservationComponentSchema() {
	return getCachedSchema('ObservationComponent', [], () => {
		const baseSchema: z.ZodType<types.ObservationComponent> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: createCodeableConceptSchema(),
			valueQuantity: createQuantitySchema().optional(),
			valueCodeableConcept: createCodeableConceptSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueRange: createRangeSchema().optional(),
			valueRatio: createRatioSchema().optional(),
			valueSampledData: createSampledDataSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valuePeriod: createPeriodSchema().optional(),
			dataAbsentReason: createCodeableConceptSchema().optional(),
			interpretation: z.array(createCodeableConceptSchema()).optional(),
			referenceRange: z.array(createObservationReferenceRangeSchema()).optional(),
		})

		return baseSchema
	})
}

export function createObservationDefinitionSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ObservationDefinition', [contained], () => {
		const baseSchema: z.ZodType<types.ObservationDefinition<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ObservationDefinition'),
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
			category: z.array(createCodeableConceptSchema()).optional(),
			code: createCodeableConceptSchema(),
			identifier: z.array(createIdentifierSchema()).optional(),
			permittedDataType: z
				.enum([
					'Quantity',
					'CodeableConcept',
					'string',
					'boolean',
					'integer',
					'Range',
					'Ratio',
					'SampledData',
					'time',
					'dateTime',
					'Period',
				])
				.array()
				.optional(),
			_permittedDataType: z.array(createElementSchema()).optional(),
			multipleResultsAllowed: primitives.getBooleanSchema().optional(),
			_multipleResultsAllowed: createElementSchema().optional(),
			method: createCodeableConceptSchema().optional(),
			preferredReportName: primitives.getStringSchema().optional(),
			_preferredReportName: createElementSchema().optional(),
			quantitativeDetails: createObservationDefinitionQuantitativeDetailsSchema().optional(),
			qualifiedInterval: z.array(createObservationDefinitionQualifiedIntervalSchema()).optional(),
			validCodedValueSet: createReferenceSchema().optional(),
			normalCodedValueSet: createReferenceSchema().optional(),
			abnormalCodedValueSet: createReferenceSchema().optional(),
			criticalCodedValueSet: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createObservationDefinitionQuantitativeDetailsSchema() {
	return getCachedSchema('ObservationDefinitionQuantitativeDetails', [], () => {
		const baseSchema: z.ZodType<types.ObservationDefinitionQuantitativeDetails> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			customaryUnit: createCodeableConceptSchema().optional(),
			unit: createCodeableConceptSchema().optional(),
			conversionFactor: primitives.getDecimalSchema().optional(),
			_conversionFactor: createElementSchema().optional(),
			decimalPrecision: primitives.getIntegerSchema().optional(),
			_decimalPrecision: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createObservationDefinitionQualifiedIntervalSchema() {
	return getCachedSchema('ObservationDefinitionQualifiedInterval', [], () => {
		const baseSchema: z.ZodType<types.ObservationDefinitionQualifiedInterval> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: z.enum(['reference', 'critical', 'absolute']).optional(),
			_category: createElementSchema().optional(),
			range: createRangeSchema().optional(),
			context: createCodeableConceptSchema().optional(),
			appliesTo: z.array(createCodeableConceptSchema()).optional(),
			gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
			_gender: createElementSchema().optional(),
			age: createRangeSchema().optional(),
			gestationalAge: createRangeSchema().optional(),
			condition: primitives.getStringSchema().optional(),
			_condition: createElementSchema().optional(),
		})

		return baseSchema
	})
}
