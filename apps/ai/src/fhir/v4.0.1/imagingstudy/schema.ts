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
  createReferenceSchema,
  createCodeableConceptSchema,
  createAnnotationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createImagingStudySchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("ImagingStudy", [contained], () => {
    const baseSchema: z.ZodType<types.ImagingStudy<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("ImagingStudy"),
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
          "registered",
          "available",
          "cancelled",
          "entered-in-error",
          "unknown",
        ]),
        _status: createElementSchema().optional(),
        modality: z.array(createCodingSchema()).optional(),
        subject: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        started: primitives.getDateTimeSchema().optional(),
        _started: createElementSchema().optional(),
        basedOn: z.array(createReferenceSchema()).optional(),
        referrer: createReferenceSchema().optional(),
        interpreter: z.array(createReferenceSchema()).optional(),
        endpoint: z.array(createReferenceSchema()).optional(),
        numberOfSeries: primitives.getUnsignedIntSchema().optional(),
        _numberOfSeries: createElementSchema().optional(),
        numberOfInstances: primitives.getUnsignedIntSchema().optional(),
        _numberOfInstances: createElementSchema().optional(),
        procedureReference: createReferenceSchema().optional(),
        procedureCode: z.array(createCodeableConceptSchema()).optional(),
        location: createReferenceSchema().optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        series: z.array(createImagingStudySeriesSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createImagingStudySeriesSchema() {
  return getCachedSchema("ImagingStudySeries", [], () => {
    const baseSchema: z.ZodType<types.ImagingStudySeries> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      uid: primitives.getIdSchema(),
      _uid: createElementSchema().optional(),
      number: primitives.getUnsignedIntSchema().optional(),
      _number: createElementSchema().optional(),
      modality: createCodingSchema(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      numberOfInstances: primitives.getUnsignedIntSchema().optional(),
      _numberOfInstances: createElementSchema().optional(),
      endpoint: z.array(createReferenceSchema()).optional(),
      bodySite: createCodingSchema().optional(),
      laterality: createCodingSchema().optional(),
      specimen: z.array(createReferenceSchema()).optional(),
      started: primitives.getDateTimeSchema().optional(),
      _started: createElementSchema().optional(),
      performer: z.array(createImagingStudyPerformerSchema()).optional(),
      instance: z.array(createImagingStudyInstanceSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createImagingStudyPerformerSchema() {
  return getCachedSchema("ImagingStudyPerformer", [], () => {
    const baseSchema: z.ZodType<types.ImagingStudyPerformer> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      function: createCodeableConceptSchema().optional(),
      actor: createReferenceSchema(),
    });

    return baseSchema;
  });
}

export function createImagingStudyInstanceSchema() {
  return getCachedSchema("ImagingStudyInstance", [], () => {
    const baseSchema: z.ZodType<types.ImagingStudyInstance> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      uid: primitives.getIdSchema().optional(),
      _uid: createElementSchema().optional(),
      sopClass: createCodingSchema(),
      number: primitives.getUnsignedIntSchema().optional(),
      _number: createElementSchema().optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
