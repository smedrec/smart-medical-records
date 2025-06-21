import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import { createExtensionSchema, createElementSchema } from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createNarrativeSchema() {
  return getCachedSchema("Narrative", [], () => {
    const baseSchema: z.ZodType<types.Narrative> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      status: z.enum(["generated", "extensions", "additional", "empty"]),
      _status: createElementSchema().optional(),
      div: primitives.getXhtmlSchema(),
    });

    return baseSchema;
  });
}
