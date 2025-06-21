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
  createQuantitySchema,
  createCodeableConceptSchema,
} from "../core/schema";
import { createNarrativeSchema } from "../narrative/schema";
import { createResourceListSchema } from "../resourcelist/schema";

/* Generated from FHIR JSON Schema */

export function createMolecularSequenceSchema<
  C extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { contained?: C; allowContained?: boolean }) {
  const contained =
    options?.allowContained === false
      ? ZodNever
      : (options?.contained ?? createResourceListSchema());

  return getCachedSchema("MolecularSequence", [contained], () => {
    const baseSchema: z.ZodType<types.MolecularSequence<z.infer<C>>> =
      z.strictObject({
        resourceType: z.literal("MolecularSequence"),
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
        type: z.enum(["aa", "dna", "rna"]).optional(),
        _type: createElementSchema().optional(),
        coordinateSystem: primitives.getIntegerSchema(),
        _coordinateSystem: createElementSchema().optional(),
        patient: createReferenceSchema().optional(),
        specimen: createReferenceSchema().optional(),
        device: createReferenceSchema().optional(),
        performer: createReferenceSchema().optional(),
        quantity: createQuantitySchema().optional(),
        referenceSeq: createMolecularSequenceReferenceSeqSchema().optional(),
        variant: z.array(createMolecularSequenceVariantSchema()).optional(),
        observedSeq: primitives.getStringSchema().optional(),
        _observedSeq: createElementSchema().optional(),
        quality: z.array(createMolecularSequenceQualitySchema()).optional(),
        readCoverage: primitives.getIntegerSchema().optional(),
        _readCoverage: createElementSchema().optional(),
        repository: z
          .array(createMolecularSequenceRepositorySchema())
          .optional(),
        pointer: z.array(createReferenceSchema()).optional(),
        structureVariant: z
          .array(createMolecularSequenceStructureVariantSchema())
          .optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceReferenceSeqSchema() {
  return getCachedSchema("MolecularSequenceReferenceSeq", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceReferenceSeq> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        chromosome: createCodeableConceptSchema().optional(),
        genomeBuild: primitives.getStringSchema().optional(),
        _genomeBuild: createElementSchema().optional(),
        orientation: z.enum(["sense", "antisense"]).optional(),
        _orientation: createElementSchema().optional(),
        referenceSeqId: createCodeableConceptSchema().optional(),
        referenceSeqPointer: createReferenceSchema().optional(),
        referenceSeqString: primitives.getStringSchema().optional(),
        _referenceSeqString: createElementSchema().optional(),
        strand: z.enum(["watson", "crick"]).optional(),
        _strand: createElementSchema().optional(),
        windowStart: primitives.getIntegerSchema().optional(),
        _windowStart: createElementSchema().optional(),
        windowEnd: primitives.getIntegerSchema().optional(),
        _windowEnd: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceVariantSchema() {
  return getCachedSchema("MolecularSequenceVariant", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceVariant> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        start: primitives.getIntegerSchema().optional(),
        _start: createElementSchema().optional(),
        end: primitives.getIntegerSchema().optional(),
        _end: createElementSchema().optional(),
        observedAllele: primitives.getStringSchema().optional(),
        _observedAllele: createElementSchema().optional(),
        referenceAllele: primitives.getStringSchema().optional(),
        _referenceAllele: createElementSchema().optional(),
        cigar: primitives.getStringSchema().optional(),
        _cigar: createElementSchema().optional(),
        variantPointer: createReferenceSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceQualitySchema() {
  return getCachedSchema("MolecularSequenceQuality", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceQuality> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: z.enum(["indel", "snp", "unknown"]),
        _type: createElementSchema().optional(),
        standardSequence: createCodeableConceptSchema().optional(),
        start: primitives.getIntegerSchema().optional(),
        _start: createElementSchema().optional(),
        end: primitives.getIntegerSchema().optional(),
        _end: createElementSchema().optional(),
        score: createQuantitySchema().optional(),
        method: createCodeableConceptSchema().optional(),
        truthTP: primitives.getDecimalSchema().optional(),
        _truthTP: createElementSchema().optional(),
        queryTP: primitives.getDecimalSchema().optional(),
        _queryTP: createElementSchema().optional(),
        truthFN: primitives.getDecimalSchema().optional(),
        _truthFN: createElementSchema().optional(),
        queryFP: primitives.getDecimalSchema().optional(),
        _queryFP: createElementSchema().optional(),
        gtFP: primitives.getDecimalSchema().optional(),
        _gtFP: createElementSchema().optional(),
        precision: primitives.getDecimalSchema().optional(),
        _precision: createElementSchema().optional(),
        recall: primitives.getDecimalSchema().optional(),
        _recall: createElementSchema().optional(),
        fScore: primitives.getDecimalSchema().optional(),
        _fScore: createElementSchema().optional(),
        roc: createMolecularSequenceRocSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceRocSchema() {
  return getCachedSchema("MolecularSequenceRoc", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceRoc> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      score: z.array(primitives.getIntegerSchema()).optional(),
      _score: z.array(createElementSchema()).optional(),
      numTP: z.array(primitives.getIntegerSchema()).optional(),
      _numTP: z.array(createElementSchema()).optional(),
      numFP: z.array(primitives.getIntegerSchema()).optional(),
      _numFP: z.array(createElementSchema()).optional(),
      numFN: z.array(primitives.getIntegerSchema()).optional(),
      _numFN: z.array(createElementSchema()).optional(),
      precision: z.array(primitives.getDecimalSchema()).optional(),
      _precision: z.array(createElementSchema()).optional(),
      sensitivity: z.array(primitives.getDecimalSchema()).optional(),
      _sensitivity: z.array(createElementSchema()).optional(),
      fMeasure: z.array(primitives.getDecimalSchema()).optional(),
      _fMeasure: z.array(createElementSchema()).optional(),
    });

    return baseSchema;
  });
}

export function createMolecularSequenceRepositorySchema() {
  return getCachedSchema("MolecularSequenceRepository", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceRepository> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        type: z.enum(["directlink", "openapi", "login", "oauth", "other"]),
        _type: createElementSchema().optional(),
        url: primitives.getUriSchema().optional(),
        _url: createElementSchema().optional(),
        name: primitives.getStringSchema().optional(),
        _name: createElementSchema().optional(),
        datasetId: primitives.getStringSchema().optional(),
        _datasetId: createElementSchema().optional(),
        variantsetId: primitives.getStringSchema().optional(),
        _variantsetId: createElementSchema().optional(),
        readsetId: primitives.getStringSchema().optional(),
        _readsetId: createElementSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceStructureVariantSchema() {
  return getCachedSchema("MolecularSequenceStructureVariant", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceStructureVariant> =
      z.strictObject({
        id: primitives.getStringSchema().optional(),
        extension: z.array(createExtensionSchema()).optional(),
        modifierExtension: z.array(createExtensionSchema()).optional(),
        variantType: createCodeableConceptSchema().optional(),
        exact: primitives.getBooleanSchema().optional(),
        _exact: createElementSchema().optional(),
        length: primitives.getIntegerSchema().optional(),
        _length: createElementSchema().optional(),
        outer: createMolecularSequenceOuterSchema().optional(),
        inner: createMolecularSequenceInnerSchema().optional(),
      });

    return baseSchema;
  });
}

export function createMolecularSequenceOuterSchema() {
  return getCachedSchema("MolecularSequenceOuter", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceOuter> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      start: primitives.getIntegerSchema().optional(),
      _start: createElementSchema().optional(),
      end: primitives.getIntegerSchema().optional(),
      _end: createElementSchema().optional(),
    });

    return baseSchema;
  });
}

export function createMolecularSequenceInnerSchema() {
  return getCachedSchema("MolecularSequenceInner", [], () => {
    const baseSchema: z.ZodType<types.MolecularSequenceInner> = z.strictObject({
      id: primitives.getStringSchema().optional(),
      extension: z.array(createExtensionSchema()).optional(),
      modifierExtension: z.array(createExtensionSchema()).optional(),
      start: primitives.getIntegerSchema().optional(),
      _start: createElementSchema().optional(),
      end: primitives.getIntegerSchema().optional(),
      _end: createElementSchema().optional(),
    });

    return baseSchema;
  });
}
