import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createReferenceSchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createBinarySchema() {
  return getCachedSchema("Binary", [], () => {
    const baseSchema: z.ZodType<types.Binary> = z.strictObject({
      resourceType: z.literal("Binary"),
      id: primitives.getIdSchema().optional(),
      meta: createMetaSchema().optional(),
      implicitRules: primitives.getUriSchema().optional(),
      _implicitRules: createElementSchema().optional(),
      language: primitives.getCodeSchema().optional(),
      _language: createElementSchema().optional(),
      contentType: primitives.getCodeSchema(),
      _contentType: createElementSchema().optional(),
      securityContext: createReferenceSchema().optional(),
      data: primitives.getBase64BinarySchema().optional(),
      _data: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
