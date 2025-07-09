import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createAccountSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Account', [contained], () => {
		const baseSchema: z.ZodType<types.Account<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Account'),
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
			status: z.enum(['active', 'inactive', 'entered-in-error', 'on-hold', 'unknown']),
			_status: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			subject: z.array(createReferenceSchema()).optional(),
			servicePeriod: createPeriodSchema().optional(),
			coverage: z.array(createAccountCoverageSchema()).optional(),
			owner: createReferenceSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			guarantor: z.array(createAccountGuarantorSchema()).optional(),
			partOf: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createAccountCoverageSchema() {
	return getCachedSchema('AccountCoverage', [], () => {
		const baseSchema: z.ZodType<types.AccountCoverage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			coverage: createReferenceSchema(),
			priority: primitives.getPositiveIntSchema().optional(),
			_priority: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createAccountGuarantorSchema() {
	return getCachedSchema('AccountGuarantor', [], () => {
		const baseSchema: z.ZodType<types.AccountGuarantor> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			party: createReferenceSchema(),
			onHold: primitives.getBooleanSchema().optional(),
			_onHold: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}
