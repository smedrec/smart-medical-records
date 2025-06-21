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
  createPeriodSchema,
  createAnnotationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createClinicalImpressionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("ClinicalImpression", [contained], () => {
    const baseSchema: z.ZodType<types.ClinicalImpression<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("ClinicalImpression"),
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
        code: createCodeableConceptSchema().optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        subject: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        effectiveDateTime: z.string().optional(),
        _effectiveDateTime: createElementSchema().optional(),
        effectivePeriod: createPeriodSchema().optional(),
        date: primitives.getDateTimeSchema().optional(),
        _date: createElementSchema().optional(),
        assessor: createReferenceSchema().optional(),
        previous: createReferenceSchema().optional(),
        problem: z.array(createReferenceSchema()).optional(),
        investigation: z
          .array(createClinicalImpressionInvestigationSchema())
          .optional(),
        protocol: z.array(primitives.getUriSchema()).optional(),
        _protocol: z.array(createElementSchema()).optional(),
        summary: primitives.getStringSchema().optional(),
        _summary: createElementSchema().optional(),
        finding: z.array(createClinicalImpressionFindingSchema()).optional(),
        prognosisCodeableConcept: z
          .array(createCodeableConceptSchema())
          .optional(),
        prognosisReference: z.array(createReferenceSchema()).optional(),
        supportingInfo: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createClinicalImpressionInvestigationSchema() {
  return getCachedSchema("ClinicalImpressionInvestigation", [], () => {
    const baseSchema: z.ZodType<types.ClinicalImpressionInvestigation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: createCodeableConceptSchema(),
        item: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createClinicalImpressionFindingSchema() {
  return getCachedSchema("ClinicalImpressionFinding", [], () => {
    const baseSchema: z.ZodType<types.ClinicalImpressionFinding> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        itemCodeableConcept: createCodeableConceptSchema().optional(),
        itemReference: createReferenceSchema().optional(),
        basis: primitives.getStringSchema().optional(),
        _basis: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
