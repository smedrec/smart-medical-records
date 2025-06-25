import { z } from 'zod/v4'

import {
	createAddressSchema,
	createAttachmentSchema,
	createCodeableConceptSchema,
	createContactPointSchema,
	createElementSchema,
	createExtensionSchema,
	createHumanNameSchema,
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

export function createPractitionerSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Practitioner', [contained], () => {
		const baseSchema: z.ZodType<types.Practitioner<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Practitioner'),
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
			active: primitives.getBooleanSchema().optional(),
			_active: createElementSchema().optional(),
			name: z.array(createHumanNameSchema()).optional(),
			telecom: z.array(createContactPointSchema()).optional(),
			address: z.array(createAddressSchema()).optional(),
			gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
			_gender: createElementSchema().optional(),
			birthDate: primitives.getDateSchema().optional(),
			_birthDate: createElementSchema().optional(),
			photo: z.array(createAttachmentSchema()).optional(),
			qualification: z.array(createPractitionerQualificationSchema()).optional(),
			communication: z.array(createCodeableConceptSchema()).optional(),
		})

		return baseSchema
	})
}

export function createPractitionerQualificationSchema() {
	return getCachedSchema('PractitionerQualification', [], () => {
		const baseSchema: z.ZodType<types.PractitionerQualification> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			code: createCodeableConceptSchema(),
			period: createPeriodSchema().optional(),
			issuer: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createPractitionerRoleSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('PractitionerRole', [contained], () => {
		const baseSchema: z.ZodType<types.PractitionerRole<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('PractitionerRole'),
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
			active: primitives.getBooleanSchema().optional(),
			_active: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
			practitioner: createReferenceSchema().optional(),
			organization: createReferenceSchema().optional(),
			code: z.array(createCodeableConceptSchema()).optional(),
			specialty: z.array(createCodeableConceptSchema()).optional(),
			location: z.array(createReferenceSchema()).optional(),
			healthcareService: z.array(createReferenceSchema()).optional(),
			telecom: z.array(createContactPointSchema()).optional(),
			availableTime: z.array(createPractitionerRoleAvailableTimeSchema()).optional(),
			notAvailable: z.array(createPractitionerRoleNotAvailableSchema()).optional(),
			availabilityExceptions: primitives.getStringSchema().optional(),
			_availabilityExceptions: createElementSchema().optional(),
			endpoint: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createPractitionerRoleAvailableTimeSchema() {
	return getCachedSchema('PractitionerRoleAvailableTime', [], () => {
		const baseSchema: z.ZodType<types.PractitionerRoleAvailableTime> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			daysOfWeek: z.array(primitives.getCodeSchema()).optional(),
			_daysOfWeek: z.array(createElementSchema()).optional(),
			allDay: primitives.getBooleanSchema().optional(),
			_allDay: createElementSchema().optional(),
			availableStartTime: primitives.getTimeSchema().optional(),
			_availableStartTime: createElementSchema().optional(),
			availableEndTime: primitives.getTimeSchema().optional(),
			_availableEndTime: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createPractitionerRoleNotAvailableSchema() {
	return getCachedSchema('PractitionerRoleNotAvailable', [], () => {
		const baseSchema: z.ZodType<types.PractitionerRoleNotAvailable> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema(),
			_description: createElementSchema().optional(),
			during: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}
