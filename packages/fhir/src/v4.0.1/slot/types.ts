import type {
	CodeableConcept,
	Element,
	Extension,
	Identifier,
	Meta,
	Reference,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A slot of time on a schedule that may be available for booking appointments. */

export interface Slot<Contained = ResourceList> {
	resourceType: `Slot`
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
	/** External Ids for this item. */
	identifier?: Identifier[]
	/** A broad categorization of the service that is to be performed during this appointment. */
	serviceCategory?: CodeableConcept[]
	/** The type of appointments that can be booked into this slot (ideally this would be an identifiable service - which is at a location, rather than the location itself). If provided then this overrides the value provided on the availability resource. */
	serviceType?: CodeableConcept[]
	/** The specialty of a practitioner that would be required to perform the service requested in this appointment. */
	specialty?: CodeableConcept[]
	/** The style of appointment or patient that may be booked in the slot (not service type). */
	appointmentType?: CodeableConcept
	/** The schedule resource that this slot defines an interval of status information. */
	schedule: Reference
	/** busy | free | busy-unavailable | busy-tentative | entered-in-error. */
	status: 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative' | 'entered-in-error'

	_status?: Element
	/** Date/Time that the slot is to begin. */
	start: string

	_start?: Element
	/** Date/Time that the slot is to conclude. */
	end: string

	_end?: Element
	/** This slot has already been overbooked, appointments are unlikely to be accepted for this time. */
	overbooked?: boolean

	_overbooked?: Element
	/** Comments on the slot to describe any extended information. Such as custom constraints on the slot. */
	comment?: string

	_comment?: Element
}
