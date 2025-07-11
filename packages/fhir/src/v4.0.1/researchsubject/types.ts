import type { Element, Extension, Identifier, Meta, Period, Reference } from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A physical entity which is the primary unit of operational and/or administrative interest in a study. */

export interface ResearchSubject<Contained = ResourceList> {
	resourceType: `ResearchSubject`
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
	/** Identifiers assigned to this research subject for a study. */
	identifier?: Identifier[]
	/** The current state of the subject. */
	status:
		| 'candidate'
		| 'eligible'
		| 'follow-up'
		| 'ineligible'
		| 'not-registered'
		| 'off-study'
		| 'on-study'
		| 'on-study-intervention'
		| 'on-study-observation'
		| 'pending-on-study'
		| 'potential-candidate'
		| 'screening'
		| 'withdrawn'

	_status?: Element
	/** The dates the subject began and ended their participation in the study. */
	period?: Period
	/** Reference to the study the subject is participating in. */
	study: Reference
	/** The record of the person or animal who is involved in the study. */
	individual: Reference
	/** The name of the arm in the study the subject is expected to follow as part of this study. */
	assignedArm?: string

	_assignedArm?: Element
	/** The name of the arm in the study the subject actually followed as part of this study. */
	actualArm?: string

	_actualArm?: Element
	/** A record of the patient's informed agreement to participate in the study. */
	consent?: Reference
}
