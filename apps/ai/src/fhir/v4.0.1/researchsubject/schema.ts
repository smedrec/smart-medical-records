import { z } from 'zod/v4'

import {
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

export function createResearchSubjectSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ResearchSubject', [contained], () => {
		const baseSchema: z.ZodType<types.ResearchSubject<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ResearchSubject'),
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
			status: z.enum([
				'candidate',
				'eligible',
				'follow-up',
				'ineligible',
				'not-registered',
				'off-study',
				'on-study',
				'on-study-intervention',
				'on-study-observation',
				'pending-on-study',
				'potential-candidate',
				'screening',
				'withdrawn',
			]),
			_status: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
			study: createReferenceSchema(),
			individual: createReferenceSchema(),
			assignedArm: primitives.getStringSchema().optional(),
			_assignedArm: createElementSchema().optional(),
			actualArm: primitives.getStringSchema().optional(),
			_actualArm: createElementSchema().optional(),
			consent: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}
