import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createCodeableConceptSchema,
  createReferenceSchema,
  createRatioSchema,
  createPeriodSchema,
  createAnnotationSchema,
  createQuantitySchema,
  createDosageSchema,
  createMoneySchema,
  createDurationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createMedicationSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Medication", [contained], () => {
    const baseSchema: z.ZodType<types.Medication<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Medication"),
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
      code: createCodeableConceptSchema().optional(),
      status: primitives.getCodeSchema().optional(),
      _status: createElementSchema().optional(),
      manufacturer: createReferenceSchema().optional(),
      form: createCodeableConceptSchema().optional(),
      amount: createRatioSchema().optional(),
      ingredient: z.array(createMedicationIngredientSchema()).optional(),
      batch: createMedicationBatchSchema().optional(),
    });

    return baseSchema;
  });
}

export function createMedicationIngredientSchema() {
  return getCachedSchema("MedicationIngredient", [], () => {
    const baseSchema: z.ZodType<types.MedicationIngredient> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      itemCodeableConcept: createCodeableConceptSchema().optional(),
      itemReference: createReferenceSchema().optional(),
      isActive: primitives.getBooleanSchema().optional(),
      _isActive: createElementSchema().optional(),
      strength: createRatioSchema().optional(),
    });

    return baseSchema;
  });
}

export function createMedicationBatchSchema() {
  return getCachedSchema("MedicationBatch", [], () => {
    const baseSchema: z.ZodType<types.MedicationBatch> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      lotNumber: primitives.getStringSchema().optional(),
      _lotNumber: createElementSchema().optional(),
      expirationDate: primitives.getDateTimeSchema().optional(),
      _expirationDate: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createMedicationAdministrationSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MedicationAdministration", [contained], () => {
    const baseSchema: z.ZodType<types.MedicationAdministration<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MedicationAdministration"),
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
        instantiates: z.array(primitives.getUriSchema()).optional(),
        _instantiates: z.array(createElementSchema()).optional(),
        partOf: z.array(createReferenceSchema()).optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        statusReason: z.array(createCodeableConceptSchema()).optional(),
        category: createCodeableConceptSchema().optional(),
        medicationCodeableConcept: createCodeableConceptSchema().optional(),
        medicationReference: createReferenceSchema().optional(),
        subject: createReferenceSchema(),
        context: createReferenceSchema().optional(),
        supportingInformation: z.array(createReferenceSchema()).optional(),
        effectiveDateTime: z.string().optional(),
        _effectiveDateTime: createElementSchema().optional(),
        effectivePeriod: createPeriodSchema().optional(),
        performer: z
          .array(createMedicationAdministrationPerformerSchema())
          .optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        request: createReferenceSchema().optional(),
        device: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        dosage: createMedicationAdministrationDosageSchema().optional(),
        eventHistory: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMedicationAdministrationPerformerSchema() {
  return getCachedSchema("MedicationAdministrationPerformer", [], () => {
    const baseSchema: z.ZodType<types.MedicationAdministrationPerformer> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        function: createCodeableConceptSchema().optional(),
        actor: createReferenceSchema(),
      });

    return baseSchema;
  });
}

export function createMedicationAdministrationDosageSchema() {
  return getCachedSchema("MedicationAdministrationDosage", [], () => {
    const baseSchema: z.ZodType<types.MedicationAdministrationDosage> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        text: primitives.getStringSchema().optional(),
        _text: createElementSchema().optional(),
        site: createCodeableConceptSchema().optional(),
        route: createCodeableConceptSchema().optional(),
        method: createCodeableConceptSchema().optional(),
        dose: createQuantitySchema().optional(),
        rateRatio: createRatioSchema().optional(),
        rateQuantity: createQuantitySchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationDispenseSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MedicationDispense", [contained], () => {
    const baseSchema: z.ZodType<types.MedicationDispense<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MedicationDispense"),
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
        partOf: z.array(createReferenceSchema()).optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        statusReasonCodeableConcept: createCodeableConceptSchema().optional(),
        statusReasonReference: createReferenceSchema().optional(),
        category: createCodeableConceptSchema().optional(),
        medicationCodeableConcept: createCodeableConceptSchema().optional(),
        medicationReference: createReferenceSchema().optional(),
        subject: createReferenceSchema().optional(),
        context: createReferenceSchema().optional(),
        supportingInformation: z.array(createReferenceSchema()).optional(),
        performer: z
          .array(createMedicationDispensePerformerSchema())
          .optional(),
        location: createReferenceSchema().optional(),
        authorizingPrescription: z.array(createReferenceSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        quantity: createQuantitySchema().optional(),
        daysSupply: createQuantitySchema().optional(),
        whenPrepared: primitives.getDateTimeSchema().optional(),
        _whenPrepared: createElementSchema().optional(),
        whenHandedOver: primitives.getDateTimeSchema().optional(),
        _whenHandedOver: createElementSchema().optional(),
        destination: createReferenceSchema().optional(),
        receiver: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        dosageInstruction: z.array(createDosageSchema()).optional(),
        substitution: createMedicationDispenseSubstitutionSchema().optional(),
        detectedIssue: z.array(createReferenceSchema()).optional(),
        eventHistory: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMedicationDispensePerformerSchema() {
  return getCachedSchema("MedicationDispensePerformer", [], () => {
    const baseSchema: z.ZodType<types.MedicationDispensePerformer> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        function: createCodeableConceptSchema().optional(),
        actor: createReferenceSchema(),
      });

    return baseSchema;
  });
}

export function createMedicationDispenseSubstitutionSchema() {
  return getCachedSchema("MedicationDispenseSubstitution", [], () => {
    const baseSchema: z.ZodType<types.MedicationDispenseSubstitution> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        wasSubstituted: primitives.getBooleanSchema(),
        _wasSubstituted: createElementSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        reason: z.array(createCodeableConceptSchema()).optional(),
        responsibleParty: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MedicationKnowledge", [contained], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledge<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MedicationKnowledge"),
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
        code: createCodeableConceptSchema().optional(),
        status: primitives.getCodeSchema().optional(),
        _status: createElementSchema().optional(),
        manufacturer: createReferenceSchema().optional(),
        doseForm: createCodeableConceptSchema().optional(),
        amount: createQuantitySchema().optional(),
        synonym: z.array(primitives.getStringSchema()).optional(),
        _synonym: z.array(createElementSchema()).optional(),
        relatedMedicationKnowledge: z
          .array(createMedicationKnowledgeRelatedMedicationKnowledgeSchema())
          .optional(),
        associatedMedication: z.array(createReferenceSchema()).optional(),
        productType: z.array(createCodeableConceptSchema()).optional(),
        monograph: z
          .array(createMedicationKnowledgeMonographSchema())
          .optional(),
        ingredient: z
          .array(createMedicationKnowledgeIngredientSchema())
          .optional(),
        preparationInstruction: primitives.getMarkdownSchema().optional(),
        _preparationInstruction: createElementSchema().optional(),
        intendedRoute: z.array(createCodeableConceptSchema()).optional(),
        cost: z.array(createMedicationKnowledgeCostSchema()).optional(),
        monitoringProgram: z
          .array(createMedicationKnowledgeMonitoringProgramSchema())
          .optional(),
        administrationGuidelines: z
          .array(createMedicationKnowledgeAdministrationGuidelinesSchema())
          .optional(),
        medicineClassification: z
          .array(createMedicationKnowledgeMedicineClassificationSchema())
          .optional(),
        packaging: createMedicationKnowledgePackagingSchema().optional(),
        drugCharacteristic: z
          .array(createMedicationKnowledgeDrugCharacteristicSchema())
          .optional(),
        contraindication: z.array(createReferenceSchema()).optional(),
        regulatory: z
          .array(createMedicationKnowledgeRegulatorySchema())
          .optional(),
        kinetics: z.array(createMedicationKnowledgeKineticsSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeRelatedMedicationKnowledgeSchema() {
  return getCachedSchema(
    "MedicationKnowledgeRelatedMedicationKnowledge",
    [],
    () => {
      const baseSchema: z.ZodType<types.MedicationKnowledgeRelatedMedicationKnowledge> =
        z.strictObject({
          id: primitives.getStringSchema().optional(),
          extension: z.array(createExtensionSchema()).optional(),
          modifierExtension: z.array(createExtensionSchema()).optional(),
          type: createCodeableConceptSchema(),
          reference: z.array(createReferenceSchema()),
        });

      return baseSchema;
    },
  );
}

export function createMedicationKnowledgeMonographSchema() {
  return getCachedSchema("MedicationKnowledgeMonograph", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeMonograph> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        source: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeIngredientSchema() {
  return getCachedSchema("MedicationKnowledgeIngredient", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeIngredient> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        itemCodeableConcept: createCodeableConceptSchema().optional(),
        itemReference: createReferenceSchema().optional(),
        isActive: primitives.getBooleanSchema().optional(),
        _isActive: createElementSchema().optional(),
        strength: createRatioSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeCostSchema() {
  return getCachedSchema("MedicationKnowledgeCost", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeCost> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        source: primitives.getStringSchema().optional(),
        _source: createElementSchema().optional(),
        cost: createMoneySchema(),
      },
    );

    return baseSchema;
  });
}

export function createMedicationKnowledgeMonitoringProgramSchema() {
  return getCachedSchema("MedicationKnowledgeMonitoringProgram", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeMonitoringProgram> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeAdministrationGuidelinesSchema() {
  return getCachedSchema(
    "MedicationKnowledgeAdministrationGuidelines",
    [],
    () => {
      const baseSchema: z.ZodType<types.MedicationKnowledgeAdministrationGuidelines> =
        z.strictObject({
          id: primitives.getStringSchema().optional(),
          extension: z.array(createExtensionSchema()).optional(),
          modifierExtension: z.array(createExtensionSchema()).optional(),
          dosage: z.array(createMedicationKnowledgeDosageSchema()).optional(),
          indicationCodeableConcept: createCodeableConceptSchema().optional(),
          indicationReference: createReferenceSchema().optional(),
          patientCharacteristics: z
            .array(createMedicationKnowledgePatientCharacteristicsSchema())
            .optional(),
        });

      return baseSchema;
    },
  );
}

export function createMedicationKnowledgeDosageSchema() {
  return getCachedSchema("MedicationKnowledgeDosage", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeDosage> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        dosage: z.array(createDosageSchema()),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgePatientCharacteristicsSchema() {
  return getCachedSchema(
    "MedicationKnowledgePatientCharacteristics",
    [],
    () => {
      const baseSchema: z.ZodType<types.MedicationKnowledgePatientCharacteristics> =
        z.strictObject({
          id: primitives.getStringSchema().optional(),
          extension: z.array(createExtensionSchema()).optional(),
          modifierExtension: z.array(createExtensionSchema()).optional(),
          characteristicCodeableConcept:
            createCodeableConceptSchema().optional(),
          characteristicQuantity: createQuantitySchema().optional(),
          value: z.array(primitives.getStringSchema()).optional(),
          _value: z.array(createElementSchema()).optional(),
        });

      return baseSchema;
    },
  );
}

export function createMedicationKnowledgeMedicineClassificationSchema() {
  return getCachedSchema(
    "MedicationKnowledgeMedicineClassification",
    [],
    () => {
      const baseSchema: z.ZodType<types.MedicationKnowledgeMedicineClassification> =
        z.strictObject({
          id: primitives.getStringSchema().optional(),
          extension: z.array(createExtensionSchema()).optional(),
          modifierExtension: z.array(createExtensionSchema()).optional(),
          type: createCodeableConceptSchema(),
          classification: z.array(createCodeableConceptSchema()).optional(),
        });

      return baseSchema;
    },
  );
}

export function createMedicationKnowledgePackagingSchema() {
  return getCachedSchema("MedicationKnowledgePackaging", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgePackaging> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        quantity: createQuantitySchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeDrugCharacteristicSchema() {
  return getCachedSchema("MedicationKnowledgeDrugCharacteristic", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeDrugCharacteristic> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        valueCodeableConcept: createCodeableConceptSchema().optional(),
        valueString: z.string().optional(),
        _valueString: createElementSchema().optional(),
        valueQuantity: createQuantitySchema().optional(),
        valueBase64Binary: z.string().optional(),
        _valueBase64Binary: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeRegulatorySchema() {
  return getCachedSchema("MedicationKnowledgeRegulatory", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeRegulatory> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        regulatoryAuthority: createReferenceSchema(),
        substitution: z
          .array(createMedicationKnowledgeSubstitutionSchema())
          .optional(),
        schedule: z.array(createMedicationKnowledgeScheduleSchema()).optional(),
        maxDispense: createMedicationKnowledgeMaxDispenseSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeSubstitutionSchema() {
  return getCachedSchema("MedicationKnowledgeSubstitution", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeSubstitution> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        allowed: primitives.getBooleanSchema().optional(),
        _allowed: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeScheduleSchema() {
  return getCachedSchema("MedicationKnowledgeSchedule", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeSchedule> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        schedule: createCodeableConceptSchema(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeMaxDispenseSchema() {
  return getCachedSchema("MedicationKnowledgeMaxDispense", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeMaxDispense> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        quantity: createQuantitySchema(),
        period: createDurationSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationKnowledgeKineticsSchema() {
  return getCachedSchema("MedicationKnowledgeKinetics", [], () => {
    const baseSchema: z.ZodType<types.MedicationKnowledgeKinetics> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        areaUnderCurve: z.array(createQuantitySchema()).optional(),
        lethalDose50: z.array(createQuantitySchema()).optional(),
        halfLifePeriod: createDurationSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationRequestSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MedicationRequest", [contained], () => {
    const baseSchema: z.ZodType<types.MedicationRequest<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MedicationRequest"),
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
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        statusReason: createCodeableConceptSchema().optional(),
        intent: primitives.getCodeSchema(),
        _intent: createElementSchema().optional(),
        category: z.array(createCodeableConceptSchema()).optional(),
        priority: primitives.getCodeSchema().optional(),
        _priority: createElementSchema().optional(),
        doNotPerform: primitives.getBooleanSchema().optional(),
        _doNotPerform: createElementSchema().optional(),
        reportedBoolean: z.boolean().optional(),
        _reportedBoolean: createElementSchema().optional(),
        reportedReference: createReferenceSchema().optional(),
        medicationCodeableConcept: createCodeableConceptSchema().optional(),
        medicationReference: createReferenceSchema().optional(),
        subject: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        supportingInformation: z.array(createReferenceSchema()).optional(),
        authoredOn: primitives.getDateTimeSchema().optional(),
        _authoredOn: createElementSchema().optional(),
        requester: createReferenceSchema().optional(),
        performer: createReferenceSchema().optional(),
        performerType: createCodeableConceptSchema().optional(),
        recorder: createReferenceSchema().optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        instantiatesCanonical: z
          .array(primitives.getCanonicalSchema())
          .optional(),
        _instantiatesCanonical: z.array(createElementSchema()).optional(),
        instantiatesUri: z.array(primitives.getUriSchema()).optional(),
        _instantiatesUri: z.array(createElementSchema()).optional(),
        basedOn: z.array(createReferenceSchema()).optional(),
        groupIdentifier: createIdentifierSchema().optional(),
        courseOfTherapyType: createCodeableConceptSchema().optional(),
        insurance: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        dosageInstruction: z.array(createDosageSchema()).optional(),
        dispenseRequest:
          createMedicationRequestDispenseRequestSchema().optional(),
        substitution: createMedicationRequestSubstitutionSchema().optional(),
        priorPrescription: createReferenceSchema().optional(),
        detectedIssue: z.array(createReferenceSchema()).optional(),
        eventHistory: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMedicationRequestDispenseRequestSchema() {
  return getCachedSchema("MedicationRequestDispenseRequest", [], () => {
    const baseSchema: z.ZodType<types.MedicationRequestDispenseRequest> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        initialFill: createMedicationRequestInitialFillSchema().optional(),
        dispenseInterval: createDurationSchema().optional(),
        validityPeriod: createPeriodSchema().optional(),
        numberOfRepeatsAllowed: primitives.getUnsignedIntSchema().optional(),
        _numberOfRepeatsAllowed: createElementSchema().optional(),
        quantity: createQuantitySchema().optional(),
        expectedSupplyDuration: createDurationSchema().optional(),
        performer: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationRequestInitialFillSchema() {
  return getCachedSchema("MedicationRequestInitialFill", [], () => {
    const baseSchema: z.ZodType<types.MedicationRequestInitialFill> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        quantity: createQuantitySchema().optional(),
        duration: createDurationSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationRequestSubstitutionSchema() {
  return getCachedSchema("MedicationRequestSubstitution", [], () => {
    const baseSchema: z.ZodType<types.MedicationRequestSubstitution> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        allowedBoolean: z.boolean().optional(),
        _allowedBoolean: createElementSchema().optional(),
        allowedCodeableConcept: createCodeableConceptSchema().optional(),
        reason: createCodeableConceptSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMedicationStatementSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MedicationStatement", [contained], () => {
    const baseSchema: z.ZodType<types.MedicationStatement<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MedicationStatement"),
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
        partOf: z.array(createReferenceSchema()).optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        statusReason: z.array(createCodeableConceptSchema()).optional(),
        category: createCodeableConceptSchema().optional(),
        medicationCodeableConcept: createCodeableConceptSchema().optional(),
        medicationReference: createReferenceSchema().optional(),
        subject: createReferenceSchema(),
        context: createReferenceSchema().optional(),
        effectiveDateTime: z.string().optional(),
        _effectiveDateTime: createElementSchema().optional(),
        effectivePeriod: createPeriodSchema().optional(),
        dateAsserted: primitives.getDateTimeSchema().optional(),
        _dateAsserted: createElementSchema().optional(),
        informationSource: createReferenceSchema().optional(),
        derivedFrom: z.array(createReferenceSchema()).optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        dosage: z.array(createDosageSchema()).optional(),
      });

    return baseSchema;
  });
}
