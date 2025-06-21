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

export function createTerminologyCapabilitiesSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("TerminologyCapabilities", [contained], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilities<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("TerminologyCapabilities"),
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
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        title: primitives.getStringSchema().optional(),
        _title: createElementSchema().optional(),
        status: z.enum(["draft", "active", "retired", "unknown"]),
        _status: createElementSchema().optional(),
        experimental: primitives.getBooleanSchema().optional(),
        _experimental: createElementSchema().optional(),
        date: primitives.getDateTimeSchema(),
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
        copyright: primitives.getMarkdownSchema().optional(),
        _copyright: createElementSchema().optional(),
        kind: primitives.getCodeSchema(),
        _kind: createElementSchema().optional(),
        software: createTerminologyCapabilitiesSoftwareSchema().optional(),
        implementation:
          createTerminologyCapabilitiesImplementationSchema().optional(),
        lockedDate: primitives.getBooleanSchema().optional(),
        _lockedDate: createElementSchema().optional(),
        codeSystem: z
          .array(createTerminologyCapabilitiesCodeSystemSchema())
          .optional(),
        expansion: createTerminologyCapabilitiesExpansionSchema().optional(),
        codeSearch: z.enum(["explicit", "all"]).optional(),
        _codeSearch: createElementSchema().optional(),
        validateCode:
          createTerminologyCapabilitiesValidateCodeSchema().optional(),
        translation:
          createTerminologyCapabilitiesTranslationSchema().optional(),
        closure: createTerminologyCapabilitiesClosureSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesSoftwareSchema() {
  return getCachedSchema("TerminologyCapabilitiesSoftware", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesSoftware> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getStringSchema(),
        _name: createElementSchema().optional(),
        version: primitives.getStringSchema().optional(),
        _version: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesImplementationSchema() {
  return getCachedSchema("TerminologyCapabilitiesImplementation", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesImplementation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema(),
        _description: createElementSchema().optional(),
        url: primitives.getUrlSchema().optional(),
        _url: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesCodeSystemSchema() {
  return getCachedSchema("TerminologyCapabilitiesCodeSystem", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesCodeSystem> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        uri: primitives.getCanonicalSchema().optional(),
        version: z
          .array(createTerminologyCapabilitiesVersionSchema())
          .optional(),
        subsumption: primitives.getBooleanSchema().optional(),
        _subsumption: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesVersionSchema() {
  return getCachedSchema("TerminologyCapabilitiesVersion", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesVersion> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: primitives.getStringSchema().optional(),
        _code: createElementSchema().optional(),
        isDefault: primitives.getBooleanSchema().optional(),
        _isDefault: createElementSchema().optional(),
        compositional: primitives.getBooleanSchema().optional(),
        _compositional: createElementSchema().optional(),
        language: z.array(primitives.getCodeSchema()).optional(),
        _language: z.array(createElementSchema()).optional(),
        filter: z.array(createTerminologyCapabilitiesFilterSchema()).optional(),
        property: z.array(primitives.getCodeSchema()).optional(),
        _property: z.array(createElementSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesFilterSchema() {
  return getCachedSchema("TerminologyCapabilitiesFilter", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesFilter> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: primitives.getCodeSchema().optional(),
        _code: createElementSchema().optional(),
        op: z.array(primitives.getCodeSchema()).optional(),
        _op: z.array(createElementSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesExpansionSchema() {
  return getCachedSchema("TerminologyCapabilitiesExpansion", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesExpansion> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        hierarchical: primitives.getBooleanSchema().optional(),
        _hierarchical: createElementSchema().optional(),
        paging: primitives.getBooleanSchema().optional(),
        _paging: createElementSchema().optional(),
        incomplete: primitives.getBooleanSchema().optional(),
        _incomplete: createElementSchema().optional(),
        parameter: z
          .array(createTerminologyCapabilitiesParameterSchema())
          .optional(),
        textFilter: primitives.getMarkdownSchema().optional(),
        _textFilter: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesParameterSchema() {
  return getCachedSchema("TerminologyCapabilitiesParameter", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesParameter> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getCodeSchema().optional(),
        _name: createElementSchema().optional(),
        documentation: primitives.getStringSchema().optional(),
        _documentation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesValidateCodeSchema() {
  return getCachedSchema("TerminologyCapabilitiesValidateCode", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesValidateCode> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        translations: primitives.getBooleanSchema(),
        _translations: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesTranslationSchema() {
  return getCachedSchema("TerminologyCapabilitiesTranslation", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesTranslation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        needsMap: primitives.getBooleanSchema(),
        _needsMap: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createTerminologyCapabilitiesClosureSchema() {
  return getCachedSchema("TerminologyCapabilitiesClosure", [], () => {
    const baseSchema: z.ZodType<types.TerminologyCapabilitiesClosure> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        translation: primitives.getBooleanSchema().optional(),
        _translation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
