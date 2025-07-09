import type {
	CodeableConcept,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Reference,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A booking of a healthcare event among patient(s), practitioner(s), related person(s) and/or device(s) for a specific date/time. This may result in one or more Encounter(s). */

export interface Appointment<Contained = ResourceList> {
	resourceType: `Appointment`
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
	/** This records identifiers associated with this appointment concern that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate (e.g. in CDA documents, or in written / printed documentation). */
	identifier?: Identifier[]
	/** The overall status of the Appointment. Each of the participants has their own participation status which indicates their involvement in the process, however this status indicates the shared status. */
	status:
		| 'proposed'
		| 'pending'
		| 'booked'
		| 'arrived'
		| 'fulfilled'
		| 'cancelled'
		| 'noshow'
		| 'entered-in-error'
		| 'checked-in'
		| 'waitlist'

	_status?: Element
	/** The coded reason for the appointment being cancelled. This is often used in reporting/billing/futher processing to determine if further actions are required, or specific fees apply. */
	cancelationReason?: CodeableConcept
	/** A broad categorization of the service that is to be performed during this appointment. */
	serviceCategory?: CodeableConcept[]
	/** The specific service that is to be performed during this appointment. */
	serviceType?: CodeableConcept[]
	/** The specialty of a practitioner that would be required to perform the service requested in this appointment. */
	specialty?: CodeableConcept[]
	/** The style of appointment or patient that has been booked in the slot (not service type). */
	appointmentType?: CodeableConcept
	/** The coded reason that this appointment is being scheduled. This is more clinical than administrative. */
	reasonCode?: CodeableConcept[]
	/** Reason the appointment has been scheduled to take place, as specified using information from another resource. When the patient arrives and the encounter begins it may be used as the admission diagnosis. The indication will typically be a Condition (with other resources referenced in the evidence.detail), or a Procedure. */
	reasonReference?: Reference[]
	/** The priority of the appointment. Can be used to make informed decisions if needing to re-prioritize appointments. (The iCal Standard specifies 0 as undefined, 1 as highest, 9 as lowest priority). */
	priority?: number

	_priority?: Element
	/** The brief description of the appointment as would be shown on a subject line in a meeting request, or appointment list. Detailed or expanded information should be put in the comment field. */
	description?: string

	_description?: Element
	/** Additional information to support the appointment provided when making the appointment. */
	supportingInformation?: Reference[]
	/** Date/Time that the appointment is to take place. */
	start?: string

	_start?: Element
	/** Date/Time that the appointment is to conclude. */
	end?: string

	_end?: Element
	/** Number of minutes that the appointment is to take. This can be less than the duration between the start and end times.  For example, where the actual time of appointment is only an estimate or if a 30 minute appointment is being requested, but any time would work.  Also, if there is, for example, a planned 15 minute break in the middle of a long appointment, the duration may be 15 minutes less than the difference between the start and end. */
	minutesDuration?: number

	_minutesDuration?: Element
	/** The slots from the participants' schedules that will be filled by the appointment. */
	slot?: Reference[]
	/** The date that this appointment was initially created. This could be different to the meta.lastModified value on the initial entry, as this could have been before the resource was created on the FHIR server, and should remain unchanged over the lifespan of the appointment. */
	created?: string

	_created?: Element
	/** Additional comments about the appointment. */
	comment?: string

	_comment?: Element
	/** While Appointment.comment contains information for internal use, Appointment.patientInstructions is used to capture patient facing information about the Appointment (e.g. please bring your referral or fast from 8pm night before). */
	patientInstruction?: string

	_patientInstruction?: Element
	/** The service request this appointment is allocated to assess (e.g. incoming referral or procedure request). */
	basedOn?: Reference[]

	participant: AppointmentParticipant[]
	/** A set of date ranges (potentially including times) that the appointment is preferred to be scheduled within.

The duration (usually in minutes) could also be provided to indicate the length of the appointment to fill and populate the start/end times for the actual allocated time. However, in other situations the duration may be calculated by the scheduling system. */
	requestedPeriod?: Period[]
}

/** A booking of a healthcare event among patient(s), practitioner(s), related person(s) and/or device(s) for a specific date/time. This may result in one or more Encounter(s). */

export interface AppointmentParticipant {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Role of participant in the appointment. */
	type?: CodeableConcept[]
	/** A Person, Location/HealthcareService or Device that is participating in the appointment. */
	actor?: Reference
	/** Whether this participant is required to be present at the meeting. This covers a use-case where two doctors need to meet to discuss the results for a specific patient, and the patient is not required to be present. */
	required?: 'required' | 'optional' | 'information-only'

	_required?: Element
	/** Participation status of the actor. */
	status: 'accepted' | 'declined' | 'tentative' | 'needs-action'

	_status?: Element
	/** Participation period of the actor. */
	period?: Period
}

/** A reply to an appointment request for a patient and/or practitioner(s), such as a confirmation or rejection. */

export interface AppointmentResponse<Contained = ResourceList> {
	resourceType: `AppointmentResponse`
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
	/** This records identifiers associated with this appointment response concern that are defined by business processes and/ or used to refer to it when a direct URL reference to the resource itself is not appropriate. */
	identifier?: Identifier[]
	/** Appointment that this response is replying to. */
	appointment: Reference
	/** Date/Time that the appointment is to take place, or requested new start time. */
	start?: string

	_start?: Element
	/** This may be either the same as the appointment request to confirm the details of the appointment, or alternately a new time to request a re-negotiation of the end time. */
	end?: string

	_end?: Element
	/** Role of participant in the appointment. */
	participantType?: CodeableConcept[]
	/** A Person, Location, HealthcareService, or Device that is participating in the appointment. */
	actor?: Reference
	/** Participation status of the participant. When the status is declined or tentative if the start/end times are different to the appointment, then these times should be interpreted as a requested time change. When the status is accepted, the times can either be the time of the appointment (as a confirmation of the time) or can be empty. */
	participantStatus: string

	_participantStatus?: Element
	/** Additional comments about the appointment. */
	comment?: string

	_comment?: Element
}
