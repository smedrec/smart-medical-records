import type {
	Annotation,
	CodeableConcept,
	Duration,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Quantity,
	Range,
	Reference,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A sample to be used for analysis. */

export interface Specimen<Contained = ResourceList> {
	resourceType: `Specimen`
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
	/** Id for specimen. */
	identifier?: Identifier[]
	/** The identifier assigned by the lab when accessioning specimen(s). This is not necessarily the same as the specimen identifier, depending on local lab procedures. */
	accessionIdentifier?: Identifier
	/** The availability of the specimen. */
	status?: 'available' | 'unavailable' | 'unsatisfactory' | 'entered-in-error'

	_status?: Element
	/** The kind of material that forms the specimen. */
	type?: CodeableConcept
	/** Where the specimen came from. This may be from patient(s), from a location (e.g., the source of an environmental sample), or a sampling of a substance or a device. */
	subject?: Reference
	/** Time when specimen was received for processing or testing. */
	receivedTime?: string

	_receivedTime?: Element
	/** Reference to the parent (source) specimen which is used when the specimen was either derived from or a component of another specimen. */
	parent?: Reference[]
	/** Details concerning a service request that required a specimen to be collected. */
	request?: Reference[]

	collection?: SpecimenCollection

	processing?: SpecimenProcessing[]

	container?: SpecimenContainer[]
	/** A mode or state of being that describes the nature of the specimen. */
	condition?: CodeableConcept[]
	/** To communicate any details or issues about the specimen or during the specimen collection. (for example: broken vial, sent with patient, frozen). */
	note?: Annotation[]
}

/** A sample to be used for analysis. */

export interface SpecimenCollection {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Person who collected the specimen. */
	collector?: Reference

	collectedDateTime?: string

	_collectedDateTime?: Element

	collectedPeriod?: Period
	/** The span of time over which the collection of a specimen occurred. */
	duration?: Duration
	/** The quantity of specimen collected; for instance the volume of a blood sample, or the physical measurement of an anatomic pathology sample. */
	quantity?: Quantity
	/** A coded value specifying the technique that is used to perform the procedure. */
	method?: CodeableConcept
	/** Anatomical location from which the specimen was collected (if subject is a patient). This is the target site.  This element is not used for environmental specimens. */
	bodySite?: CodeableConcept

	fastingStatusCodeableConcept?: CodeableConcept

	fastingStatusDuration?: Duration
}

/** A sample to be used for analysis. */

export interface SpecimenProcessing {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Textual description of procedure. */
	description?: string

	_description?: Element
	/** A coded value specifying the procedure used to process the specimen. */
	procedure?: CodeableConcept
	/** Material used in the processing step. */
	additive?: Reference[]

	timeDateTime?: string

	_timeDateTime?: Element

	timePeriod?: Period
}

/** A sample to be used for analysis. */

export interface SpecimenContainer {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Id for container. There may be multiple; a manufacturer's bar code, lab assigned identifier, etc. The container ID may differ from the specimen id in some circumstances. */
	identifier?: Identifier[]
	/** Textual description of the container. */
	description?: string

	_description?: Element
	/** The type of container associated with the specimen (e.g. slide, aliquot, etc.). */
	type?: CodeableConcept
	/** The capacity (volume or other measure) the container may contain. */
	capacity?: Quantity
	/** The quantity of specimen in the container; may be volume, dimensions, or other appropriate measurements, depending on the specimen type. */
	specimenQuantity?: Quantity

	additiveCodeableConcept?: CodeableConcept

	additiveReference?: Reference
}

/** A kind of specimen with associated set of requirements. */

export interface SpecimenDefinition<Contained = ResourceList> {
	resourceType: `SpecimenDefinition`
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
	/** A business identifier associated with the kind of specimen. */
	identifier?: Identifier
	/** The kind of material to be collected. */
	typeCollected?: CodeableConcept
	/** Preparation of the patient for specimen collection. */
	patientPreparation?: CodeableConcept[]
	/** Time aspect of specimen collection (duration or offset). */
	timeAspect?: string

	_timeAspect?: Element
	/** The action to be performed for collecting the specimen. */
	collection?: CodeableConcept[]

	typeTested?: SpecimenDefinitionTypeTested[]
}

/** A kind of specimen with associated set of requirements. */

export interface SpecimenDefinitionTypeTested {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Primary of secondary specimen. */
	isDerived?: boolean

	_isDerived?: Element
	/** The kind of specimen conditioned for testing expected by lab. */
	type?: CodeableConcept
	/** The preference for this type of conditioned specimen. */
	preference: 'preferred' | 'alternate'

	_preference?: Element

	container?: SpecimenDefinitionContainer
	/** Requirements for delivery and special handling of this kind of conditioned specimen. */
	requirement?: string

	_requirement?: Element
	/** The usual time that a specimen of this kind is retained after the ordered tests are completed, for the purpose of additional testing. */
	retentionTime?: Duration
	/** Criterion for rejection of the specimen in its container by the laboratory. */
	rejectionCriterion?: CodeableConcept[]

	handling?: SpecimenDefinitionHandling[]
}

/** A kind of specimen with associated set of requirements. */

export interface SpecimenDefinitionContainer {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	material?: CodeableConcept

	type?: CodeableConcept

	cap?: CodeableConcept

	description?: string

	_description?: Element

	capacity?: Quantity

	minimumVolumeQuantity?: Quantity

	minimumVolumeString?: string

	_minimumVolumeString?: Element

	additive?: SpecimenDefinitionAdditive[]

	preparation?: string

	_preparation?: Element
}

/** A kind of specimen with associated set of requirements. */

export interface SpecimenDefinitionAdditive {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	additiveCodeableConcept?: CodeableConcept

	additiveReference?: Reference
}

/** A kind of specimen with associated set of requirements. */

export interface SpecimenDefinitionHandling {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	temperatureQualifier?: CodeableConcept

	temperatureRange?: Range

	maxDuration?: Duration

	instruction?: string

	_instruction?: Element
}
