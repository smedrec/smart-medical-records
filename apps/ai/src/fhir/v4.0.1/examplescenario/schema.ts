import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createExampleScenarioSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ExampleScenario', [contained], () => {
		const baseSchema: z.ZodType<types.ExampleScenario<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ExampleScenario'),
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
			url: primitives.getUriSchema().optional(),
			_url: createElementSchema().optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			purpose: primitives.getMarkdownSchema().optional(),
			_purpose: createElementSchema().optional(),
			actor: z.array(createExampleScenarioActorSchema()).optional(),
			instance: z.array(createExampleScenarioInstanceSchema()).optional(),
			process: z.array(createExampleScenarioProcessSchema()).optional(),
			workflow: z.array(primitives.getCanonicalSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioActorSchema() {
	return getCachedSchema('ExampleScenarioActor', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioActor> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			actorId: primitives.getStringSchema(),
			_actorId: createElementSchema().optional(),
			type: z.enum(['person', 'entity']),
			_type: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioInstanceSchema() {
	return getCachedSchema('ExampleScenarioInstance', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioInstance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			resourceId: primitives.getStringSchema(),
			_resourceId: createElementSchema().optional(),
			resourceType: primitives.getCodeSchema(),
			_resourceType: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			version: z.array(createExampleScenarioVersionSchema()).optional(),
			containedInstance: z.array(createExampleScenarioContainedInstanceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioVersionSchema() {
	return getCachedSchema('ExampleScenarioVersion', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioVersion> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			versionId: primitives.getStringSchema().optional(),
			_versionId: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioContainedInstanceSchema() {
	return getCachedSchema('ExampleScenarioContainedInstance', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioContainedInstance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			resourceId: primitives.getStringSchema().optional(),
			_resourceId: createElementSchema().optional(),
			versionId: primitives.getStringSchema().optional(),
			_versionId: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioProcessSchema() {
	return getCachedSchema('ExampleScenarioProcess', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioProcess> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			title: primitives.getStringSchema(),
			_title: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			preConditions: primitives.getMarkdownSchema().optional(),
			_preConditions: createElementSchema().optional(),
			postConditions: primitives.getMarkdownSchema().optional(),
			_postConditions: createElementSchema().optional(),
			step: z.array(createExampleScenarioStepSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioStepSchema() {
	return getCachedSchema('ExampleScenarioStep', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioStep> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			process: z.array(createExampleScenarioProcessSchema()).optional(),
			pause: primitives.getBooleanSchema().optional(),
			_pause: createElementSchema().optional(),
			operation: createExampleScenarioOperationSchema().optional(),
			alternative: z.array(createExampleScenarioAlternativeSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioOperationSchema() {
	return getCachedSchema('ExampleScenarioOperation', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioOperation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			number: primitives.getStringSchema().optional(),
			_number: createElementSchema().optional(),
			type: primitives.getStringSchema().optional(),
			_type: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			initiator: primitives.getStringSchema().optional(),
			_initiator: createElementSchema().optional(),
			receiver: primitives.getStringSchema().optional(),
			_receiver: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			initiatorActive: primitives.getBooleanSchema().optional(),
			_initiatorActive: createElementSchema().optional(),
			receiverActive: primitives.getBooleanSchema().optional(),
			_receiverActive: createElementSchema().optional(),
			request: createExampleScenarioContainedInstanceSchema().optional(),
			response: createExampleScenarioContainedInstanceSchema().optional(),
		})

		return baseSchema
	})
}

export function createExampleScenarioAlternativeSchema() {
	return getCachedSchema('ExampleScenarioAlternative', [], () => {
		const baseSchema: z.ZodType<types.ExampleScenarioAlternative> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			step: z.array(createExampleScenarioStepSchema()).optional(),
		})

		return baseSchema
	})
}
