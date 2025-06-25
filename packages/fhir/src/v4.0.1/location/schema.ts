import { z } from 'zod/v4'

import {
	createAddressSchema,
	createCodeableConceptSchema,
	createCodingSchema,
	createContactPointSchema,
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

export function createLocationSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Location', [contained], () => {
		const baseSchema: z.ZodType<types.Location<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Location'),
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
			status: z.enum(['active', 'suspended', 'inactive']).optional(),
			_status: createElementSchema().optional(),
			operationalStatus: createCodingSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			alias: z.array(primitives.getStringSchema()).optional(),
			_alias: z.array(createElementSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			mode: z.enum(['instance', 'kind']).optional(),
			_mode: createElementSchema().optional(),
			type: z.array(createCodeableConceptSchema()).optional(),
			telecom: z.array(createContactPointSchema()).optional(),
			address: createAddressSchema().optional(),
			physicalType: createCodeableConceptSchema().optional(),
			position: createLocationPositionSchema().optional(),
			managingOrganization: createReferenceSchema().optional(),
			partOf: createReferenceSchema().optional(),
			hoursOfOperation: z.array(createLocationHoursOfOperationSchema()).optional(),
			availabilityExceptions: primitives.getStringSchema().optional(),
			_availabilityExceptions: createElementSchema().optional(),
			endpoint: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createLocationPositionSchema() {
	return getCachedSchema('LocationPosition', [], () => {
		const baseSchema: z.ZodType<types.LocationPosition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			longitude: primitives.getDecimalSchema(),
			_longitude: createElementSchema().optional(),
			latitude: primitives.getDecimalSchema(),
			_latitude: createElementSchema().optional(),
			altitude: primitives.getDecimalSchema().optional(),
			_altitude: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createLocationHoursOfOperationSchema() {
	return getCachedSchema('LocationHoursOfOperation', [], () => {
		const baseSchema: z.ZodType<types.LocationHoursOfOperation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			daysOfWeek: z.array(primitives.getCodeSchema()).optional(),
			_daysOfWeek: z.array(createElementSchema()).optional(),
			allDay: primitives.getBooleanSchema().optional(),
			_allDay: createElementSchema().optional(),
			openingTime: primitives.getTimeSchema().optional(),
			_openingTime: createElementSchema().optional(),
			closingTime: primitives.getTimeSchema().optional(),
			_closingTime: createElementSchema().optional(),
		})

		return baseSchema
	})
}
