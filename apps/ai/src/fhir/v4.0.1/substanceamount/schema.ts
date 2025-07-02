import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createExtensionSchema,
  createQuantitySchema,
  createRangeSchema,
  createElementSchema,
  createCodeableConceptSchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createSubstanceAmountSchema() {
  return getCachedSchema("SubstanceAmount", [], () => {
    const baseSchema: z.ZodType<types.SubstanceAmount> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      amountQuantity: createQuantitySchema().optional(),
      amountRange: createRangeSchema().optional(),
      amountString: z.string().optional(),
      _amountString: createElementSchema().optional(),
      amountType: createCodeableConceptSchema().optional(),
      amountText: primitives.getStringSchema().optional(),
      _amountText: createElementSchema().optional(),
      referenceRange: createSubstanceAmountReferenceRangeSchema().optional(),
    });

    return baseSchema;
  });
}

export function createSubstanceAmountReferenceRangeSchema() {
  return getCachedSchema("SubstanceAmountReferenceRange", [], () => {
    const baseSchema: z.ZodType<types.SubstanceAmountReferenceRange> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        lowLimit: createQuantitySchema().optional(),
        highLimit: createQuantitySchema().optional(),
      });

    return baseSchema;
  });
}
