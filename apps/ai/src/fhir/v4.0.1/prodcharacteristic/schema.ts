import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createExtensionSchema,
  createQuantitySchema,
  createElementSchema,
  createAttachmentSchema,
  createCodeableConceptSchema,
} from "../core/schema";

/* Generated from FHIR JSON Schema */

export function createProdCharacteristicSchema() {
  return getCachedSchema("ProdCharacteristic", [], () => {
    const baseSchema: z.ZodType<types.ProdCharacteristic> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      height: createQuantitySchema().optional(),
      width: createQuantitySchema().optional(),
      depth: createQuantitySchema().optional(),
      weight: createQuantitySchema().optional(),
      nominalVolume: createQuantitySchema().optional(),
      externalDiameter: createQuantitySchema().optional(),
      shape: primitives.getStringSchema().optional(),
      _shape: createElementSchema().optional(),
      color: z.array(primitives.getStringSchema()).optional(),
      _color: z.array(createElementSchema()).optional(),
      imprint: z.array(primitives.getStringSchema()).optional(),
      _imprint: z.array(createElementSchema()).optional(),
      image: z.array(createAttachmentSchema()).optional(),
      scoring: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}
