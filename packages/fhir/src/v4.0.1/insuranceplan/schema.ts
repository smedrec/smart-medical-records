import { z } from 'zod/v4'

import {
	createAddressSchema,
	createCodeableConceptSchema,
	createContactPointSchema,
	createElementSchema,
	createExtensionSchema,
	createHumanNameSchema,
	createIdentifierSchema,
	createMetaSchema,
	createMoneySchema,
	createPeriodSchema,
	createQuantitySchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createInsurancePlanSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('InsurancePlan', [contained], () => {
		const baseSchema: z.ZodType<types.InsurancePlan<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('InsurancePlan'),
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
			status: z.enum(['draft', 'active', 'retired', 'unknown']).optional(),
			_status: createElementSchema().optional(),
			type: z.array(createCodeableConceptSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			alias: z.array(primitives.getStringSchema()).optional(),
			_alias: z.array(createElementSchema()).optional(),
			period: createPeriodSchema().optional(),
			ownedBy: createReferenceSchema().optional(),
			administeredBy: createReferenceSchema().optional(),
			coverageArea: z.array(createReferenceSchema()).optional(),
			contact: z.array(createInsurancePlanContactSchema()).optional(),
			endpoint: z.array(createReferenceSchema()).optional(),
			network: z.array(createReferenceSchema()).optional(),
			coverage: z.array(createInsurancePlanCoverageSchema()).optional(),
			plan: z.array(createInsurancePlanPlanSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanContactSchema() {
	return getCachedSchema('InsurancePlanContact', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanContact> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			purpose: createCodeableConceptSchema().optional(),
			name: createHumanNameSchema().optional(),
			telecom: z.array(createContactPointSchema()).optional(),
			address: createAddressSchema().optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanCoverageSchema() {
	return getCachedSchema('InsurancePlanCoverage', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanCoverage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema(),
			network: z.array(createReferenceSchema()).optional(),
			benefit: z.array(createInsurancePlanBenefitSchema()),
		})

		return baseSchema
	})
}

export function createInsurancePlanBenefitSchema() {
	return getCachedSchema('InsurancePlanBenefit', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanBenefit> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema(),
			requirement: primitives.getStringSchema().optional(),
			_requirement: createElementSchema().optional(),
			limit: z.array(createInsurancePlanLimitSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanLimitSchema() {
	return getCachedSchema('InsurancePlanLimit', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanLimit> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			value: createQuantitySchema().optional(),
			code: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanPlanSchema() {
	return getCachedSchema('InsurancePlanPlan', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanPlan> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			coverageArea: z.array(createReferenceSchema()).optional(),
			network: z.array(createReferenceSchema()).optional(),
			generalCost: z.array(createInsurancePlanGeneralCostSchema()).optional(),
			specificCost: z.array(createInsurancePlanSpecificCostSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanGeneralCostSchema() {
	return getCachedSchema('InsurancePlanGeneralCost', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanGeneralCost> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			groupSize: primitives.getPositiveIntSchema().optional(),
			_groupSize: createElementSchema().optional(),
			cost: createMoneySchema().optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanSpecificCostSchema() {
	return getCachedSchema('InsurancePlanSpecificCost', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanSpecificCost> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: createCodeableConceptSchema(),
			benefit: z.array(createInsurancePlanBenefit1Schema()).optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanBenefit1Schema() {
	return getCachedSchema('InsurancePlanBenefit1', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanBenefit1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema(),
			cost: z.array(createInsurancePlanCostSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInsurancePlanCostSchema() {
	return getCachedSchema('InsurancePlanCost', [], () => {
		const baseSchema: z.ZodType<types.InsurancePlanCost> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema(),
			applicability: createCodeableConceptSchema().optional(),
			qualifiers: z.array(createCodeableConceptSchema()).optional(),
			value: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}
