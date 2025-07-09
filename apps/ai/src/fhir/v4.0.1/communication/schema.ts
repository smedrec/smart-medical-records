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

export function createCommunicationSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Communication', [contained], () => {
		const baseSchema: z.ZodType<types.Communication<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Communication'),
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
			partOf: z.array(createReferenceSchema()).optional(),
			inResponseTo: z.array(createReferenceSchema()).optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			statusReason: createCodeableConceptSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			priority: primitives.getCodeSchema().optional(),
			_priority: createElementSchema().optional(),
			medium: z.array(createCodeableConceptSchema()).optional(),
			subject: createReferenceSchema().optional(),
			topic: createCodeableConceptSchema().optional(),
			about: z.array(createReferenceSchema()).optional(),
			encounter: createReferenceSchema().optional(),
			sent: primitives.getDateTimeSchema().optional(),
			_sent: createElementSchema().optional(),
			received: primitives.getDateTimeSchema().optional(),
			_received: createElementSchema().optional(),
			recipient: z.array(createReferenceSchema()).optional(),
			sender: createReferenceSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			payload: z.array(createCommunicationPayloadSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createCommunicationPayloadSchema() {
	return getCachedSchema('CommunicationPayload', [], () => {
		const baseSchema: z.ZodType<types.CommunicationPayload> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			contentString: z.string().optional(),
			_contentString: createElementSchema().optional(),
			contentAttachment: createAttachmentSchema().optional(),
			contentReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createCommunicationRequestSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('CommunicationRequest', [contained], () => {
		const baseSchema: z.ZodType<types.CommunicationRequest<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('CommunicationRequest'),
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
			replaces: z.array(createReferenceSchema()).optional(),
			groupIdentifier: createIdentifierSchema().optional(),
			status: primitives.getCodeSchema(),
			_status: createElementSchema().optional(),
			statusReason: createCodeableConceptSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			priority: primitives.getCodeSchema().optional(),
			_priority: createElementSchema().optional(),
			doNotPerform: primitives.getBooleanSchema().optional(),
			_doNotPerform: createElementSchema().optional(),
			medium: z.array(createCodeableConceptSchema()).optional(),
			subject: createReferenceSchema().optional(),
			about: z.array(createReferenceSchema()).optional(),
			encounter: createReferenceSchema().optional(),
			payload: z.array(createCommunicationRequestPayloadSchema()).optional(),
			occurrenceDateTime: z.string().optional(),
			_occurrenceDateTime: createElementSchema().optional(),
			occurrencePeriod: createPeriodSchema().optional(),
			authoredOn: primitives.getDateTimeSchema().optional(),
			_authoredOn: createElementSchema().optional(),
			requester: createReferenceSchema().optional(),
			recipient: z.array(createReferenceSchema()).optional(),
			sender: createReferenceSchema().optional(),
			reasonCode: z.array(createCodeableConceptSchema()).optional(),
			reasonReference: z.array(createReferenceSchema()).optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createCommunicationRequestPayloadSchema() {
	return getCachedSchema('CommunicationRequestPayload', [], () => {
		const baseSchema: z.ZodType<types.CommunicationRequestPayload> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			contentString: z.string().optional(),
			_contentString: createElementSchema().optional(),
			contentAttachment: createAttachmentSchema().optional(),
			contentReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}
