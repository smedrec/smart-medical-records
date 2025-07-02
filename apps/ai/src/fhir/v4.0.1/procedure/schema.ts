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
  createAgeSchema,
  createRangeSchema,
  createAnnotationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createProcedureSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Procedure", [contained], () => {
    const baseSchema: z.ZodType<types.Procedure<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Procedure"),
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
      partOf: z.array(createReferenceSchema()).optional(),
      status: primitives.getCodeSchema(),
      _status: createElementSchema().optional(),
      statusReason: createCodeableConceptSchema().optional(),
      category: createCodeableConceptSchema().optional(),
      code: createCodeableConceptSchema().optional(),
      subject: createReferenceSchema(),
      encounter: createReferenceSchema().optional(),
      performedDateTime: z.string().optional(),
      _performedDateTime: createElementSchema().optional(),
      performedPeriod: createPeriodSchema().optional(),
      performedString: z.string().optional(),
      _performedString: createElementSchema().optional(),
      performedAge: createAgeSchema().optional(),
      performedRange: createRangeSchema().optional(),
      recorder: createReferenceSchema().optional(),
      asserter: createReferenceSchema().optional(),
      performer: z.array(createProcedurePerformerSchema()).optional(),
      location: createReferenceSchema().optional(),
      reasonCode: z.array(createCodeableConceptSchema()).optional(),
      reasonReference: z.array(createReferenceSchema()).optional(),
      bodySite: z.array(createCodeableConceptSchema()).optional(),
      outcome: createCodeableConceptSchema().optional(),
      report: z.array(createReferenceSchema()).optional(),
      complication: z.array(createCodeableConceptSchema()).optional(),
      complicationDetail: z.array(createReferenceSchema()).optional(),
      followUp: z.array(createCodeableConceptSchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
      focalDevice: z.array(createProcedureFocalDeviceSchema()).optional(),
      usedReference: z.array(createReferenceSchema()).optional(),
      usedCode: z.array(createCodeableConceptSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createProcedurePerformerSchema() {
  return getCachedSchema("ProcedurePerformer", [], () => {
    const baseSchema: z.ZodType<types.ProcedurePerformer> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      function: createCodeableConceptSchema().optional(),
      actor: createReferenceSchema(),
      onBehalfOf: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createProcedureFocalDeviceSchema() {
  return getCachedSchema("ProcedureFocalDevice", [], () => {
    const baseSchema: z.ZodType<types.ProcedureFocalDevice> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      action: createCodeableConceptSchema().optional(),
      manipulated: createReferenceSchema(),
    });

    return baseSchema;
  });
}
