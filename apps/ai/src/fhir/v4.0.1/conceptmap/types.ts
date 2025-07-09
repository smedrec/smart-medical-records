import type {
	CodeableConcept,
	ContactDetail,
	Element,
	Extension,
	Identifier,
	Meta,
	UsageContext,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMap<Contained = ResourceList> {
	resourceType: `ConceptMap`
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
	/** An absolute URI that is used to identify this concept map when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this concept map is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the concept map is stored on different servers. */
	url?: string

	_url?: Element
	/** A formal identifier that is used to identify this concept map when it is represented in other formats, or referenced in a specification, model, design or an instance. */
	identifier?: Identifier
	/** The identifier that is used to identify this version of the concept map when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the concept map author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the concept map. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name?: string

	_name?: Element
	/** A short, descriptive, user-friendly title for the concept map. */
	title?: string

	_title?: Element
	/** The status of this concept map. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** A Boolean value to indicate that this concept map is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
	experimental?: boolean

	_experimental?: Element
	/** The date  (and optionally time) when the concept map was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the concept map changes. */
	date?: string

	_date?: Element
	/** The name of the organization or individual that published the concept map. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** A free text natural language description of the concept map from a consumer's perspective. */
	description?: string

	_description?: Element
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate concept map instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the concept map is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** Explanation of why this concept map is needed and why it has been designed as it has. */
	purpose?: string

	_purpose?: Element
	/** A copyright statement relating to the concept map and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the concept map. */
	copyright?: string

	_copyright?: Element

	sourceUri?: string

	_sourceUri?: Element

	sourceCanonical?: string

	_sourceCanonical?: Element

	targetUri?: string

	_targetUri?: Element

	targetCanonical?: string

	_targetCanonical?: Element

	group?: ConceptMapGroup[]
}

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMapGroup {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** An absolute URI that identifies the source system where the concepts to be mapped are defined. */
	source?: string

	_source?: Element
	/** The specific version of the code system, as determined by the code system authority. */
	sourceVersion?: string

	_sourceVersion?: Element
	/** An absolute URI that identifies the target system that the concepts will be mapped to. */
	target?: string

	_target?: Element
	/** The specific version of the code system, as determined by the code system authority. */
	targetVersion?: string

	_targetVersion?: Element

	element: ConceptMapElement[]

	unmapped?: ConceptMapUnmapped
}

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMapElement {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	code?: string

	_code?: Element

	display?: string

	_display?: Element

	target?: ConceptMapTarget[]
}

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMapTarget {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	code?: string

	_code?: Element

	display?: string

	_display?: Element

	equivalence?:
		| 'relatedto'
		| 'equivalent'
		| 'equal'
		| 'wider'
		| 'subsumes'
		| 'narrower'
		| 'specializes'
		| 'inexact'
		| 'unmatched'
		| 'disjoint'

	_equivalence?: Element

	comment?: string

	_comment?: Element

	dependsOn?: ConceptMapDependsOn[]

	product?: ConceptMapDependsOn[]
}

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMapDependsOn {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	property?: string

	_property?: Element

	system?: string

	value?: string

	_value?: Element

	display?: string

	_display?: Element
}

/** A statement of relationships from one set of concepts to one or more other concepts - either concepts in code systems, or data element/data element concepts, or classes in class models. */

export interface ConceptMapUnmapped {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	mode?: 'provided' | 'fixed' | 'other-map'

	_mode?: Element

	code?: string

	_code?: Element

	display?: string

	_display?: Element

	url?: string
}
