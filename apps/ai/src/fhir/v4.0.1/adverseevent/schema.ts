import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createAdverseEventSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('AdverseEvent', [contained], () => {
		const baseSchema: z.ZodType<types.AdverseEvent<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('AdverseEvent'),
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
			identifier: createIdentifierSchema().optional(),
			actuality: z.enum(['actual', 'potential']),
			_actuality: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			event: createCodeableConceptSchema().optional(),
			subject: createReferenceSchema(),
			encounter: createReferenceSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			detected: primitives.getDateTimeSchema().optional(),
			_detected: createElementSchema().optional(),
			recordedDate: primitives.getDateTimeSchema().optional(),
			_recordedDate: createElementSchema().optional(),
			resultingCondition: z.array(createReferenceSchema()).optional(),
			location: createReferenceSchema().optional(),
			seriousness: createCodeableConceptSchema().optional(),
			severity: createCodeableConceptSchema().optional(),
			outcome: createCodeableConceptSchema().optional(),
			recorder: createReferenceSchema().optional(),
			contributor: z.array(createReferenceSchema()).optional(),
			suspectEntity: z.array(createAdverseEventSuspectEntitySchema()).optional(),
			subjectMedicalHistory: z.array(createReferenceSchema()).optional(),
			referenceDocument: z.array(createReferenceSchema()).optional(),
			study: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createAdverseEventSuspectEntitySchema() {
	return getCachedSchema('AdverseEventSuspectEntity', [], () => {
		const baseSchema: z.ZodType<types.AdverseEventSuspectEntity> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			instance: createReferenceSchema(),
			causality: z.array(createAdverseEventCausalitySchema()).optional(),
		})

		return baseSchema
	})
}

export function createAdverseEventCausalitySchema() {
	return getCachedSchema('AdverseEventCausality', [], () => {
		const baseSchema: z.ZodType<types.AdverseEventCausality> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			assessment: createCodeableConceptSchema().optional(),
			productRelatedness: primitives.getStringSchema().optional(),
			_productRelatedness: createElementSchema().optional(),
			author: createReferenceSchema().optional(),
			method: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}
