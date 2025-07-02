import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createExtensionSchema,
  createCodeableConceptSchema,
  createPeriodSchema,
  createElementSchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createMarketingStatusSchema() {
  return getCachedSchema("MarketingStatus", [], () => {
    const baseSchema: z.ZodType<types.MarketingStatus> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      country: createCodeableConceptSchema(),
      jurisdiction: createCodeableConceptSchema().optional(),
      status: createCodeableConceptSchema(),
      dateRange: createPeriodSchema(),
      restoreDate: primitives.getDateTimeSchema().optional(),
      _restoreDate: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
