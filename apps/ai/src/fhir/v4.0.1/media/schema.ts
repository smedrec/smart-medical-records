import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createAttachmentSchema,
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

export function createMediaSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Media', [contained], () => {
		const baseSchema: z.ZodType<types.Media<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Media'),
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
			basedOn: z.array(createReferenceSchema()).optional(),
			partOf: z.array(createReferenceSchema()).optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			modality: createCodeableConceptSchema().optional(),
			view: createCodeableConceptSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			createdDateTime: z.string().optional(),
			_createdDateTime: createElementSchema().optional(),
			createdPeriod: createPeriodSchema().optional(),
			issued: primitives.getInstantSchema().optional(),
			_issued: createElementSchema().optional(),
			operator: createReferenceSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			bodySite: createCodeableConceptSchema().optional(),
			deviceName: primitives.getStringSchema().optional(),
			_deviceName: createElementSchema().optional(),
			device: createReferenceSchema().optional(),
			height: primitives.getPositiveIntSchema().optional(),
			_height: createElementSchema().optional(),
			width: primitives.getPositiveIntSchema().optional(),
			_width: createElementSchema().optional(),
			frames: primitives.getPositiveIntSchema().optional(),
			_frames: createElementSchema().optional(),
			duration: primitives.getDecimalSchema().optional(),
			_duration: createElementSchema().optional(),
			content: createAttachmentSchema(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}
