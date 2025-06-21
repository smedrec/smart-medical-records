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
  createMoneySchema,
  createQuantitySchema,
  createAttachmentSchema,
  createAddressSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createClaimSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("Claim", [contained], () => {
    const baseSchema: z.ZodType<types.Claim<z.infer<C>>> = z.strictObject({
      resourceType: z.literal("Claim"),
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
      status: primitives.getCodeSchema(),
      _status: createElementSchema().optional(),
      type: createCodeableConceptSchema(),
      subType: createCodeableConceptSchema().optional(),
      use: z.enum(["claim", "preauthorization", "predetermination"]),
      _use: createElementSchema().optional(),
      patient: createReferenceSchema(),
      billablePeriod: createPeriodSchema().optional(),
      created: primitives.getDateTimeSchema(),
      _created: createElementSchema().optional(),
      enterer: createReferenceSchema().optional(),
      insurer: createReferenceSchema().optional(),
      provider: createReferenceSchema(),
      priority: createCodeableConceptSchema(),
      fundsReserve: createCodeableConceptSchema().optional(),
      related: z.array(createClaimRelatedSchema()).optional(),
      prescription: createReferenceSchema().optional(),
      originalPrescription: createReferenceSchema().optional(),
      payee: createClaimPayeeSchema().optional(),
      referral: createReferenceSchema().optional(),
      facility: createReferenceSchema().optional(),
      careTeam: z.array(createClaimCareTeamSchema()).optional(),
      supportingInfo: z.array(createClaimSupportingInfoSchema()).optional(),
      diagnosis: z.array(createClaimDiagnosisSchema()).optional(),
      procedure: z.array(createClaimProcedureSchema()).optional(),
      insurance: z.array(createClaimInsuranceSchema()),
      accident: createClaimAccidentSchema().optional(),
      item: z.array(createClaimItemSchema()).optional(),
      total: createMoneySchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimRelatedSchema() {
  return getCachedSchema("ClaimRelated", [], () => {
    const baseSchema: z.ZodType<types.ClaimRelated> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      claim: createReferenceSchema().optional(),
      relationship: createCodeableConceptSchema().optional(),
      reference: createIdentifierSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimPayeeSchema() {
  return getCachedSchema("ClaimPayee", [], () => {
    const baseSchema: z.ZodType<types.ClaimPayee> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodeableConceptSchema(),
      party: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimCareTeamSchema() {
  return getCachedSchema("ClaimCareTeam", [], () => {
    const baseSchema: z.ZodType<types.ClaimCareTeam> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      provider: createReferenceSchema(),
      responsible: primitives.getBooleanSchema().optional(),
      _responsible: createElementSchema().optional(),
      role: createCodeableConceptSchema().optional(),
      qualification: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimSupportingInfoSchema() {
  return getCachedSchema("ClaimSupportingInfo", [], () => {
    const baseSchema: z.ZodType<types.ClaimSupportingInfo> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      category: createCodeableConceptSchema(),
      code: createCodeableConceptSchema().optional(),
      timingDate: z.string().optional(),
      _timingDate: createElementSchema().optional(),
      timingPeriod: createPeriodSchema().optional(),
      valueBoolean: z.boolean().optional(),
      _valueBoolean: createElementSchema().optional(),
      valueString: z.string().optional(),
      _valueString: createElementSchema().optional(),
      valueQuantity: createQuantitySchema().optional(),
      valueAttachment: createAttachmentSchema().optional(),
      valueReference: createReferenceSchema().optional(),
      reason: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimDiagnosisSchema() {
  return getCachedSchema("ClaimDiagnosis", [], () => {
    const baseSchema: z.ZodType<types.ClaimDiagnosis> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      diagnosisCodeableConcept: createCodeableConceptSchema().optional(),
      diagnosisReference: createReferenceSchema().optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      onAdmission: createCodeableConceptSchema().optional(),
      packageCode: createCodeableConceptSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimProcedureSchema() {
  return getCachedSchema("ClaimProcedure", [], () => {
    const baseSchema: z.ZodType<types.ClaimProcedure> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      type: z.array(createCodeableConceptSchema()).optional(),
      date: primitives.getDateTimeSchema().optional(),
      _date: createElementSchema().optional(),
      procedureCodeableConcept: createCodeableConceptSchema().optional(),
      procedureReference: createReferenceSchema().optional(),
      udi: z.array(createReferenceSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimInsuranceSchema() {
  return getCachedSchema("ClaimInsurance", [], () => {
    const baseSchema: z.ZodType<types.ClaimInsurance> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      focal: primitives.getBooleanSchema(),
      _focal: createElementSchema().optional(),
      identifier: createIdentifierSchema().optional(),
      coverage: createReferenceSchema(),
      businessArrangement: primitives.getStringSchema().optional(),
      _businessArrangement: createElementSchema().optional(),
      preAuthRef: z.array(primitives.getStringSchema()).optional(),
      _preAuthRef: z.array(createElementSchema()).optional(),
      claimResponse: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimAccidentSchema() {
  return getCachedSchema("ClaimAccident", [], () => {
    const baseSchema: z.ZodType<types.ClaimAccident> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      date: primitives.getDateSchema(),
      _date: createElementSchema().optional(),
      type: createCodeableConceptSchema().optional(),
      locationAddress: createAddressSchema().optional(),
      locationReference: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimItemSchema() {
  return getCachedSchema("ClaimItem", [], () => {
    const baseSchema: z.ZodType<types.ClaimItem> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      careTeamSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _careTeamSequence: z.array(createElementSchema()).optional(),
      diagnosisSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _diagnosisSequence: z.array(createElementSchema()).optional(),
      procedureSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _procedureSequence: z.array(createElementSchema()).optional(),
      informationSequence: z
        .array(primitives.getPositiveIntSchema())
        .optional(),
      _informationSequence: z.array(createElementSchema()).optional(),
      revenue: createCodeableConceptSchema().optional(),
      category: createCodeableConceptSchema().optional(),
      productOrService: createCodeableConceptSchema(),
      modifier: z.array(createCodeableConceptSchema()).optional(),
      programCode: z.array(createCodeableConceptSchema()).optional(),
      servicedDate: z.string().optional(),
      _servicedDate: createElementSchema().optional(),
      servicedPeriod: createPeriodSchema().optional(),
      locationCodeableConcept: createCodeableConceptSchema().optional(),
      locationAddress: createAddressSchema().optional(),
      locationReference: createReferenceSchema().optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      udi: z.array(createReferenceSchema()).optional(),
      bodySite: createCodeableConceptSchema().optional(),
      subSite: z.array(createCodeableConceptSchema()).optional(),
      encounter: z.array(createReferenceSchema()).optional(),
      detail: z.array(createClaimDetailSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimDetailSchema() {
  return getCachedSchema("ClaimDetail", [], () => {
    const baseSchema: z.ZodType<types.ClaimDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema().optional(),
      _sequence: createElementSchema().optional(),
      revenue: createCodeableConceptSchema().optional(),
      category: createCodeableConceptSchema().optional(),
      productOrService: createCodeableConceptSchema(),
      modifier: z.array(createCodeableConceptSchema()).optional(),
      programCode: z.array(createCodeableConceptSchema()).optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      udi: z.array(createReferenceSchema()).optional(),
      subDetail: z.array(createClaimSubDetailSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimSubDetailSchema() {
  return getCachedSchema("ClaimSubDetail", [], () => {
    const baseSchema: z.ZodType<types.ClaimSubDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema().optional(),
      _sequence: createElementSchema().optional(),
      revenue: createCodeableConceptSchema().optional(),
      category: createCodeableConceptSchema().optional(),
      productOrService: createCodeableConceptSchema(),
      modifier: z.array(createCodeableConceptSchema()).optional(),
      programCode: z.array(createCodeableConceptSchema()).optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      udi: z.array(createReferenceSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("ClaimResponse", [contained], () => {
    const baseSchema: z.ZodType<types.ClaimResponse<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("ClaimResponse"),
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
        status: primitives.getCodeSchema(),
        _status: createElementSchema().optional(),
        type: createCodeableConceptSchema(),
        subType: createCodeableConceptSchema().optional(),
        use: primitives.getCodeSchema(),
        _use: createElementSchema().optional(),
        patient: createReferenceSchema(),
        created: primitives.getDateTimeSchema(),
        _created: createElementSchema().optional(),
        insurer: createReferenceSchema(),
        requestor: createReferenceSchema().optional(),
        request: createReferenceSchema().optional(),
        outcome: primitives.getCodeSchema(),
        _outcome: createElementSchema().optional(),
        disposition: primitives.getStringSchema().optional(),
        _disposition: createElementSchema().optional(),
        preAuthRef: primitives.getStringSchema().optional(),
        _preAuthRef: createElementSchema().optional(),
        preAuthPeriod: createPeriodSchema().optional(),
        payeeType: createCodeableConceptSchema().optional(),
        item: z.array(createClaimResponseItemSchema()).optional(),
        addItem: z.array(createClaimResponseAddItemSchema()).optional(),
        adjudication: z
          .array(createClaimResponseAdjudicationSchema())
          .optional(),
        total: z.array(createClaimResponseTotalSchema()).optional(),
        payment: createClaimResponsePaymentSchema().optional(),
        fundsReserve: createCodeableConceptSchema().optional(),
        formCode: createCodeableConceptSchema().optional(),
        form: createAttachmentSchema().optional(),
        processNote: z.array(createClaimResponseProcessNoteSchema()).optional(),
        communicationRequest: z.array(createReferenceSchema()).optional(),
        insurance: z.array(createClaimResponseInsuranceSchema()).optional(),
        error: z.array(createClaimResponseErrorSchema()).optional(),
      });

    return baseSchema;
  });
}

export function createClaimResponseItemSchema() {
  return getCachedSchema("ClaimResponseItem", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseItem> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      itemSequence: primitives.getPositiveIntSchema(),
      _itemSequence: createElementSchema().optional(),
      noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
      _noteNumber: z.array(createElementSchema()).optional(),
      adjudication: z.array(createClaimResponseAdjudicationSchema()),
      detail: z.array(createClaimResponseDetailSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseAdjudicationSchema() {
  return getCachedSchema("ClaimResponseAdjudication", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseAdjudication> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        category: createCodeableConceptSchema(),
        reason: createCodeableConceptSchema().optional(),
        amount: createMoneySchema().optional(),
        value: primitives.getDecimalSchema().optional(),
        _value: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createClaimResponseDetailSchema() {
  return getCachedSchema("ClaimResponseDetail", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      detailSequence: primitives.getPositiveIntSchema().optional(),
      _detailSequence: createElementSchema().optional(),
      noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
      _noteNumber: z.array(createElementSchema()).optional(),
      adjudication: z.array(createClaimResponseAdjudicationSchema()),
      subDetail: z.array(createClaimResponseSubDetailSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseSubDetailSchema() {
  return getCachedSchema("ClaimResponseSubDetail", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseSubDetail> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      subDetailSequence: primitives.getPositiveIntSchema().optional(),
      _subDetailSequence: createElementSchema().optional(),
      noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
      _noteNumber: z.array(createElementSchema()).optional(),
      adjudication: z.array(createClaimResponseAdjudicationSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseAddItemSchema() {
  return getCachedSchema("ClaimResponseAddItem", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseAddItem> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      itemSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _itemSequence: z.array(createElementSchema()).optional(),
      detailSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _detailSequence: z.array(createElementSchema()).optional(),
      subdetailSequence: z.array(primitives.getPositiveIntSchema()).optional(),
      _subdetailSequence: z.array(createElementSchema()).optional(),
      provider: z.array(createReferenceSchema()).optional(),
      productOrService: createCodeableConceptSchema(),
      modifier: z.array(createCodeableConceptSchema()).optional(),
      programCode: z.array(createCodeableConceptSchema()).optional(),
      servicedDate: z.string().optional(),
      _servicedDate: createElementSchema().optional(),
      servicedPeriod: createPeriodSchema().optional(),
      locationCodeableConcept: createCodeableConceptSchema().optional(),
      locationAddress: createAddressSchema().optional(),
      locationReference: createReferenceSchema().optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      bodySite: createCodeableConceptSchema().optional(),
      subSite: z.array(createCodeableConceptSchema()).optional(),
      noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
      _noteNumber: z.array(createElementSchema()).optional(),
      adjudication: z.array(createClaimResponseAdjudicationSchema()),
      detail: z.array(createClaimResponseDetail1Schema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseDetail1Schema() {
  return getCachedSchema("ClaimResponseDetail1", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseDetail1> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      productOrService: createCodeableConceptSchema(),
      modifier: z.array(createCodeableConceptSchema()).optional(),
      quantity: createQuantitySchema().optional(),
      unitPrice: createMoneySchema().optional(),
      factor: primitives.getDecimalSchema().optional(),
      _factor: createElementSchema().optional(),
      net: createMoneySchema().optional(),
      noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
      _noteNumber: z.array(createElementSchema()).optional(),
      adjudication: z.array(createClaimResponseAdjudicationSchema()),
      subDetail: z.array(createClaimResponseSubDetail1Schema()).optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseSubDetail1Schema() {
  return getCachedSchema("ClaimResponseSubDetail1", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseSubDetail1> = z.strictObject(
      {
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        productOrService: createCodeableConceptSchema(),
        modifier: z.array(createCodeableConceptSchema()).optional(),
        quantity: createQuantitySchema().optional(),
        unitPrice: createMoneySchema().optional(),
        factor: primitives.getDecimalSchema().optional(),
        _factor: createElementSchema().optional(),
        net: createMoneySchema().optional(),
        noteNumber: z.array(primitives.getPositiveIntSchema()).optional(),
        _noteNumber: z.array(createElementSchema()).optional(),
        adjudication: z.array(createClaimResponseAdjudicationSchema()),
      },
    );

    return baseSchema;
  });
}

export function createClaimResponseTotalSchema() {
  return getCachedSchema("ClaimResponseTotal", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseTotal> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      category: createCodeableConceptSchema(),
      amount: createMoneySchema(),
    });

    return baseSchema;
  });
}

export function createClaimResponsePaymentSchema() {
  return getCachedSchema("ClaimResponsePayment", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponsePayment> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      type: createCodeableConceptSchema(),
      adjustment: createMoneySchema().optional(),
      adjustmentReason: createCodeableConceptSchema().optional(),
      date: primitives.getDateSchema().optional(),
      _date: createElementSchema().optional(),
      amount: createMoneySchema(),
      identifier: createIdentifierSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseProcessNoteSchema() {
  return getCachedSchema("ClaimResponseProcessNote", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseProcessNote> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        number: primitives.getPositiveIntSchema().optional(),
        _number: createElementSchema().optional(),
        type: z.enum(["display", "print", "printoper"]).optional(),
        _type: createElementSchema().optional(),
        text: primitives.getStringSchema(),
        _text: createElementSchema().optional(),
        language: createCodeableConceptSchema().optional(),
      });

    return baseSchema;
  });
}

export function createClaimResponseInsuranceSchema() {
  return getCachedSchema("ClaimResponseInsurance", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseInsurance> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      sequence: primitives.getPositiveIntSchema(),
      _sequence: createElementSchema().optional(),
      focal: primitives.getBooleanSchema(),
      _focal: createElementSchema().optional(),
      coverage: createReferenceSchema(),
      businessArrangement: primitives.getStringSchema().optional(),
      _businessArrangement: createElementSchema().optional(),
      claimResponse: createReferenceSchema().optional(),
    });

    return baseSchema;
  });
}

export function createClaimResponseErrorSchema() {
  return getCachedSchema("ClaimResponseError", [], () => {
    const baseSchema: z.ZodType<types.ClaimResponseError> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      itemSequence: primitives.getPositiveIntSchema().optional(),
      _itemSequence: createElementSchema().optional(),
      detailSequence: primitives.getPositiveIntSchema().optional(),
      _detailSequence: createElementSchema().optional(),
      subDetailSequence: primitives.getPositiveIntSchema().optional(),
      _subDetailSequence: createElementSchema().optional(),
      code: createCodeableConceptSchema(),
    });

    return baseSchema;
  });
}
