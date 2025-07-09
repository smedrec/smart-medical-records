import { z } from 'zod/v4'

import {
	createAttachmentSchema,
	createCodeableConceptSchema,
	createCodingSchema,
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

export function createConsentSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Consent', [contained], () => {
		const baseSchema: z.ZodType<types.Consent<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Consent'),
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
			status: z.enum(['draft', 'proposed', 'active', 'rejected', 'inactive', 'entered-in-error']),
			_status: createElementSchema().optional(),
			scope: createCodeableConceptSchema(),
			category: z.array(createCodeableConceptSchema()),
			patient: createReferenceSchema().optional(),
			dateTime: primitives.getDateTimeSchema().optional(),
			_dateTime: createElementSchema().optional(),
			performer: z.array(createReferenceSchema()).optional(),
			organization: z.array(createReferenceSchema()).optional(),
			sourceAttachment: createAttachmentSchema().optional(),
			sourceReference: createReferenceSchema().optional(),
			policy: z.array(createConsentPolicySchema()).optional(),
			policyRule: createCodeableConceptSchema().optional(),
			verification: z.array(createConsentVerificationSchema()).optional(),
			provision: createConsentProvisionSchema().optional(),
		})

		return baseSchema
	})
}

export function createConsentPolicySchema() {
	return getCachedSchema('ConsentPolicy', [], () => {
		const baseSchema: z.ZodType<types.ConsentPolicy> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			authority: primitives.getUriSchema().optional(),
			_authority: createElementSchema().optional(),
			uri: primitives.getUriSchema().optional(),
			_uri: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createConsentVerificationSchema() {
	return getCachedSchema('ConsentVerification', [], () => {
		const baseSchema: z.ZodType<types.ConsentVerification> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			verified: primitives.getBooleanSchema(),
			_verified: createElementSchema().optional(),
			verifiedWith: createReferenceSchema().optional(),
			verificationDate: primitives.getDateTimeSchema().optional(),
			_verificationDate: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createConsentProvisionSchema() {
	return getCachedSchema('ConsentProvision', [], () => {
		const baseSchema: z.ZodType<types.ConsentProvision> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: z.enum(['deny', 'permit']).optional(),
			_type: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
			actor: z.array(createConsentActorSchema()).optional(),
			action: z.array(createCodeableConceptSchema()).optional(),
			securityLabel: z.array(createCodingSchema()).optional(),
			purpose: z.array(createCodingSchema()).optional(),
			class: z.array(createCodingSchema()).optional(),
			code: z.array(createCodeableConceptSchema()).optional(),
			dataPeriod: createPeriodSchema().optional(),
			data: z.array(createConsentDataSchema()).optional(),
			provision: z.array(createConsentProvisionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createConsentActorSchema() {
	return getCachedSchema('ConsentActor', [], () => {
		const baseSchema: z.ZodType<types.ConsentActor> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			role: createCodeableConceptSchema(),
			reference: createReferenceSchema(),
		})

		return baseSchema
	})
}

export function createConsentDataSchema() {
	return getCachedSchema('ConsentData', [], () => {
		const baseSchema: z.ZodType<types.ConsentData> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			meaning: z.enum(['instance', 'related', 'dependents', 'authoredby']).optional(),
			_meaning: createElementSchema().optional(),
			reference: createReferenceSchema(),
		})

		return baseSchema
	})
}
