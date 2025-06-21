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
  createAnnotationSchema,
  createPeriodSchema,
  createDurationSchema,
  createQuantitySchema,
  createRangeSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createSpecimenSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Specimen", [contained], () => {
    const baseSchema: z.ZodType<types.Specimen<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Specimen"),
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
      accessionIdentifier: createIdentifierSchema().optional(),
      status: z
        .enum([
          "available",
          "unavailable",
          "unsatisfactory",
          "entered-in-error",
        ])
        .optional(),
      _status: createElementSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      subject: createReferenceSchema().optional(),
      receivedTime: primitives.getDateTimeSchema().optional(),
      _receivedTime: createElementSchema().optional(),
      parent: z.array(createReferenceSchema()).optional(),
      request: z.array(createReferenceSchema()).optional(),
      collection: createSpecimenCollectionSchema().optional(),
      processing: z.array(createSpecimenProcessingSchema()).optional(),
      container: z.array(createSpecimenContainerSchema()).optional(),
      condition: z.array(createCodeableConceptSchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createSpecimenCollectionSchema() {
  return getCachedSchema("SpecimenCollection", [], () => {
    const baseSchema: z.ZodType<types.SpecimenCollection> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      collector: createReferenceSchema().optional(),
      collectedDateTime: z.string().optional(),
      _collectedDateTime: createElementSchema().optional(),
      collectedPeriod: createPeriodSchema().optional(),
      duration: createDurationSchema().optional(),
      quantity: createQuantitySchema().optional(),
      method: createCodeableConceptSchema().optional(),
      bodySite: createCodeableConceptSchema().optional(),
      fastingStatusCodeableConcept: createCodeableConceptSchema().optional(),
      fastingStatusDuration: createDurationSchema().optional(),
    });

    return baseSchema;
  });
}

export function createSpecimenProcessingSchema() {
  return getCachedSchema("SpecimenProcessing", [], () => {
    const baseSchema: z.ZodType<types.SpecimenProcessing> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      procedure: createCodeableConceptSchema().optional(),
      additive: z.array(createReferenceSchema()).optional(),
      timeDateTime: z.string().optional(),
      _timeDateTime: createElementSchema().optional(),
      timePeriod: createPeriodSchema().optional(),
    });

    return baseSchema;
  });
}

export function createSpecimenContainerSchema() {
  return getCachedSchema("SpecimenContainer", [], () => {
    const baseSchema: z.ZodType<types.SpecimenContainer> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      identifier: z.array(createIdentifierSchema()).optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      capacity: createQuantitySchema().optional(),
      specimenQuantity: createQuantitySchema().optional(),
      additiveCodeableConcept: createCodeableConceptSchema().optional(),
      additiveReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createSpecimenDefinitionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("SpecimenDefinition", [contained], () => {
    const baseSchema: z.ZodType<types.SpecimenDefinition<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("SpecimenDefinition"),
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
        typeCollected: createCodeableConceptSchema().optional(),
        patientPreparation: z.array(createCodeableConceptSchema()).optional(),
        timeAspect: primitives.getStringSchema().optional(),
        _timeAspect: createElementSchema().optional(),
        collection: z.array(createCodeableConceptSchema()).optional(),
        typeTested: z
          .array(createSpecimenDefinitionTypeTestedSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createSpecimenDefinitionTypeTestedSchema() {
  return getCachedSchema("SpecimenDefinitionTypeTested", [], () => {
    const baseSchema: z.ZodType<types.SpecimenDefinitionTypeTested> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        isDerived: primitives.getBooleanSchema().optional(),
        _isDerived: createElementSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        preference: z.enum(["preferred", "alternate"]),
        _preference: createElementSchema().optional(),
        container: createSpecimenDefinitionContainerSchema().optional(),
        requirement: primitives.getStringSchema().optional(),
        _requirement: createElementSchema().optional(),
        retentionTime: createDurationSchema().optional(),
        rejectionCriterion: z.array(createCodeableConceptSchema()).optional(),
        handling: z.array(createSpecimenDefinitionHandlingSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createSpecimenDefinitionContainerSchema() {
  return getCachedSchema("SpecimenDefinitionContainer", [], () => {
    const baseSchema: z.ZodType<types.SpecimenDefinitionContainer> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        material: createCodeableConceptSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        cap: createCodeableConceptSchema().optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        capacity: createQuantitySchema().optional(),
        minimumVolumeQuantity: createQuantitySchema().optional(),
        minimumVolumeString: z.string().optional(),
        _minimumVolumeString: createElementSchema().optional(),
        additive: z.array(createSpecimenDefinitionAdditiveSchema()).optional(),
        preparation: primitives.getStringSchema().optional(),
        _preparation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createSpecimenDefinitionAdditiveSchema() {
  return getCachedSchema("SpecimenDefinitionAdditive", [], () => {
    const baseSchema: z.ZodType<types.SpecimenDefinitionAdditive> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        additiveCodeableConcept: createCodeableConceptSchema().optional(),
        additiveReference: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}

export function createSpecimenDefinitionHandlingSchema() {
  return getCachedSchema("SpecimenDefinitionHandling", [], () => {
    const baseSchema: z.ZodType<types.SpecimenDefinitionHandling> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        temperatureQualifier: createCodeableConceptSchema().optional(),
        temperatureRange: createRangeSchema().optional(),
        maxDuration: createDurationSchema().optional(),
        instruction: primitives.getStringSchema().optional(),
        _instruction: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
