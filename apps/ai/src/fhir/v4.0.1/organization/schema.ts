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
  createContactPointSchema,
  createAddressSchema,
  createReferenceSchema,
  createHumanNameSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createOrganizationSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Organization", [contained], () => {
    const baseSchema: z.ZodType<types.Organization<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("Organization"),
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
        type: z.array(createCodeableConceptSchema()).optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        alias: z.array(primitives.getStringSchema()).optional(),
        _alias: z.array(createElementSchema()).optional(),
        telecom: z.array(createContactPointSchema()).optional(),
        address: z.array(createAddressSchema()).optional(),
        partOf: createReferenceSchema().optional(),
        contact: z.array(createOrganizationContactSchema()).optional(),
        endpoint: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createOrganizationContactSchema() {
  return getCachedSchema("OrganizationContact", [], () => {
    const baseSchema: z.ZodType<types.OrganizationContact> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      purpose: createCodeableConceptSchema().optional(),
      name: createHumanNameSchema().optional(),
      telecom: z.array(createContactPointSchema()).optional(),
      address: createAddressSchema().optional(),
    });

    return baseSchema;
  });
}

export function createOrganizationAffiliationSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("OrganizationAffiliation", [contained], () => {
    const baseSchema: z.ZodType<types.OrganizationAffiliation<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("OrganizationAffiliation"),
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
        period: createPeriodSchema().optional(),
        organization: createReferenceSchema().optional(),
        participatingOrganization: createReferenceSchema().optional(),
        network: z.array(createReferenceSchema()).optional(),
        code: z.array(createCodeableConceptSchema()).optional(),
        specialty: z.array(createCodeableConceptSchema()).optional(),
        location: z.array(createReferenceSchema()).optional(),
        healthcareService: z.array(createReferenceSchema()).optional(),
        telecom: z.array(createContactPointSchema()).optional(),
        endpoint: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}
