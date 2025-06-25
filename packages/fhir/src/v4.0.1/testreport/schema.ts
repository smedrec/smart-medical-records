import { z } from 'zod/v4'

import {
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

export function createTestReportSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('TestReport', [contained], () => {
		const baseSchema: z.ZodType<types.TestReport<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('TestReport'),
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
			identifier: createIdentifierSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			status: z.enum(['completed', 'in-progress', 'waiting', 'stopped', 'entered-in-error']),
			_status: createElementSchema().optional(),
			testScript: createReferenceSchema(),
			result: z.enum(['pass', 'fail', 'pending']),
			_result: createElementSchema().optional(),
			score: primitives.getDecimalSchema().optional(),
			_score: createElementSchema().optional(),
			tester: primitives.getStringSchema().optional(),
			_tester: createElementSchema().optional(),
			issued: primitives.getDateTimeSchema().optional(),
			_issued: createElementSchema().optional(),
			participant: z.array(createTestReportParticipantSchema()).optional(),
			setup: createTestReportSetupSchema().optional(),
			test: z.array(createTestReportTestSchema()).optional(),
			teardown: createTestReportTeardownSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportParticipantSchema() {
	return getCachedSchema('TestReportParticipant', [], () => {
		const baseSchema: z.ZodType<types.TestReportParticipant> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: z.enum(['test-engine', 'client', 'server']),
			_type: createElementSchema().optional(),
			uri: primitives.getUriSchema(),
			_uri: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportSetupSchema() {
	return getCachedSchema('TestReportSetup', [], () => {
		const baseSchema: z.ZodType<types.TestReportSetup> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			action: z.array(createTestReportActionSchema()),
		})

		return baseSchema
	})
}

export function createTestReportActionSchema() {
	return getCachedSchema('TestReportAction', [], () => {
		const baseSchema: z.ZodType<types.TestReportAction> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			operation: createTestReportOperationSchema().optional(),
			assert: createTestReportAssertSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportOperationSchema() {
	return getCachedSchema('TestReportOperation', [], () => {
		const baseSchema: z.ZodType<types.TestReportOperation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			result: z.enum(['pass', 'skip', 'fail', 'warning', 'error']).optional(),
			_result: createElementSchema().optional(),
			message: primitives.getMarkdownSchema().optional(),
			_message: createElementSchema().optional(),
			detail: primitives.getUriSchema().optional(),
			_detail: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportAssertSchema() {
	return getCachedSchema('TestReportAssert', [], () => {
		const baseSchema: z.ZodType<types.TestReportAssert> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			result: z.enum(['pass', 'skip', 'fail', 'warning', 'error']).optional(),
			_result: createElementSchema().optional(),
			message: primitives.getMarkdownSchema().optional(),
			_message: createElementSchema().optional(),
			detail: primitives.getStringSchema().optional(),
			_detail: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportTestSchema() {
	return getCachedSchema('TestReportTest', [], () => {
		const baseSchema: z.ZodType<types.TestReportTest> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			action: z.array(createTestReportAction1Schema()),
		})

		return baseSchema
	})
}

export function createTestReportAction1Schema() {
	return getCachedSchema('TestReportAction1', [], () => {
		const baseSchema: z.ZodType<types.TestReportAction1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			operation: createTestReportOperationSchema().optional(),
			assert: createTestReportAssertSchema().optional(),
		})

		return baseSchema
	})
}

export function createTestReportTeardownSchema() {
	return getCachedSchema('TestReportTeardown', [], () => {
		const baseSchema: z.ZodType<types.TestReportTeardown> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			action: z.array(createTestReportAction2Schema()),
		})

		return baseSchema
	})
}

export function createTestReportAction2Schema() {
	return getCachedSchema('TestReportAction2', [], () => {
		const baseSchema: z.ZodType<types.TestReportAction2> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			operation: createTestReportOperationSchema(),
		})

		return baseSchema
	})
}
