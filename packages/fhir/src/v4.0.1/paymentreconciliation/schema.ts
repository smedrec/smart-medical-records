import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createPeriodSchema,
  createReferenceSchema,
  createMoneySchema,
  createCodeableConceptSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createPaymentReconciliationSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("PaymentReconciliation", [contained], () => {
    const baseSchema: z.ZodType<types.PaymentReconciliation<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("PaymentReconciliation"),
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
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        period: createPeriodSchema().optional(),
        created: primitives.getDateTimeSchema(),
        _created: createElementSchema().optional(),
        paymentIssuer: createReferenceSchema().optional(),
        request: createReferenceSchema().optional(),
        requestor: createReferenceSchema().optional(),
        outcome: z.enum(["queued", "complete", "error", "partial"]).optional(),
        _outcome: createElementSchema().optional(),
        disposition: primitives.getStringSchema().optional(),
        _disposition: createElementSchema().optional(),
        paymentDate: primitives.getDateSchema(),
        _paymentDate: createElementSchema().optional(),
        paymentAmount: createMoneySchema(),
        paymentIdentifier: createIdentifierSchema().optional(),
        detail: z.array(createPaymentReconciliationDetailSchema()).optional(),
        formCode: createCodeableConceptSchema().optional(),
        processNote: z
          .array(createPaymentReconciliationProcessNoteSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createPaymentReconciliationDetailSchema() {
  return getCachedSchema("PaymentReconciliationDetail", [], () => {
    const baseSchema: z.ZodType<types.PaymentReconciliationDetail> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        identifier: createIdentifierSchema().optional(),
        predecessor: createIdentifierSchema().optional(),
        type: createCodeableConceptSchema(),
        request: createReferenceSchema().optional(),
        submitter: createReferenceSchema().optional(),
        response: createReferenceSchema().optional(),
        date: primitives.getDateSchema().optional(),
        _date: createElementSchema().optional(),
        responsible: createReferenceSchema().optional(),
        payee: createReferenceSchema().optional(),
        amount: createMoneySchema().optional(),
      });

    return baseSchema;
  });
}

export function createPaymentReconciliationProcessNoteSchema() {
  return getCachedSchema("PaymentReconciliationProcessNote", [], () => {
    const baseSchema: z.ZodType<types.PaymentReconciliationProcessNote> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: z.enum(["display", "print", "printoper"]).optional(),
        _type: createElementSchema().optional(),
        text: primitives.getStringSchema().optional(),
        _text: createElementSchema().optional(),
      });

    return baseSchema;
  });
}
