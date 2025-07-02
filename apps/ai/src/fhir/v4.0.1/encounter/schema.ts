import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createCodingSchema,
  createCodeableConceptSchema,
  createReferenceSchema,
  createPeriodSchema,
  createDurationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createEncounterSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Encounter", [contained], () => {
    const baseSchema: z.ZodType<types.Encounter<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Encounter"),
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
      status: z.enum([
        "planned",
        "arrived",
        "triaged",
        "in-progress",
        "onleave",
        "finished",
        "cancelled",
        "entered-in-error",
        "unknown",
      ]),
      _status: createElementSchema().optional(),
      statusHistory: z.array(createEncounterStatusHistorySchema()).optional(),
      class: createCodingSchema(),
      classHistory: z.array(createEncounterClassHistorySchema()).optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      serviceType: createCodeableConceptSchema().optional(),
      priority: createCodeableConceptSchema().optional(),
      subject: createReferenceSchema().optional(),
      episodeOfCare: z.array(createReferenceSchema()).optional(),
      basedOn: z.array(createReferenceSchema()).optional(),
      participant: z.array(createEncounterParticipantSchema()).optional(),
      appointment: z.array(createReferenceSchema()).optional(),
      period: createPeriodSchema().optional(),
      length: createDurationSchema().optional(),
      reasonCode: z.array(createCodeableConceptSchema()).optional(),
      reasonReference: z.array(createReferenceSchema()).optional(),
      diagnosis: z.array(createEncounterDiagnosisSchema()).optional(),
      account: z.array(createReferenceSchema()).optional(),
      hospitalization: createEncounterHospitalizationSchema().optional(),
      location: z.array(createEncounterLocationSchema()).optional(),
      serviceProvider: createReferenceSchema().optional(),
      partOf: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createEncounterStatusHistorySchema() {
  return getCachedSchema("EncounterStatusHistory", [], () => {
    const baseSchema: z.ZodType<types.EncounterStatusHistory> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      status: z.enum([
        "planned",
        "arrived",
        "triaged",
        "in-progress",
        "onleave",
        "finished",
        "cancelled",
        "entered-in-error",
        "unknown",
      ]),
      _status: createElementSchema().optional(),
      period: createPeriodSchema(),
    });

    return baseSchema;
  });
}

export function createEncounterClassHistorySchema() {
  return getCachedSchema("EncounterClassHistory", [], () => {
    const baseSchema: z.ZodType<types.EncounterClassHistory> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      class: createCodingSchema(),
      period: createPeriodSchema(),
    });

    return baseSchema;
  });
}

export function createEncounterParticipantSchema() {
  return getCachedSchema("EncounterParticipant", [], () => {
    const baseSchema: z.ZodType<types.EncounterParticipant> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      period: createPeriodSchema().optional(),
      individual: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createEncounterDiagnosisSchema() {
  return getCachedSchema("EncounterDiagnosis", [], () => {
    const baseSchema: z.ZodType<types.EncounterDiagnosis> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      condition: createReferenceSchema(),
      use: createCodeableConceptSchema().optional(),
      rank: primitives.getPositiveIntSchema().optional(),
      _rank: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createEncounterHospitalizationSchema() {
  return getCachedSchema("EncounterHospitalization", [], () => {
    const baseSchema: z.ZodType<types.EncounterHospitalization> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        preAdmissionIdentifier: createIdentifierSchema().optional(),
        origin: createReferenceSchema().optional(),
        admitSource: createCodeableConceptSchema().optional(),
        reAdmission: createCodeableConceptSchema().optional(),
        dietPreference: z.array(createCodeableConceptSchema()).optional(),
        specialCourtesy: z.array(createCodeableConceptSchema()).optional(),
        specialArrangement: z.array(createCodeableConceptSchema()).optional(),
        destination: createReferenceSchema().optional(),
        dischargeDisposition: createCodeableConceptSchema().optional(),
      });

    return baseSchema;
  });
}

export function createEncounterLocationSchema() {
  return getCachedSchema("EncounterLocation", [], () => {
    const baseSchema: z.ZodType<types.EncounterLocation> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      location: createReferenceSchema(),
      status: z.enum(["planned", "active", "reserved", "completed"]).optional(),
      _status: createElementSchema().optional(),
      physicalType: createCodeableConceptSchema().optional(),
      period: createPeriodSchema().optional(),
    });

    return baseSchema;
  });
}
