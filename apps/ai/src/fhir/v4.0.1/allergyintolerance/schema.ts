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

export function createAllergyIntoleranceSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("AllergyIntolerance", [contained], () => {
    const baseSchema: z.ZodType<types.AllergyIntolerance<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("AllergyIntolerance"),
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
        type: z.enum(["allergy", "intolerance"]).optional(),
        _type: createElementSchema().optional(),
        category: z
          .enum(["food", "medication", "environment", "biologic"])
          .array()
          .optional(),
        _category: z.array(createElementSchema()).optional(),
        criticality: z.enum(["low", "high", "unable-to-assess"]).optional(),
        _criticality: createElementSchema().optional(),
        code: createCodeableConceptSchema().optional(),
        patient: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        onsetDateTime: z.string().optional(),
        _onsetDateTime: createElementSchema().optional(),
        onsetAge: createAgeSchema().optional(),
        onsetPeriod: createPeriodSchema().optional(),
        onsetRange: createRangeSchema().optional(),
        onsetString: z.string().optional(),
        _onsetString: createElementSchema().optional(),
        recordedDate: primitives.getDateTimeSchema().optional(),
        _recordedDate: createElementSchema().optional(),
        recorder: createReferenceSchema().optional(),
        asserter: createReferenceSchema().optional(),
        lastOccurrence: primitives.getDateTimeSchema().optional(),
        _lastOccurrence: createElementSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
        reaction: z.array(createAllergyIntoleranceReactionSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createAllergyIntoleranceReactionSchema() {
  return getCachedSchema("AllergyIntoleranceReaction", [], () => {
    const baseSchema: z.ZodType<types.AllergyIntoleranceReaction> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        substance: createCodeableConceptSchema().optional(),
        manifestation: z.array(createCodeableConceptSchema()),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        onset: primitives.getDateTimeSchema().optional(),
        _onset: createElementSchema().optional(),
        severity: z.enum(["mild", "moderate", "severe"]).optional(),
        _severity: createElementSchema().optional(),
        exposureRoute: createCodeableConceptSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
      });

    return baseSchema;
  });
}
