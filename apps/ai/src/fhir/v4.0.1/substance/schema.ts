import { z } from 'zod/v4'

import {
	createAttachmentSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createQuantitySchema,
	createRangeSchema,
	createRatioSchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import { createSubstanceAmountSchema } from '../substanceamount/schema'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createSubstanceSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Substance', [contained], () => {
		const baseSchema: z.ZodType<types.Substance<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Substance'),
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
			status: z.enum(['active', 'inactive', 'entered-in-error']).optional(),
			_status: createElementSchema().optional(),
			category: z.array(createCodeableConceptSchema()).optional(),
			code: createCodeableConceptSchema(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			instance: z.array(createSubstanceInstanceSchema()).optional(),
			ingredient: z.array(createSubstanceIngredientSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceInstanceSchema() {
	return getCachedSchema('SubstanceInstance', [], () => {
		const baseSchema: z.ZodType<types.SubstanceInstance> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: createIdentifierSchema().optional(),
			expiry: primitives.getDateTimeSchema().optional(),
			_expiry: createElementSchema().optional(),
			quantity: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceIngredientSchema() {
	return getCachedSchema('SubstanceIngredient', [], () => {
		const baseSchema: z.ZodType<types.SubstanceIngredient> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			quantity: createRatioSchema().optional(),
			substanceCodeableConcept: createCodeableConceptSchema().optional(),
			substanceReference: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceNucleicAcidSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstanceNucleicAcid', [contained], () => {
		const baseSchema: z.ZodType<types.SubstanceNucleicAcid<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstanceNucleicAcid'),
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
			sequenceType: createCodeableConceptSchema().optional(),
			numberOfSubunits: primitives.getIntegerSchema().optional(),
			_numberOfSubunits: createElementSchema().optional(),
			areaOfHybridisation: primitives.getStringSchema().optional(),
			_areaOfHybridisation: createElementSchema().optional(),
			oligoNucleotideType: createCodeableConceptSchema().optional(),
			subunit: z.array(createSubstanceNucleicAcidSubunitSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceNucleicAcidSubunitSchema() {
	return getCachedSchema('SubstanceNucleicAcidSubunit', [], () => {
		const baseSchema: z.ZodType<types.SubstanceNucleicAcidSubunit> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			subunit: primitives.getIntegerSchema().optional(),
			_subunit: createElementSchema().optional(),
			sequence: primitives.getStringSchema().optional(),
			_sequence: createElementSchema().optional(),
			length: primitives.getIntegerSchema().optional(),
			_length: createElementSchema().optional(),
			sequenceAttachment: createAttachmentSchema().optional(),
			fivePrime: createCodeableConceptSchema().optional(),
			threePrime: createCodeableConceptSchema().optional(),
			linkage: z.array(createSubstanceNucleicAcidLinkageSchema()).optional(),
			sugar: z.array(createSubstanceNucleicAcidSugarSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceNucleicAcidLinkageSchema() {
	return getCachedSchema('SubstanceNucleicAcidLinkage', [], () => {
		const baseSchema: z.ZodType<types.SubstanceNucleicAcidLinkage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			connectivity: primitives.getStringSchema().optional(),
			_connectivity: createElementSchema().optional(),
			identifier: createIdentifierSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			residueSite: primitives.getStringSchema().optional(),
			_residueSite: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceNucleicAcidSugarSchema() {
	return getCachedSchema('SubstanceNucleicAcidSugar', [], () => {
		const baseSchema: z.ZodType<types.SubstanceNucleicAcidSugar> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: createIdentifierSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			residueSite: primitives.getStringSchema().optional(),
			_residueSite: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstancePolymer', [contained], () => {
		const baseSchema: z.ZodType<types.SubstancePolymer<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstancePolymer'),
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
			class: createCodeableConceptSchema().optional(),
			geometry: createCodeableConceptSchema().optional(),
			copolymerConnectivity: z.array(createCodeableConceptSchema()).optional(),
			modification: z.array(primitives.getStringSchema()).optional(),
			_modification: z.array(createElementSchema()).optional(),
			monomerSet: z.array(createSubstancePolymerMonomerSetSchema()).optional(),
			repeat: z.array(createSubstancePolymerRepeatSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerMonomerSetSchema() {
	return getCachedSchema('SubstancePolymerMonomerSet', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerMonomerSet> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			ratioType: createCodeableConceptSchema().optional(),
			startingMaterial: z.array(createSubstancePolymerStartingMaterialSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerStartingMaterialSchema() {
	return getCachedSchema('SubstancePolymerStartingMaterial', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerStartingMaterial> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			material: createCodeableConceptSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			isDefining: primitives.getBooleanSchema().optional(),
			_isDefining: createElementSchema().optional(),
			amount: createSubstanceAmountSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerRepeatSchema() {
	return getCachedSchema('SubstancePolymerRepeat', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerRepeat> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			numberOfUnits: primitives.getIntegerSchema().optional(),
			_numberOfUnits: createElementSchema().optional(),
			averageMolecularFormula: primitives.getStringSchema().optional(),
			_averageMolecularFormula: createElementSchema().optional(),
			repeatUnitAmountType: createCodeableConceptSchema().optional(),
			repeatUnit: z.array(createSubstancePolymerRepeatUnitSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerRepeatUnitSchema() {
	return getCachedSchema('SubstancePolymerRepeatUnit', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerRepeatUnit> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			orientationOfPolymerisation: createCodeableConceptSchema().optional(),
			repeatUnit: primitives.getStringSchema().optional(),
			_repeatUnit: createElementSchema().optional(),
			amount: createSubstanceAmountSchema().optional(),
			degreeOfPolymerisation: z
				.array(createSubstancePolymerDegreeOfPolymerisationSchema())
				.optional(),
			structuralRepresentation: z
				.array(createSubstancePolymerStructuralRepresentationSchema())
				.optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerDegreeOfPolymerisationSchema() {
	return getCachedSchema('SubstancePolymerDegreeOfPolymerisation', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerDegreeOfPolymerisation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			degree: createCodeableConceptSchema().optional(),
			amount: createSubstanceAmountSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstancePolymerStructuralRepresentationSchema() {
	return getCachedSchema('SubstancePolymerStructuralRepresentation', [], () => {
		const baseSchema: z.ZodType<types.SubstancePolymerStructuralRepresentation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			representation: primitives.getStringSchema().optional(),
			_representation: createElementSchema().optional(),
			attachment: createAttachmentSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceProteinSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstanceProtein', [contained], () => {
		const baseSchema: z.ZodType<types.SubstanceProtein<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstanceProtein'),
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
			sequenceType: createCodeableConceptSchema().optional(),
			numberOfSubunits: primitives.getIntegerSchema().optional(),
			_numberOfSubunits: createElementSchema().optional(),
			disulfideLinkage: z.array(primitives.getStringSchema()).optional(),
			_disulfideLinkage: z.array(createElementSchema()).optional(),
			subunit: z.array(createSubstanceProteinSubunitSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceProteinSubunitSchema() {
	return getCachedSchema('SubstanceProteinSubunit', [], () => {
		const baseSchema: z.ZodType<types.SubstanceProteinSubunit> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			subunit: primitives.getIntegerSchema().optional(),
			_subunit: createElementSchema().optional(),
			sequence: primitives.getStringSchema().optional(),
			_sequence: createElementSchema().optional(),
			length: primitives.getIntegerSchema().optional(),
			_length: createElementSchema().optional(),
			sequenceAttachment: createAttachmentSchema().optional(),
			nTerminalModificationId: createIdentifierSchema().optional(),
			nTerminalModification: primitives.getStringSchema().optional(),
			_nTerminalModification: createElementSchema().optional(),
			cTerminalModificationId: createIdentifierSchema().optional(),
			cTerminalModification: primitives.getStringSchema().optional(),
			_cTerminalModification: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceReferenceInformationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstanceReferenceInformation', [contained], () => {
		const baseSchema: z.ZodType<types.SubstanceReferenceInformation<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstanceReferenceInformation'),
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
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
			gene: z.array(createSubstanceReferenceInformationGeneSchema()).optional(),
			geneElement: z.array(createSubstanceReferenceInformationGeneElementSchema()).optional(),
			classification: z.array(createSubstanceReferenceInformationClassificationSchema()).optional(),
			target: z.array(createSubstanceReferenceInformationTargetSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceReferenceInformationGeneSchema() {
	return getCachedSchema('SubstanceReferenceInformationGene', [], () => {
		const baseSchema: z.ZodType<types.SubstanceReferenceInformationGene> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			geneSequenceOrigin: createCodeableConceptSchema().optional(),
			gene: createCodeableConceptSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceReferenceInformationGeneElementSchema() {
	return getCachedSchema('SubstanceReferenceInformationGeneElement', [], () => {
		const baseSchema: z.ZodType<types.SubstanceReferenceInformationGeneElement> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			element: createIdentifierSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceReferenceInformationClassificationSchema() {
	return getCachedSchema('SubstanceReferenceInformationClassification', [], () => {
		const baseSchema: z.ZodType<types.SubstanceReferenceInformationClassification> = z.strictObject(
			{
				id: primitives.getStringSchema().optional(),
				extension: z.array(createExtensionSchema()).optional(),
				modifierExtension: z.array(createExtensionSchema()).optional(),
				domain: createCodeableConceptSchema().optional(),
				classification: createCodeableConceptSchema().optional(),
				subtype: z.array(createCodeableConceptSchema()).optional(),
				source: z.array(createReferenceSchema()).optional(),
			}
		)

		return baseSchema
	})
}

export function createSubstanceReferenceInformationTargetSchema() {
	return getCachedSchema('SubstanceReferenceInformationTarget', [], () => {
		const baseSchema: z.ZodType<types.SubstanceReferenceInformationTarget> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			target: createIdentifierSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			interaction: createCodeableConceptSchema().optional(),
			organism: createCodeableConceptSchema().optional(),
			organismType: createCodeableConceptSchema().optional(),
			amountQuantity: createQuantitySchema().optional(),
			amountRange: createRangeSchema().optional(),
			amountString: z.string().optional(),
			_amountString: createElementSchema().optional(),
			amountType: createCodeableConceptSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstanceSourceMaterial', [contained], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterial<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstanceSourceMaterial'),
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
			sourceMaterialClass: createCodeableConceptSchema().optional(),
			sourceMaterialType: createCodeableConceptSchema().optional(),
			sourceMaterialState: createCodeableConceptSchema().optional(),
			organismId: createIdentifierSchema().optional(),
			organismName: primitives.getStringSchema().optional(),
			_organismName: createElementSchema().optional(),
			parentSubstanceId: z.array(createIdentifierSchema()).optional(),
			parentSubstanceName: z.array(primitives.getStringSchema()).optional(),
			_parentSubstanceName: z.array(createElementSchema()).optional(),
			countryOfOrigin: z.array(createCodeableConceptSchema()).optional(),
			geographicalLocation: z.array(primitives.getStringSchema()).optional(),
			_geographicalLocation: z.array(createElementSchema()).optional(),
			developmentStage: createCodeableConceptSchema().optional(),
			fractionDescription: z
				.array(createSubstanceSourceMaterialFractionDescriptionSchema())
				.optional(),
			organism: createSubstanceSourceMaterialOrganismSchema().optional(),
			partDescription: z.array(createSubstanceSourceMaterialPartDescriptionSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialFractionDescriptionSchema() {
	return getCachedSchema('SubstanceSourceMaterialFractionDescription', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialFractionDescription> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			fraction: primitives.getStringSchema().optional(),
			_fraction: createElementSchema().optional(),
			materialType: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialOrganismSchema() {
	return getCachedSchema('SubstanceSourceMaterialOrganism', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialOrganism> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			family: createCodeableConceptSchema().optional(),
			genus: createCodeableConceptSchema().optional(),
			species: createCodeableConceptSchema().optional(),
			intraspecificType: createCodeableConceptSchema().optional(),
			intraspecificDescription: primitives.getStringSchema().optional(),
			_intraspecificDescription: createElementSchema().optional(),
			author: z.array(createSubstanceSourceMaterialAuthorSchema()).optional(),
			hybrid: createSubstanceSourceMaterialHybridSchema().optional(),
			organismGeneral: createSubstanceSourceMaterialOrganismGeneralSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialAuthorSchema() {
	return getCachedSchema('SubstanceSourceMaterialAuthor', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialAuthor> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			authorType: createCodeableConceptSchema().optional(),
			authorDescription: primitives.getStringSchema().optional(),
			_authorDescription: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialHybridSchema() {
	return getCachedSchema('SubstanceSourceMaterialHybrid', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialHybrid> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			maternalOrganismId: primitives.getStringSchema().optional(),
			_maternalOrganismId: createElementSchema().optional(),
			maternalOrganismName: primitives.getStringSchema().optional(),
			_maternalOrganismName: createElementSchema().optional(),
			paternalOrganismId: primitives.getStringSchema().optional(),
			_paternalOrganismId: createElementSchema().optional(),
			paternalOrganismName: primitives.getStringSchema().optional(),
			_paternalOrganismName: createElementSchema().optional(),
			hybridType: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialOrganismGeneralSchema() {
	return getCachedSchema('SubstanceSourceMaterialOrganismGeneral', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialOrganismGeneral> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			kingdom: createCodeableConceptSchema().optional(),
			phylum: createCodeableConceptSchema().optional(),
			class: createCodeableConceptSchema().optional(),
			order: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSourceMaterialPartDescriptionSchema() {
	return getCachedSchema('SubstanceSourceMaterialPartDescription', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSourceMaterialPartDescription> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			part: createCodeableConceptSchema().optional(),
			partLocation: createCodeableConceptSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationSchema<
	C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('SubstanceSpecification', [contained], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecification<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('SubstanceSpecification'),
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
			type: createCodeableConceptSchema().optional(),
			status: createCodeableConceptSchema().optional(),
			domain: createCodeableConceptSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
			moiety: z.array(createSubstanceSpecificationMoietySchema()).optional(),
			property: z.array(createSubstanceSpecificationPropertySchema()).optional(),
			referenceInformation: createReferenceSchema().optional(),
			structure: createSubstanceSpecificationStructureSchema().optional(),
			code: z.array(createSubstanceSpecificationCodeSchema()).optional(),
			name: z.array(createSubstanceSpecificationNameSchema()).optional(),
			molecularWeight: z.array(createSubstanceSpecificationMolecularWeightSchema()).optional(),
			relationship: z.array(createSubstanceSpecificationRelationshipSchema()).optional(),
			nucleicAcid: createReferenceSchema().optional(),
			polymer: createReferenceSchema().optional(),
			protein: createReferenceSchema().optional(),
			sourceMaterial: createReferenceSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationMoietySchema() {
	return getCachedSchema('SubstanceSpecificationMoiety', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationMoiety> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			role: createCodeableConceptSchema().optional(),
			identifier: createIdentifierSchema().optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			stereochemistry: createCodeableConceptSchema().optional(),
			opticalActivity: createCodeableConceptSchema().optional(),
			molecularFormula: primitives.getStringSchema().optional(),
			_molecularFormula: createElementSchema().optional(),
			amountQuantity: createQuantitySchema().optional(),
			amountString: z.string().optional(),
			_amountString: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationPropertySchema() {
	return getCachedSchema('SubstanceSpecificationProperty', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationProperty> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			category: createCodeableConceptSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			parameters: primitives.getStringSchema().optional(),
			_parameters: createElementSchema().optional(),
			definingSubstanceReference: createReferenceSchema().optional(),
			definingSubstanceCodeableConcept: createCodeableConceptSchema().optional(),
			amountQuantity: createQuantitySchema().optional(),
			amountString: z.string().optional(),
			_amountString: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationStructureSchema() {
	return getCachedSchema('SubstanceSpecificationStructure', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationStructure> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			stereochemistry: createCodeableConceptSchema().optional(),
			opticalActivity: createCodeableConceptSchema().optional(),
			molecularFormula: primitives.getStringSchema().optional(),
			_molecularFormula: createElementSchema().optional(),
			molecularFormulaByMoiety: primitives.getStringSchema().optional(),
			_molecularFormulaByMoiety: createElementSchema().optional(),
			isotope: z.array(createSubstanceSpecificationIsotopeSchema()).optional(),
			molecularWeight: createSubstanceSpecificationMolecularWeightSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
			representation: z.array(createSubstanceSpecificationRepresentationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationIsotopeSchema() {
	return getCachedSchema('SubstanceSpecificationIsotope', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationIsotope> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			identifier: createIdentifierSchema().optional(),
			name: createCodeableConceptSchema().optional(),
			substitution: createCodeableConceptSchema().optional(),
			halfLife: createQuantitySchema().optional(),
			molecularWeight: createSubstanceSpecificationMolecularWeightSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationMolecularWeightSchema() {
	return getCachedSchema('SubstanceSpecificationMolecularWeight', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationMolecularWeight> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			method: createCodeableConceptSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			amount: createQuantitySchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationRepresentationSchema() {
	return getCachedSchema('SubstanceSpecificationRepresentation', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationRepresentation> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: createCodeableConceptSchema().optional(),
			representation: primitives.getStringSchema().optional(),
			_representation: createElementSchema().optional(),
			attachment: createAttachmentSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationCodeSchema() {
	return getCachedSchema('SubstanceSpecificationCode', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationCode> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: createCodeableConceptSchema().optional(),
			status: createCodeableConceptSchema().optional(),
			statusDate: primitives.getDateTimeSchema().optional(),
			_statusDate: createElementSchema().optional(),
			comment: primitives.getStringSchema().optional(),
			_comment: createElementSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationNameSchema() {
	return getCachedSchema('SubstanceSpecificationName', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationName> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema(),
			_name: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			status: createCodeableConceptSchema().optional(),
			preferred: primitives.getBooleanSchema().optional(),
			_preferred: createElementSchema().optional(),
			language: z.array(createCodeableConceptSchema()).optional(),
			domain: z.array(createCodeableConceptSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			synonym: z.array(createSubstanceSpecificationNameSchema()).optional(),
			translation: z.array(createSubstanceSpecificationNameSchema()).optional(),
			official: z.array(createSubstanceSpecificationOfficialSchema()).optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationOfficialSchema() {
	return getCachedSchema('SubstanceSpecificationOfficial', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationOfficial> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			authority: createCodeableConceptSchema().optional(),
			status: createCodeableConceptSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createSubstanceSpecificationRelationshipSchema() {
	return getCachedSchema('SubstanceSpecificationRelationship', [], () => {
		const baseSchema: z.ZodType<types.SubstanceSpecificationRelationship> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			substanceReference: createReferenceSchema().optional(),
			substanceCodeableConcept: createCodeableConceptSchema().optional(),
			relationship: createCodeableConceptSchema().optional(),
			isDefining: primitives.getBooleanSchema().optional(),
			_isDefining: createElementSchema().optional(),
			amountQuantity: createQuantitySchema().optional(),
			amountRange: createRangeSchema().optional(),
			amountRatio: createRatioSchema().optional(),
			amountString: z.string().optional(),
			_amountString: createElementSchema().optional(),
			amountRatioLowLimit: createRatioSchema().optional(),
			amountType: createCodeableConceptSchema().optional(),
			source: z.array(createReferenceSchema()).optional(),
		})

		return baseSchema
	})
}
