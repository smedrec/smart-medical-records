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
  createHumanNameSchema,
  createContactPointSchema,
  createAddressSchema,
  createAttachmentSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createRelatedPersonSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("RelatedPerson", [contained], () => {
    const baseSchema: z.ZodType<types.RelatedPerson<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("RelatedPerson"),
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
        active: primitives.getBooleanSchema().optional(),
        _active: createElementSchema().optional(),
        patient: createReferenceSchema(),
        relationship: z.array(createCodeableConceptSchema()).optional(),
        name: z.array(createHumanNameSchema()).optional(),
        telecom: z.array(createContactPointSchema()).optional(),
        gender: z.enum(["male", "female", "other", "unknown"]).optional(),
        _gender: createElementSchema().optional(),
        birthDate: primitives.getDateSchema().optional(),
        _birthDate: createElementSchema().optional(),
        address: z.array(createAddressSchema()).optional(),
        photo: z.array(createAttachmentSchema()).optional(),
        period: createPeriodSchema().optional(),
        communication: z
          .array(createRelatedPersonCommunicationSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createRelatedPersonCommunicationSchema() {
  return getCachedSchema("RelatedPersonCommunication", [], () => {
    const baseSchema: z.ZodType<types.RelatedPersonCommunication> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        language: createCodeableConceptSchema(),
        preferred: primitives.getBooleanSchema().optional(),
        _preferred: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
