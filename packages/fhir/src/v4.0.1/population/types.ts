import type { CodeableConcept, Extension, Range } from '../core/types'

/* Generated from FHIR JSON Schema */

/** A populatioof people with some set of grouping criteria. */

export interface Population {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	ageRange?: Range

	ageCodeableConcept?: CodeableConcept
	/** The gender of the specific population. */
	gender?: CodeableConcept
	/** Race of the specific population. */
	race?: CodeableConcept
	/** The existing physiological conditions of the specific population to which this applies. */
	physiologicalCondition?: CodeableConcept
}
