import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createContactPointSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createSubscriptionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Subscription", [contained], () => {
    const baseSchema: z.ZodType<types.Subscription<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("Subscription"),
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
        status: z.enum(["requested", "active", "error", "off"]),
        _status: createElementSchema().optional(),
        contact: z.array(createContactPointSchema()).optional(),
        end: primitives.getInstantSchema().optional(),
        _end: createElementSchema().optional(),
        reason: primitives.getStringSchema(),
        _reason: createElementSchema().optional(),
        criteria: primitives.getStringSchema(),
        _criteria: createElementSchema().optional(),
        error: primitives.getStringSchema().optional(),
        _error: createElementSchema().optional(),
        channel: createSubscriptionChannelSchema(),
      });

    return baseSchema;
  });
}

export function createSubscriptionChannelSchema() {
  return getCachedSchema("SubscriptionChannel", [], () => {
    const baseSchema: z.ZodType<types.SubscriptionChannel> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: z.enum(["rest-hook", "websocket", "email", "sms", "message"]),
      _type: createElementSchema().optional(),
      endpoint: primitives.getUrlSchema().optional(),
      _endpoint: createElementSchema().optional(),
      payload: primitives.getCodeSchema().optional(),
      _payload: createElementSchema().optional(),
      header: z.array(primitives.getStringSchema()).optional(),
      _header: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}
