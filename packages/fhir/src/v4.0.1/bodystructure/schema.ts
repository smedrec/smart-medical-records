import { z } from 'zod/v4'

import {
	createAttachmentSchema,
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

export function createBodyStructureSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('BodyStructure', [contained], () => {
		const baseSchema: z.ZodType<types.BodyStructure<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('BodyStructure'),
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
			morphology: createCodeableConceptSchema().optional(),
			location: createCodeableConceptSchema().optional(),
			locationQualifier: z.array(createCodeableConceptSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			image: z.array(createAttachmentSchema()).optional(),
			patient: createReferenceSchema(),
		})

		return baseSchema
	})
}
