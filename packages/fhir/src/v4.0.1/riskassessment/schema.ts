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
  createRangeSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createRiskAssessmentSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("RiskAssessment", [contained], () => {
    const baseSchema: z.ZodType<types.RiskAssessment<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("RiskAssessment"),
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
        basedOn: createReferenceSchema().optional(),
        parent: createReferenceSchema().optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        method: createCodeableConceptSchema().optional(),
        code: createCodeableConceptSchema().optional(),
        subject: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        occurrenceDateTime: z.string().optional(),
        _occurrenceDateTime: createElementSchema().optional(),
        occurrencePeriod: createPeriodSchema().optional(),
        condition: createReferenceSchema().optional(),
        performer: createReferenceSchema().optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        basis: z.array(createReferenceSchema()).optional(),
        prediction: z.array(createRiskAssessmentPredictionSchema()).optional(),
        mitigation: primitives.getStringSchema().optional(),
        _mitigation: createElementSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createRiskAssessmentPredictionSchema() {
  return getCachedSchema("RiskAssessmentPrediction", [], () => {
    const baseSchema: z.ZodType<types.RiskAssessmentPrediction> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        outcome: createCodeableConceptSchema().optional(),
        probabilityDecimal: z.number().optional(),
        _probabilityDecimal: createElementSchema().optional(),
        probabilityRange: createRangeSchema().optional(),
        qualitativeRisk: createCodeableConceptSchema().optional(),
        relativeRisk: primitives.getDecimalSchema().optional(),
        _relativeRisk: createElementSchema().optional(),
        whenPeriod: createPeriodSchema().optional(),
        whenRange: createRangeSchema().optional(),
        rationale: primitives.getStringSchema().optional(),
        _rationale: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
