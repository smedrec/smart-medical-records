import type {
	CodeableConcept,
	Element,
	Extension,
	Identifier,
	Meta,
	Money,
	Reference,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** This resource provides the status of the payment for goods and services rendered, and the request and response resource references. */

export interface PaymentNotice<Contained = ResourceList> {
	resourceType: `PaymentNotice`
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
	/** A unique identifier assigned to this payment notice. */
	identifier?: Identifier[]
	/** The status of the resource instance. */
	status: string

	_status?: Element
	/** Reference of resource for which payment is being made. */
	request?: Reference
	/** Reference of response to resource for which payment is being made. */
	response?: Reference
	/** The date when this resource was created. */
	created: string

	_created?: Element
	/** The practitioner who is responsible for the services rendered to the patient. */
	provider?: Reference
	/** A reference to the payment which is the subject of this notice. */
	payment: Reference
	/** The date when the above payment action occurred. */
	paymentDate?: string

	_paymentDate?: Element
	/** The party who will receive or has received payment that is the subject of this notification. */
	payee?: Reference
	/** The party who is notified of the payment status. */
	recipient: Reference
	/** The amount sent to the payee. */
	amount: Money
	/** A code indicating whether payment has been sent or cleared. */
	paymentStatus?: CodeableConcept
}
