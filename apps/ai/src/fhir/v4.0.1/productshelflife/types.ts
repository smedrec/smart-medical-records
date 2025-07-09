import type { CodeableConcept, Extension, Identifier, Quantity } from '../core/types'

/* Generated from FHIR JSON Schema */

/** The shelf-life and storage information for a medicinal product item or container can be described using this class. */

export interface ProductShelfLife {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** Unique identifier for the packaged Medicinal Product. */
	identifier?: Identifier
	/** This describes the shelf life, taking into account various scenarios such as shelf life of the packaged Medicinal Product itself, shelf life after transformation where necessary and shelf life after the first opening of a bottle, etc. The shelf life type shall be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified. */
	type: CodeableConcept
	/** The shelf life time period can be specified using a numerical value for the period of time and its unit of time measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	period: Quantity
	/** Special precautions for storage, if any, can be specified using an appropriate controlled vocabulary The controlled term and the controlled term identifier shall be specified. */
	specialPrecautionsForStorage?: CodeableConcept[]
}
