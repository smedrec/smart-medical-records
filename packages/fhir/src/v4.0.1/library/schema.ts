import { z } from 'zod/v4'

import {
	createAttachmentSchema,
	createCodeableConceptSchema,
	createContactDetailSchema,
	createDataRequirementSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createParameterDefinitionSchema,
	createPeriodSchema,
	createReferenceSchema,
	createRelatedArtifactSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createLibrarySchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Library', [contained], () => {
		const baseSchema: z.ZodType<types.Library<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Library'),
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
			subtitle: primitives.getStringSchema().optional(),
			_subtitle: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			type: createCodeableConceptSchema(),
			subjectCodeableConcept: createCodeableConceptSchema().optional(),
			subjectReference: createReferenceSchema().optional(),
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
			usage: primitives.getStringSchema().optional(),
			_usage: createElementSchema().optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			approvalDate: primitives.getDateSchema().optional(),
			_approvalDate: createElementSchema().optional(),
			lastReviewDate: primitives.getDateSchema().optional(),
			_lastReviewDate: createElementSchema().optional(),
			effectivePeriod: createPeriodSchema().optional(),
			topic: z.array(createCodeableConceptSchema()).optional(),
			author: z.array(createContactDetailSchema()).optional(),
			editor: z.array(createContactDetailSchema()).optional(),
			reviewer: z.array(createContactDetailSchema()).optional(),
			endorser: z.array(createContactDetailSchema()).optional(),
			relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
			parameter: z.array(createParameterDefinitionSchema()).optional(),
			dataRequirement: z.array(createDataRequirementSchema()).optional(),
			content: z.array(createAttachmentSchema()).optional(),
		})

		return baseSchema
	})
}
