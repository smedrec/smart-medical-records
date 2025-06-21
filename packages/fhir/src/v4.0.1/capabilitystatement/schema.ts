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
  createReferenceSchema,
  createCodingSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createCapabilityStatementSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("CapabilityStatement", [contained], () => {
    const baseSchema: z.ZodType<types.CapabilityStatement<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("CapabilityStatement"),
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
        kind: z.enum(["instance", "capability", "requirements"]),
        _kind: createElementSchema().optional(),
        instantiates: z.array(primitives.getCanonicalSchema()).optional(),
        imports: z.array(primitives.getCanonicalSchema()).optional(),
        software: createCapabilityStatementSoftwareSchema().optional(),
        implementation:
          createCapabilityStatementImplementationSchema().optional(),
        fhirVersion: z.enum([
          "0.01",
          "0.05",
          "0.06",
          "0.11",
          "0.0.80",
          "0.0.81",
          "0.0.82",
          "0.4.0",
          "0.5.0",
          "1.0.0",
          "1.0.1",
          "1.0.2",
          "1.1.0",
          "1.4.0",
          "1.6.0",
          "1.8.0",
          "3.0.0",
          "3.0.1",
          "3.3.0",
          "3.5.0",
          "4.0.0",
          "4.0.1",
        ]),
        _fhirVersion: createElementSchema().optional(),
        format: z.array(primitives.getCodeSchema()),
        _format: z.array(createElementSchema()).optional(),
        patchFormat: z.array(primitives.getCodeSchema()).optional(),
        _patchFormat: z.array(createElementSchema()).optional(),
        implementationGuide: z
          .array(primitives.getCanonicalSchema())
          .optional(),
        rest: z.array(createCapabilityStatementRestSchema()).optional(),
        messaging: z
          .array(createCapabilityStatementMessagingSchema())
          .optional(),
        document: z.array(createCapabilityStatementDocumentSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementSoftwareSchema() {
  return getCachedSchema("CapabilityStatementSoftware", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementSoftware> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getStringSchema(),
        _name: createElementSchema().optional(),
        version: primitives.getStringSchema().optional(),
        _version: createElementSchema().optional(),
        releaseDate: primitives.getDateTimeSchema().optional(),
        _releaseDate: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementImplementationSchema() {
  return getCachedSchema("CapabilityStatementImplementation", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementImplementation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema(),
        _description: createElementSchema().optional(),
        url: primitives.getUrlSchema().optional(),
        _url: createElementSchema().optional(),
        custodian: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementRestSchema() {
  return getCachedSchema("CapabilityStatementRest", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementRest> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        mode: z.enum(["client", "server"]),
        _mode: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
        security: createCapabilityStatementSecuritySchema().optional(),
        resource: z.array(createCapabilityStatementResourceSchema()).optional(),
        interaction: z
          .array(createCapabilityStatementInteraction1Schema())
          .optional(),
        searchParam: z
          .array(createCapabilityStatementSearchParamSchema())
          .optional(),
        operation: z
          .array(createCapabilityStatementOperationSchema())
          .optional(),
        compartment: z.array(primitives.getCanonicalSchema()).optional(),
      },
    );

    return baseSchema;
  });
}

export function createCapabilityStatementSecuritySchema() {
  return getCachedSchema("CapabilityStatementSecurity", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementSecurity> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        cors: primitives.getBooleanSchema().optional(),
        _cors: createElementSchema().optional(),
        service: z.array(createCodeableConceptSchema()).optional(),
        description: primitives.getMarkdownSchema().optional(),
        _description: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementResourceSchema() {
  return getCachedSchema("CapabilityStatementResource", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementResource> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: primitives.getCodeSchema().optional(),
        _type: createElementSchema().optional(),
        profile: primitives.getCanonicalSchema().optional(),
        supportedProfile: z.array(primitives.getCanonicalSchema()).optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
        interaction: z
          .array(createCapabilityStatementInteractionSchema())
          .optional(),
        versioning: z
          .enum(["no-version", "versioned", "versioned-update"])
          .optional(),
        _versioning: createElementSchema().optional(),
        readHistory: primitives.getBooleanSchema().optional(),
        _readHistory: createElementSchema().optional(),
        updateCreate: primitives.getBooleanSchema().optional(),
        _updateCreate: createElementSchema().optional(),
        conditionalCreate: primitives.getBooleanSchema().optional(),
        _conditionalCreate: createElementSchema().optional(),
        conditionalRead: z
          .enum([
            "not-supported",
            "modified-since",
            "not-match",
            "full-support",
          ])
          .optional(),
        _conditionalRead: createElementSchema().optional(),
        conditionalUpdate: primitives.getBooleanSchema().optional(),
        _conditionalUpdate: createElementSchema().optional(),
        conditionalDelete: z
          .enum(["not-supported", "single", "multiple"])
          .optional(),
        _conditionalDelete: createElementSchema().optional(),
        referencePolicy: z
          .enum(["literal", "logical", "resolves", "enforced", "local"])
          .array()
          .optional(),
        _referencePolicy: z.array(createElementSchema()).optional(),
        searchInclude: z.array(primitives.getStringSchema()).optional(),
        _searchInclude: z.array(createElementSchema()).optional(),
        searchRevInclude: z.array(primitives.getStringSchema()).optional(),
        _searchRevInclude: z.array(createElementSchema()).optional(),
        searchParam: z
          .array(createCapabilityStatementSearchParamSchema())
          .optional(),
        operation: z
          .array(createCapabilityStatementOperationSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementInteractionSchema() {
  return getCachedSchema("CapabilityStatementInteraction", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementInteraction> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: z
          .enum([
            "read",
            "vread",
            "update",
            "patch",
            "delete",
            "history-instance",
            "history-type",
            "create",
            "search-type",
          ])
          .optional(),
        _code: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementSearchParamSchema() {
  return getCachedSchema("CapabilityStatementSearchParam", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementSearchParam> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        definition: primitives.getCanonicalSchema().optional(),
        type: z
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
        _type: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementOperationSchema() {
  return getCachedSchema("CapabilityStatementOperation", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementOperation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        definition: primitives.getCanonicalSchema(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementInteraction1Schema() {
  return getCachedSchema("CapabilityStatementInteraction1", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementInteraction1> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: z
          .enum(["transaction", "batch", "search-system", "history-system"])
          .optional(),
        _code: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementMessagingSchema() {
  return getCachedSchema("CapabilityStatementMessaging", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementMessaging> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        endpoint: z.array(createCapabilityStatementEndpointSchema()).optional(),
        reliableCache: primitives.getUnsignedIntSchema().optional(),
        _reliableCache: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
        supportedMessage: z
          .array(createCapabilityStatementSupportedMessageSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementEndpointSchema() {
  return getCachedSchema("CapabilityStatementEndpoint", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementEndpoint> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        protocol: createCodingSchema(),
        address: primitives.getUrlSchema().optional(),
        _address: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementSupportedMessageSchema() {
  return getCachedSchema("CapabilityStatementSupportedMessage", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementSupportedMessage> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        mode: z.enum(["sender", "receiver"]).optional(),
        _mode: createElementSchema().optional(),
        definition: primitives.getCanonicalSchema(),
      });

    return baseSchema;
  });
}

export function createCapabilityStatementDocumentSchema() {
  return getCachedSchema("CapabilityStatementDocument", [], () => {
    const baseSchema: z.ZodType<types.CapabilityStatementDocument> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        mode: z.enum(["producer", "consumer"]),
        _mode: createElementSchema().optional(),
        documentation: primitives.getMarkdownSchema().optional(),
        _documentation: createElementSchema().optional(),
        profile: primitives.getCanonicalSchema(),
      });

    return baseSchema;
  });
}
