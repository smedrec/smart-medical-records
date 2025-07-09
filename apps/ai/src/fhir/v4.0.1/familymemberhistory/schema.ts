import { z } from 'zod/v4'

import {
	createAgeSchema,
	createAnnotationSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createRangeSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createFamilyMemberHistorySchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('FamilyMemberHistory', [contained], () => {
		const baseSchema: z.ZodType<types.FamilyMemberHistory<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('FamilyMemberHistory'),
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
			status: z.enum(['partial', 'completed', 'entered-in-error', 'health-unknown']),
			_status: createElementSchema().optional(),
			dataAbsentReason: createCodeableConceptSchema().optional(),
			patient: createReferenceSchema(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			relationship: createCodeableConceptSchema(),
			sex: createCodeableConceptSchema().optional(),
			bornPeriod: createPeriodSchema().optional(),
			bornDate: z.string().optional(),
			_bornDate: createElementSchema().optional(),
			bornString: z.string().optional(),
			_bornString: createElementSchema().optional(),
			ageAge: createAgeSchema().optional(),
			ageRange: createRangeSchema().optional(),
			ageString: z.string().optional(),
			_ageString: createElementSchema().optional(),
			estimatedAge: primitives.getBooleanSchema().optional(),
			_estimatedAge: createElementSchema().optional(),
			deceasedBoolean: z.boolean().optional(),
			_deceasedBoolean: createElementSchema().optional(),
			deceasedAge: createAgeSchema().optional(),
			deceasedRange: createRangeSchema().optional(),
			deceasedDate: z.string().optional(),
			_deceasedDate: createElementSchema().optional(),
			deceasedString: z.string().optional(),
			_deceasedString: createElementSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			condition: z.array(createFamilyMemberHistoryConditionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createFamilyMemberHistoryConditionSchema() {
	return getCachedSchema('FamilyMemberHistoryCondition', [], () => {
		const baseSchema: z.ZodType<types.FamilyMemberHistoryCondition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: createCodeableConceptSchema(),
			outcome: createCodeableConceptSchema().optional(),
			contributedToDeath: primitives.getBooleanSchema().optional(),
			_contributedToDeath: createElementSchema().optional(),
			onsetAge: createAgeSchema().optional(),
			onsetRange: createRangeSchema().optional(),
			onsetPeriod: createPeriodSchema().optional(),
			onsetString: z.string().optional(),
			_onsetString: createElementSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}
