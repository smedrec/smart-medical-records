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

/** A collection of documents compiled for a purpose together with metadata that applies to the collection. */

export interface DocumentManifest<Contained = ResourceList> {
	resourceType: `DocumentManifest`
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
	/** A single identifier that uniquely identifies this manifest. Principally used to refer to the manifest in non-FHIR contexts. */
	masterIdentifier?: Identifier
	/** Other identifiers associated with the document manifest, including version independent  identifiers. */
	identifier?: Identifier[]
	/** The status of this document manifest. */
	status: 'current' | 'superseded' | 'entered-in-error'

	_status?: Element
	/** The code specifying the type of clinical activity that resulted in placing the associated content into the DocumentManifest. */
	type?: CodeableConcept
	/** Who or what the set of documents is about. The documents can be about a person, (patient or healthcare practitioner), a device (i.e. machine) or even a group of subjects (such as a document about a herd of farm animals, or a set of patients that share a common exposure). If the documents cross more than one subject, then more than one subject is allowed here (unusual use case). */
	subject?: Reference
	/** When the document manifest was created for submission to the server (not necessarily the same thing as the actual resource last modified time, since it may be modified, replicated, etc.). */
	created?: string

	_created?: Element
	/** Identifies who is the author of the manifest. Manifest author is not necessarly the author of the references included. */
	author?: Reference[]
	/** A patient, practitioner, or organization for which this set of documents is intended. */
	recipient?: Reference[]
	/** Identifies the source system, application, or software that produced the document manifest. */
	source?: string

	_source?: Element
	/** Human-readable description of the source document. This is sometimes known as the "title". */
	description?: string

	_description?: Element
	/** The list of Resources that consist of the parts of this manifest. */
	content: Reference[]

	related?: DocumentManifestRelated[]
}

/** A collection of documents compiled for a purpose together with metadata that applies to the collection. */

export interface DocumentManifestRelated {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Related identifier to this DocumentManifest.  For example, Order numbers, accession numbers, XDW workflow numbers. */
	identifier?: Identifier
	/** Related Resource to this DocumentManifest. For example, Order, ServiceRequest,  Procedure, EligibilityRequest, etc. */
	ref?: Reference
}
