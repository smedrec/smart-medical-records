import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createContactDetailSchema,
  createUsageContextSchema,
  createCodeableConceptSchema,
  createReferenceSchema,
  createCodingSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createTestScriptSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("TestScript", [contained], () => {
    const baseSchema: z.ZodType<types.TestScript<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("TestScript"),
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
      url: primitives.getUriSchema(),
      _url: createElementSchema().optional(),
      identifier: createIdentifierSchema().optional(),
      version: primitives.getStringSchema().optional(),
      _version: createElementSchema().optional(),
      name: primitives.getStringSchema(),
      _name: createElementSchema().optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
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
      copyright: primitives.getMarkdownSchema().optional(),
      _copyright: createElementSchema().optional(),
      origin: z.array(createTestScriptOriginSchema()).optional(),
      destination: z.array(createTestScriptDestinationSchema()).optional(),
      metadata: createTestScriptMetadataSchema().optional(),
      fixture: z.array(createTestScriptFixtureSchema()).optional(),
      profile: z.array(createReferenceSchema()).optional(),
      variable: z.array(createTestScriptVariableSchema()).optional(),
      setup: createTestScriptSetupSchema().optional(),
      test: z.array(createTestScriptTestSchema()).optional(),
      teardown: createTestScriptTeardownSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptOriginSchema() {
  return getCachedSchema("TestScriptOrigin", [], () => {
    const baseSchema: z.ZodType<types.TestScriptOrigin> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      index: primitives.getIntegerSchema(),
      _index: createElementSchema().optional(),
      profile: createCodingSchema(),
    });

    return baseSchema;
  });
}

export function createTestScriptDestinationSchema() {
  return getCachedSchema("TestScriptDestination", [], () => {
    const baseSchema: z.ZodType<types.TestScriptDestination> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      index: primitives.getIntegerSchema(),
      _index: createElementSchema().optional(),
      profile: createCodingSchema(),
    });

    return baseSchema;
  });
}

export function createTestScriptMetadataSchema() {
  return getCachedSchema("TestScriptMetadata", [], () => {
    const baseSchema: z.ZodType<types.TestScriptMetadata> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      link: z.array(createTestScriptLinkSchema()).optional(),
      capability: z.array(createTestScriptCapabilitySchema()),
    });

    return baseSchema;
  });
}

export function createTestScriptLinkSchema() {
  return getCachedSchema("TestScriptLink", [], () => {
    const baseSchema: z.ZodType<types.TestScriptLink> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      url: primitives.getUriSchema().optional(),
      _url: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptCapabilitySchema() {
  return getCachedSchema("TestScriptCapability", [], () => {
    const baseSchema: z.ZodType<types.TestScriptCapability> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      required: primitives.getBooleanSchema().optional(),
      _required: createElementSchema().optional(),
      validated: primitives.getBooleanSchema().optional(),
      _validated: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      origin: z.array(primitives.getIntegerSchema()).optional(),
      _origin: z.array(createElementSchema()).optional(),
      destination: primitives.getIntegerSchema().optional(),
      _destination: createElementSchema().optional(),
      link: z.array(primitives.getUriSchema()).optional(),
      _link: z.array(createElementSchema()).optional(),
      capabilities: primitives.getCanonicalSchema(),
    });

    return baseSchema;
  });
}

export function createTestScriptFixtureSchema() {
  return getCachedSchema("TestScriptFixture", [], () => {
    const baseSchema: z.ZodType<types.TestScriptFixture> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      autocreate: primitives.getBooleanSchema(),
      _autocreate: createElementSchema().optional(),
      autodelete: primitives.getBooleanSchema(),
      _autodelete: createElementSchema().optional(),
      resource: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptVariableSchema() {
  return getCachedSchema("TestScriptVariable", [], () => {
    const baseSchema: z.ZodType<types.TestScriptVariable> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      name: primitives.getStringSchema(),
      _name: createElementSchema().optional(),
      defaultValue: primitives.getStringSchema().optional(),
      _defaultValue: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      expression: primitives.getStringSchema().optional(),
      _expression: createElementSchema().optional(),
      headerField: primitives.getStringSchema().optional(),
      _headerField: createElementSchema().optional(),
      hint: primitives.getStringSchema().optional(),
      _hint: createElementSchema().optional(),
      path: primitives.getStringSchema().optional(),
      _path: createElementSchema().optional(),
      sourceId: primitives.getIdSchema().optional(),
      _sourceId: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptSetupSchema() {
  return getCachedSchema("TestScriptSetup", [], () => {
    const baseSchema: z.ZodType<types.TestScriptSetup> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      action: z.array(createTestScriptActionSchema()),
    });

    return baseSchema;
  });
}

export function createTestScriptActionSchema() {
  return getCachedSchema("TestScriptAction", [], () => {
    const baseSchema: z.ZodType<types.TestScriptAction> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      operation: createTestScriptOperationSchema().optional(),
      assert: createTestScriptAssertSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptOperationSchema() {
  return getCachedSchema("TestScriptOperation", [], () => {
    const baseSchema: z.ZodType<types.TestScriptOperation> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodingSchema().optional(),
      resource: primitives.getCodeSchema().optional(),
      _resource: createElementSchema().optional(),
      label: primitives.getStringSchema().optional(),
      _label: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      accept: primitives.getCodeSchema().optional(),
      _accept: createElementSchema().optional(),
      contentType: primitives.getCodeSchema().optional(),
      _contentType: createElementSchema().optional(),
      destination: primitives.getIntegerSchema().optional(),
      _destination: createElementSchema().optional(),
      encodeRequestUrl: primitives.getBooleanSchema().optional(),
      _encodeRequestUrl: createElementSchema().optional(),
      method: z
        .enum(["delete", "get", "options", "patch", "post", "put", "head"])
        .optional(),
      _method: createElementSchema().optional(),
      origin: primitives.getIntegerSchema().optional(),
      _origin: createElementSchema().optional(),
      params: primitives.getStringSchema().optional(),
      _params: createElementSchema().optional(),
      requestHeader: z.array(createTestScriptRequestHeaderSchema()).optional(),
      requestId: primitives.getIdSchema().optional(),
      _requestId: createElementSchema().optional(),
      responseId: primitives.getIdSchema().optional(),
      _responseId: createElementSchema().optional(),
      sourceId: primitives.getIdSchema().optional(),
      _sourceId: createElementSchema().optional(),
      targetId: primitives.getIdSchema().optional(),
      _targetId: createElementSchema().optional(),
      url: primitives.getStringSchema().optional(),
      _url: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptRequestHeaderSchema() {
  return getCachedSchema("TestScriptRequestHeader", [], () => {
    const baseSchema: z.ZodType<types.TestScriptRequestHeader> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        field: primitives.getStringSchema().optional(),
        _field: createElementSchema().optional(),
        value: primitives.getStringSchema().optional(),
        _value: createElementSchema().optional(),
      },
    );

    return baseSchema;
  });
}

export function createTestScriptAssertSchema() {
  return getCachedSchema("TestScriptAssert", [], () => {
    const baseSchema: z.ZodType<types.TestScriptAssert> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      label: primitives.getStringSchema().optional(),
      _label: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      direction: z.enum(["response", "request"]).optional(),
      _direction: createElementSchema().optional(),
      compareToSourceId: primitives.getStringSchema().optional(),
      _compareToSourceId: createElementSchema().optional(),
      compareToSourceExpression: primitives.getStringSchema().optional(),
      _compareToSourceExpression: createElementSchema().optional(),
      compareToSourcePath: primitives.getStringSchema().optional(),
      _compareToSourcePath: createElementSchema().optional(),
      contentType: primitives.getCodeSchema().optional(),
      _contentType: createElementSchema().optional(),
      expression: primitives.getStringSchema().optional(),
      _expression: createElementSchema().optional(),
      headerField: primitives.getStringSchema().optional(),
      _headerField: createElementSchema().optional(),
      minimumId: primitives.getStringSchema().optional(),
      _minimumId: createElementSchema().optional(),
      navigationLinks: primitives.getBooleanSchema().optional(),
      _navigationLinks: createElementSchema().optional(),
      operator: z
        .enum([
          "equals",
          "notEquals",
          "in",
          "notIn",
          "greaterThan",
          "lessThan",
          "empty",
          "notEmpty",
          "contains",
          "notContains",
          "eval",
        ])
        .optional(),
      _operator: createElementSchema().optional(),
      path: primitives.getStringSchema().optional(),
      _path: createElementSchema().optional(),
      requestMethod: z
        .enum(["delete", "get", "options", "patch", "post", "put", "head"])
        .optional(),
      _requestMethod: createElementSchema().optional(),
      requestURL: primitives.getStringSchema().optional(),
      _requestURL: createElementSchema().optional(),
      resource: primitives.getCodeSchema().optional(),
      _resource: createElementSchema().optional(),
      response: z
        .enum([
          "okay",
          "created",
          "noContent",
          "notModified",
          "bad",
          "forbidden",
          "notFound",
          "methodNotAllowed",
          "conflict",
          "gone",
          "preconditionFailed",
          "unprocessable",
        ])
        .optional(),
      _response: createElementSchema().optional(),
      responseCode: primitives.getStringSchema().optional(),
      _responseCode: createElementSchema().optional(),
      sourceId: primitives.getIdSchema().optional(),
      _sourceId: createElementSchema().optional(),
      validateProfileId: primitives.getIdSchema().optional(),
      _validateProfileId: createElementSchema().optional(),
      value: primitives.getStringSchema().optional(),
      _value: createElementSchema().optional(),
      warningOnly: primitives.getBooleanSchema().optional(),
      _warningOnly: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptTestSchema() {
  return getCachedSchema("TestScriptTest", [], () => {
    const baseSchema: z.ZodType<types.TestScriptTest> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      action: z.array(createTestScriptAction1Schema()),
    });

    return baseSchema;
  });
}

export function createTestScriptAction1Schema() {
  return getCachedSchema("TestScriptAction1", [], () => {
    const baseSchema: z.ZodType<types.TestScriptAction1> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      operation: createTestScriptOperationSchema().optional(),
      assert: createTestScriptAssertSchema().optional(),
    });

    return baseSchema;
  });
}

export function createTestScriptTeardownSchema() {
  return getCachedSchema("TestScriptTeardown", [], () => {
    const baseSchema: z.ZodType<types.TestScriptTeardown> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      action: z.array(createTestScriptAction2Schema()),
    });

    return baseSchema;
  });
}

export function createTestScriptAction2Schema() {
  return getCachedSchema("TestScriptAction2", [], () => {
    const baseSchema: z.ZodType<types.TestScriptAction2> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      operation: createTestScriptOperationSchema(),
    });

    return baseSchema;
  });
}
