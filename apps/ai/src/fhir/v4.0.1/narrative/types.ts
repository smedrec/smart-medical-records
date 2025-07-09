import type { Element, Extension } from '../core/types'

/* Generated from FHIR JSON Schema */

/** A human-readable summary of the resource conveying the essential clinical and business information for the resource. */

export interface Narrative {
	id?: string

	extension?: Extension[]
	/** The status of the narrative - whether it's entirely generated (from just the defined data or the extensions too), or whether a human authored it and it may contain additional data. */
	status: 'generated' | 'extensions' | 'additional' | 'empty'

	_status?: Element
	/** The actual narrative content, a stripped down version of XHTML. */
	div: string
}
