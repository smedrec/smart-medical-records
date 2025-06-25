import type { CodeableConcept, Element, Extension, Quantity, Range } from '../core/types'

/* Generated from FHIR JSON Schema */

/** Chemical substances are a single substance type whose primary defining element is the molecular structure. Chemical substances shall be defined on the basis of their complete covalent molecular structure; the presence of a salt (counter-ion) and/or solvates (water, alcohols) is also captured. Purity, grade, physical form or particle size are not taken into account in the definition of a chemical substance or in the assignment of a Substance ID. */

export interface SubstanceAmount {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	amountQuantity?: Quantity

	amountRange?: Range

	amountString?: string

	_amountString?: Element
	/** Most elements that require a quantitative value will also have a field called amount type. Amount type should always be specified because the actual value of the amount is often dependent on it. EXAMPLE: In capturing the actual relative amounts of substances or molecular fragments it is essential to indicate whether the amount refers to a mole ratio or weight ratio. For any given element an effort should be made to use same the amount type for all related definitional elements. */
	amountType?: CodeableConcept
	/** A textual comment on a numeric value. */
	amountText?: string

	_amountText?: Element

	referenceRange?: SubstanceAmountReferenceRange
}

/** Chemical substances are a single substance type whose primary defining element is the molecular structure. Chemical substances shall be defined on the basis of their complete covalent molecular structure; the presence of a salt (counter-ion) and/or solvates (water, alcohols) is also captured. Purity, grade, physical form or particle size are not taken into account in the definition of a chemical substance or in the assignment of a Substance ID. */

export interface SubstanceAmountReferenceRange {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** Lower limit possible or expected. */
	lowLimit?: Quantity
	/** Upper limit possible or expected. */
	highLimit?: Quantity
}
