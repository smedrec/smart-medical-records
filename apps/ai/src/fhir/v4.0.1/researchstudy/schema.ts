import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createResearchStudySchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ResearchStudy', [contained], () => {
		const baseSchema: z.ZodType<types.ResearchStudy<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ResearchStudy'),
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
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			protocol: z.array(createReferenceSchema()).optional(),
			partOf: z.array(createReferenceSchema()).optional(),
			status: z.enum([
				'active',
				'administratively-completed',
				'approved',
				'closed-to-accrual',
				'closed-to-accrual-and-intervention',
				'completed',
				'disapproved',
				'in-review',
				'temporarily-closed-to-accrual',
				'temporarily-closed-to-accrual-and-intervention',
				'withdrawn',
			]),
			_status: createElementSchema().optional(),
			primaryPurposeType: createCodeableConceptSchema().optional(),
			phase: createCodeableConceptSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			focus: z.array(createCodeableConceptSchema()).optional(),
			condition: z.array(createCodeableConceptSchema()).optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
			keyword: z.array(createCodeableConceptSchema()).optional(),
			location: z.array(createCodeableConceptSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			enrollment: z.array(createReferenceSchema()).optional(),
			period: createPeriodSchema().optional(),
			sponsor: createReferenceSchema().optional(),
			principalInvestigator: createReferenceSchema().optional(),
			site: z.array(createReferenceSchema()).optional(),
			reasonStopped: createCodeableConceptSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
			arm: z.array(createResearchStudyArmSchema()).optional(),
			objective: z.array(createResearchStudyObjectiveSchema()).optional(),
		})

		return baseSchema
	})
}

export function createResearchStudyArmSchema() {
	return getCachedSchema('ResearchStudyArm', [], () => {
		const baseSchema: z.ZodType<types.ResearchStudyArm> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema(),
			_name: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createResearchStudyObjectiveSchema() {
	return getCachedSchema('ResearchStudyObjective', [], () => {
		const baseSchema: z.ZodType<types.ResearchStudyObjective> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}
