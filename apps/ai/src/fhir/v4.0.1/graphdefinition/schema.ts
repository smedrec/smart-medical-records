import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createContactDetailSchema,
  createUsageContextSchema,
  createCodeableConceptSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createGraphDefinitionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("GraphDefinition", [contained], () => {
    const baseSchema: z.ZodType<types.GraphDefinition<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("GraphDefinition"),
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
        url: primitives.getUriSchema().optional(),
        _url: createElementSchema().optional(),
        version: primitives.getStringSchema().optional(),
        _version: createElementSchema().optional(),
        name: primitives.getStringSchema(),
        _name: createElementSchema().optional(),
        status: z.enum(["draft", "active", "retired", "unknown"]),
        _status: createElementSchema().optional(),
        experimental: primitives.getBooleanSchema().optional(),
        _experimental: createElementSchema().optional(),
        date: primitives.getDateTimeSchema().optional(),
        _date: createElementSchema().optional(),
        publisher: primitives.getStringSchema().optional(),
        _publisher: createElementSchema().optional(),
        contact: z.array(createContactDetailSchema()).optional(),
        description: primitives.getMarkdownSchema().optional(),
        _description: createElementSchema().optional(),
        useContext: z.array(createUsageContextSchema()).optional(),
        jurisdiction: z.array(createCodeableConceptSchema()).optional(),
        purpose: primitives.getMarkdownSchema().optional(),
        _purpose: createElementSchema().optional(),
        start: primitives.getCodeSchema(),
        _start: createElementSchema().optional(),
        profile: primitives.getCanonicalSchema().optional(),
        link: z.array(createGraphDefinitionLinkSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createGraphDefinitionLinkSchema() {
  return getCachedSchema("GraphDefinitionLink", [], () => {
    const baseSchema: z.ZodType<types.GraphDefinitionLink> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      path: primitives.getStringSchema().optional(),
      _path: createElementSchema().optional(),
      sliceName: primitives.getStringSchema().optional(),
      _sliceName: createElementSchema().optional(),
      min: primitives.getIntegerSchema().optional(),
      _min: createElementSchema().optional(),
      max: primitives.getStringSchema().optional(),
      _max: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      target: z.array(createGraphDefinitionTargetSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createGraphDefinitionTargetSchema() {
  return getCachedSchema("GraphDefinitionTarget", [], () => {
    const baseSchema: z.ZodType<types.GraphDefinitionTarget> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: primitives.getCodeSchema().optional(),
      _type: createElementSchema().optional(),
      params: primitives.getStringSchema().optional(),
      _params: createElementSchema().optional(),
      profile: primitives.getCanonicalSchema().optional(),
      compartment: z.array(createGraphDefinitionCompartmentSchema()).optional(),
      link: z.array(createGraphDefinitionLinkSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createGraphDefinitionCompartmentSchema() {
  return getCachedSchema("GraphDefinitionCompartment", [], () => {
    const baseSchema: z.ZodType<types.GraphDefinitionCompartment> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        use: z.enum(["condition", "requirement"]).optional(),
        _use: createElementSchema().optional(),
        code: primitives.getCodeSchema().optional(),
        _code: createElementSchema().optional(),
        rule: z
          .enum(["identical", "matching", "different", "custom"])
          .optional(),
        _rule: createElementSchema().optional(),
        expression: primitives.getStringSchema().optional(),
        _expression: createElementSchema().optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
