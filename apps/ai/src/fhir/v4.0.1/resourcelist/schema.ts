import { z } from "zod/v4";
import * as types from "./types";
import * as primitives from "../primitives";
import { getCachedSchema, ZodNever } from "../schema-cache";

/* Generated from FHIR JSON Schema */

const UNKNOWN = z.unknown();
export function createResourceListSchema() {
  return UNKNOWN;
}
