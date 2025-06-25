import type {
	CodeableConcept,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Quantity,
	Range,
	Reference,
	Timing,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A record of a request for a medication, substance or device used in the healthcare setting. */

export interface SupplyRequest<Contained = ResourceList> {
	resourceType: `SupplyRequest`
	/** The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes. */
	id?: string
	/** The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource. */
	meta?: Meta
	/** A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc. */
	implicitRules?: string

	_implicitRules?: Element
	/** The base language in which the resource is written. */
	language?: string

	_language?: Element
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Business identifiers assigned to this SupplyRequest by the author and/or other systems. These identifiers remain constant as the resource is updated and propagates from server to server. */
	identifier?: Identifier[]
	/** Status of the supply request. */
	status?:
		| 'draft'
		| 'active'
		| 'suspended'
		| 'cancelled'
		| 'completed'
		| 'entered-in-error'
		| 'unknown'

	_status?: Element
	/** Category of supply, e.g.  central, non-stock, etc. This is used to support work flows associated with the supply process. */
	category?: CodeableConcept
	/** Indicates how quickly this SupplyRequest should be addressed with respect to other requests. */
	priority?: string

	_priority?: Element

	itemCodeableConcept?: CodeableConcept

	itemReference?: Reference
	/** The amount that is being ordered of the indicated item. */
	quantity: Quantity

	parameter?: SupplyRequestParameter[]

	occurrenceDateTime?: string

	_occurrenceDateTime?: Element

	occurrencePeriod?: Period

	occurrenceTiming?: Timing
	/** When the request was made. */
	authoredOn?: string

	_authoredOn?: Element
	/** The device, practitioner, etc. who initiated the request. */
	requester?: Reference
	/** Who is intended to fulfill the request. */
	supplier?: Reference[]
	/** The reason why the supply item was requested. */
	reasonCode?: CodeableConcept[]
	/** The reason why the supply item was requested. */
	reasonReference?: Reference[]
	/** Where the supply is expected to come from. */
	deliverFrom?: Reference
	/** Where the supply is destined to go. */
	deliverTo?: Reference
}

/** A record of a request for a medication, substance or device used in the healthcare setting. */

export interface SupplyRequestParameter {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A code or string that identifies the device detail being asserted. */
	code?: CodeableConcept

	valueCodeableConcept?: CodeableConcept

	valueQuantity?: Quantity

	valueRange?: Range

	valueBoolean?: boolean

	_valueBoolean?: Element
}
