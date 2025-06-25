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
	createTimingSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createServiceRequestSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ServiceRequest', [contained], () => {
		const baseSchema: z.ZodType<types.ServiceRequest<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ServiceRequest'),
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
			instantiatesCanonical: z.array(primitives.getCanonicalSchema()).optional(),
			instantiatesUri: z.array(primitives.getUriSchema()).optional(),
			_instantiatesUri: z.array(createElementSchema()).optional(),
			basedOn: z.array(createReferenceSchema()).optional(),
			replaces: z.array(createReferenceSchema()).optional(),
			requisition: createIdentifierSchema().optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			intent: primitives.getCodeSchema(),
			_intent: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			priority: primitives.getCodeSchema().optional(),
			_priority: createElementSchema().optional(),
			doNotPerform: primitives.getBooleanSchema().optional(),
			_doNotPerform: createElementSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			orderDetail: z.array(createCodeableConceptSchema()).optional(),
			quantityQuantity: createQuantitySchema().optional(),
			quantityRatio: createRatioSchema().optional(),
			quantityRange: createRangeSchema().optional(),
			subject: createReferenceSchema(),
			encounter: createReferenceSchema().optional(),
			occurrenceDateTime: z.string().optional(),
			_occurrenceDateTime: createElementSchema().optional(),
			occurrencePeriod: createPeriodSchema().optional(),
			occurrenceTiming: createTimingSchema().optional(),
			asNeededBoolean: z.boolean().optional(),
			_asNeededBoolean: createElementSchema().optional(),
			asNeededCodeableConcept: createCodeableConceptSchema().optional(),
			authoredOn: primitives.getDateTimeSchema().optional(),
			_authoredOn: createElementSchema().optional(),
			requester: createReferenceSchema().optional(),
			performerType: createCodeableConceptSchema().optional(),
			performer: z.array(createReferenceSchema()).optional(),
			locationCode: z.array(createCodeableConceptSchema()).optional(),
			locationReference: z.array(createReferenceSchema()).optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			insurance: z.array(createReferenceSchema()).optional(),
			supportingInfo: z.array(createReferenceSchema()).optional(),
			specimen: z.array(createReferenceSchema()).optional(),
			bodySite: z.array(createCodeableConceptSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			patientInstruction: primitives.getStringSchema().optional(),
			_patientInstruction: createElementSchema().optional(),
			relevantHistory: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}
