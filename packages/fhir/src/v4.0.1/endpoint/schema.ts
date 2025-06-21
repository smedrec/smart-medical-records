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
  createContactPointSchema,
  createPeriodSchema,
  createCodeableConceptSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createEndpointSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Endpoint", [contained], () => {
    const baseSchema: z.ZodType<types.Endpoint<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Endpoint"),
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
        "active",
        "suspended",
        "error",
        "off",
        "entered-in-error",
        "test",
      ]),
      _status: createElementSchema().optional(),
      connectionType: createCodingSchema(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      managingOrganization: createReferenceSchema().optional(),
      contact: z.array(createContactPointSchema()).optional(),
      period: createPeriodSchema().optional(),
      payloadType: z.array(createCodeableConceptSchema()),
      payloadMimeType: z.array(primitives.getCodeSchema()).optional(),
      _payloadMimeType: z.array(createElementSchema()).optional(),
      address: primitives.getUrlSchema(),
      _address: createElementSchema().optional(),
      header: z.array(primitives.getStringSchema()).optional(),
      _header: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}
