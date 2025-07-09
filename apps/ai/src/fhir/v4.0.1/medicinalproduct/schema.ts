import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createCodingSchema,
	createDurationSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createPeriodSchema,
	createQuantitySchema,
	createRatioSchema,
	createReferenceSchema,
} from '../core/schema'
import { createMarketingStatusSchema } from '../marketingstatus/schema'
import { createNarrativeSchema } from '../narrative/schema'
import { createPopulationSchema } from '../population/schema'
import * as primitives from '../primitives'
import { createProdCharacteristicSchema } from '../prodcharacteristic/schema'
import { createProductShelfLifeSchema } from '../productshelflife/schema'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createMedicinalProductSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProduct', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProduct<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProduct'),
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
			type: createCodeableConceptSchema().optional(),
			domain: createCodingSchema().optional(),
			combinedPharmaceuticalDoseForm: createCodeableConceptSchema().optional(),
			legalStatusOfSupply: createCodeableConceptSchema().optional(),
			additionalMonitoringIndicator: createCodeableConceptSchema().optional(),
			specialMeasures: z.array(primitives.getStringSchema()).optional(),
			_specialMeasures: z.array(createElementSchema()).optional(),
			paediatricUseIndicator: createCodeableConceptSchema().optional(),
			productClassification: z.array(createCodeableConceptSchema()).optional(),
			marketingStatus: z.array(createMarketingStatusSchema()).optional(),
			pharmaceuticalProduct: z.array(createReferenceSchema()).optional(),
			packagedMedicinalProduct: z.array(createReferenceSchema()).optional(),
			attachedDocument: z.array(createReferenceSchema()).optional(),
			masterFile: z.array(createReferenceSchema()).optional(),
			contact: z.array(createReferenceSchema()).optional(),
			clinicalTrial: z.array(createReferenceSchema()).optional(),
			name: z.array(createMedicinalProductNameSchema()),
			crossReference: z.array(createIdentifierSchema()).optional(),
			manufacturingBusinessOperation: z
				.array(createMedicinalProductManufacturingBusinessOperationSchema())
				.optional(),
			specialDesignation: z.array(createMedicinalProductSpecialDesignationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductNameSchema() {
	return getCachedSchema('MedicinalProductName', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductName> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			productName: primitives.getStringSchema(),
			_productName: createElementSchema().optional(),
			namePart: z.array(createMedicinalProductNamePartSchema()).optional(),
			countryLanguage: z.array(createMedicinalProductCountryLanguageSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductNamePartSchema() {
	return getCachedSchema('MedicinalProductNamePart', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductNamePart> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			part: primitives.getStringSchema().optional(),
			_part: createElementSchema().optional(),
			type: createCodingSchema(),
		})

		return baseSchema
	})
}

export function createMedicinalProductCountryLanguageSchema() {
	return getCachedSchema('MedicinalProductCountryLanguage', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductCountryLanguage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			country: createCodeableConceptSchema(),
			jurisdiction: createCodeableConceptSchema().optional(),
			language: createCodeableConceptSchema(),
		})

		return baseSchema
	})
}

export function createMedicinalProductManufacturingBusinessOperationSchema() {
	return getCachedSchema('MedicinalProductManufacturingBusinessOperation', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductManufacturingBusinessOperation> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				operationType: createCodeableConceptSchema().optional(),
				authorisationReferenceNumber: createIdentifierSchema().optional(),
				effectiveDate: primitives.getDateTimeSchema().optional(),
				_effectiveDate: createElementSchema().optional(),
				confidentialityIndicator: createCodeableConceptSchema().optional(),
				manufacturer: z.array(createReferenceSchema()).optional(),
				regulator: createReferenceSchema().optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductSpecialDesignationSchema() {
	return getCachedSchema('MedicinalProductSpecialDesignation', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductSpecialDesignation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			intendedUse: createCodeableConceptSchema().optional(),
			indicationCodeableConcept: createCodeableConceptSchema().optional(),
			indicationReference: createReferenceSchema().optional(),
			status: createCodeableConceptSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			species: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductAuthorizationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductAuthorization', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductAuthorization<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductAuthorization'),
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
			subject: createReferenceSchema().optional(),
			country: z.array(createCodeableConceptSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			status: createCodeableConceptSchema().optional(),
			statusDate: primitives.getDateTimeSchema().optional(),
			_statusDate: createElementSchema().optional(),
			restoreDate: primitives.getDateTimeSchema().optional(),
			_restoreDate: createElementSchema().optional(),
			validityPeriod: createPeriodSchema().optional(),
			dataExclusivityPeriod: createPeriodSchema().optional(),
			dateOfFirstAuthorization: primitives.getDateTimeSchema().optional(),
			_dateOfFirstAuthorization: createElementSchema().optional(),
			internationalBirthDate: primitives.getDateTimeSchema().optional(),
			_internationalBirthDate: createElementSchema().optional(),
			legalBasis: createCodeableConceptSchema().optional(),
			jurisdictionalAuthorization: z
				.array(createMedicinalProductAuthorizationJurisdictionalAuthorizationSchema())
				.optional(),
			holder: createReferenceSchema().optional(),
			regulator: createReferenceSchema().optional(),
			procedure: createMedicinalProductAuthorizationProcedureSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductAuthorizationJurisdictionalAuthorizationSchema() {
	return getCachedSchema('MedicinalProductAuthorizationJurisdictionalAuthorization', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductAuthorizationJurisdictionalAuthorization> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				identifier: z.array(createIdentifierSchema()).optional(),
				country: createCodeableConceptSchema().optional(),
				jurisdiction: z.array(createCodeableConceptSchema()).optional(),
				legalStatusOfSupply: createCodeableConceptSchema().optional(),
				validityPeriod: createPeriodSchema().optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductAuthorizationProcedureSchema() {
	return getCachedSchema('MedicinalProductAuthorizationProcedure', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductAuthorizationProcedure> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: createIdentifierSchema().optional(),
			type: createCodeableConceptSchema(),
			datePeriod: createPeriodSchema().optional(),
			dateDateTime: z.string().optional(),
			_dateDateTime: createElementSchema().optional(),
			application: z.array(createMedicinalProductAuthorizationProcedureSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductContraindicationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductContraindication', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductContraindication<z.infer<C>>> =
			z.strictObject({
				resourceType: z.literal('MedicinalProductContraindication'),
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
				subject: z.array(createReferenceSchema()).optional(),
				disease: createCodeableConceptSchema().optional(),
				diseaseStatus: createCodeableConceptSchema().optional(),
				comorbidity: z.array(createCodeableConceptSchema()).optional(),
				therapeuticIndication: z.array(createReferenceSchema()).optional(),
				otherTherapy: z
					.array(createMedicinalProductContraindicationOtherTherapySchema())
					.optional(),
				population: z.array(createPopulationSchema()).optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductContraindicationOtherTherapySchema() {
	return getCachedSchema('MedicinalProductContraindicationOtherTherapy', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductContraindicationOtherTherapy> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				therapyRelationshipType: createCodeableConceptSchema(),
				medicationCodeableConcept: createCodeableConceptSchema().optional(),
				medicationReference: createReferenceSchema().optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductIndicationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductIndication', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIndication<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductIndication'),
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
			subject: z.array(createReferenceSchema()).optional(),
			diseaseSymptomProcedure: createCodeableConceptSchema().optional(),
			diseaseStatus: createCodeableConceptSchema().optional(),
			comorbidity: z.array(createCodeableConceptSchema()).optional(),
			intendedEffect: createCodeableConceptSchema().optional(),
			duration: createQuantitySchema().optional(),
			otherTherapy: z.array(createMedicinalProductIndicationOtherTherapySchema()).optional(),
			undesirableEffect: z.array(createReferenceSchema()).optional(),
			population: z.array(createPopulationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductIndicationOtherTherapySchema() {
	return getCachedSchema('MedicinalProductIndicationOtherTherapy', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIndicationOtherTherapy> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			therapyRelationshipType: createCodeableConceptSchema(),
			medicationCodeableConcept: createCodeableConceptSchema().optional(),
			medicationReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductIngredientSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductIngredient', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIngredient<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductIngredient'),
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
			role: createCodeableConceptSchema(),
			allergenicIndicator: primitives.getBooleanSchema().optional(),
			_allergenicIndicator: createElementSchema().optional(),
			manufacturer: z.array(createReferenceSchema()).optional(),
			specifiedSubstance: z
				.array(createMedicinalProductIngredientSpecifiedSubstanceSchema())
				.optional(),
			substance: createMedicinalProductIngredientSubstanceSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductIngredientSpecifiedSubstanceSchema() {
	return getCachedSchema('MedicinalProductIngredientSpecifiedSubstance', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIngredientSpecifiedSubstance> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				code: createCodeableConceptSchema(),
				group: createCodeableConceptSchema(),
				confidentiality: createCodeableConceptSchema().optional(),
				strength: z.array(createMedicinalProductIngredientStrengthSchema()).optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductIngredientStrengthSchema() {
	return getCachedSchema('MedicinalProductIngredientStrength', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIngredientStrength> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			presentation: createRatioSchema(),
			presentationLowLimit: createRatioSchema().optional(),
			concentration: createRatioSchema().optional(),
			concentrationLowLimit: createRatioSchema().optional(),
			measurementPoint: primitives.getStringSchema().optional(),
			_measurementPoint: createElementSchema().optional(),
			country: z.array(createCodeableConceptSchema()).optional(),
			referenceStrength: z
				.array(createMedicinalProductIngredientReferenceStrengthSchema())
				.optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductIngredientReferenceStrengthSchema() {
	return getCachedSchema('MedicinalProductIngredientReferenceStrength', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIngredientReferenceStrength> = z.strictObject(
			{
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				substance: createCodeableConceptSchema().optional(),
				strength: createRatioSchema(),
				strengthLowLimit: createRatioSchema().optional(),
				measurementPoint: primitives.getStringSchema().optional(),
				_measurementPoint: createElementSchema().optional(),
				country: z.array(createCodeableConceptSchema()).optional(),
			}
		)

		return baseSchema
	})
}

export function createMedicinalProductIngredientSubstanceSchema() {
	return getCachedSchema('MedicinalProductIngredientSubstance', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductIngredientSubstance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: createCodeableConceptSchema(),
			strength: z.array(createMedicinalProductIngredientStrengthSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductInteractionSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductInteraction', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductInteraction<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductInteraction'),
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
			subject: z.array(createReferenceSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			interactant: z.array(createMedicinalProductInteractionInteractantSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			effect: createCodeableConceptSchema().optional(),
			incidence: createCodeableConceptSchema().optional(),
			management: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductInteractionInteractantSchema() {
	return getCachedSchema('MedicinalProductInteractionInteractant', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductInteractionInteractant> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			itemReference: createReferenceSchema().optional(),
			itemCodeableConcept: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductManufacturedSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductManufactured', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductManufactured<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductManufactured'),
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
			manufacturedDoseForm: createCodeableConceptSchema(),
			unitOfPresentation: createCodeableConceptSchema().optional(),
			quantity: createQuantitySchema(),
			manufacturer: z.array(createReferenceSchema()).optional(),
			ingredient: z.array(createReferenceSchema()).optional(),
			physicalCharacteristics: createProdCharacteristicSchema().optional(),
			otherCharacteristics: z.array(createCodeableConceptSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductPackagedSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductPackaged', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPackaged<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductPackaged'),
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
			subject: z.array(createReferenceSchema()).optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			legalStatusOfSupply: createCodeableConceptSchema().optional(),
			marketingStatus: z.array(createMarketingStatusSchema()).optional(),
			marketingAuthorization: createReferenceSchema().optional(),
			manufacturer: z.array(createReferenceSchema()).optional(),
			batchIdentifier: z.array(createMedicinalProductPackagedBatchIdentifierSchema()).optional(),
			packageItem: z.array(createMedicinalProductPackagedPackageItemSchema()),
		})

		return baseSchema
	})
}

export function createMedicinalProductPackagedBatchIdentifierSchema() {
	return getCachedSchema('MedicinalProductPackagedBatchIdentifier', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPackagedBatchIdentifier> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			outerPackaging: createIdentifierSchema(),
			immediatePackaging: createIdentifierSchema().optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductPackagedPackageItemSchema() {
	return getCachedSchema('MedicinalProductPackagedPackageItem', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPackagedPackageItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: z.array(createIdentifierSchema()).optional(),
			type: createCodeableConceptSchema(),
			quantity: createQuantitySchema(),
			material: z.array(createCodeableConceptSchema()).optional(),
			alternateMaterial: z.array(createCodeableConceptSchema()).optional(),
			device: z.array(createReferenceSchema()).optional(),
			manufacturedItem: z.array(createReferenceSchema()).optional(),
			packageItem: z.array(createMedicinalProductPackagedPackageItemSchema()).optional(),
			physicalCharacteristics: createProdCharacteristicSchema().optional(),
			otherCharacteristics: z.array(createCodeableConceptSchema()).optional(),
			shelfLifeStorage: z.array(createProductShelfLifeSchema()).optional(),
			manufacturer: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createMedicinalProductPharmaceuticalSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductPharmaceutical', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPharmaceutical<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('MedicinalProductPharmaceutical'),
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
			administrableDoseForm: createCodeableConceptSchema(),
			unitOfPresentation: createCodeableConceptSchema().optional(),
			ingredient: z.array(createReferenceSchema()).optional(),
			device: z.array(createReferenceSchema()).optional(),
			characteristics: z
				.array(createMedicinalProductPharmaceuticalCharacteristicsSchema())
				.optional(),
			routeOfAdministration: z.array(
				createMedicinalProductPharmaceuticalRouteOfAdministrationSchema()
			),
		})

		return baseSchema
	})
}

export function createMedicinalProductPharmaceuticalCharacteristicsSchema() {
	return getCachedSchema('MedicinalProductPharmaceuticalCharacteristics', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPharmaceuticalCharacteristics> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				code: createCodeableConceptSchema(),
				status: createCodeableConceptSchema().optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductPharmaceuticalRouteOfAdministrationSchema() {
	return getCachedSchema('MedicinalProductPharmaceuticalRouteOfAdministration', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPharmaceuticalRouteOfAdministration> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				code: createCodeableConceptSchema(),
				firstDose: createQuantitySchema().optional(),
				maxSingleDose: createQuantitySchema().optional(),
				maxDosePerDay: createQuantitySchema().optional(),
				maxDosePerTreatmentPeriod: createRatioSchema().optional(),
				maxTreatmentPeriod: createDurationSchema().optional(),
				targetSpecies: z
					.array(createMedicinalProductPharmaceuticalTargetSpeciesSchema())
					.optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductPharmaceuticalTargetSpeciesSchema() {
	return getCachedSchema('MedicinalProductPharmaceuticalTargetSpecies', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPharmaceuticalTargetSpecies> = z.strictObject(
			{
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				code: createCodeableConceptSchema(),
				withdrawalPeriod: z
					.array(createMedicinalProductPharmaceuticalWithdrawalPeriodSchema())
					.optional(),
			}
		)

		return baseSchema
	})
}

export function createMedicinalProductPharmaceuticalWithdrawalPeriodSchema() {
	return getCachedSchema('MedicinalProductPharmaceuticalWithdrawalPeriod', [], () => {
		const baseSchema: z.ZodType<types.MedicinalProductPharmaceuticalWithdrawalPeriod> =
			z.strictObject({
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				tissue: createCodeableConceptSchema(),
				value: createQuantitySchema(),
				supportingInformation: primitives.getStringSchema().optional(),
				_supportingInformation: createElementSchema().optional(),
			})

		return baseSchema
	})
}

export function createMedicinalProductUndesirableEffectSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('MedicinalProductUndesirableEffect', [contained], () => {
		const baseSchema: z.ZodType<types.MedicinalProductUndesirableEffect<z.infer<C>>> =
			z.strictObject({
				resourceType: z.literal('MedicinalProductUndesirableEffect'),
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
				subject: z.array(createReferenceSchema()).optional(),
				symptomConditionEffect: createCodeableConceptSchema().optional(),
				classification: createCodeableConceptSchema().optional(),
				frequencyOfOccurrence: createCodeableConceptSchema().optional(),
				population: z.array(createPopulationSchema()).optional(),
			})

		return baseSchema
	})
}
