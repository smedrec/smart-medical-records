import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createQuantitySchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createVisionPrescriptionSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('VisionPrescription', [contained], () => {
		const baseSchema: z.ZodType<types.VisionPrescription<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('VisionPrescription'),
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
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			created: primitives.getDateTimeSchema(),
			_created: createElementSchema().optional(),
			patient: createReferenceSchema(),
			encounter: createReferenceSchema().optional(),
			dateWritten: primitives.getDateTimeSchema(),
			_dateWritten: createElementSchema().optional(),
			prescriber: createReferenceSchema(),
			lensSpecification: z.array(createVisionPrescriptionLensSpecificationSchema()),
		})

		return baseSchema
	})
}

export function createVisionPrescriptionLensSpecificationSchema() {
	return getCachedSchema('VisionPrescriptionLensSpecification', [], () => {
		const baseSchema: z.ZodType<types.VisionPrescriptionLensSpecification> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			product: createCodeableConceptSchema(),
			eye: z.enum(['right', 'left']),
			_eye: createElementSchema().optional(),
			sphere: primitives.getDecimalSchema().optional(),
			_sphere: createElementSchema().optional(),
			cylinder: primitives.getDecimalSchema().optional(),
			_cylinder: createElementSchema().optional(),
			axis: primitives.getIntegerSchema().optional(),
			_axis: createElementSchema().optional(),
			prism: z.array(createVisionPrescriptionPrismSchema()).optional(),
			add: primitives.getDecimalSchema().optional(),
			_add: createElementSchema().optional(),
			power: primitives.getDecimalSchema().optional(),
			_power: createElementSchema().optional(),
			backCurve: primitives.getDecimalSchema().optional(),
			_backCurve: createElementSchema().optional(),
			diameter: primitives.getDecimalSchema().optional(),
			_diameter: createElementSchema().optional(),
			duration: createQuantitySchema().optional(),
			color: primitives.getStringSchema().optional(),
			_color: createElementSchema().optional(),
			brand: primitives.getStringSchema().optional(),
			_brand: createElementSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createVisionPrescriptionPrismSchema() {
	return getCachedSchema('VisionPrescriptionPrism', [], () => {
		const baseSchema: z.ZodType<types.VisionPrescriptionPrism> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			amount: primitives.getDecimalSchema().optional(),
			_amount: createElementSchema().optional(),
			base: z.enum(['up', 'down', 'in', 'out']).optional(),
			_base: createElementSchema().optional(),
		})

		return baseSchema
	})
}
