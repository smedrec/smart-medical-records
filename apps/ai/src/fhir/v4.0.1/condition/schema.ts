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
  createAgeSchema,
  createPeriodSchema,
  createRangeSchema,
  createAnnotationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createConditionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Condition", [contained], () => {
    const baseSchema: z.ZodType<types.Condition<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Condition"),
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
      clinicalStatus: createCodeableConceptSchema().optional(),
      verificationStatus: createCodeableConceptSchema().optional(),
      category: z.array(createCodeableConceptSchema()).optional(),
      severity: createCodeableConceptSchema().optional(),
      code: createCodeableConceptSchema().optional(),
      bodySite: z.array(createCodeableConceptSchema()).optional(),
      subject: createReferenceSchema(),
      encounter: createReferenceSchema().optional(),
      onsetDateTime: z.string().optional(),
      _onsetDateTime: createElementSchema().optional(),
      onsetAge: createAgeSchema().optional(),
      onsetPeriod: createPeriodSchema().optional(),
      onsetRange: createRangeSchema().optional(),
      onsetString: z.string().optional(),
      _onsetString: createElementSchema().optional(),
      abatementDateTime: z.string().optional(),
      _abatementDateTime: createElementSchema().optional(),
      abatementAge: createAgeSchema().optional(),
      abatementPeriod: createPeriodSchema().optional(),
      abatementRange: createRangeSchema().optional(),
      abatementString: z.string().optional(),
      _abatementString: createElementSchema().optional(),
      recordedDate: primitives.getDateTimeSchema().optional(),
      _recordedDate: createElementSchema().optional(),
      recorder: createReferenceSchema().optional(),
      asserter: createReferenceSchema().optional(),
      stage: z.array(createConditionStageSchema()).optional(),
      evidence: z.array(createConditionEvidenceSchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createConditionStageSchema() {
  return getCachedSchema("ConditionStage", [], () => {
    const baseSchema: z.ZodType<types.ConditionStage> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      summary: createCodeableConceptSchema().optional(),
      assessment: z.array(createReferenceSchema()).optional(),
      type: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createConditionEvidenceSchema() {
  return getCachedSchema("ConditionEvidence", [], () => {
    const baseSchema: z.ZodType<types.ConditionEvidence> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: z.array(createCodeableConceptSchema()).optional(),
      detail: z.array(createReferenceSchema()).optional(),
    });

    return baseSchema;
  });
}
