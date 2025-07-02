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
  createContactPointSchema,
  createAnnotationSchema,
  createQuantitySchema,
  createTimingSchema,
  createPeriodSchema,
  createRangeSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";
import { createProductShelfLifeSchema } from "../productshelflife/schema";
import { createProdCharacteristicSchema } from "../prodcharacteristic/schema";

/* Generated from FHIR JSON Schema */

export function createDeviceSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Device", [contained], () => {
    const baseSchema: z.ZodType<types.Device<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Device"),
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
      definition: createReferenceSchema().optional(),
      udiCarrier: z.array(createDeviceUdiCarrierSchema()).optional(),
      status: z
        .enum(["active", "inactive", "entered-in-error", "unknown"])
        .optional(),
      _status: createElementSchema().optional(),
      statusReason: z.array(createCodeableConceptSchema()).optional(),
      distinctIdentifier: primitives.getStringSchema().optional(),
      _distinctIdentifier: createElementSchema().optional(),
      manufacturer: primitives.getStringSchema().optional(),
      _manufacturer: createElementSchema().optional(),
      manufactureDate: primitives.getDateTimeSchema().optional(),
      _manufactureDate: createElementSchema().optional(),
      expirationDate: primitives.getDateTimeSchema().optional(),
      _expirationDate: createElementSchema().optional(),
      lotNumber: primitives.getStringSchema().optional(),
      _lotNumber: createElementSchema().optional(),
      serialNumber: primitives.getStringSchema().optional(),
      _serialNumber: createElementSchema().optional(),
      deviceName: z.array(createDeviceDeviceNameSchema()).optional(),
      modelNumber: primitives.getStringSchema().optional(),
      _modelNumber: createElementSchema().optional(),
      partNumber: primitives.getStringSchema().optional(),
      _partNumber: createElementSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      specialization: z.array(createDeviceSpecializationSchema()).optional(),
      version: z.array(createDeviceVersionSchema()).optional(),
      property: z.array(createDevicePropertySchema()).optional(),
      patient: createReferenceSchema().optional(),
      owner: createReferenceSchema().optional(),
      contact: z.array(createContactPointSchema()).optional(),
      location: createReferenceSchema().optional(),
      url: primitives.getUriSchema().optional(),
      _url: createElementSchema().optional(),
      note: z.array(createAnnotationSchema()).optional(),
      safety: z.array(createCodeableConceptSchema()).optional(),
      parent: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDeviceUdiCarrierSchema() {
  return getCachedSchema("DeviceUdiCarrier", [], () => {
    const baseSchema: z.ZodType<types.DeviceUdiCarrier> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      deviceIdentifier: primitives.getStringSchema().optional(),
      _deviceIdentifier: createElementSchema().optional(),
      issuer: primitives.getUriSchema().optional(),
      _issuer: createElementSchema().optional(),
      jurisdiction: primitives.getUriSchema().optional(),
      _jurisdiction: createElementSchema().optional(),
      carrierAIDC: primitives.getBase64BinarySchema().optional(),
      _carrierAIDC: createElementSchema().optional(),
      carrierHRF: primitives.getStringSchema().optional(),
      _carrierHRF: createElementSchema().optional(),
      entryType: z
        .enum(["barcode", "rfid", "manual", "card", "self-reported", "unknown"])
        .optional(),
      _entryType: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDeviceDeviceNameSchema() {
  return getCachedSchema("DeviceDeviceName", [], () => {
    const baseSchema: z.ZodType<types.DeviceDeviceName> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      name: primitives.getStringSchema(),
      _name: createElementSchema().optional(),
      type: z.enum([
        "udi-label-name",
        "user-friendly-name",
        "patient-reported-name",
        "manufacturer-name",
        "model-name",
        "other",
      ]),
      _type: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDeviceSpecializationSchema() {
  return getCachedSchema("DeviceSpecialization", [], () => {
    const baseSchema: z.ZodType<types.DeviceSpecialization> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      systemType: createCodeableConceptSchema(),
      version: primitives.getStringSchema().optional(),
      _version: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDeviceVersionSchema() {
  return getCachedSchema("DeviceVersion", [], () => {
    const baseSchema: z.ZodType<types.DeviceVersion> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodeableConceptSchema().optional(),
      component: createIdentifierSchema().optional(),
      value: primitives.getStringSchema(),
      _value: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDevicePropertySchema() {
  return getCachedSchema("DeviceProperty", [], () => {
    const baseSchema: z.ZodType<types.DeviceProperty> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodeableConceptSchema(),
      valueQuantity: z.array(createQuantitySchema()).optional(),
      valueCode: z.array(createCodeableConceptSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createDeviceDefinitionSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("DeviceDefinition", [contained], () => {
    const baseSchema: z.ZodType<types.DeviceDefinition<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("DeviceDefinition"),
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
        udiDeviceIdentifier: z
          .array(createDeviceDefinitionUdiDeviceIdentifierSchema())
          .optional(),
        manufacturerString: z.string().optional(),
        _manufacturerString: createElementSchema().optional(),
        manufacturerReference: createReferenceSchema().optional(),
        deviceName: z
          .array(createDeviceDefinitionDeviceNameSchema())
          .optional(),
        modelNumber: primitives.getStringSchema().optional(),
        _modelNumber: createElementSchema().optional(),
        type: createCodeableConceptSchema().optional(),
        specialization: z
          .array(createDeviceDefinitionSpecializationSchema())
          .optional(),
        version: z.array(primitives.getStringSchema()).optional(),
        _version: z.array(createElementSchema()).optional(),
        safety: z.array(createCodeableConceptSchema()).optional(),
        shelfLifeStorage: z.array(createProductShelfLifeSchema()).optional(),
        physicalCharacteristics: createProdCharacteristicSchema().optional(),
        languageCode: z.array(createCodeableConceptSchema()).optional(),
        capability: z
          .array(createDeviceDefinitionCapabilitySchema())
          .optional(),
        property: z.array(createDeviceDefinitionPropertySchema()).optional(),
        owner: createReferenceSchema().optional(),
        contact: z.array(createContactPointSchema()).optional(),
        url: primitives.getUriSchema().optional(),
        _url: createElementSchema().optional(),
        onlineInformation: primitives.getUriSchema().optional(),
        _onlineInformation: createElementSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
        quantity: createQuantitySchema().optional(),
        parentDevice: createReferenceSchema().optional(),
        material: z.array(createDeviceDefinitionMaterialSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionUdiDeviceIdentifierSchema() {
  return getCachedSchema("DeviceDefinitionUdiDeviceIdentifier", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionUdiDeviceIdentifier> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        deviceIdentifier: primitives.getStringSchema(),
        _deviceIdentifier: createElementSchema().optional(),
        issuer: primitives.getUriSchema(),
        _issuer: createElementSchema().optional(),
        jurisdiction: primitives.getUriSchema(),
        _jurisdiction: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionDeviceNameSchema() {
  return getCachedSchema("DeviceDefinitionDeviceName", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionDeviceName> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        name: primitives.getStringSchema(),
        _name: createElementSchema().optional(),
        type: z.enum([
          "udi-label-name",
          "user-friendly-name",
          "patient-reported-name",
          "manufacturer-name",
          "model-name",
          "other",
        ]),
        _type: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionSpecializationSchema() {
  return getCachedSchema("DeviceDefinitionSpecialization", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionSpecialization> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        systemType: primitives.getStringSchema(),
        _systemType: createElementSchema().optional(),
        version: primitives.getStringSchema().optional(),
        _version: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionCapabilitySchema() {
  return getCachedSchema("DeviceDefinitionCapability", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionCapability> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        description: z.array(createCodeableConceptSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionPropertySchema() {
  return getCachedSchema("DeviceDefinitionProperty", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionProperty> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        valueQuantity: z.array(createQuantitySchema()).optional(),
        valueCode: z.array(createCodeableConceptSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createDeviceDefinitionMaterialSchema() {
  return getCachedSchema("DeviceDefinitionMaterial", [], () => {
    const baseSchema: z.ZodType<types.DeviceDefinitionMaterial> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        substance: createCodeableConceptSchema(),
        alternate: primitives.getBooleanSchema().optional(),
        _alternate: createElementSchema().optional(),
        allergenicIndicator: primitives.getBooleanSchema().optional(),
        _allergenicIndicator: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createDeviceMetricSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("DeviceMetric", [contained], () => {
    const baseSchema: z.ZodType<types.DeviceMetric<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("DeviceMetric"),
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
        type: createCodeableConceptSchema(),
        unit: createCodeableConceptSchema().optional(),
        source: createReferenceSchema().optional(),
        parent: createReferenceSchema().optional(),
        operationalStatus: z
          .enum(["on", "off", "standby", "entered-in-error"])
          .optional(),
        _operationalStatus: createElementSchema().optional(),
        color: z
          .enum([
            "black",
            "red",
            "green",
            "yellow",
            "blue",
            "magenta",
            "cyan",
            "white",
          ])
          .optional(),
        _color: createElementSchema().optional(),
        category: z.enum([
          "measurement",
          "setting",
          "calculation",
          "unspecified",
        ]),
        _category: createElementSchema().optional(),
        measurementPeriod: createTimingSchema().optional(),
        calibration: z.array(createDeviceMetricCalibrationSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createDeviceMetricCalibrationSchema() {
  return getCachedSchema("DeviceMetricCalibration", [], () => {
    const baseSchema: z.ZodType<types.DeviceMetricCalibration> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: z.enum(["unspecified", "offset", "gain", "two-point"]).optional(),
        _type: createElementSchema().optional(),
        state: z
          .enum([
            "not-calibrated",
            "calibration-required",
            "calibrated",
            "unspecified",
          ])
          .optional(),
        _state: createElementSchema().optional(),
        time: primitives.getInstantSchema().optional(),
        _time: createElementSchema().optional(),
      },
    );

    return baseSchema;
  });
}

export function createDeviceRequestSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("DeviceRequest", [contained], () => {
    const baseSchema: z.ZodType<types.DeviceRequest<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("DeviceRequest"),
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
        basedOn: z.array(createReferenceSchema()).optional(),
        priorRequest: z.array(createReferenceSchema()).optional(),
        groupIdentifier: createIdentifierSchema().optional(),
        status: primitives.getCodeSchema().optional(),
        _status: createElementSchema().optional(),
        intent: primitives.getCodeSchema(),
        _intent: createElementSchema().optional(),
        priority: primitives.getCodeSchema().optional(),
        _priority: createElementSchema().optional(),
        codeReference: createReferenceSchema().optional(),
        codeCodeableConcept: createCodeableConceptSchema().optional(),
        parameter: z.array(createDeviceRequestParameterSchema()).optional(),
        subject: createReferenceSchema(),
        encounter: createReferenceSchema().optional(),
        occurrenceDateTime: z.string().optional(),
        _occurrenceDateTime: createElementSchema().optional(),
        occurrencePeriod: createPeriodSchema().optional(),
        occurrenceTiming: createTimingSchema().optional(),
        authoredOn: primitives.getDateTimeSchema().optional(),
        _authoredOn: createElementSchema().optional(),
        requester: createReferenceSchema().optional(),
        performerType: createCodeableConceptSchema().optional(),
        performer: createReferenceSchema().optional(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        insurance: z.array(createReferenceSchema()).optional(),
        supportingInfo: z.array(createReferenceSchema()).optional(),
        note: z.array(createAnnotationSchema()).optional(),
        relevantHistory: z.array(createReferenceSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createDeviceRequestParameterSchema() {
  return getCachedSchema("DeviceRequestParameter", [], () => {
    const baseSchema: z.ZodType<types.DeviceRequestParameter> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      code: createCodeableConceptSchema().optional(),
      valueCodeableConcept: createCodeableConceptSchema().optional(),
      valueQuantity: createQuantitySchema().optional(),
      valueRange: createRangeSchema().optional(),
      valueBoolean: z.boolean().optional(),
      _valueBoolean: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createDeviceUseStatementSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("DeviceUseStatement", [contained], () => {
    const baseSchema: z.ZodType<types.DeviceUseStatement<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("DeviceUseStatement"),
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
        basedOn: z.array(createReferenceSchema()).optional(),
        status: z.enum([
          "active",
          "completed",
          "entered-in-error",
          "intended",
          "stopped",
          "on-hold",
        ]),
        _status: createElementSchema().optional(),
        subject: createReferenceSchema(),
        derivedFrom: z.array(createReferenceSchema()).optional(),
        timingTiming: createTimingSchema().optional(),
        timingPeriod: createPeriodSchema().optional(),
        timingDateTime: z.string().optional(),
        _timingDateTime: createElementSchema().optional(),
        recordedOn: primitives.getDateTimeSchema().optional(),
        _recordedOn: createElementSchema().optional(),
        source: createReferenceSchema().optional(),
        device: createReferenceSchema(),
        reasonCode: z.array(createCodeableConceptSchema()).optional(),
        reasonReference: z.array(createReferenceSchema()).optional(),
        bodySite: createCodeableConceptSchema().optional(),
        note: z.array(createAnnotationSchema()).optional(),
      });

    return baseSchema;
  });
}
