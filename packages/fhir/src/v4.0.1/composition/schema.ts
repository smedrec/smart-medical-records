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
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createCompositionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Composition", [contained], () => {
    const baseSchema: z.ZodType<types.Composition<z.infer<C>>> = z.strictObject(
      {
        resourceType: z.literal("Composition"),
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
        identifier: createIdentifierSchema().optional(),
        status: z.enum(["preliminary", "final", "amended", "entered-in-error"]),
        _status: createElementSchema().optional(),
        type: createCodeableConceptSchema(),
        category: z.array(createCodeableConceptSchema()).optional(),
        subject: createReferenceSchema().optional(),
        encounter: createReferenceSchema().optional(),
        date: primitives.getDateTimeSchema(),
        _date: createElementSchema().optional(),
        author: z.array(createReferenceSchema()),
        title: primitives.getStringSchema(),
        _title: createElementSchema().optional(),
        confidentiality: primitives.getCodeSchema().optional(),
        _confidentiality: createElementSchema().optional(),
        attester: z.array(createCompositionAttesterSchema()).optional(),
        custodian: createReferenceSchema().optional(),
        relatesTo: z.array(createCompositionRelatesToSchema()).optional(),
        event: z.array(createCompositionEventSchema()).optional(),
        section: z.array(createCompositionSectionSchema()).optional(),
      },
    );

    return baseSchema;
  });
}

export function createCompositionAttesterSchema() {
  return getCachedSchema("CompositionAttester", [], () => {
    const baseSchema: z.ZodType<types.CompositionAttester> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      mode: z.enum(["personal", "professional", "legal", "official"]),
      _mode: createElementSchema().optional(),
      time: primitives.getDateTimeSchema().optional(),
      _time: createElementSchema().optional(),
      party: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createCompositionRelatesToSchema() {
  return getCachedSchema("CompositionRelatesTo", [], () => {
    const baseSchema: z.ZodType<types.CompositionRelatesTo> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: primitives.getCodeSchema(),
      _code: createElementSchema().optional(),
      targetIdentifier: createIdentifierSchema().optional(),
      targetReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createCompositionEventSchema() {
  return getCachedSchema("CompositionEvent", [], () => {
    const baseSchema: z.ZodType<types.CompositionEvent> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: z.array(createCodeableConceptSchema()).optional(),
      period: createPeriodSchema().optional(),
      detail: z.array(createReferenceSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createCompositionSectionSchema() {
  return getCachedSchema("CompositionSection", [], () => {
    const baseSchema: z.ZodType<types.CompositionSection> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
      code: createCodeableConceptSchema().optional(),
      author: z.array(createReferenceSchema()).optional(),
      focus: createReferenceSchema().optional(),
      text: createNarrativeSchema().optional(),
      mode: primitives.getCodeSchema().optional(),
      _mode: createElementSchema().optional(),
      orderedBy: createCodeableConceptSchema().optional(),
      entry: z.array(createReferenceSchema()).optional(),
      emptyReason: createCodeableConceptSchema().optional(),
      section: z.array(createCompositionSectionSchema()).optional(),
    });

    return baseSchema;
  });
}
