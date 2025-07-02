import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createExtensionSchema,
  createIdentifierSchema,
  createCodeableConceptSchema,
  createQuantitySchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createProductShelfLifeSchema() {
  return getCachedSchema("ProductShelfLife", [], () => {
    const baseSchema: z.ZodType<types.ProductShelfLife> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      identifier: createIdentifierSchema().optional(),
      type: createCodeableConceptSchema(),
      period: createQuantitySchema(),
      specialPrecautionsForStorage: z
        .array(createCodeableConceptSchema())
        .optional(),
    });

    return baseSchema;
  });
}
