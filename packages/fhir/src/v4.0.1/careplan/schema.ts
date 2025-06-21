import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createReferenceSchema,
  createCodeableConceptSchema,
  createPeriodSchema,
  createAnnotationSchema,
  createTimingSchema,
  createQuantitySchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createCarePlanSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("CarePlan", [contained], () => {
    const baseSchema: z.ZodType<types.CarePlan<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("CarePlan"),
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
      instantiatesCanonical: z
        .array(primitives.getCanonicalSchema())
        .optional(),
      instantiatesUri: z.array(primitives.getUriSchema()).optional(),
      _instantiatesUri: z.array(createElementSchema()).optional(),
      basedOn: z.array(createReferenceSchema()).optional(),
      replaces: z.array(createReferenceSchema()).optional(),
      partOf: z.array(createReferenceSchema()).optional(),
      status: primitives.getCodeSchema(),
      _status: createElementSchema().optional(),
      intent: primitives.getCodeSchema(),
      _intent: createElementSchema().optional(),
      category: z.array(createCodeableConceptSchema()).optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      subject: createReferenceSchema(),
      encounter: createReferenceSchema().optional(),
      period: createPeriodSchema().optional(),
      created: primitives.getDateTimeSchema().optional(),
      _created: createElementSchema().optional(),
      author: createReferenceSchema().optional(),
      contributor: z.array(createReferenceSchema()).optional(),
      careTeam: z.array(createReferenceSchema()).optional(),
      addresses: z.array(createReferenceSchema()).optional(),
      supportingInfo: z.array(createReferenceSchema()).optional(),
      goal: z.array(createReferenceSchema()).optional(),
      activity: z.array(createCarePlanActivitySchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createCarePlanActivitySchema() {
  return getCachedSchema("CarePlanActivity", [], () => {
    const baseSchema: z.ZodType<types.CarePlanActivity> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      outcomeCodeableConcept: z.array(createCodeableConceptSchema()).optional(),
      outcomeReference: z.array(createReferenceSchema()).optional(),
      progress: z.array(createAnnotationSchema()).optional(),
      reference: createReferenceSchema().optional(),
      detail: createCarePlanDetailSchema().optional(),
    });

    return baseSchema;
  });
}

export function createCarePlanDetailSchema() {
  return getCachedSchema("CarePlanDetail", [], () => {
    const baseSchema: z.ZodType<types.CarePlanDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      kind: primitives.getCodeSchema().optional(),
      _kind: createElementSchema().optional(),
      instantiatesCanonical: z
        .array(primitives.getCanonicalSchema())
        .optional(),
      instantiatesUri: z.array(primitives.getUriSchema()).optional(),
      _instantiatesUri: z.array(createElementSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      reasonCode: z.array(createCodeableConceptSchema()).optional(),
      reasonReference: z.array(createReferenceSchema()).optional(),
      goal: z.array(createReferenceSchema()).optional(),
      status: z
        .enum([
          "not-started",
          "scheduled",
          "in-progress",
          "on-hold",
          "completed",
          "cancelled",
          "stopped",
          "unknown",
          "entered-in-error",
        ])
        .optional(),
      _status: createElementSchema().optional(),
      statusReason: createCodeableConceptSchema().optional(),
      doNotPerform: primitives.getBooleanSchema().optional(),
      _doNotPerform: createElementSchema().optional(),
      scheduledTiming: createTimingSchema().optional(),
      scheduledPeriod: createPeriodSchema().optional(),
      scheduledString: z.string().optional(),
      _scheduledString: createElementSchema().optional(),
      location: createReferenceSchema().optional(),
      performer: z.array(createReferenceSchema()).optional(),
      productCodeableConcept: createCodeableConceptSchema().optional(),
      productReference: createReferenceSchema().optional(),
      dailyAmount: createQuantitySchema().optional(),
      quantity: createQuantitySchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
