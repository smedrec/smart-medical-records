import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createCodingSchema,
  createPeriodSchema,
  createCodeableConceptSchema,
  createReferenceSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createAuditEventSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("AuditEvent", [contained], () => {
    const baseSchema: z.ZodType<types.AuditEvent<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("AuditEvent"),
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
      type: createCodingSchema(),
      subtype: z.array(createCodingSchema()).optional(),
      action: z.enum(["C", "R", "U", "D", "E"]).optional(),
      _action: createElementSchema().optional(),
      period: createPeriodSchema().optional(),
      recorded: primitives.getInstantSchema(),
      _recorded: createElementSchema().optional(),
      outcome: z.enum(["0", "4", "8", "12"]).optional(),
      _outcome: createElementSchema().optional(),
      outcomeDesc: primitives.getStringSchema().optional(),
      _outcomeDesc: createElementSchema().optional(),
      purposeOfEvent: z.array(createCodeableConceptSchema()).optional(),
      agent: z.array(createAuditEventAgentSchema()),
      source: createAuditEventSourceSchema(),
      entity: z.array(createAuditEventEntitySchema()).optional(),
    });

    return baseSchema;
  });
}

export function createAuditEventAgentSchema() {
  return getCachedSchema("AuditEventAgent", [], () => {
    const baseSchema: z.ZodType<types.AuditEventAgent> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodeableConceptSchema().optional(),
      role: z.array(createCodeableConceptSchema()).optional(),
      who: createReferenceSchema().optional(),
      altId: primitives.getStringSchema().optional(),
      _altId: createElementSchema().optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      requestor: primitives.getBooleanSchema(),
      _requestor: createElementSchema().optional(),
      location: createReferenceSchema().optional(),
      policy: z.array(primitives.getUriSchema()).optional(),
      _policy: z.array(createElementSchema()).optional(),
      media: createCodingSchema().optional(),
      network: createAuditEventNetworkSchema().optional(),
      purposeOfUse: z.array(createCodeableConceptSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createAuditEventNetworkSchema() {
  return getCachedSchema("AuditEventNetwork", [], () => {
    const baseSchema: z.ZodType<types.AuditEventNetwork> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      address: primitives.getStringSchema().optional(),
      _address: createElementSchema().optional(),
      type: z.enum(["1", "2", "3", "4", "5"]).optional(),
      _type: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createAuditEventSourceSchema() {
  return getCachedSchema("AuditEventSource", [], () => {
    const baseSchema: z.ZodType<types.AuditEventSource> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      site: primitives.getStringSchema().optional(),
      _site: createElementSchema().optional(),
      observer: createReferenceSchema(),
      type: z.array(createCodingSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createAuditEventEntitySchema() {
  return getCachedSchema("AuditEventEntity", [], () => {
    const baseSchema: z.ZodType<types.AuditEventEntity> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      what: createReferenceSchema().optional(),
      type: createCodingSchema().optional(),
      role: createCodingSchema().optional(),
      lifecycle: createCodingSchema().optional(),
      securityLabel: z.array(createCodingSchema()).optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      query: primitives.getBase64BinarySchema().optional(),
      _query: createElementSchema().optional(),
      detail: z.array(createAuditEventDetailSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createAuditEventDetailSchema() {
  return getCachedSchema("AuditEventDetail", [], () => {
    const baseSchema: z.ZodType<types.AuditEventDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: primitives.getStringSchema().optional(),
      _type: createElementSchema().optional(),
      valueString: z.string().optional(),
      _valueString: createElementSchema().optional(),
      valueBase64Binary: z.string().optional(),
      _valueBase64Binary: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
