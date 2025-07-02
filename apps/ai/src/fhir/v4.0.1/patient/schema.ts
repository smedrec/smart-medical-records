import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";
import {
  createMetaSchema,
  createElementSchema,
  createExtensionSchema,
  createIdentifierSchema,
  createHumanNameSchema,
  createContactPointSchema,
  createAddressSchema,
  createCodeableConceptSchema,
  createAttachmentSchema,
  createReferenceSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createPatientSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Patient", [contained], () => {
    const baseSchema: z.ZodType<types.Patient<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Patient"),
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
      name: z.array(createHumanNameSchema()).optional(),
      telecom: z.array(createContactPointSchema()).optional(),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      _gender: createElementSchema().optional(),
      birthDate: primitives.getDateSchema().optional(),
      _birthDate: createElementSchema().optional(),
      deceasedBoolean: z.boolean().optional(),
      _deceasedBoolean: createElementSchema().optional(),
      deceasedDateTime: z.string().optional(),
      _deceasedDateTime: createElementSchema().optional(),
      address: z.array(createAddressSchema()).optional(),
      maritalStatus: createCodeableConceptSchema().optional(),
      multipleBirthBoolean: z.boolean().optional(),
      _multipleBirthBoolean: createElementSchema().optional(),
      multipleBirthInteger: z.number().optional(),
      _multipleBirthInteger: createElementSchema().optional(),
      photo: z.array(createAttachmentSchema()).optional(),
      contact: z.array(createPatientContactSchema()).optional(),
      communication: z.array(createPatientCommunicationSchema()).optional(),
      generalPractitioner: z.array(createReferenceSchema()).optional(),
      managingOrganization: createReferenceSchema().optional(),
      link: z.array(createPatientLinkSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createPatientContactSchema() {
  return getCachedSchema("PatientContact", [], () => {
    const baseSchema: z.ZodType<types.PatientContact> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      relationship: z.array(createCodeableConceptSchema()).optional(),
      name: createHumanNameSchema().optional(),
      telecom: z.array(createContactPointSchema()).optional(),
      address: createAddressSchema().optional(),
      gender: z.enum(["male", "female", "other", "unknown"]).optional(),
      _gender: createElementSchema().optional(),
      organization: createReferenceSchema().optional(),
      period: createPeriodSchema().optional(),
    });

    return baseSchema;
  });
}

export function createPatientCommunicationSchema() {
  return getCachedSchema("PatientCommunication", [], () => {
    const baseSchema: z.ZodType<types.PatientCommunication> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      language: createCodeableConceptSchema(),
      preferred: primitives.getBooleanSchema().optional(),
      _preferred: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createPatientLinkSchema() {
  return getCachedSchema("PatientLink", [], () => {
    const baseSchema: z.ZodType<types.PatientLink> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      other: createReferenceSchema(),
      type: z.enum(["replaced-by", "replaces", "refer", "seealso"]),
      _type: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
