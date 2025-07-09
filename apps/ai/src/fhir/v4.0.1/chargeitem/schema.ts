import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createMoneySchema,
	createPeriodSchema,
	createQuantitySchema,
	createReferenceSchema,
	createTimingSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createChargeItemSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ChargeItem', [contained], () => {
		const baseSchema: z.ZodType<types.ChargeItem<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ChargeItem'),
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
			definitionUri: z.array(primitives.getUriSchema()).optional(),
			_definitionUri: z.array(createElementSchema()).optional(),
			definitionCanonical: z.array(primitives.getCanonicalSchema()).optional(),
			status: z.enum([
				'planned',
				'billable',
				'not-billable',
				'aborted',
				'billed',
				'entered-in-error',
				'unknown',
			]),
			_status: createElementSchema().optional(),
			partOf: z.array(createReferenceSchema()).optional(),
			code: createCodeableConceptSchema(),
			subject: createReferenceSchema(),
			context: createReferenceSchema().optional(),
			occurrenceDateTime: z.string().optional(),
			_occurrenceDateTime: createElementSchema().optional(),
			occurrencePeriod: createPeriodSchema().optional(),
			occurrenceTiming: createTimingSchema().optional(),
			performer: z.array(createChargeItemPerformerSchema()).optional(),
			performingOrganization: createReferenceSchema().optional(),
			requestingOrganization: createReferenceSchema().optional(),
			costCenter: createReferenceSchema().optional(),
			quantity: createQuantitySchema().optional(),
			bodysite: z.array(createCodeableConceptSchema()).optional(),
			factorOverride: primitives.getDecimalSchema().optional(),
			_factorOverride: createElementSchema().optional(),
			priceOverride: createMoneySchema().optional(),
			overrideReason: primitives.getStringSchema().optional(),
			_overrideReason: createElementSchema().optional(),
			enterer: createReferenceSchema().optional(),
			enteredDate: primitives.getDateTimeSchema().optional(),
			_enteredDate: createElementSchema().optional(),
			reason: z.array(createCodeableConceptSchema()).optional(),
			service: z.array(createReferenceSchema()).optional(),
			productReference: createReferenceSchema().optional(),
			productCodeableConcept: createCodeableConceptSchema().optional(),
			account: z.array(createReferenceSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			supportingInformation: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createChargeItemPerformerSchema() {
	return getCachedSchema('ChargeItemPerformer', [], () => {
		const baseSchema: z.ZodType<types.ChargeItemPerformer> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			function: createCodeableConceptSchema().optional(),
			actor: createReferenceSchema(),
		})

		return baseSchema
	})
}

export function createChargeItemDefinitionSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ChargeItemDefinition', [contained], () => {
		const baseSchema: z.ZodType<types.ChargeItemDefinition<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ChargeItemDefinition'),
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
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			derivedFromUri: z.array(primitives.getUriSchema()).optional(),
			_derivedFromUri: z.array(createElementSchema()).optional(),
			partOf: z.array(primitives.getCanonicalSchema()).optional(),
			replaces: z.array(primitives.getCanonicalSchema()).optional(),
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
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			approvalDate: primitives.getDateSchema().optional(),
			_approvalDate: createElementSchema().optional(),
			lastReviewDate: primitives.getDateSchema().optional(),
			_lastReviewDate: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			instance: z.array(createReferenceSchema()).optional(),
			applicability: z.array(createChargeItemDefinitionApplicabilitySchema()).optional(),
			propertyGroup: z.array(createChargeItemDefinitionPropertyGroupSchema()).optional(),
		})

		return baseSchema
	})
}

export function createChargeItemDefinitionApplicabilitySchema() {
	return getCachedSchema('ChargeItemDefinitionApplicability', [], () => {
		const baseSchema: z.ZodType<types.ChargeItemDefinitionApplicability> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			language: primitives.getStringSchema().optional(),
			_language: createElementSchema().optional(),
			expression: primitives.getStringSchema().optional(),
			_expression: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createChargeItemDefinitionPropertyGroupSchema() {
	return getCachedSchema('ChargeItemDefinitionPropertyGroup', [], () => {
		const baseSchema: z.ZodType<types.ChargeItemDefinitionPropertyGroup> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			applicability: z.array(createChargeItemDefinitionApplicabilitySchema()).optional(),
			priceComponent: z.array(createChargeItemDefinitionPriceComponentSchema()).optional(),
		})

		return baseSchema
	})
}

export function createChargeItemDefinitionPriceComponentSchema() {
	return getCachedSchema('ChargeItemDefinitionPriceComponent', [], () => {
		const baseSchema: z.ZodType<types.ChargeItemDefinitionPriceComponent> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: primitives.getCodeSchema().optional(),
			_type: createElementSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			amount: createMoneySchema().optional(),
		})

		return baseSchema
	})
}
