import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createReferenceSchema,
  createCodeableConceptSchema,
  createTimingSchema,
  createSignatureSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createVerificationResultSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("VerificationResult", [contained], () => {
    const baseSchema: z.ZodType<types.VerificationResult<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("VerificationResult"),
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
        target: z.array(createReferenceSchema()).optional(),
        targetLocation: z.array(primitives.getStringSchema()).optional(),
        _targetLocation: z.array(createElementSchema()).optional(),
        need: createCodeableConceptSchema().optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        statusDate: primitives.getDateTimeSchema().optional(),
        _statusDate: createElementSchema().optional(),
        validationType: createCodeableConceptSchema().optional(),
        validationProcess: z.array(createCodeableConceptSchema()).optional(),
        frequency: createTimingSchema().optional(),
        lastPerformed: primitives.getDateTimeSchema().optional(),
        _lastPerformed: createElementSchema().optional(),
        nextScheduled: primitives.getDateSchema().optional(),
        _nextScheduled: createElementSchema().optional(),
        failureAction: createCodeableConceptSchema().optional(),
        primarySource: z
          .array(createVerificationResultPrimarySourceSchema())
          .optional(),
        attestation: createVerificationResultAttestationSchema().optional(),
        validator: z
          .array(createVerificationResultValidatorSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createVerificationResultPrimarySourceSchema() {
  return getCachedSchema("VerificationResultPrimarySource", [], () => {
    const baseSchema: z.ZodType<types.VerificationResultPrimarySource> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        who: createReferenceSchema().optional(),
        type: z.array(createCodeableConceptSchema()).optional(),
        communicationMethod: z.array(createCodeableConceptSchema()).optional(),
        validationStatus: createCodeableConceptSchema().optional(),
        validationDate: primitives.getDateTimeSchema().optional(),
        _validationDate: createElementSchema().optional(),
        canPushUpdates: createCodeableConceptSchema().optional(),
        pushTypeAvailable: z.array(createCodeableConceptSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createVerificationResultAttestationSchema() {
  return getCachedSchema("VerificationResultAttestation", [], () => {
    const baseSchema: z.ZodType<types.VerificationResultAttestation> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        who: createReferenceSchema().optional(),
        onBehalfOf: createReferenceSchema().optional(),
        communicationMethod: createCodeableConceptSchema().optional(),
        date: primitives.getDateSchema().optional(),
        _date: createElementSchema().optional(),
        sourceIdentityCertificate: primitives.getStringSchema().optional(),
        _sourceIdentityCertificate: createElementSchema().optional(),
        proxyIdentityCertificate: primitives.getStringSchema().optional(),
        _proxyIdentityCertificate: createElementSchema().optional(),
        proxySignature: createSignatureSchema().optional(),
        sourceSignature: createSignatureSchema().optional(),
      });

    return baseSchema;
  });
}

export function createVerificationResultValidatorSchema() {
  return getCachedSchema("VerificationResultValidator", [], () => {
    const baseSchema: z.ZodType<types.VerificationResultValidator> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        organization: createReferenceSchema(),
        identityCertificate: primitives.getStringSchema().optional(),
        _identityCertificate: createElementSchema().optional(),
        attestationSignature: createSignatureSchema().optional(),
      });

    return baseSchema;
  });
}
