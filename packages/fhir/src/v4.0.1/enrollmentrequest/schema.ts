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
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createEnrollmentRequestSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("EnrollmentRequest", [contained], () => {
    const baseSchema: z.ZodType<types.EnrollmentRequest<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("EnrollmentRequest"),
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
        status: primitives.getCodeSchema().optional(),
        _status: createElementSchema().optional(),
        created: primitives.getDateTimeSchema().optional(),
        _created: createElementSchema().optional(),
        insurer: createReferenceSchema().optional(),
        provider: createReferenceSchema().optional(),
        candidate: createReferenceSchema().optional(),
        coverage: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}
