import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createMetaSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createOperationOutcomeSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('OperationOutcome', [contained], () => {
		const baseSchema: z.ZodType<types.OperationOutcome<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('OperationOutcome'),
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
			issue: z.array(createOperationOutcomeIssueSchema()),
		})

		return baseSchema
	})
}

export function createOperationOutcomeIssueSchema() {
	return getCachedSchema('OperationOutcomeIssue', [], () => {
		const baseSchema: z.ZodType<types.OperationOutcomeIssue> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			severity: z.enum(['fatal', 'error', 'warning', 'information']),
			_severity: createElementSchema().optional(),
			code: z.enum([
				'invalid',
				'structure',
				'required',
				'value',
				'invariant',
				'security',
				'login',
				'unknown',
				'expired',
				'forbidden',
				'suppressed',
				'processing',
				'not-supported',
				'duplicate',
				'multiple-matches',
				'not-found',
				'deleted',
				'too-long',
				'code-invalid',
				'extension',
				'too-costly',
				'business-rule',
				'conflict',
				'transient',
				'lock-error',
				'no-store',
				'exception',
				'timeout',
				'incomplete',
				'throttled',
				'informational',
			]),
			_code: createElementSchema().optional(),
			details: createCodeableConceptSchema().optional(),
			diagnostics: primitives.getStringSchema().optional(),
			_diagnostics: createElementSchema().optional(),
			location: z.array(primitives.getStringSchema()).optional(),
			_location: z.array(createElementSchema()).optional(),
			expression: z.array(primitives.getStringSchema()).optional(),
			_expression: z.array(createElementSchema()).optional(),
		})

		return baseSchema
	})
}
