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
  createAnnotationSchema,
  createQuantitySchema,
  createRangeSchema,
  createRatioSchema,
  createDurationSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createGoalSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Goal", [contained], () => {
    const baseSchema: z.ZodType<types.Goal<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Goal"),
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
      lifecycleStatus: z.enum([
        "proposed",
        "planned",
        "accepted",
        "active",
        "on-hold",
        "completed",
        "cancelled",
        "entered-in-error",
        "rejected",
      ]),
      _lifecycleStatus: createElementSchema().optional(),
      achievementStatus: createCodeableConceptSchema().optional(),
      category: z.array(createCodeableConceptSchema()).optional(),
      priority: createCodeableConceptSchema().optional(),
      description: createCodeableConceptSchema(),
      subject: createReferenceSchema(),
      startDate: z.string().optional(),
      _startDate: createElementSchema().optional(),
      startCodeableConcept: createCodeableConceptSchema().optional(),
      target: z.array(createGoalTargetSchema()).optional(),
      statusDate: primitives.getDateSchema().optional(),
      _statusDate: createElementSchema().optional(),
      statusReason: primitives.getStringSchema().optional(),
      _statusReason: createElementSchema().optional(),
      expressedBy: createReferenceSchema().optional(),
      addresses: z.array(createReferenceSchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
      outcomeCode: z.array(createCodeableConceptSchema()).optional(),
      outcomeReference: z.array(createReferenceSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createGoalTargetSchema() {
  return getCachedSchema("GoalTarget", [], () => {
    const baseSchema: z.ZodType<types.GoalTarget> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      measure: createCodeableConceptSchema().optional(),
      detailQuantity: createQuantitySchema().optional(),
      detailRange: createRangeSchema().optional(),
      detailCodeableConcept: createCodeableConceptSchema().optional(),
      detailString: z.string().optional(),
      _detailString: createElementSchema().optional(),
      detailBoolean: z.boolean().optional(),
      _detailBoolean: createElementSchema().optional(),
      detailInteger: z.number().optional(),
      _detailInteger: createElementSchema().optional(),
      detailRatio: createRatioSchema().optional(),
      dueDate: z.string().optional(),
      _dueDate: createElementSchema().optional(),
      dueDuration: createDurationSchema().optional(),
    });

    return baseSchema;
  });
}
