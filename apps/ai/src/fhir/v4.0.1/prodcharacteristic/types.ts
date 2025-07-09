import type { Attachment, CodeableConcept, Element, Extension, Quantity } from '../core/types'

/* Generated from FHIR JSON Schema */

/** The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available. */

export interface ProdCharacteristic {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** Where applicable, the height can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	height?: Quantity
	/** Where applicable, the width can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	width?: Quantity
	/** Where applicable, the depth can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	depth?: Quantity
	/** Where applicable, the weight can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	weight?: Quantity
	/** Where applicable, the nominal volume can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	nominalVolume?: Quantity
	/** Where applicable, the external diameter can be specified using a numerical value and its unit of measurement The unit of measurement shall be specified in accordance with ISO 11240 and the resulting terminology The symbol and the symbol identifier shall be used. */
	externalDiameter?: Quantity
	/** Where applicable, the shape can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used. */
	shape?: string

	_shape?: Element
	/** Where applicable, the color can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used. */
	color?: string[]

	_color?: Element[]
	/** Where applicable, the imprint can be specified as text. */
	imprint?: string[]

	_imprint?: Element[]
	/** Where applicable, the image can be provided The format of the image attachment shall be specified by regional implementations. */
	image?: Attachment[]
	/** Where applicable, the scoring can be specified An appropriate controlled vocabulary shall be used The term and the term identifier shall be used. */
	scoring?: CodeableConcept
}
