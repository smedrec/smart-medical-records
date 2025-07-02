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
  createCodeableConceptSchema,
  createAnnotationSchema,
  createTimingSchema,
  createQuantitySchema,
  createRatioSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createNutritionOrderSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("NutritionOrder", [contained], () => {
    const baseSchema: z.ZodType<types.NutritionOrder<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("NutritionOrder"),
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
        instantiatesCanonical: z
          .array(primitives.getCanonicalSchema())
          .optional(),
        instantiatesUri: z.array(primitives.getUriSchema()).optional(),
        _instantiatesUri: z.array(createElementSchema()).optional(),
        instantiates: z.array(primitives.getUriSchema()).optional(),
        _instantiates: z.array(createElementSchema()).optional(),
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        intent: primitives.getCodeSchema(),
        _intent: createElementSchema().optional(),
        patient: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        dateTime: primitives.getDateTimeSchema(),
        _dateTime: createElementSchema().optional(),
        orderer: createReferenceSchema().optional(),
        allergyIntolerance: z.array(createReferenceSchema()).optional(),
        foodPreferenceModifier: z
          .array(createCodeableConceptSchema())
          .optional(),
        excludeFoodModifier: z.array(createCodeableConceptSchema()).optional(),
        oralDiet: createNutritionOrderOralDietSchema().optional(),
        supplement: z.array(createNutritionOrderSupplementSchema()).optional(),
        enteralFormula: createNutritionOrderEnteralFormulaSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createNutritionOrderOralDietSchema() {
  return getCachedSchema("NutritionOrderOralDiet", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderOralDiet> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      schedule: z.array(createTimingSchema()).optional(),
      nutrient: z.array(createNutritionOrderNutrientSchema()).optional(),
      texture: z.array(createNutritionOrderTextureSchema()).optional(),
      fluidConsistencyType: z.array(createCodeableConceptSchema()).optional(),
      instruction: primitives.getStringSchema().optional(),
      _instruction: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createNutritionOrderNutrientSchema() {
  return getCachedSchema("NutritionOrderNutrient", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderNutrient> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      modifier: createCodeableConceptSchema().optional(),
      amount: createQuantitySchema().optional(),
    });

    return baseSchema;
  });
}

export function createNutritionOrderTextureSchema() {
  return getCachedSchema("NutritionOrderTexture", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderTexture> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      modifier: createCodeableConceptSchema().optional(),
      foodType: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createNutritionOrderSupplementSchema() {
  return getCachedSchema("NutritionOrderSupplement", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderSupplement> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema().optional(),
        productName: primitives.getStringSchema().optional(),
        _productName: createElementSchema().optional(),
        schedule: z.array(createTimingSchema()).optional(),
        quantity: createQuantitySchema().optional(),
        instruction: primitives.getStringSchema().optional(),
        _instruction: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createNutritionOrderEnteralFormulaSchema() {
  return getCachedSchema("NutritionOrderEnteralFormula", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderEnteralFormula> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        baseFormulaType: createCodeableConceptSchema().optional(),
        baseFormulaProductName: primitives.getStringSchema().optional(),
        _baseFormulaProductName: createElementSchema().optional(),
        additiveType: createCodeableConceptSchema().optional(),
        additiveProductName: primitives.getStringSchema().optional(),
        _additiveProductName: createElementSchema().optional(),
        caloricDensity: createQuantitySchema().optional(),
        routeofAdministration: createCodeableConceptSchema().optional(),
        administration: z
          .array(createNutritionOrderAdministrationSchema())
          .optional(),
        maxVolumeToDeliver: createQuantitySchema().optional(),
        administrationInstruction: primitives.getStringSchema().optional(),
        _administrationInstruction: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createNutritionOrderAdministrationSchema() {
  return getCachedSchema("NutritionOrderAdministration", [], () => {
    const baseSchema: z.ZodType<types.NutritionOrderAdministration> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        schedule: createTimingSchema().optional(),
        quantity: createQuantitySchema().optional(),
        rateQuantity: createQuantitySchema().optional(),
        rateRatio: createRatioSchema().optional(),
      });

    return baseSchema;
  });
}
