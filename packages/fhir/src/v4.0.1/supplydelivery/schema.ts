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
  createTimingSchema,
  createQuantitySchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createSupplyDeliverySchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("SupplyDelivery", [contained], () => {
    const baseSchema: z.ZodType<types.SupplyDelivery<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("SupplyDelivery"),
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
        basedOn: z.array(createReferenceSchema()).optional(),
        partOf: z.array(createReferenceSchema()).optional(),
        status: z
          .enum(["in-progress", "completed", "abandoned", "entered-in-error"])
          .optional(),
        _status: createElementSchema().optional(),
        patient: createReferenceSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        suppliedItem: createSupplyDeliverySuppliedItemSchema().optional(),
        occurrenceDateTime: z.string().optional(),
        _occurrenceDateTime: createElementSchema().optional(),
        occurrencePeriod: createPeriodSchema().optional(),
        occurrenceTiming: createTimingSchema().optional(),
        supplier: createReferenceSchema().optional(),
        destination: createReferenceSchema().optional(),
        receiver: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createSupplyDeliverySuppliedItemSchema() {
  return getCachedSchema("SupplyDeliverySuppliedItem", [], () => {
    const baseSchema: z.ZodType<types.SupplyDeliverySuppliedItem> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        quantity: createQuantitySchema().optional(),
        itemCodeableConcept: createCodeableConceptSchema().optional(),
        itemReference: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}
