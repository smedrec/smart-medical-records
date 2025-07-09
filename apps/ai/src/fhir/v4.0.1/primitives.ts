// Primitives schema header file

import { z } from 'zod/v4'

const PRIMITIVE_SCHEMAS = {
	base64Binary: z.string().base64(),
	boolean: z.boolean(),
	canonical: z.string(),
	code: z.string().regex(/^[^\s]+(\s[^\s]+)*$/),
	date: z
		.string()
		.regex(
			/^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/
		),
	dateTime: z
		.string()
		.regex(
			/^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/
		),
	decimal: z.number(),
	id: z.string().regex(/^[A-Za-z0-9\-.]{1,64}$/),
	instant: z
		.string()
		.regex(
			/^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$/
		),
	integer: z.number().int(),
	markdown: z.string(),
	oid: z.string().regex(/^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/),
	positiveInt: z.number().int().positive(),
	string: z.string(),
	time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/),
	unsignedInt: z.number().int().min(0),
	uri: z.string().regex(/^\S*$/),
	url: z.string().url(),
	uuid: z.string().regex(/^urn:uuid:.+$/),
	xhtml: z.string(),
} as const

export const getBase64BinarySchema = () => PRIMITIVE_SCHEMAS.base64Binary
export const getBooleanSchema = () => PRIMITIVE_SCHEMAS.boolean
export const getCanonicalSchema = () => PRIMITIVE_SCHEMAS.canonical
export const getCodeSchema = () => PRIMITIVE_SCHEMAS.code
export const getDateSchema = () => PRIMITIVE_SCHEMAS.date
export const getDateTimeSchema = () => PRIMITIVE_SCHEMAS.dateTime
export const getDecimalSchema = () => PRIMITIVE_SCHEMAS.decimal
export const getIdSchema = () => PRIMITIVE_SCHEMAS.id
export const getInstantSchema = () => PRIMITIVE_SCHEMAS.instant
export const getIntegerSchema = () => PRIMITIVE_SCHEMAS.integer
export const getMarkdownSchema = () => PRIMITIVE_SCHEMAS.markdown
export const getOidSchema = () => PRIMITIVE_SCHEMAS.oid
export const getPositiveIntSchema = () => PRIMITIVE_SCHEMAS.positiveInt
export const getStringSchema = () => PRIMITIVE_SCHEMAS.string
export const getTimeSchema = () => PRIMITIVE_SCHEMAS.time
export const getUnsignedIntSchema = () => PRIMITIVE_SCHEMAS.unsignedInt
export const getUriSchema = () => PRIMITIVE_SCHEMAS.uri
export const getUrlSchema = () => PRIMITIVE_SCHEMAS.url
export const getUuidSchema = () => PRIMITIVE_SCHEMAS.uuid
export const getXhtmlSchema = () => PRIMITIVE_SCHEMAS.xhtml

export type Base64BinarySchema = z.ZodString
export type BooleanSchema = z.ZodBoolean
export type CanonicalSchema = z.ZodString
export type CodeSchema = z.ZodString
export type DateSchema = z.ZodString
export type DateTimeSchema = z.ZodString
export type DecimalSchema = z.ZodNumber
export type IdSchema = z.ZodString
export type InstantSchema = z.ZodString
export type IntegerSchema = z.ZodNumber
export type MarkdownSchema = z.ZodString
export type OidSchema = z.ZodString
export type PositiveIntSchema = z.ZodNumber
export type StringSchema = z.ZodString
export type TimeSchema = z.ZodString
export type UnsignedIntSchema = z.ZodNumber
export type UriSchema = z.ZodString
export type UrlSchema = z.ZodString
export type UuidSchema = z.ZodString
export type XhtmlSchema = z.ZodString
