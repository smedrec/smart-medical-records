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
  createQuantitySchema,
  createRangeSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createGroupSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Group", [contained], () => {
    const baseSchema: z.ZodType<types.Group<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Group"),
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
      active: primitives.getBooleanSchema().optional(),
      _active: createElementSchema().optional(),
      type: z.enum([
        "person",
        "animal",
        "practitioner",
        "device",
        "medication",
        "substance",
      ]),
      _type: createElementSchema().optional(),
      actual: primitives.getBooleanSchema(),
      _actual: createElementSchema().optional(),
      code: createCodeableConceptSchema().optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      quantity: primitives.getUnsignedIntSchema().optional(),
      _quantity: createElementSchema().optional(),
      managingEntity: createReferenceSchema().optional(),
      characteristic: z.array(createGroupCharacteristicSchema()).optional(),
      member: z.array(createGroupMemberSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createGroupCharacteristicSchema() {
  return getCachedSchema("GroupCharacteristic", [], () => {
    const baseSchema: z.ZodType<types.GroupCharacteristic> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema(),
      valueCodeableConcept: createCodeableConceptSchema().optional(),
      valueBoolean: z.boolean().optional(),
      _valueBoolean: createElementSchema().optional(),
      valueQuantity: createQuantitySchema().optional(),
      valueRange: createRangeSchema().optional(),
      valueReference: createReferenceSchema().optional(),
      exclude: primitives.getBooleanSchema(),
      _exclude: createElementSchema().optional(),
      period: createPeriodSchema().optional(),
    });

    return baseSchema;
  });
}

export function createGroupMemberSchema() {
  return getCachedSchema("GroupMember", [], () => {
    const baseSchema: z.ZodType<types.GroupMember> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      entity: createReferenceSchema(),
      period: createPeriodSchema().optional(),
      inactive: primitives.getBooleanSchema().optional(),
      _inactive: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
