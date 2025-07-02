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
  createAttachmentSchema,
  createContactPointSchema,
  createPeriodSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createHealthcareServiceSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("HealthcareService", [contained], () => {
    const baseSchema: z.ZodType<types.HealthcareService<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("HealthcareService"),
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
        providedBy: createReferenceSchema().optional(),
        category: z.array(createCodeableConceptSchema()).optional(),
        type: z.array(createCodeableConceptSchema()).optional(),
        specialty: z.array(createCodeableConceptSchema()).optional(),
        location: z.array(createReferenceSchema()).optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        comment: primitives.getStringSchema().optional(),
        _comment: createElementSchema().optional(),
        extraDetails: primitives.getMarkdownSchema().optional(),
        _extraDetails: createElementSchema().optional(),
        photo: createAttachmentSchema().optional(),
        telecom: z.array(createContactPointSchema()).optional(),
        coverageArea: z.array(createReferenceSchema()).optional(),
        serviceProvisionCode: z.array(createCodeableConceptSchema()).optional(),
        eligibility: z
          .array(createHealthcareServiceEligibilitySchema())
          .optional(),
        program: z.array(createCodeableConceptSchema()).optional(),
        characteristic: z.array(createCodeableConceptSchema()).optional(),
        communication: z.array(createCodeableConceptSchema()).optional(),
        referralMethod: z.array(createCodeableConceptSchema()).optional(),
        appointmentRequired: primitives.getBooleanSchema().optional(),
        _appointmentRequired: createElementSchema().optional(),
        availableTime: z
          .array(createHealthcareServiceAvailableTimeSchema())
          .optional(),
        notAvailable: z
          .array(createHealthcareServiceNotAvailableSchema())
          .optional(),
        availabilityExceptions: primitives.getStringSchema().optional(),
        _availabilityExceptions: createElementSchema().optional(),
        endpoint: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createHealthcareServiceEligibilitySchema() {
  return getCachedSchema("HealthcareServiceEligibility", [], () => {
    const baseSchema: z.ZodType<types.HealthcareServiceEligibility> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        code: createCodeableConceptSchema().optional(),
        comment: primitives.getMarkdownSchema().optional(),
        _comment: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createHealthcareServiceAvailableTimeSchema() {
  return getCachedSchema("HealthcareServiceAvailableTime", [], () => {
    const baseSchema: z.ZodType<types.HealthcareServiceAvailableTime> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        daysOfWeek: z
          .enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
          .array()
          .optional(),
        _daysOfWeek: z.array(createElementSchema()).optional(),
        allDay: primitives.getBooleanSchema().optional(),
        _allDay: createElementSchema().optional(),
        availableStartTime: primitives.getTimeSchema().optional(),
        _availableStartTime: createElementSchema().optional(),
        availableEndTime: primitives.getTimeSchema().optional(),
        _availableEndTime: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createHealthcareServiceNotAvailableSchema() {
  return getCachedSchema("HealthcareServiceNotAvailable", [], () => {
    const baseSchema: z.ZodType<types.HealthcareServiceNotAvailable> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        description: primitives.getStringSchema(),
        _description: createElementSchema().optional(),
        during: createPeriodSchema().optional(),
      });

    return baseSchema;
  });
}
