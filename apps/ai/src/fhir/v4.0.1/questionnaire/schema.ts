import { z } from 'zod/v4'

import {
	createAttachmentSchema,
	createCodeableConceptSchema,
	createCodingSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createQuantitySchema,
	createReferenceSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createQuestionnaireSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Questionnaire', [contained], () => {
		const baseSchema: z.ZodType<types.Questionnaire<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Questionnaire'),
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
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			derivedFrom: z.array(primitives.getCanonicalSchema()).optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			subjectType: z.array(primitives.getCodeSchema()).optional(),
			_subjectType: z.array(createElementSchema()).optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			purpose: primitives.getMarkdownSchema().optional(),
			_purpose: createElementSchema().optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			approvalDate: primitives.getDateSchema().optional(),
			_approvalDate: createElementSchema().optional(),
			lastReviewDate: primitives.getDateSchema().optional(),
			_lastReviewDate: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			code: z.array(createCodingSchema()).optional(),
			item: z.array(createQuestionnaireItemSchema()).optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireItemSchema() {
	return getCachedSchema('QuestionnaireItem', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			linkId: primitives.getStringSchema().optional(),
			_linkId: createElementSchema().optional(),
			definition: primitives.getUriSchema().optional(),
			_definition: createElementSchema().optional(),
			code: z.array(createCodingSchema()).optional(),
			prefix: primitives.getStringSchema().optional(),
			_prefix: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			type: z.enum([
				'group',
				'display',
				'boolean',
				'decimal',
				'integer',
				'date',
				'dateTime',
				'time',
				'string',
				'text',
				'url',
				'choice',
				'open-choice',
				'attachment',
				'reference',
				'quantity',
			]),
			_type: createElementSchema().optional(),
			enableWhen: z.array(createQuestionnaireEnableWhenSchema()).optional(),
			enableBehavior: z.enum(['all', 'any']).optional(),
			_enableBehavior: createElementSchema().optional(),
			required: primitives.getBooleanSchema().optional(),
			_required: createElementSchema().optional(),
			repeats: primitives.getBooleanSchema().optional(),
			_repeats: createElementSchema().optional(),
			readOnly: primitives.getBooleanSchema().optional(),
			_readOnly: createElementSchema().optional(),
			maxLength: primitives.getIntegerSchema().optional(),
			_maxLength: createElementSchema().optional(),
			answerValueSet: primitives.getCanonicalSchema().optional(),
			answerOption: z.array(createQuestionnaireAnswerOptionSchema()).optional(),
			initial: z.array(createQuestionnaireInitialSchema()).optional(),
			item: z.array(createQuestionnaireItemSchema()).optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireEnableWhenSchema() {
	return getCachedSchema('QuestionnaireEnableWhen', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireEnableWhen> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			question: primitives.getStringSchema().optional(),
			_question: createElementSchema().optional(),
			operator: z.enum(['exists', '=', '!=', '>', '<', '>=', '<=']).optional(),
			_operator: createElementSchema().optional(),
			answerBoolean: z.boolean().optional(),
			_answerBoolean: createElementSchema().optional(),
			answerDecimal: z.number().optional(),
			_answerDecimal: createElementSchema().optional(),
			answerInteger: z.number().optional(),
			_answerInteger: createElementSchema().optional(),
			answerDate: z.string().optional(),
			_answerDate: createElementSchema().optional(),
			answerDateTime: z.string().optional(),
			_answerDateTime: createElementSchema().optional(),
			answerTime: z.string().optional(),
			_answerTime: createElementSchema().optional(),
			answerString: z.string().optional(),
			_answerString: createElementSchema().optional(),
			answerCoding: createCodingSchema().optional(),
			answerQuantity: createQuantitySchema().optional(),
			answerReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireAnswerOptionSchema() {
	return getCachedSchema('QuestionnaireAnswerOption', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireAnswerOption> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueDate: z.string().optional(),
			_valueDate: createElementSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueCoding: createCodingSchema().optional(),
			valueReference: createReferenceSchema().optional(),
			initialSelected: primitives.getBooleanSchema().optional(),
			_initialSelected: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireInitialSchema() {
	return getCachedSchema('QuestionnaireInitial', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireInitial> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueDate: z.string().optional(),
			_valueDate: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueUri: z.string().optional(),
			_valueUri: createElementSchema().optional(),
			valueAttachment: createAttachmentSchema().optional(),
			valueCoding: createCodingSchema().optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireResponseSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('QuestionnaireResponse', [contained], () => {
		const baseSchema: z.ZodType<types.QuestionnaireResponse<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('QuestionnaireResponse'),
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
			basedOn: z.array(createReferenceSchema()).optional(),
			partOf: z.array(createReferenceSchema()).optional(),
			questionnaire: primitives.getCanonicalSchema().optional(),
			status: z.enum(['in-progress', 'completed', 'amended', 'entered-in-error', 'stopped']),
			_status: createElementSchema().optional(),
			subject: createReferenceSchema().optional(),
			encounter: createReferenceSchema().optional(),
			authored: primitives.getDateTimeSchema().optional(),
			_authored: createElementSchema().optional(),
			author: createReferenceSchema().optional(),
			source: createReferenceSchema().optional(),
			item: z.array(createQuestionnaireResponseItemSchema()).optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireResponseItemSchema() {
	return getCachedSchema('QuestionnaireResponseItem', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireResponseItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			linkId: primitives.getStringSchema(),
			_linkId: createElementSchema().optional(),
			definition: primitives.getUriSchema().optional(),
			_definition: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			answer: z.array(createQuestionnaireResponseAnswerSchema()).optional(),
			item: z.array(createQuestionnaireResponseItemSchema()).optional(),
		})

		return baseSchema
	})
}

export function createQuestionnaireResponseAnswerSchema() {
	return getCachedSchema('QuestionnaireResponseAnswer', [], () => {
		const baseSchema: z.ZodType<types.QuestionnaireResponseAnswer> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueDate: z.string().optional(),
			_valueDate: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueUri: z.string().optional(),
			_valueUri: createElementSchema().optional(),
			valueAttachment: createAttachmentSchema().optional(),
			valueCoding: createCodingSchema().optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueReference: createReferenceSchema().optional(),
			item: z.array(createQuestionnaireResponseItemSchema()).optional(),
		})

		return baseSchema
	})
}
