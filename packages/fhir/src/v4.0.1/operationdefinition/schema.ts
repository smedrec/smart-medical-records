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

export function createOperationDefinitionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("OperationDefinition", [contained], () => {
    const baseSchema: z.ZodType<types.OperationDefinition<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("OperationDefinition"),
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
        title: primitives.getStringSchema().optional(),
        _title: createElementSchema().optional(),
        status: z.enum(["draft", "active", "retired", "unknown"]),
        _status: createElementSchema().optional(),
        kind: z.enum(["operation", "query"]),
        _kind: createElementSchema().optional(),
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
        affectsState: primitives.getBooleanSchema().optional(),
        _affectsState: createElementSchema().optional(),
        code: primitives.getCodeSchema(),
        _code: createElementSchema().optional(),
        comment: primitives.getMarkdownSchema().optional(),
        _comment: createElementSchema().optional(),
        base: primitives.getCanonicalSchema().optional(),
        resource: z.array(primitives.getCodeSchema()).optional(),
        _resource: z.array(createElementSchema()).optional(),
        system: primitives.getBooleanSchema(),
        _system: createElementSchema().optional(),
        type: primitives.getBooleanSchema(),
        _type: createElementSchema().optional(),
        instance: primitives.getBooleanSchema(),
        _instance: createElementSchema().optional(),
        inputProfile: primitives.getCanonicalSchema().optional(),
        outputProfile: primitives.getCanonicalSchema().optional(),
        parameter: z
          .array(createOperationDefinitionParameterSchema())
          .optional(),
        overload: z.array(createOperationDefinitionOverloadSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createOperationDefinitionParameterSchema() {
  return getCachedSchema("OperationDefinitionParameter", [], () => {
    const baseSchema: z.ZodType<types.OperationDefinitionParameter> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getCodeSchema(),
        _name: createElementSchema().optional(),
        use: z.enum(["in", "out"]),
        _use: createElementSchema().optional(),
        min: primitives.getIntegerSchema(),
        _min: createElementSchema().optional(),
        max: primitives.getStringSchema(),
        _max: createElementSchema().optional(),
        documentation: primitives.getStringSchema().optional(),
        _documentation: createElementSchema().optional(),
        type: primitives.getCodeSchema().optional(),
        _type: createElementSchema().optional(),
        targetProfile: z.array(primitives.getCanonicalSchema()).optional(),
        searchType: z
          .enum([
            "number",
            "date",
            "string",
            "token",
            "reference",
            "composite",
            "quantity",
            "uri",
            "special",
          ])
          .optional(),
        _searchType: createElementSchema().optional(),
        binding: createOperationDefinitionBindingSchema().optional(),
        referencedFrom: z
          .array(createOperationDefinitionReferencedFromSchema())
          .optional(),
        part: z.array(createOperationDefinitionParameterSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createOperationDefinitionBindingSchema() {
  return getCachedSchema("OperationDefinitionBinding", [], () => {
    const baseSchema: z.ZodType<types.OperationDefinitionBinding> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        strength: z
          .enum(["required", "extensible", "preferred", "example"])
          .optional(),
        _strength: createElementSchema().optional(),
        valueSet: primitives.getCanonicalSchema(),
      });

    return baseSchema;
  });
}

export function createOperationDefinitionReferencedFromSchema() {
  return getCachedSchema("OperationDefinitionReferencedFrom", [], () => {
    const baseSchema: z.ZodType<types.OperationDefinitionReferencedFrom> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        source: primitives.getStringSchema().optional(),
        _source: createElementSchema().optional(),
        sourceId: primitives.getStringSchema().optional(),
        _sourceId: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createOperationDefinitionOverloadSchema() {
  return getCachedSchema("OperationDefinitionOverload", [], () => {
    const baseSchema: z.ZodType<types.OperationDefinitionOverload> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        parameterName: z.array(primitives.getStringSchema()).optional(),
        _parameterName: z.array(createElementSchema()).optional(),
        comment: primitives.getStringSchema().optional(),
        _comment: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
