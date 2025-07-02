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
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createBiologicallyDerivedProductSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("BiologicallyDerivedProduct", [contained], () => {
    const baseSchema: z.ZodType<types.BiologicallyDerivedProduct<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("BiologicallyDerivedProduct"),
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
        productCategory: z
          .enum(["organ", "tissue", "fluid", "cells", "biologicalAgent"])
          .optional(),
        _productCategory: createElementSchema().optional(),
        productCode: createCodeableConceptSchema().optional(),
        status: z.enum(["available", "unavailable"]).optional(),
        _status: createElementSchema().optional(),
        request: z.array(createReferenceSchema()).optional(),
        quantity: primitives.getIntegerSchema().optional(),
        _quantity: createElementSchema().optional(),
        parent: z.array(createReferenceSchema()).optional(),
        collection:
          createBiologicallyDerivedProductCollectionSchema().optional(),
        processing: z
          .array(createBiologicallyDerivedProductProcessingSchema())
          .optional(),
        manipulation:
          createBiologicallyDerivedProductManipulationSchema().optional(),
        storage: z
          .array(createBiologicallyDerivedProductStorageSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createBiologicallyDerivedProductCollectionSchema() {
  return getCachedSchema("BiologicallyDerivedProductCollection", [], () => {
    const baseSchema: z.ZodType<types.BiologicallyDerivedProductCollection> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        collector: createReferenceSchema().optional(),
        source: createReferenceSchema().optional(),
        collectedDateTime: z.string().optional(),
        _collectedDateTime: createElementSchema().optional(),
        collectedPeriod: createPeriodSchema().optional(),
      });

    return baseSchema;
  });
}

export function createBiologicallyDerivedProductProcessingSchema() {
  return getCachedSchema("BiologicallyDerivedProductProcessing", [], () => {
    const baseSchema: z.ZodType<types.BiologicallyDerivedProductProcessing> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        procedure: createCodeableConceptSchema().optional(),
        additive: createReferenceSchema().optional(),
        timeDateTime: z.string().optional(),
        _timeDateTime: createElementSchema().optional(),
        timePeriod: createPeriodSchema().optional(),
      });

    return baseSchema;
  });
}

export function createBiologicallyDerivedProductManipulationSchema() {
  return getCachedSchema("BiologicallyDerivedProductManipulation", [], () => {
    const baseSchema: z.ZodType<types.BiologicallyDerivedProductManipulation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        timeDateTime: z.string().optional(),
        _timeDateTime: createElementSchema().optional(),
        timePeriod: createPeriodSchema().optional(),
      });

    return baseSchema;
  });
}

export function createBiologicallyDerivedProductStorageSchema() {
  return getCachedSchema("BiologicallyDerivedProductStorage", [], () => {
    const baseSchema: z.ZodType<types.BiologicallyDerivedProductStorage> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        temperature: primitives.getDecimalSchema().optional(),
        _temperature: createElementSchema().optional(),
        scale: z.enum(["farenheit", "celsius", "kelvin"]).optional(),
        _scale: createElementSchema().optional(),
        duration: createPeriodSchema().optional(),
      });

    return baseSchema;
  });
}
