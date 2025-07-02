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
  createReferenceSchema,
  createAttachmentSchema,
  createCodingSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createDocumentReferenceSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("DocumentReference", [contained], () => {
    const baseSchema: z.ZodType<types.DocumentReference<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("DocumentReference"),
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
        masterIdentifier: createIdentifierSchema().optional(),
        identifier: z.array(createIdentifierSchema()).optional(),
        status: z.enum(["current", "superseded", "entered-in-error"]),
        _status: createElementSchema().optional(),
        docStatus: primitives.getCodeSchema().optional(),
        _docStatus: createElementSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        category: z.array(createCodeableConceptSchema()).optional(),
        subject: createReferenceSchema().optional(),
        date: primitives.getInstantSchema().optional(),
        _date: createElementSchema().optional(),
        author: z.array(createReferenceSchema()).optional(),
        authenticator: createReferenceSchema().optional(),
        custodian: createReferenceSchema().optional(),
        relatesTo: z.array(createDocumentReferenceRelatesToSchema()).optional(),
        description: primitives.getStringSchema().optional(),
        _description: createElementSchema().optional(),
        securityLabel: z.array(createCodeableConceptSchema()).optional(),
        content: z.array(createDocumentReferenceContentSchema()),
        context: createDocumentReferenceContextSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDocumentReferenceRelatesToSchema() {
  return getCachedSchema("DocumentReferenceRelatesTo", [], () => {
    const baseSchema: z.ZodType<types.DocumentReferenceRelatesTo> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: z.enum(["replaces", "transforms", "signs", "appends"]),
        _code: createElementSchema().optional(),
        target: createReferenceSchema(),
      });

    return baseSchema;
  });
}

export function createDocumentReferenceContentSchema() {
  return getCachedSchema("DocumentReferenceContent", [], () => {
    const baseSchema: z.ZodType<types.DocumentReferenceContent> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        attachment: createAttachmentSchema(),
        format: createCodingSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDocumentReferenceContextSchema() {
  return getCachedSchema("DocumentReferenceContext", [], () => {
    const baseSchema: z.ZodType<types.DocumentReferenceContext> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        encounter: z.array(createReferenceSchema()).optional(),
        event: z.array(createCodeableConceptSchema()).optional(),
        period: createPeriodSchema().optional(),
        facilityType: createCodeableConceptSchema().optional(),
        practiceSetting: createCodeableConceptSchema().optional(),
        sourcePatientInfo: createReferenceSchema().optional(),
        related: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}
