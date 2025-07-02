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
  createContactDetailSchema,
  createUsageContextSchema,
  createPeriodSchema,
  createRelatedArtifactSchema,
  createQuantitySchema,
  createRangeSchema,
  createDurationSchema,
  createTriggerDefinitionSchema,
  createDataRequirementSchema,
  createAgeSchema,
  createTimingSchema,
  createExpressionSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createPlanDefinitionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("PlanDefinition", [contained], () => {
    const baseSchema: z.ZodType<types.PlanDefinition<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("PlanDefinition"),
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
        identifier: z.array(createIdentifierSchema()).optional(),
        version: primitives.getStringSchema().optional(),
        _version: createElementSchema().optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        title: primitives.getStringSchema().optional(),
        _title: createElementSchema().optional(),
        subtitle: primitives.getStringSchema().optional(),
        _subtitle: createElementSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        status: z.enum(["draft", "active", "retired", "unknown"]),
        _status: createElementSchema().optional(),
        experimental: primitives.getBooleanSchema().optional(),
        _experimental: createElementSchema().optional(),
        subjectCodeableConcept: createCodeableConceptSchema().optional(),
        subjectReference: createReferenceSchema().optional(),
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
        usage: primitives.getStringSchema().optional(),
        _usage: createElementSchema().optional(),
        copyright: primitives.getMarkdownSchema().optional(),
        _copyright: createElementSchema().optional(),
        approvalDate: primitives.getDateSchema().optional(),
        _approvalDate: createElementSchema().optional(),
        lastReviewDate: primitives.getDateSchema().optional(),
        _lastReviewDate: createElementSchema().optional(),
        effectivePeriod: createPeriodSchema().optional(),
        topic: z.array(createCodeableConceptSchema()).optional(),
        author: z.array(createContactDetailSchema()).optional(),
        editor: z.array(createContactDetailSchema()).optional(),
        reviewer: z.array(createContactDetailSchema()).optional(),
        endorser: z.array(createContactDetailSchema()).optional(),
        relatedArtifact: z.array(createRelatedArtifactSchema()).optional(),
        library: z.array(primitives.getCanonicalSchema()).optional(),
        goal: z.array(createPlanDefinitionGoalSchema()).optional(),
        action: z.array(createPlanDefinitionActionSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createPlanDefinitionGoalSchema() {
  return getCachedSchema("PlanDefinitionGoal", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionGoal> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      category: createCodeableConceptSchema().optional(),
      description: createCodeableConceptSchema(),
      priority: createCodeableConceptSchema().optional(),
      start: createCodeableConceptSchema().optional(),
      addresses: z.array(createCodeableConceptSchema()).optional(),
      documentation: z.array(createRelatedArtifactSchema()).optional(),
      target: z.array(createPlanDefinitionTargetSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createPlanDefinitionTargetSchema() {
  return getCachedSchema("PlanDefinitionTarget", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionTarget> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      measure: createCodeableConceptSchema().optional(),
      detailQuantity: createQuantitySchema().optional(),
      detailRange: createRangeSchema().optional(),
      detailCodeableConcept: createCodeableConceptSchema().optional(),
      due: createDurationSchema().optional(),
    });

    return baseSchema;
  });
}

export function createPlanDefinitionActionSchema() {
  return getCachedSchema("PlanDefinitionAction", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionAction> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      prefix: primitives.getStringSchema().optional(),
      _prefix: createElementSchema().optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
      description: primitives.getStringSchema().optional(),
      _description: createElementSchema().optional(),
      textEquivalent: primitives.getStringSchema().optional(),
      _textEquivalent: createElementSchema().optional(),
      priority: primitives.getCodeSchema().optional(),
      _priority: createElementSchema().optional(),
      code: z.array(createCodeableConceptSchema()).optional(),
      reason: z.array(createCodeableConceptSchema()).optional(),
      documentation: z.array(createRelatedArtifactSchema()).optional(),
      goalId: z.array(primitives.getIdSchema()).optional(),
      _goalId: z.array(createElementSchema()).optional(),
      subjectCodeableConcept: createCodeableConceptSchema().optional(),
      subjectReference: createReferenceSchema().optional(),
      trigger: z.array(createTriggerDefinitionSchema()).optional(),
      condition: z.array(createPlanDefinitionConditionSchema()).optional(),
      input: z.array(createDataRequirementSchema()).optional(),
      output: z.array(createDataRequirementSchema()).optional(),
      relatedAction: z
        .array(createPlanDefinitionRelatedActionSchema())
        .optional(),
      timingDateTime: z.string().optional(),
      _timingDateTime: createElementSchema().optional(),
      timingAge: createAgeSchema().optional(),
      timingPeriod: createPeriodSchema().optional(),
      timingDuration: createDurationSchema().optional(),
      timingRange: createRangeSchema().optional(),
      timingTiming: createTimingSchema().optional(),
      participant: z.array(createPlanDefinitionParticipantSchema()).optional(),
      type: createCodeableConceptSchema().optional(),
      groupingBehavior: z
        .enum(["visual-group", "logical-group", "sentence-group"])
        .optional(),
      _groupingBehavior: createElementSchema().optional(),
      selectionBehavior: z
        .enum([
          "any",
          "all",
          "all-or-none",
          "exactly-one",
          "at-most-one",
          "one-or-more",
        ])
        .optional(),
      _selectionBehavior: createElementSchema().optional(),
      requiredBehavior: z
        .enum(["must", "could", "must-unless-documented"])
        .optional(),
      _requiredBehavior: createElementSchema().optional(),
      precheckBehavior: z.enum(["yes", "no"]).optional(),
      _precheckBehavior: createElementSchema().optional(),
      cardinalityBehavior: z.enum(["single", "multiple"]).optional(),
      _cardinalityBehavior: createElementSchema().optional(),
      definitionCanonical: z.string().optional(),
      _definitionCanonical: createElementSchema().optional(),
      definitionUri: z.string().optional(),
      _definitionUri: createElementSchema().optional(),
      transform: primitives.getCanonicalSchema().optional(),
      dynamicValue: z
        .array(createPlanDefinitionDynamicValueSchema())
        .optional(),
      action: z.array(createPlanDefinitionActionSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createPlanDefinitionConditionSchema() {
  return getCachedSchema("PlanDefinitionCondition", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionCondition> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        kind: z.enum(["applicability", "start", "stop"]).optional(),
        _kind: createElementSchema().optional(),
        expression: createExpressionSchema().optional(),
      },
    );

    return baseSchema;
  });
}

export function createPlanDefinitionRelatedActionSchema() {
  return getCachedSchema("PlanDefinitionRelatedAction", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionRelatedAction> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        actionId: primitives.getIdSchema().optional(),
        _actionId: createElementSchema().optional(),
        relationship: z
          .enum([
            "before-start",
            "before",
            "before-end",
            "concurrent-with-start",
            "concurrent",
            "concurrent-with-end",
            "after-start",
            "after",
            "after-end",
          ])
          .optional(),
        _relationship: createElementSchema().optional(),
        offsetDuration: createDurationSchema().optional(),
        offsetRange: createRangeSchema().optional(),
      });

    return baseSchema;
  });
}

export function createPlanDefinitionParticipantSchema() {
  return getCachedSchema("PlanDefinitionParticipant", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionParticipant> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: z
          .enum(["patient", "practitioner", "related-person", "device"])
          .optional(),
        _type: createElementSchema().optional(),
        role: createCodeableConceptSchema().optional(),
      });

    return baseSchema;
  });
}

export function createPlanDefinitionDynamicValueSchema() {
  return getCachedSchema("PlanDefinitionDynamicValue", [], () => {
    const baseSchema: z.ZodType<types.PlanDefinitionDynamicValue> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        path: primitives.getStringSchema().optional(),
        _path: createElementSchema().optional(),
        expression: createExpressionSchema().optional(),
      });

    return baseSchema;
  });
}
