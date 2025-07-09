import { z } from 'zod/v4'

import {
	createAnnotationSchema,
	createCodeableConceptSchema,
	createElementSchema,
	createExtensionSchema,
	createIdentifierSchema,
	createMetaSchema,
	createMoneySchema,
	createReferenceSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createInvoiceSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('Invoice', [contained], () => {
		const baseSchema: z.ZodType<types.Invoice<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('Invoice'),
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
			status: z.enum(['draft', 'issued', 'balanced', 'cancelled', 'entered-in-error']),
			_status: createElementSchema().optional(),
			cancelledReason: primitives.getStringSchema().optional(),
			_cancelledReason: createElementSchema().optional(),
			type: createCodeableConceptSchema().optional(),
			subject: createReferenceSchema().optional(),
			recipient: createReferenceSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			participant: z.array(createInvoiceParticipantSchema()).optional(),
			issuer: createReferenceSchema().optional(),
			account: createReferenceSchema().optional(),
			lineItem: z.array(createInvoiceLineItemSchema()).optional(),
			totalPriceComponent: z.array(createInvoicePriceComponentSchema()).optional(),
			totalNet: createMoneySchema().optional(),
			totalGross: createMoneySchema().optional(),
			paymentTerms: primitives.getMarkdownSchema().optional(),
			_paymentTerms: createElementSchema().optional(),
			note: z.array(createAnnotationSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInvoiceParticipantSchema() {
	return getCachedSchema('InvoiceParticipant', [], () => {
		const baseSchema: z.ZodType<types.InvoiceParticipant> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			role: createCodeableConceptSchema().optional(),
			actor: createReferenceSchema(),
		})

		return baseSchema
	})
}

export function createInvoiceLineItemSchema() {
	return getCachedSchema('InvoiceLineItem', [], () => {
		const baseSchema: z.ZodType<types.InvoiceLineItem> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			sequence: primitives.getPositiveIntSchema().optional(),
			_sequence: createElementSchema().optional(),
			chargeItemReference: createReferenceSchema().optional(),
			chargeItemCodeableConcept: createCodeableConceptSchema().optional(),
			priceComponent: z.array(createInvoicePriceComponentSchema()).optional(),
		})

		return baseSchema
	})
}

export function createInvoicePriceComponentSchema() {
	return getCachedSchema('InvoicePriceComponent', [], () => {
		const baseSchema: z.ZodType<types.InvoicePriceComponent> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: z
				.enum(['base', 'surcharge', 'deduction', 'discount', 'tax', 'informational'])
				.optional(),
			_type: createElementSchema().optional(),
			code: createCodeableConceptSchema().optional(),
			factor: primitives.getDecimalSchema().optional(),
			_factor: createElementSchema().optional(),
			amount: createMoneySchema().optional(),
		})

		return baseSchema
	})
}
