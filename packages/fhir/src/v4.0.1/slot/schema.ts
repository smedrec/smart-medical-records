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
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createSlotSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Slot", [contained], () => {
    const baseSchema: z.ZodType<types.Slot<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Slot"),
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
      serviceCategory: z.array(createCodeableConceptSchema()).optional(),
      serviceType: z.array(createCodeableConceptSchema()).optional(),
      specialty: z.array(createCodeableConceptSchema()).optional(),
      appointmentType: createCodeableConceptSchema().optional(),
      schedule: createReferenceSchema(),
      status: z.enum([
        "busy",
        "free",
        "busy-unavailable",
        "busy-tentative",
        "entered-in-error",
      ]),
      _status: createElementSchema().optional(),
      start: primitives.getInstantSchema(),
      _start: createElementSchema().optional(),
      end: primitives.getInstantSchema(),
      _end: createElementSchema().optional(),
      overbooked: primitives.getBooleanSchema().optional(),
      _overbooked: createElementSchema().optional(),
      comment: primitives.getStringSchema().optional(),
      _comment: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
