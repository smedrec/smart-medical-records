import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createExtensionSchema,
  createRangeSchema,
  createCodeableConceptSchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createPopulationSchema() {
  return getCachedSchema("Population", [], () => {
    const baseSchema: z.ZodType<types.Population> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      ageRange: createRangeSchema().optional(),
      ageCodeableConcept: createCodeableConceptSchema().optional(),
      gender: createCodeableConceptSchema().optional(),
      race: createCodeableConceptSchema().optional(),
      physiologicalCondition: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}
