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
  createContactDetailSchema,
  createUsageContextSchema,
  createPeriodSchema,
  createRelatedArtifactSchema,
  createExpressionSchema,
  createQuantitySchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createMeasureSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Measure", [contained], () => {
    const baseSchema: z.ZodType<types.Measure<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Measure"),
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
      url: primitives.getUriSchema().optional(),
      _url: createElementSchema().optional(),
      identifier: z.array(createIdentifierSchema()).optional(),
      version: primitives.getStringSchema().optional(),
      _version: createElementSchema().optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
      subtitle: primitives.getStringSchema().optional(),
      _subtitle: createElementSchema().optional(),
      status: z.enum(["draft", "active", "retired", "unknown"]),
      _status: createElementSchema().optional(),
      experimental: primitives.getBooleanSchema().optional(),
      _experimental: createElementSchema().optional(),
      subjectCodeableConcept: createCodeableConceptSchema().optional(),
      subjectReference: createReferenceSchema().optional(),
      date: primitives.getDateTimeSchema().optional(),
      _date: createElementSchema().optional(),
      publisher: primitives.getStringSchema().optional(),
      _publisher: createElementSchema().optional(),
      contact: z.array(createContactDetailSchema()).optional(),
      description: primitives.getMarkdownSchema().optional(),
      _description: createElementSchema().optional(),
      useContext: z.array(createUsageContextSchema()).optional(),
      jurisdiction: z.array(createCodeableConceptSchema()).optional(),
      purpose: primitives.getMarkdownSchema().optional(),
      _purpose: createElementSchema().optional(),
      usage: primitives.getStringSchema().optional(),
      _usage: createElementSchema().optional(),
      copyright: primitives.getMarkdownSchema().optional(),
      _copyright: createElementSchema().optional(),
      approvalDate: primitives.getDateSchema().optional(),
      _approvalDate: createElementSchema().optional(),
      lastReviewDate: primitives.getDateSchema().optional(),
      _lastReviewDate: createElementSchema().optional(),
      effectivePeriod: createPeriodSchema().optional(),
      topic: z.array(createCodeableConceptSchema()).optional(),
      author: z.array(createContactDetailSchema()).optional(),
      editor: z.array(createContactDetailSchema()).optional(),
      reviewer: z.array(createContactDetailSchema()).optional(),
      endorser: z.array(createContactDetailSchema()).optional(),
      relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
      library: z.array(primitives.getCanonicalSchema()).optional(),
      disclaimer: primitives.getMarkdownSchema().optional(),
      _disclaimer: createElementSchema().optional(),
      scoring: createCodeableConceptSchema().optional(),
      compositeScoring: createCodeableConceptSchema().optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      riskAdjustment: primitives.getStringSchema().optional(),
      _riskAdjustment: createElementSchema().optional(),
      rateAggregation: primitives.getStringSchema().optional(),
      _rateAggregation: createElementSchema().optional(),
      rationale: primitives.getMarkdownSchema().optional(),
      _rationale: createElementSchema().optional(),
      clinicalRecommendationStatement: primitives
        .getMarkdownSchema()
        .optional(),
      _clinicalRecommendationStatement: createElementSchema().optional(),
      improvementNotation: createCodeableConceptSchema().optional(),
      definition: z.array(primitives.getMarkdownSchema()).optional(),
      _definition: z.array(createElementSchema()).optional(),
      guidance: primitives.getMarkdownSchema().optional(),
      _guidance: createElementSchema().optional(),
      group: z.array(createMeasureGroupSchema()).optional(),
      supplementalData: z
        .array(createMeasureSupplementalDataSchema())
        .optional(),
    });

    return baseSchema;
  });
}

export function createMeasureGroupSchema() {
  return getCachedSchema("MeasureGroup", [], () => {
    const baseSchema: z.ZodType<types.MeasureGroup> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      population: z.array(createMeasurePopulationSchema()).optional(),
      stratifier: z.array(createMeasureStratifierSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createMeasurePopulationSchema() {
  return getCachedSchema("MeasurePopulation", [], () => {
    const baseSchema: z.ZodType<types.MeasurePopulation> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      criteria: createExpressionSchema(),
    });

    return baseSchema;
  });
}

export function createMeasureStratifierSchema() {
  return getCachedSchema("MeasureStratifier", [], () => {
    const baseSchema: z.ZodType<types.MeasureStratifier> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      criteria: createExpressionSchema().optional(),
      component: z.array(createMeasureComponentSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createMeasureComponentSchema() {
  return getCachedSchema("MeasureComponent", [], () => {
    const baseSchema: z.ZodType<types.MeasureComponent> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      criteria: createExpressionSchema(),
    });

    return baseSchema;
  });
}

export function createMeasureSupplementalDataSchema() {
  return getCachedSchema("MeasureSupplementalData", [], () => {
    const baseSchema: z.ZodType<types.MeasureSupplementalData> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: createCodeableConceptSchema().optional(),
        usage: z.array(createCodeableConceptSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        criteria: createExpressionSchema(),
      },
    );

    return baseSchema;
  });
}

export function createMeasureReportSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MeasureReport", [contained], () => {
    const baseSchema: z.ZodType<types.MeasureReport<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MeasureReport"),
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
        status: z.enum(["complete", "pending", "error"]),
        _status: createElementSchema().optional(),
        type: z.enum([
          "individual",
          "subject-list",
          "summary",
          "data-collection",
        ]),
        _type: createElementSchema().optional(),
        measure: primitives.getCanonicalSchema(),
        subject: createReferenceSchema().optional(),
        date: primitives.getDateTimeSchema().optional(),
        _date: createElementSchema().optional(),
        reporter: createReferenceSchema().optional(),
        period: createPeriodSchema(),
        improvementNotation: createCodeableConceptSchema().optional(),
        group: z.array(createMeasureReportGroupSchema()).optional(),
        evaluatedResource: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createMeasureReportGroupSchema() {
  return getCachedSchema("MeasureReportGroup", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportGroup> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      population: z.array(createMeasureReportPopulationSchema()).optional(),
      measureScore: createQuantitySchema().optional(),
      stratifier: z.array(createMeasureReportStratifierSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createMeasureReportPopulationSchema() {
  return getCachedSchema("MeasureReportPopulation", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportPopulation> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: createCodeableConceptSchema().optional(),
        count: primitives.getIntegerSchema().optional(),
        _count: createElementSchema().optional(),
        subjectResults: createReferenceSchema().optional(),
      },
    );

    return baseSchema;
  });
}

export function createMeasureReportStratifierSchema() {
  return getCachedSchema("MeasureReportStratifier", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportStratifier> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: z.array(createCodeableConceptSchema()).optional(),
        stratum: z.array(createMeasureReportStratumSchema()).optional(),
      },
    );

    return baseSchema;
  });
}

export function createMeasureReportStratumSchema() {
  return getCachedSchema("MeasureReportStratum", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportStratum> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      value: createCodeableConceptSchema().optional(),
      component: z.array(createMeasureReportComponentSchema()).optional(),
      population: z.array(createMeasureReportPopulation1Schema()).optional(),
      measureScore: createQuantitySchema().optional(),
    });

    return baseSchema;
  });
}

export function createMeasureReportComponentSchema() {
  return getCachedSchema("MeasureReportComponent", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportComponent> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema(),
      value: createCodeableConceptSchema(),
    });

    return baseSchema;
  });
}

export function createMeasureReportPopulation1Schema() {
  return getCachedSchema("MeasureReportPopulation1", [], () => {
    const baseSchema: z.ZodType<types.MeasureReportPopulation1> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: createCodeableConceptSchema().optional(),
        count: primitives.getIntegerSchema().optional(),
        _count: createElementSchema().optional(),
        subjectResults: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}
