import { z } from 'zod/v4'

import * as primitives from '../primitives'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */
// Resources schema header file

export function createElementSchema() {
	return getCachedSchema('Element', [], () => {
		const baseSchema: z.ZodType<types.Element> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExtensionSchema() {
	return getCachedSchema('Extension', [], () => {
		const baseSchema: z.ZodType<types.Extension> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			url: primitives.getUriSchema(),
			_url: createElementSchema().optional(),
			valueBase64Binary: z.string().optional(),
			_valueBase64Binary: createElementSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueCanonical: z.string().optional(),
			_valueCanonical: createElementSchema().optional(),
			valueCode: z.string().optional(),
			_valueCode: createElementSchema().optional(),
			valueDate: z.string().optional(),
			_valueDate: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valueDecimal: z.number().optional(),
			_valueDecimal: createElementSchema().optional(),
			valueId: z.string().optional(),
			_valueId: createElementSchema().optional(),
			valueInstant: z.string().optional(),
			_valueInstant: createElementSchema().optional(),
			valueInteger: z.number().optional(),
			_valueInteger: createElementSchema().optional(),
			valueMarkdown: z.string().optional(),
			_valueMarkdown: createElementSchema().optional(),
			valueOid: z.string().optional(),
			_valueOid: createElementSchema().optional(),
			valuePositiveInt: z.number().optional(),
			_valuePositiveInt: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueTime: z.string().optional(),
			_valueTime: createElementSchema().optional(),
			valueUnsignedInt: z.number().optional(),
			_valueUnsignedInt: createElementSchema().optional(),
			valueUri: z.string().optional(),
			_valueUri: createElementSchema().optional(),
			valueUrl: z.string().optional(),
			_valueUrl: createElementSchema().optional(),
			valueUuid: z.string().optional(),
			_valueUuid: createElementSchema().optional(),
			valueAddress: createAddressSchema().optional(),
			valueAge: createAgeSchema().optional(),
			valueAnnotation: createAnnotationSchema().optional(),
			valueAttachment: createAttachmentSchema().optional(),
			valueCodeableConcept: createCodeableConceptSchema().optional(),
			valueCoding: createCodingSchema().optional(),
			valueContactPoint: createContactPointSchema().optional(),
			valueCount: createCountSchema().optional(),
			valueDistance: createDistanceSchema().optional(),
			valueDuration: createDurationSchema().optional(),
			valueHumanName: createHumanNameSchema().optional(),
			valueIdentifier: createIdentifierSchema().optional(),
			valueMoney: createMoneySchema().optional(),
			valuePeriod: createPeriodSchema().optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueRange: createRangeSchema().optional(),
			valueRatio: createRatioSchema().optional(),
			valueReference: createReferenceSchema().optional(),
			valueSampledData: createSampledDataSchema().optional(),
			valueSignature: createSignatureSchema().optional(),
			valueTiming: createTimingSchema().optional(),
			valueContactDetail: createContactDetailSchema().optional(),
			valueContributor: createContributorSchema().optional(),
			valueDataRequirement: createDataRequirementSchema().optional(),
			valueExpression: createExpressionSchema().optional(),
			valueParameterDefinition: createParameterDefinitionSchema().optional(),
			valueRelatedArtifact: createRelatedArtifactSchema().optional(),
			valueTriggerDefinition: createTriggerDefinitionSchema().optional(),
			valueUsageContext: createUsageContextSchema().optional(),
			valueDosage: createDosageSchema().optional(),
			valueMeta: createMetaSchema().optional(),
		})

		return baseSchema
	})
}

export function createAnnotationSchema() {
	return getCachedSchema('Annotation', [], () => {
		const baseSchema: z.ZodType<types.Annotation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			authorReference: createReferenceSchema().optional(),
			authorString: z.string().optional(),
			_authorString: createElementSchema().optional(),
			time: primitives.getDateTimeSchema().optional(),
			_time: createElementSchema().optional(),
			text: primitives.getMarkdownSchema(),
			_text: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createAttachmentSchema() {
	return getCachedSchema('Attachment', [], () => {
		const baseSchema: z.ZodType<types.Attachment> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			contentType: primitives.getCodeSchema().optional(),
			_contentType: createElementSchema().optional(),
			language: primitives.getCodeSchema().optional(),
			_language: createElementSchema().optional(),
			data: primitives.getBase64BinarySchema().optional(),
			_data: createElementSchema().optional(),
			url: primitives.getUrlSchema().optional(),
			_url: createElementSchema().optional(),
			size: primitives.getUnsignedIntSchema().optional(),
			_size: createElementSchema().optional(),
			hash: primitives.getBase64BinarySchema().optional(),
			_hash: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			creation: primitives.getDateTimeSchema().optional(),
			_creation: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createIdentifierSchema() {
	return getCachedSchema('Identifier', [], () => {
		const baseSchema: z.ZodType<types.Identifier> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			use: z.enum(['usual', 'official', 'temp', 'secondary', 'old']).optional(),
			_use: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
			assigner: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createCodeableConceptSchema() {
	return getCachedSchema('CodeableConcept', [], () => {
		const baseSchema: z.ZodType<types.CodeableConcept> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			coding: z.array(createCodingSchema()).optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createCodingSchema() {
	return getCachedSchema('Coding', [], () => {
		const baseSchema: z.ZodType<types.Coding> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			userSelected: primitives.getBooleanSchema().optional(),
			_userSelected: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createQuantitySchema() {
	return getCachedSchema('Quantity', [], () => {
		const baseSchema: z.ZodType<types.Quantity> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			comparator: z.enum(['<', '<=', '>=', '>']).optional(),
			_comparator: createElementSchema().optional(),
			unit: primitives.getStringSchema().optional(),
			_unit: createElementSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createDurationSchema() {
	return getCachedSchema('Duration', [], () => {
		const baseSchema: z.ZodType<types.Duration> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			comparator: z.enum(['<', '<=', '>=', '>']).optional(),
			_comparator: createElementSchema().optional(),
			unit: primitives.getStringSchema().optional(),
			_unit: createElementSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createDistanceSchema() {
	return getCachedSchema('Distance', [], () => {
		const baseSchema: z.ZodType<types.Distance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			comparator: z.enum(['<', '<=', '>=', '>']).optional(),
			_comparator: createElementSchema().optional(),
			unit: primitives.getStringSchema().optional(),
			_unit: createElementSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createCountSchema() {
	return getCachedSchema('Count', [], () => {
		const baseSchema: z.ZodType<types.Count> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			comparator: z.enum(['<', '<=', '>=', '>']).optional(),
			_comparator: createElementSchema().optional(),
			unit: primitives.getStringSchema().optional(),
			_unit: createElementSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createMoneySchema() {
	return getCachedSchema('Money', [], () => {
		const baseSchema: z.ZodType<types.Money> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			currency: primitives.getCodeSchema().optional(),
			_currency: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createAgeSchema() {
	return getCachedSchema('Age', [], () => {
		const baseSchema: z.ZodType<types.Age> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
			comparator: z.enum(['<', '<=', '>=', '>']).optional(),
			_comparator: createElementSchema().optional(),
			unit: primitives.getStringSchema().optional(),
			_unit: createElementSchema().optional(),
			system: primitives.getUriSchema().optional(),
			_system: createElementSchema().optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createRangeSchema() {
	return getCachedSchema('Range', [], () => {
		const baseSchema: z.ZodType<types.Range> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			low: createQuantitySchema().optional(),
			high: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createPeriodSchema() {
	return getCachedSchema('Period', [], () => {
		const baseSchema: z.ZodType<types.Period> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			start: primitives.getDateTimeSchema().optional(),
			_start: createElementSchema().optional(),
			end: primitives.getDateTimeSchema().optional(),
			_end: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createRatioSchema() {
	return getCachedSchema('Ratio', [], () => {
		const baseSchema: z.ZodType<types.Ratio> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			numerator: createQuantitySchema().optional(),
			denominator: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createReferenceSchema() {
	return getCachedSchema('Reference', [], () => {
		const baseSchema: z.ZodType<types.Reference> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			reference: primitives.getStringSchema().optional(),
			_reference: createElementSchema().optional(),
			type: primitives.getUriSchema().optional(),
			_type: createElementSchema().optional(),
			identifier: createIdentifierSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSampledDataSchema() {
	return getCachedSchema('SampledData', [], () => {
		const baseSchema: z.ZodType<types.SampledData> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			origin: createQuantitySchema(),
			period: primitives.getDecimalSchema(),
			_period: createElementSchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			lowerLimit: primitives.getDecimalSchema().optional(),
			_lowerLimit: createElementSchema().optional(),
			upperLimit: primitives.getDecimalSchema().optional(),
			_upperLimit: createElementSchema().optional(),
			dimensions: primitives.getPositiveIntSchema(),
			_dimensions: createElementSchema().optional(),
			data: primitives.getStringSchema().optional(),
			_data: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSignatureSchema() {
	return getCachedSchema('Signature', [], () => {
		const baseSchema: z.ZodType<types.Signature> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			type: z.array(createCodingSchema()),
			when: primitives.getInstantSchema(),
			_when: createElementSchema().optional(),
			who: createReferenceSchema(),
			onBehalfOf: createReferenceSchema().optional(),
			targetFormat: primitives.getCodeSchema().optional(),
			_targetFormat: createElementSchema().optional(),
			sigFormat: primitives.getCodeSchema().optional(),
			_sigFormat: createElementSchema().optional(),
			data: primitives.getBase64BinarySchema().optional(),
			_data: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createHumanNameSchema() {
	return getCachedSchema('HumanName', [], () => {
		const baseSchema: z.ZodType<types.HumanName> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			use: z
				.enum(['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'])
				.optional(),
			_use: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			family: primitives.getStringSchema().optional(),
			_family: createElementSchema().optional(),
			given: z.array(primitives.getStringSchema()).optional(),
			_given: z.array(createElementSchema()).optional(),
			prefix: z.array(primitives.getStringSchema()).optional(),
			_prefix: z.array(createElementSchema()).optional(),
			suffix: z.array(primitives.getStringSchema()).optional(),
			_suffix: z.array(createElementSchema()).optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}

export function createAddressSchema() {
	return getCachedSchema('Address', [], () => {
		const baseSchema: z.ZodType<types.Address> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			use: z.enum(['home', 'work', 'temp', 'old', 'billing']).optional(),
			_use: createElementSchema().optional(),
			type: z.enum(['postal', 'physical', 'both']).optional(),
			_type: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			line: z.array(primitives.getStringSchema()).optional(),
			_line: z.array(createElementSchema()).optional(),
			city: primitives.getStringSchema().optional(),
			_city: createElementSchema().optional(),
			district: primitives.getStringSchema().optional(),
			_district: createElementSchema().optional(),
			state: primitives.getStringSchema().optional(),
			_state: createElementSchema().optional(),
			postalCode: primitives.getStringSchema().optional(),
			_postalCode: createElementSchema().optional(),
			country: primitives.getStringSchema().optional(),
			_country: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}

export function createContactPointSchema() {
	return getCachedSchema('ContactPoint', [], () => {
		const baseSchema: z.ZodType<types.ContactPoint> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			system: z.enum(['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other']).optional(),
			_system: createElementSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
			use: z.enum(['home', 'work', 'temp', 'old', 'mobile']).optional(),
			_use: createElementSchema().optional(),
			rank: primitives.getPositiveIntSchema().optional(),
			_rank: createElementSchema().optional(),
			period: createPeriodSchema().optional(),
		})

		return baseSchema
	})
}

export function createTimingSchema() {
	return getCachedSchema('Timing', [], () => {
		const baseSchema: z.ZodType<types.Timing> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			event: z.array(primitives.getDateTimeSchema()).optional(),
			_event: z.array(createElementSchema()).optional(),
			repeat: createTimingRepeatSchema().optional(),
			code: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createTimingRepeatSchema() {
	return getCachedSchema('TimingRepeat', [], () => {
		const baseSchema: z.ZodType<types.TimingRepeat> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			boundsDuration: createDurationSchema().optional(),
			boundsRange: createRangeSchema().optional(),
			boundsPeriod: createPeriodSchema().optional(),
			count: primitives.getPositiveIntSchema().optional(),
			_count: createElementSchema().optional(),
			countMax: primitives.getPositiveIntSchema().optional(),
			_countMax: createElementSchema().optional(),
			duration: primitives.getDecimalSchema().optional(),
			_duration: createElementSchema().optional(),
			durationMax: primitives.getDecimalSchema().optional(),
			_durationMax: createElementSchema().optional(),
			durationUnit: z.enum(['s', 'min', 'h', 'd', 'wk', 'mo', 'a']).optional(),
			_durationUnit: createElementSchema().optional(),
			frequency: primitives.getPositiveIntSchema().optional(),
			_frequency: createElementSchema().optional(),
			frequencyMax: primitives.getPositiveIntSchema().optional(),
			_frequencyMax: createElementSchema().optional(),
			period: primitives.getDecimalSchema().optional(),
			_period: createElementSchema().optional(),
			periodMax: primitives.getDecimalSchema().optional(),
			_periodMax: createElementSchema().optional(),
			periodUnit: z.enum(['s', 'min', 'h', 'd', 'wk', 'mo', 'a']).optional(),
			_periodUnit: createElementSchema().optional(),
			dayOfWeek: z.array(primitives.getCodeSchema()).optional(),
			_dayOfWeek: z.array(createElementSchema()).optional(),
			timeOfDay: z.array(primitives.getTimeSchema()).optional(),
			_timeOfDay: z.array(createElementSchema()).optional(),
			when: z
				.enum([
					'MORN',
					'MORN.early',
					'MORN.late',
					'NOON',
					'AFT',
					'AFT.early',
					'AFT.late',
					'EVE',
					'EVE.early',
					'EVE.late',
					'NIGHT',
					'PHS',
					'HS',
					'WAKE',
					'C',
					'CM',
					'CD',
					'CV',
					'AC',
					'ACM',
					'ACD',
					'ACV',
					'PC',
					'PCM',
					'PCD',
					'PCV',
				])
				.array()
				.optional(),
			_when: z.array(createElementSchema()).optional(),
			offset: primitives.getUnsignedIntSchema().optional(),
			_offset: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createMetaSchema() {
	return getCachedSchema('Meta', [], () => {
		const baseSchema: z.ZodType<types.Meta> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			versionId: primitives.getIdSchema().optional(),
			_versionId: createElementSchema().optional(),
			lastUpdated: primitives.getInstantSchema().optional(),
			_lastUpdated: createElementSchema().optional(),
			source: primitives.getUriSchema().optional(),
			_source: createElementSchema().optional(),
			profile: z.array(primitives.getCanonicalSchema()).optional(),
			security: z.array(createCodingSchema()).optional(),
			tag: z.array(createCodingSchema()).optional(),
		})

		return baseSchema
	})
}

export function createContactDetailSchema() {
	return getCachedSchema('ContactDetail', [], () => {
		const baseSchema: z.ZodType<types.ContactDetail> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			telecom: z.array(createContactPointSchema()).optional(),
		})

		return baseSchema
	})
}

export function createContributorSchema() {
	return getCachedSchema('Contributor', [], () => {
		const baseSchema: z.ZodType<types.Contributor> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			type: z.enum(['author', 'editor', 'reviewer', 'endorser']),
			_type: createElementSchema().optional(),
			name: primitives.getStringSchema(),
			_name: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
		})

		return baseSchema
	})
}

export function createDataRequirementSchema() {
	return getCachedSchema('DataRequirement', [], () => {
		const baseSchema: z.ZodType<types.DataRequirement> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			type: primitives.getCodeSchema(),
			_type: createElementSchema().optional(),
			profile: z.array(primitives.getCanonicalSchema()).optional(),
			subjectCodeableConcept: createCodeableConceptSchema().optional(),
			subjectReference: createReferenceSchema().optional(),
			mustSupport: z.array(primitives.getStringSchema()).optional(),
			_mustSupport: z.array(createElementSchema()).optional(),
			codeFilter: z.array(createDataRequirementCodeFilterSchema()).optional(),
			dateFilter: z.array(createDataRequirementDateFilterSchema()).optional(),
			limit: primitives.getPositiveIntSchema().optional(),
			_limit: createElementSchema().optional(),
			sort: z.array(createDataRequirementSortSchema()).optional(),
		})

		return baseSchema
	})
}

export function createDataRequirementCodeFilterSchema() {
	return getCachedSchema('DataRequirementCodeFilter', [], () => {
		const baseSchema: z.ZodType<types.DataRequirementCodeFilter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			path: primitives.getStringSchema().optional(),
			_path: createElementSchema().optional(),
			searchParam: primitives.getStringSchema().optional(),
			_searchParam: createElementSchema().optional(),
			valueSet: primitives.getCanonicalSchema().optional(),
			code: z.array(createCodingSchema()).optional(),
		})

		return baseSchema
	})
}

export function createDataRequirementDateFilterSchema() {
	return getCachedSchema('DataRequirementDateFilter', [], () => {
		const baseSchema: z.ZodType<types.DataRequirementDateFilter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			path: primitives.getStringSchema().optional(),
			_path: createElementSchema().optional(),
			searchParam: primitives.getStringSchema().optional(),
			_searchParam: createElementSchema().optional(),
			valueDateTime: z.string().optional(),
			_valueDateTime: createElementSchema().optional(),
			valuePeriod: createPeriodSchema().optional(),
			valueDuration: createDurationSchema().optional(),
		})

		return baseSchema
	})
}

export function createDataRequirementSortSchema() {
	return getCachedSchema('DataRequirementSort', [], () => {
		const baseSchema: z.ZodType<types.DataRequirementSort> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			path: primitives.getStringSchema(),
			_path: createElementSchema().optional(),
			direction: z.enum(['ascending', 'descending']),
			_direction: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createParameterDefinitionSchema() {
	return getCachedSchema('ParameterDefinition', [], () => {
		const baseSchema: z.ZodType<types.ParameterDefinition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			name: primitives.getCodeSchema().optional(),
			_name: createElementSchema().optional(),
			use: primitives.getCodeSchema(),
			_use: createElementSchema().optional(),
			min: primitives.getIntegerSchema().optional(),
			_min: createElementSchema().optional(),
			max: primitives.getStringSchema().optional(),
			_max: createElementSchema().optional(),
			documentation: primitives.getStringSchema().optional(),
			_documentation: createElementSchema().optional(),
			type: primitives.getCodeSchema(),
			_type: createElementSchema().optional(),
			profile: primitives.getCanonicalSchema().optional(),
		})

		return baseSchema
	})
}

export function createRelatedArtifactSchema() {
	return getCachedSchema('RelatedArtifact', [], () => {
		const baseSchema: z.ZodType<types.RelatedArtifact> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			type: z.enum([
				'documentation',
				'justification',
				'citation',
				'predecessor',
				'successor',
				'derived-from',
				'depends-on',
				'composed-of',
			]),
			_type: createElementSchema().optional(),
			label: primitives.getStringSchema().optional(),
			_label: createElementSchema().optional(),
			display: primitives.getStringSchema().optional(),
			_display: createElementSchema().optional(),
			citation: primitives.getMarkdownSchema().optional(),
			_citation: createElementSchema().optional(),
			url: primitives.getUrlSchema().optional(),
			_url: createElementSchema().optional(),
			document: createAttachmentSchema().optional(),
			resource: primitives.getCanonicalSchema().optional(),
		})

		return baseSchema
	})
}

export function createTriggerDefinitionSchema() {
	return getCachedSchema('TriggerDefinition', [], () => {
		const baseSchema: z.ZodType<types.TriggerDefinition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			type: z.enum([
				'named-event',
				'periodic',
				'data-changed',
				'data-added',
				'data-modified',
				'data-removed',
				'data-accessed',
				'data-access-ended',
			]),
			_type: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			timingTiming: createTimingSchema().optional(),
			timingReference: createReferenceSchema().optional(),
			timingDate: z.string().optional(),
			_timingDate: createElementSchema().optional(),
			timingDateTime: z.string().optional(),
			_timingDateTime: createElementSchema().optional(),
			data: z.array(createDataRequirementSchema()).optional(),
			condition: createExpressionSchema().optional(),
		})

		return baseSchema
	})
}

export function createUsageContextSchema() {
	return getCachedSchema('UsageContext', [], () => {
		const baseSchema: z.ZodType<types.UsageContext> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			code: createCodingSchema(),
			valueCodeableConcept: createCodeableConceptSchema().optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueRange: createRangeSchema().optional(),
			valueReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createDosageSchema() {
	return getCachedSchema('Dosage', [], () => {
		const baseSchema: z.ZodType<types.Dosage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getIntegerSchema().optional(),
			_sequence: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			additionalInstruction: z.array(createCodeableConceptSchema()).optional(),
			patientInstruction: primitives.getStringSchema().optional(),
			_patientInstruction: createElementSchema().optional(),
			timing: createTimingSchema().optional(),
			asNeededBoolean: z.boolean().optional(),
			_asNeededBoolean: createElementSchema().optional(),
			asNeededCodeableConcept: createCodeableConceptSchema().optional(),
			site: createCodeableConceptSchema().optional(),
			route: createCodeableConceptSchema().optional(),
			method: createCodeableConceptSchema().optional(),
			doseAndRate: z.array(createDosageDoseAndRateSchema()).optional(),
			maxDosePerPeriod: createRatioSchema().optional(),
			maxDosePerAdministration: createQuantitySchema().optional(),
			maxDosePerLifetime: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createDosageDoseAndRateSchema() {
	return getCachedSchema('DosageDoseAndRate', [], () => {
		const baseSchema: z.ZodType<types.DosageDoseAndRate> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			doseRange: createRangeSchema().optional(),
			doseQuantity: createQuantitySchema().optional(),
			rateRatio: createRatioSchema().optional(),
			rateRange: createRangeSchema().optional(),
			rateQuantity: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createExpressionSchema() {
	return getCachedSchema('Expression', [], () => {
		const baseSchema: z.ZodType<types.Expression> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			name: primitives.getIdSchema().optional(),
			_name: createElementSchema().optional(),
			language: z.enum(['text/cql', 'text/fhirpath', 'application/x-fhir-query']),
			_language: createElementSchema().optional(),
			expression: primitives.getStringSchema().optional(),
			_expression: createElementSchema().optional(),
			reference: primitives.getUriSchema().optional(),
			_reference: createElementSchema().optional(),
		})

		return baseSchema
	})
}
