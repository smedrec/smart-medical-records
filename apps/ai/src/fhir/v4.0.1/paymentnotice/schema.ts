import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createReferenceSchema,
  createMoneySchema,
  createCodeableConceptSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createPaymentNoticeSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("PaymentNotice", [contained], () => {
    const baseSchema: z.ZodType<types.PaymentNotice<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("PaymentNotice"),
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
        request: createReferenceSchema().optional(),
        response: createReferenceSchema().optional(),
        created: primitives.getDateTimeSchema(),
        _created: createElementSchema().optional(),
        provider: createReferenceSchema().optional(),
        payment: createReferenceSchema(),
        paymentDate: primitives.getDateSchema().optional(),
        _paymentDate: createElementSchema().optional(),
        payee: createReferenceSchema().optional(),
        recipient: createReferenceSchema(),
        amount: createMoneySchema(),
        paymentStatus: createCodeableConceptSchema().optional(),
      });

    return baseSchema;
  });
}
