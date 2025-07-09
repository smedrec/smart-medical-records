import { z } from 'zod/v4'

import {
	createAddressSchema,
	createAttachmentSchema,
	createCodeableConceptSchema,
	createCodingSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createMoneySchema,
	createPeriodSchema,
	createQuantitySchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createExplanationOfBenefitSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ExplanationOfBenefit', [contained], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefit<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ExplanationOfBenefit'),
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
			status: z.enum(['active', 'cancelled', 'draft', 'entered-in-error']),
			_status: createElementSchema().optional(),
			type: createCodeableConceptSchema(),
			subType: createCodeableConceptSchema().optional(),
			use: primitives.getCodeSchema(),
			_use: createElementSchema().optional(),
			patient: createReferenceSchema(),
			billablePeriod: createPeriodSchema().optional(),
			created: primitives.getDateTimeSchema(),
			_created: createElementSchema().optional(),
			enterer: createReferenceSchema().optional(),
			insurer: createReferenceSchema(),
			provider: createReferenceSchema(),
			priority: createCodeableConceptSchema().optional(),
			fundsReserveRequested: createCodeableConceptSchema().optional(),
			fundsReserve: createCodeableConceptSchema().optional(),
			related: z.array(createExplanationOfBenefitRelatedSchema()).optional(),
			prescription: createReferenceSchema().optional(),
			originalPrescription: createReferenceSchema().optional(),
			payee: createExplanationOfBenefitPayeeSchema().optional(),
			referral: createReferenceSchema().optional(),
			facility: createReferenceSchema().optional(),
			claim: createReferenceSchema().optional(),
			claimResponse: createReferenceSchema().optional(),
			outcome: primitives.getCodeSchema(),
			_outcome: createElementSchema().optional(),
			disposition: primitives.getStringSchema().optional(),
			_disposition: createElementSchema().optional(),
			preAuthRef: z.array(primitives.getStringSchema()).optional(),
			_preAuthRef: z.array(createElementSchema()).optional(),
			preAuthRefPeriod: z.array(createPeriodSchema()).optional(),
			careTeam: z.array(createExplanationOfBenefitCareTeamSchema()).optional(),
			supportingInfo: z.array(createExplanationOfBenefitSupportingInfoSchema()).optional(),
			diagnosis: z.array(createExplanationOfBenefitDiagnosisSchema()).optional(),
			procedure: z.array(createExplanationOfBenefitProcedureSchema()).optional(),
			precedence: primitives.getPositiveIntSchema().optional(),
			_precedence: createElementSchema().optional(),
			insurance: z.array(createExplanationOfBenefitInsuranceSchema()),
			accident: createExplanationOfBenefitAccidentSchema().optional(),
			item: z.array(createExplanationOfBenefitItemSchema()).optional(),
			addItem: z.array(createExplanationOfBenefitAddItemSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
			total: z.array(createExplanationOfBenefitTotalSchema()).optional(),
			payment: createExplanationOfBenefitPaymentSchema().optional(),
			formCode: createCodeableConceptSchema().optional(),
			form: createAttachmentSchema().optional(),
			processNote: z.array(createExplanationOfBenefitProcessNoteSchema()).optional(),
			benefitPeriod: createPeriodSchema().optional(),
			benefitBalance: z.array(createExplanationOfBenefitBenefitBalanceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitRelatedSchema() {
	return getCachedSchema('ExplanationOfBenefitRelated', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitRelated> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			claim: createReferenceSchema().optional(),
			relationship: createCodeableConceptSchema().optional(),
			reference: createIdentifierSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitPayeeSchema() {
	return getCachedSchema('ExplanationOfBenefitPayee', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitPayee> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			party: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitCareTeamSchema() {
	return getCachedSchema('ExplanationOfBenefitCareTeam', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitCareTeam> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema(),
			_sequence: createElementSchema().optional(),
			provider: createReferenceSchema(),
			responsible: primitives.getBooleanSchema().optional(),
			_responsible: createElementSchema().optional(),
			role: createCodeableConceptSchema().optional(),
			qualification: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitSupportingInfoSchema() {
	return getCachedSchema('ExplanationOfBenefitSupportingInfo', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitSupportingInfo> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema(),
			_sequence: createElementSchema().optional(),
			category: createCodeableConceptSchema(),
			code: createCodeableConceptSchema().optional(),
			timingDate: z.string().optional(),
			_timingDate: createElementSchema().optional(),
			timingPeriod: createPeriodSchema().optional(),
			valueBoolean: z.boolean().optional(),
			_valueBoolean: createElementSchema().optional(),
			valueString: z.string().optional(),
			_valueString: createElementSchema().optional(),
			valueQuantity: createQuantitySchema().optional(),
			valueAttachment: createAttachmentSchema().optional(),
			valueReference: createReferenceSchema().optional(),
			reason: createCodingSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitDiagnosisSchema() {
	return getCachedSchema('ExplanationOfBenefitDiagnosis', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitDiagnosis> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema(),
			_sequence: createElementSchema().optional(),
			diagnosisCodeableConcept: createCodeableConceptSchema().optional(),
			diagnosisReference: createReferenceSchema().optional(),
			type: z.array(createCodeableConceptSchema()).optional(),
			onAdmission: createCodeableConceptSchema().optional(),
			packageCode: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitProcedureSchema() {
	return getCachedSchema('ExplanationOfBenefitProcedure', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitProcedure> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema(),
			_sequence: createElementSchema().optional(),
			type: z.array(createCodeableConceptSchema()).optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			procedureCodeableConcept: createCodeableConceptSchema().optional(),
			procedureReference: createReferenceSchema().optional(),
			udi: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitInsuranceSchema() {
	return getCachedSchema('ExplanationOfBenefitInsurance', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitInsurance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			focal: primitives.getBooleanSchema(),
			_focal: createElementSchema().optional(),
			coverage: createReferenceSchema(),
			preAuthRef: z.array(primitives.getStringSchema()).optional(),
			_preAuthRef: z.array(createElementSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitAccidentSchema() {
	return getCachedSchema('ExplanationOfBenefitAccident', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitAccident> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			date: primitives.getDateSchema().optional(),
			_date: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			locationAddress: createAddressSchema().optional(),
			locationReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitItemSchema() {
	return getCachedSchema('ExplanationOfBenefitItem', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema(),
			_sequence: createElementSchema().optional(),
			careTeamSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_careTeamSequence: z.array(createElementSchema()).optional(),
			diagnosisSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_diagnosisSequence: z.array(createElementSchema()).optional(),
			procedureSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_procedureSequence: z.array(createElementSchema()).optional(),
			informationSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_informationSequence: z.array(createElementSchema()).optional(),
			revenue: createCodeableConceptSchema().optional(),
			category: createCodeableConceptSchema().optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			programCode: z.array(createCodeableConceptSchema()).optional(),
			servicedDate: z.string().optional(),
			_servicedDate: createElementSchema().optional(),
			servicedPeriod: createPeriodSchema().optional(),
			locationCodeableConcept: createCodeableConceptSchema().optional(),
			locationAddress: createAddressSchema().optional(),
			locationReference: createReferenceSchema().optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			udi: z.array(createReferenceSchema()).optional(),
			bodySite: createCodeableConceptSchema().optional(),
			subSite: z.array(createCodeableConceptSchema()).optional(),
			encounter: z.array(createReferenceSchema()).optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
			detail: z.array(createExplanationOfBenefitDetailSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitAdjudicationSchema() {
	return getCachedSchema('ExplanationOfBenefitAdjudication', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitAdjudication> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: createCodeableConceptSchema(),
			reason: createCodeableConceptSchema().optional(),
			amount: createMoneySchema().optional(),
			value: primitives.getDecimalSchema().optional(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitDetailSchema() {
	return getCachedSchema('ExplanationOfBenefitDetail', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitDetail> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema().optional(),
			_sequence: createElementSchema().optional(),
			revenue: createCodeableConceptSchema().optional(),
			category: createCodeableConceptSchema().optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			programCode: z.array(createCodeableConceptSchema()).optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			udi: z.array(createReferenceSchema()).optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
			subDetail: z.array(createExplanationOfBenefitSubDetailSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitSubDetailSchema() {
	return getCachedSchema('ExplanationOfBenefitSubDetail', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitSubDetail> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema().optional(),
			_sequence: createElementSchema().optional(),
			revenue: createCodeableConceptSchema().optional(),
			category: createCodeableConceptSchema().optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			programCode: z.array(createCodeableConceptSchema()).optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			udi: z.array(createReferenceSchema()).optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitAddItemSchema() {
	return getCachedSchema('ExplanationOfBenefitAddItem', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitAddItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			itemSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_itemSequence: z.array(createElementSchema()).optional(),
			detailSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_detailSequence: z.array(createElementSchema()).optional(),
			subDetailSequence: z.array(primitives.getPositiveIntSchema()).optional(),
			_subDetailSequence: z.array(createElementSchema()).optional(),
			provider: z.array(createReferenceSchema()).optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			programCode: z.array(createCodeableConceptSchema()).optional(),
			servicedDate: z.string().optional(),
			_servicedDate: createElementSchema().optional(),
			servicedPeriod: createPeriodSchema().optional(),
			locationCodeableConcept: createCodeableConceptSchema().optional(),
			locationAddress: createAddressSchema().optional(),
			locationReference: createReferenceSchema().optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			bodySite: createCodeableConceptSchema().optional(),
			subSite: z.array(createCodeableConceptSchema()).optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
			detail: z.array(createExplanationOfBenefitDetail1Schema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitDetail1Schema() {
	return getCachedSchema('ExplanationOfBenefitDetail1', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitDetail1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
			subDetail: z.array(createExplanationOfBenefitSubDetail1Schema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitSubDetail1Schema() {
	return getCachedSchema('ExplanationOfBenefitSubDetail1', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitSubDetail1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			productOrService: createCodeableConceptSchema(),
			modifier: z.array(createCodeableConceptSchema()).optional(),
			quantity: createQuantitySchema().optional(),
			unitPrice: createMoneySchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			net: createMoneySchema().optional(),
			noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
			_noteNumber: z.array(createElementSchema()).optional(),
			adjudication: z.array(createExplanationOfBenefitAdjudicationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitTotalSchema() {
	return getCachedSchema('ExplanationOfBenefitTotal', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitTotal> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: createCodeableConceptSchema(),
			amount: createMoneySchema(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitPaymentSchema() {
	return getCachedSchema('ExplanationOfBenefitPayment', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitPayment> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			adjustment: createMoneySchema().optional(),
			adjustmentReason: createCodeableConceptSchema().optional(),
			date: primitives.getDateSchema().optional(),
			_date: createElementSchema().optional(),
			amount: createMoneySchema().optional(),
			identifier: createIdentifierSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitProcessNoteSchema() {
	return getCachedSchema('ExplanationOfBenefitProcessNote', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitProcessNote> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			number: primitives.getPositiveIntSchema().optional(),
			_number: createElementSchema().optional(),
			type: z.enum(['display', 'print', 'printoper']).optional(),
			_type: createElementSchema().optional(),
			text: primitives.getStringSchema().optional(),
			_text: createElementSchema().optional(),
			language: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitBenefitBalanceSchema() {
	return getCachedSchema('ExplanationOfBenefitBenefitBalance', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitBenefitBalance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: createCodeableConceptSchema(),
			excluded: primitives.getBooleanSchema().optional(),
			_excluded: createElementSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			network: createCodeableConceptSchema().optional(),
			unit: createCodeableConceptSchema().optional(),
			term: createCodeableConceptSchema().optional(),
			financial: z.array(createExplanationOfBenefitFinancialSchema()).optional(),
		})

		return baseSchema
	})
}

export function createExplanationOfBenefitFinancialSchema() {
	return getCachedSchema('ExplanationOfBenefitFinancial', [], () => {
		const baseSchema: z.ZodType<types.ExplanationOfBenefitFinancial> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema(),
			allowedUnsignedInt: z.number().optional(),
			_allowedUnsignedInt: createElementSchema().optional(),
			allowedString: z.string().optional(),
			_allowedString: createElementSchema().optional(),
			allowedMoney: createMoneySchema().optional(),
			usedUnsignedInt: z.number().optional(),
			_usedUnsignedInt: createElementSchema().optional(),
			usedMoney: createMoneySchema().optional(),
		})

		return baseSchema
	})
}
