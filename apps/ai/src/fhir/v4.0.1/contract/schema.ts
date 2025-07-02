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
  createAttachmentSchema,
  createCodingSchema,
  createQuantitySchema,
  createMoneySchema,
  createTimingSchema,
  createAnnotationSchema,
  createSignatureSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createContractSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Contract", [contained], () => {
    const baseSchema: z.ZodType<types.Contract<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Contract"),
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
      url: primitives.getUriSchema().optional(),
      _url: createElementSchema().optional(),
      version: primitives.getStringSchema().optional(),
      _version: createElementSchema().optional(),
      status: primitives.getCodeSchema().optional(),
      _status: createElementSchema().optional(),
      legalState: createCodeableConceptSchema().optional(),
      instantiatesCanonical: createReferenceSchema().optional(),
      instantiatesUri: primitives.getUriSchema().optional(),
      _instantiatesUri: createElementSchema().optional(),
      contentDerivative: createCodeableConceptSchema().optional(),
      issued: primitives.getDateTimeSchema().optional(),
      _issued: createElementSchema().optional(),
      applies: createPeriodSchema().optional(),
      expirationType: createCodeableConceptSchema().optional(),
      subject: z.array(createReferenceSchema()).optional(),
      authority: z.array(createReferenceSchema()).optional(),
      domain: z.array(createReferenceSchema()).optional(),
      site: z.array(createReferenceSchema()).optional(),
      name: primitives.getStringSchema().optional(),
      _name: createElementSchema().optional(),
      title: primitives.getStringSchema().optional(),
      _title: createElementSchema().optional(),
      subtitle: primitives.getStringSchema().optional(),
      _subtitle: createElementSchema().optional(),
      alias: z.array(primitives.getStringSchema()).optional(),
      _alias: z.array(createElementSchema()).optional(),
      author: createReferenceSchema().optional(),
      scope: createCodeableConceptSchema().optional(),
      topicCodeableConcept: createCodeableConceptSchema().optional(),
      topicReference: createReferenceSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      subType: z.array(createCodeableConceptSchema()).optional(),
      contentDefinition: createContractContentDefinitionSchema().optional(),
      term: z.array(createContractTermSchema()).optional(),
      supportingInfo: z.array(createReferenceSchema()).optional(),
      relevantHistory: z.array(createReferenceSchema()).optional(),
      signer: z.array(createContractSignerSchema()).optional(),
      friendly: z.array(createContractFriendlySchema()).optional(),
      legal: z.array(createContractLegalSchema()).optional(),
      rule: z.array(createContractRuleSchema()).optional(),
      legallyBindingAttachment: createAttachmentSchema().optional(),
      legallyBindingReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractContentDefinitionSchema() {
  return getCachedSchema("ContractContentDefinition", [], () => {
    const baseSchema: z.ZodType<types.ContractContentDefinition> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: createCodeableConceptSchema(),
        subType: createCodeableConceptSchema().optional(),
        publisher: createReferenceSchema().optional(),
        publicationDate: primitives.getDateTimeSchema().optional(),
        _publicationDate: createElementSchema().optional(),
        publicationStatus: primitives.getCodeSchema(),
        _publicationStatus: createElementSchema().optional(),
        copyright: primitives.getMarkdownSchema().optional(),
        _copyright: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createContractTermSchema() {
  return getCachedSchema("ContractTerm", [], () => {
    const baseSchema: z.ZodType<types.ContractTerm> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      identifier: createIdentifierSchema().optional(),
      issued: primitives.getDateTimeSchema().optional(),
      _issued: createElementSchema().optional(),
      applies: createPeriodSchema().optional(),
      topicCodeableConcept: createCodeableConceptSchema().optional(),
      topicReference: createReferenceSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      subType: createCodeableConceptSchema().optional(),
      text: primitives.getStringSchema().optional(),
      _text: createElementSchema().optional(),
      securityLabel: z.array(createContractSecurityLabelSchema()).optional(),
      offer: createContractOfferSchema(),
      asset: z.array(createContractAssetSchema()).optional(),
      action: z.array(createContractActionSchema()).optional(),
      group: z.array(createContractTermSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractSecurityLabelSchema() {
  return getCachedSchema("ContractSecurityLabel", [], () => {
    const baseSchema: z.ZodType<types.ContractSecurityLabel> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      number: z.array(primitives.getUnsignedIntSchema()).optional(),
      _number: z.array(createElementSchema()).optional(),
      classification: createCodingSchema(),
      category: z.array(createCodingSchema()).optional(),
      control: z.array(createCodingSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractOfferSchema() {
  return getCachedSchema("ContractOffer", [], () => {
    const baseSchema: z.ZodType<types.ContractOffer> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      identifier: z.array(createIdentifierSchema()).optional(),
      party: z.array(createContractPartySchema()).optional(),
      topic: createReferenceSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      decision: createCodeableConceptSchema().optional(),
      decisionMode: z.array(createCodeableConceptSchema()).optional(),
      answer: z.array(createContractAnswerSchema()).optional(),
      text: primitives.getStringSchema().optional(),
      _text: createElementSchema().optional(),
      linkId: z.array(primitives.getStringSchema()).optional(),
      _linkId: z.array(createElementSchema()).optional(),
      securityLabelNumber: z
        .array(primitives.getUnsignedIntSchema())
        .optional(),
      _securityLabelNumber: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractPartySchema() {
  return getCachedSchema("ContractParty", [], () => {
    const baseSchema: z.ZodType<types.ContractParty> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      reference: z.array(createReferenceSchema()),
      role: createCodeableConceptSchema(),
    });

    return baseSchema;
  });
}

export function createContractAnswerSchema() {
  return getCachedSchema("ContractAnswer", [], () => {
    const baseSchema: z.ZodType<types.ContractAnswer> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      valueBoolean: z.boolean().optional(),
      _valueBoolean: createElementSchema().optional(),
      valueDecimal: z.number().optional(),
      _valueDecimal: createElementSchema().optional(),
      valueInteger: z.number().optional(),
      _valueInteger: createElementSchema().optional(),
      valueDate: z.string().optional(),
      _valueDate: createElementSchema().optional(),
      valueDateTime: z.string().optional(),
      _valueDateTime: createElementSchema().optional(),
      valueTime: z.string().optional(),
      _valueTime: createElementSchema().optional(),
      valueString: z.string().optional(),
      _valueString: createElementSchema().optional(),
      valueUri: z.string().optional(),
      _valueUri: createElementSchema().optional(),
      valueAttachment: createAttachmentSchema().optional(),
      valueCoding: createCodingSchema().optional(),
      valueQuantity: createQuantitySchema().optional(),
      valueReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractAssetSchema() {
  return getCachedSchema("ContractAsset", [], () => {
    const baseSchema: z.ZodType<types.ContractAsset> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      scope: createCodeableConceptSchema().optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      typeReference: z.array(createReferenceSchema()).optional(),
      subtype: z.array(createCodeableConceptSchema()).optional(),
      relationship: createCodingSchema().optional(),
      context: z.array(createContractContextSchema()).optional(),
      condition: primitives.getStringSchema().optional(),
      _condition: createElementSchema().optional(),
      periodType: z.array(createCodeableConceptSchema()).optional(),
      period: z.array(createPeriodSchema()).optional(),
      usePeriod: z.array(createPeriodSchema()).optional(),
      text: primitives.getStringSchema().optional(),
      _text: createElementSchema().optional(),
      linkId: z.array(primitives.getStringSchema()).optional(),
      _linkId: z.array(createElementSchema()).optional(),
      answer: z.array(createContractAnswerSchema()).optional(),
      securityLabelNumber: z
        .array(primitives.getUnsignedIntSchema())
        .optional(),
      _securityLabelNumber: z.array(createElementSchema()).optional(),
      valuedItem: z.array(createContractValuedItemSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractContextSchema() {
  return getCachedSchema("ContractContext", [], () => {
    const baseSchema: z.ZodType<types.ContractContext> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      reference: createReferenceSchema().optional(),
      code: z.array(createCodeableConceptSchema()).optional(),
      text: primitives.getStringSchema().optional(),
      _text: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractValuedItemSchema() {
  return getCachedSchema("ContractValuedItem", [], () => {
    const baseSchema: z.ZodType<types.ContractValuedItem> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      entityCodeableConcept: createCodeableConceptSchema().optional(),
      entityReference: createReferenceSchema().optional(),
      identifier: createIdentifierSchema().optional(),
      effectiveTime: primitives.getDateTimeSchema().optional(),
      _effectiveTime: createElementSchema().optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      points: primitives.getDecimalSchema().optional(),
      _points: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      payment: primitives.getStringSchema().optional(),
      _payment: createElementSchema().optional(),
      paymentDate: primitives.getDateTimeSchema().optional(),
      _paymentDate: createElementSchema().optional(),
      responsible: createReferenceSchema().optional(),
      recipient: createReferenceSchema().optional(),
      linkId: z.array(primitives.getStringSchema()).optional(),
      _linkId: z.array(createElementSchema()).optional(),
      securityLabelNumber: z
        .array(primitives.getUnsignedIntSchema())
        .optional(),
      _securityLabelNumber: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractActionSchema() {
  return getCachedSchema("ContractAction", [], () => {
    const baseSchema: z.ZodType<types.ContractAction> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      doNotPerform: primitives.getBooleanSchema().optional(),
      _doNotPerform: createElementSchema().optional(),
      type: createCodeableConceptSchema(),
      subject: z.array(createContractSubjectSchema()).optional(),
      intent: createCodeableConceptSchema(),
      linkId: z.array(primitives.getStringSchema()).optional(),
      _linkId: z.array(createElementSchema()).optional(),
      status: createCodeableConceptSchema(),
      context: createReferenceSchema().optional(),
      contextLinkId: z.array(primitives.getStringSchema()).optional(),
      _contextLinkId: z.array(createElementSchema()).optional(),
      occurrenceDateTime: z.string().optional(),
      _occurrenceDateTime: createElementSchema().optional(),
      occurrencePeriod: createPeriodSchema().optional(),
      occurrenceTiming: createTimingSchema().optional(),
      requester: z.array(createReferenceSchema()).optional(),
      requesterLinkId: z.array(primitives.getStringSchema()).optional(),
      _requesterLinkId: z.array(createElementSchema()).optional(),
      performerType: z.array(createCodeableConceptSchema()).optional(),
      performerRole: createCodeableConceptSchema().optional(),
      performer: createReferenceSchema().optional(),
      performerLinkId: z.array(primitives.getStringSchema()).optional(),
      _performerLinkId: z.array(createElementSchema()).optional(),
      reasonCode: z.array(createCodeableConceptSchema()).optional(),
      reasonReference: z.array(createReferenceSchema()).optional(),
      reason: z.array(primitives.getStringSchema()).optional(),
      _reason: z.array(createElementSchema()).optional(),
      reasonLinkId: z.array(primitives.getStringSchema()).optional(),
      _reasonLinkId: z.array(createElementSchema()).optional(),
      note: z.array(createAnnotationSchema()).optional(),
      securityLabelNumber: z
        .array(primitives.getUnsignedIntSchema())
        .optional(),
      _securityLabelNumber: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createContractSubjectSchema() {
  return getCachedSchema("ContractSubject", [], () => {
    const baseSchema: z.ZodType<types.ContractSubject> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      reference: z.array(createReferenceSchema()),
      role: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractSignerSchema() {
  return getCachedSchema("ContractSigner", [], () => {
    const baseSchema: z.ZodType<types.ContractSigner> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodingSchema(),
      party: createReferenceSchema(),
      signature: z.array(createSignatureSchema()),
    });

    return baseSchema;
  });
}

export function createContractFriendlySchema() {
  return getCachedSchema("ContractFriendly", [], () => {
    const baseSchema: z.ZodType<types.ContractFriendly> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      contentAttachment: createAttachmentSchema().optional(),
      contentReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractLegalSchema() {
  return getCachedSchema("ContractLegal", [], () => {
    const baseSchema: z.ZodType<types.ContractLegal> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      contentAttachment: createAttachmentSchema().optional(),
      contentReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createContractRuleSchema() {
  return getCachedSchema("ContractRule", [], () => {
    const baseSchema: z.ZodType<types.ContractRule> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      contentAttachment: createAttachmentSchema().optional(),
      contentReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}
