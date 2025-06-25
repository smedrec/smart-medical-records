import { z } from 'zod/v4'

import {
	createAgeSchema,
	createAnnotationSchema,
	createCodeableConceptSchema,
	createDurationSchema,
	createElementSchema,
	createExpressionSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createRangeSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
	createTimingSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createRequestGroupSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('RequestGroup', [contained], () => {
		const baseSchema: z.ZodType<types.RequestGroup<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('RequestGroup'),
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
			_instantiatesCanonical: z.array(createElementSchema()).optional(),
			instantiatesUri: z.array(primitives.getUriSchema()).optional(),
			_instantiatesUri: z.array(createElementSchema()).optional(),
			basedOn: z.array(createReferenceSchema()).optional(),
			replaces: z.array(createReferenceSchema()).optional(),
			groupIdentifier: createIdentifierSchema().optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			intent: primitives.getCodeSchema(),
			_intent: createElementSchema().optional(),
			priority: primitives.getCodeSchema().optional(),
			_priority: createElementSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			authoredOn: primitives.getDateTimeSchema().optional(),
			_authoredOn: createElementSchema().optional(),
			author: createReferenceSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
			action: z.array(createRequestGroupActionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createRequestGroupActionSchema() {
	return getCachedSchema('RequestGroupAction', [], () => {
		const baseSchema: z.ZodType<types.RequestGroupAction> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			prefix: primitives.getStringSchema().optional(),
			_prefix: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			textEquivalent: primitives.getStringSchema().optional(),
			_textEquivalent: createElementSchema().optional(),
			priority: primitives.getCodeSchema().optional(),
			_priority: createElementSchema().optional(),
			code: z.array(createCodeableConceptSchema()).optional(),
			documentation: z.array(createRelatedArtifactSchema()).optional(),
			condition: z.array(createRequestGroupConditionSchema()).optional(),
			relatedAction: z.array(createRequestGroupRelatedActionSchema()).optional(),
			timingDateTime: z.string().optional(),
			_timingDateTime: createElementSchema().optional(),
			timingAge: createAgeSchema().optional(),
			timingPeriod: createPeriodSchema().optional(),
			timingDuration: createDurationSchema().optional(),
			timingRange: createRangeSchema().optional(),
			timingTiming: createTimingSchema().optional(),
			participant: z.array(createReferenceSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			groupingBehavior: primitives.getCodeSchema().optional(),
			_groupingBehavior: createElementSchema().optional(),
			selectionBehavior: primitives.getCodeSchema().optional(),
			_selectionBehavior: createElementSchema().optional(),
			requiredBehavior: primitives.getCodeSchema().optional(),
			_requiredBehavior: createElementSchema().optional(),
			precheckBehavior: primitives.getCodeSchema().optional(),
			_precheckBehavior: createElementSchema().optional(),
			cardinalityBehavior: primitives.getCodeSchema().optional(),
			_cardinalityBehavior: createElementSchema().optional(),
			resource: createReferenceSchema().optional(),
			action: z.array(createRequestGroupActionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createRequestGroupConditionSchema() {
	return getCachedSchema('RequestGroupCondition', [], () => {
		const baseSchema: z.ZodType<types.RequestGroupCondition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			kind: primitives.getCodeSchema().optional(),
			_kind: createElementSchema().optional(),
			expression: createExpressionSchema().optional(),
		})

		return baseSchema
	})
}

export function createRequestGroupRelatedActionSchema() {
	return getCachedSchema('RequestGroupRelatedAction', [], () => {
		const baseSchema: z.ZodType<types.RequestGroupRelatedAction> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			actionId: primitives.getIdSchema().optional(),
			_actionId: createElementSchema().optional(),
			relationship: primitives.getCodeSchema().optional(),
			_relationship: createElementSchema().optional(),
			offsetDuration: createDurationSchema().optional(),
			offsetRange: createRangeSchema().optional(),
		})

		return baseSchema
	})
}
