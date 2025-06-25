import { z } from 'zod/v4'

import {
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createSignatureSchema,
} from '../core/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createBundleSchema<
	O extends z.ZodTypeAny = z.ZodUnknown,
	R extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { outcome?: O; resource?: R }) {
	return getCachedSchema('Bundle', [options?.outcome ?? null, options?.resource ?? null], () => {
		const baseSchema: z.ZodType<types.Bundle<z.infer<O>, z.infer<R>>> = z.strictObject({
			resourceType: z.literal('Bundle'),
			id: primitives.getIdSchema().optional(),
			meta: createMetaSchema().optional(),
			implicitRules: primitives.getUriSchema().optional(),
			_implicitRules: createElementSchema().optional(),
			language: primitives.getCodeSchema().optional(),
			_language: createElementSchema().optional(),
			identifier: createIdentifierSchema().optional(),
			type: z.enum([
				'document',
				'message',
				'transaction',
				'transaction-response',
				'batch',
				'batch-response',
				'history',
				'searchset',
				'collection',
			]),
			_type: createElementSchema().optional(),
			timestamp: primitives.getInstantSchema().optional(),
			_timestamp: createElementSchema().optional(),
			total: primitives.getUnsignedIntSchema().optional(),
			_total: createElementSchema().optional(),
			link: z.array(createBundleLinkSchema()).optional(),
			entry: z
				.array(
					createBundleEntrySchema<O, R>({
						resource: options?.resource,
						outcome: options?.outcome,
					})
				)
				.optional(),
			signature: createSignatureSchema().optional(),
		})

		return baseSchema
	})
}

export function createBundleLinkSchema() {
	return getCachedSchema('BundleLink', [], () => {
		const baseSchema: z.ZodType<types.BundleLink> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			relation: primitives.getStringSchema(),
			_relation: createElementSchema().optional(),
			url: primitives.getUriSchema(),
			_url: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createBundleEntrySchema<
	O extends z.ZodTypeAny = z.ZodUnknown,
	R extends z.ZodTypeAny = z.ZodUnknown,
>(options?: { outcome?: O; resource?: R }) {
	const resource = options?.resource ?? createResourceListSchema()

	return getCachedSchema('BundleEntry', [options?.outcome ?? null, resource], () => {
		const baseSchema: z.ZodType<types.BundleEntry<z.infer<O>, z.infer<R>>> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			link: z.array(createBundleLinkSchema()).optional(),
			fullUrl: primitives.getUriSchema().optional(),
			_fullUrl: createElementSchema().optional(),
			resource: resource.optional(),
			search: createBundleSearchSchema().optional(),
			request: createBundleRequestSchema().optional(),
			response: createBundleResponseSchema<O>({
				outcome: options?.outcome,
			}).optional(),
		})

		return baseSchema
	})
}

export function createBundleSearchSchema() {
	return getCachedSchema('BundleSearch', [], () => {
		const baseSchema: z.ZodType<types.BundleSearch> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			mode: z.enum(['match', 'include', 'outcome']).optional(),
			_mode: createElementSchema().optional(),
			score: primitives.getDecimalSchema().optional(),
			_score: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createBundleRequestSchema() {
	return getCachedSchema('BundleRequest', [], () => {
		const baseSchema: z.ZodType<types.BundleRequest> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			method: z.enum(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
			_method: createElementSchema().optional(),
			url: primitives.getUriSchema().optional(),
			_url: createElementSchema().optional(),
			ifNoneMatch: primitives.getStringSchema().optional(),
			_ifNoneMatch: createElementSchema().optional(),
			ifModifiedSince: primitives.getInstantSchema().optional(),
			_ifModifiedSince: createElementSchema().optional(),
			ifMatch: primitives.getStringSchema().optional(),
			_ifMatch: createElementSchema().optional(),
			ifNoneExist: primitives.getStringSchema().optional(),
			_ifNoneExist: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createBundleResponseSchema<O extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	outcome?: O
}) {
	const outcome = options?.outcome ?? createResourceListSchema()

	return getCachedSchema('BundleResponse', [outcome], () => {
		const baseSchema: z.ZodType<types.BundleResponse<z.infer<O>>> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			status: primitives.getStringSchema().optional(),
			_status: createElementSchema().optional(),
			location: primitives.getUriSchema().optional(),
			_location: createElementSchema().optional(),
			etag: primitives.getStringSchema().optional(),
			_etag: createElementSchema().optional(),
			lastModified: primitives.getInstantSchema().optional(),
			_lastModified: createElementSchema().optional(),
			outcome: outcome.optional(),
		})

		return baseSchema
	})
}
