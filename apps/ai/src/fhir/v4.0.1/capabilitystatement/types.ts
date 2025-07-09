import type {
	CodeableConcept,
	Coding,
	ContactDetail,
	Element,
	Extension,
	Meta,
	Reference,
	UsageContext,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatement<Contained = ResourceList> {
	resourceType: `CapabilityStatement`
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
	/** An absolute URI that is used to identify this capability statement when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this capability statement is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the capability statement is stored on different servers. */
	url?: string

	_url?: Element
	/** The identifier that is used to identify this version of the capability statement when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the capability statement author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the capability statement. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name?: string

	_name?: Element
	/** A short, descriptive, user-friendly title for the capability statement. */
	title?: string

	_title?: Element
	/** The status of this capability statement. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** A Boolean value to indicate that this capability statement is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
	experimental?: boolean

	_experimental?: Element
	/** The date  (and optionally time) when the capability statement was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the capability statement changes. */
	date: string

	_date?: Element
	/** The name of the organization or individual that published the capability statement. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** A free text natural language description of the capability statement from a consumer's perspective. Typically, this is used when the capability statement describes a desired rather than an actual solution, for example as a formal expression of requirements as part of an RFP. */
	description?: string

	_description?: Element
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate capability statement instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the capability statement is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** Explanation of why this capability statement is needed and why it has been designed as it has. */
	purpose?: string

	_purpose?: Element
	/** A copyright statement relating to the capability statement and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the capability statement. */
	copyright?: string

	_copyright?: Element
	/** The way that this statement is intended to be used, to describe an actual running instance of software, a particular product (kind, not instance of software) or a class of implementation (e.g. a desired purchase). */
	kind: 'instance' | 'capability' | 'requirements'

	_kind?: Element
	/** Reference to a canonical URL of another CapabilityStatement that this software implements. This capability statement is a published API description that corresponds to a business service. The server may actually implement a subset of the capability statement it claims to implement, so the capability statement must specify the full capability details. */
	instantiates?: string[]
	/** Reference to a canonical URL of another CapabilityStatement that this software adds to. The capability statement automatically includes everything in the other statement, and it is not duplicated, though the server may repeat the same resources, interactions and operations to add additional details to them. */
	imports?: string[]

	software?: CapabilityStatementSoftware

	implementation?: CapabilityStatementImplementation
	/** The version of the FHIR specification that this CapabilityStatement describes (which SHALL be the same as the FHIR version of the CapabilityStatement itself). There is no default value. */
	fhirVersion:
		| '0.01'
		| '0.05'
		| '0.06'
		| '0.11'
		| '0.0.80'
		| '0.0.81'
		| '0.0.82'
		| '0.4.0'
		| '0.5.0'
		| '1.0.0'
		| '1.0.1'
		| '1.0.2'
		| '1.1.0'
		| '1.4.0'
		| '1.6.0'
		| '1.8.0'
		| '3.0.0'
		| '3.0.1'
		| '3.3.0'
		| '3.5.0'
		| '4.0.0'
		| '4.0.1'

	_fhirVersion?: Element
	/** A list of the formats supported by this implementation using their content types. */
	format: string[]

	_format?: Element[]
	/** A list of the patch formats supported by this implementation using their content types. */
	patchFormat?: string[]

	_patchFormat?: Element[]
	/** A list of implementation guides that the server does (or should) support in their entirety. */
	implementationGuide?: string[]

	rest?: CapabilityStatementRest[]

	messaging?: CapabilityStatementMessaging[]

	document?: CapabilityStatementDocument[]
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementSoftware {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Name the software is known by. */
	name: string

	_name?: Element
	/** The version identifier for the software covered by this statement. */
	version?: string

	_version?: Element
	/** Date this version of the software was released. */
	releaseDate?: string

	_releaseDate?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementImplementation {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Information about the specific installation that this capability statement relates to. */
	description: string

	_description?: Element
	/** An absolute base URL for the implementation.  This forms the base for REST interfaces as well as the mailbox and document interfaces. */
	url?: string

	_url?: Element
	/** The organization responsible for the management of the instance and oversight of the data on the server at the specified URL. */
	custodian?: Reference
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementRest {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Identifies whether this portion of the statement is describing the ability to initiate or receive restful operations. */
	mode: 'client' | 'server'

	_mode?: Element
	/** Information about the system's restful capabilities that apply across all applications, such as security. */
	documentation?: string

	_documentation?: Element

	security?: CapabilityStatementSecurity

	resource?: CapabilityStatementResource[]

	interaction?: CapabilityStatementInteraction1[]

	searchParam?: CapabilityStatementSearchParam[]

	operation?: CapabilityStatementOperation[]
	/** An absolute URI which is a reference to the definition of a compartment that the system supports. The reference is to a CompartmentDefinition resource by its canonical URL . */
	compartment?: string[]
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementSecurity {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	cors?: boolean

	_cors?: Element

	service?: CodeableConcept[]

	description?: string

	_description?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementResource {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type?: string

	_type?: Element

	profile?: string

	supportedProfile?: string[]

	documentation?: string

	_documentation?: Element

	interaction?: CapabilityStatementInteraction[]

	versioning?: 'no-version' | 'versioned' | 'versioned-update'

	_versioning?: Element

	readHistory?: boolean

	_readHistory?: Element

	updateCreate?: boolean

	_updateCreate?: Element

	conditionalCreate?: boolean

	_conditionalCreate?: Element

	conditionalRead?: 'not-supported' | 'modified-since' | 'not-match' | 'full-support'

	_conditionalRead?: Element

	conditionalUpdate?: boolean

	_conditionalUpdate?: Element

	conditionalDelete?: 'not-supported' | 'single' | 'multiple'

	_conditionalDelete?: Element

	referencePolicy?: ('literal' | 'logical' | 'resolves' | 'enforced' | 'local')[]

	_referencePolicy?: Element[]

	searchInclude?: string[]

	_searchInclude?: Element[]

	searchRevInclude?: string[]

	_searchRevInclude?: Element[]

	searchParam?: CapabilityStatementSearchParam[]

	operation?: CapabilityStatementOperation[]
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementInteraction {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	code?:
		| 'read'
		| 'vread'
		| 'update'
		| 'patch'
		| 'delete'
		| 'history-instance'
		| 'history-type'
		| 'create'
		| 'search-type'

	_code?: Element

	documentation?: string

	_documentation?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementSearchParam {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	name?: string

	_name?: Element

	definition?: string

	type?:
		| 'number'
		| 'date'
		| 'string'
		| 'token'
		| 'reference'
		| 'composite'
		| 'quantity'
		| 'uri'
		| 'special'

	_type?: Element

	documentation?: string

	_documentation?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementOperation {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	name?: string

	_name?: Element

	definition: string

	documentation?: string

	_documentation?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementInteraction1 {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	code?: 'transaction' | 'batch' | 'search-system' | 'history-system'

	_code?: Element

	documentation?: string

	_documentation?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementMessaging {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	endpoint?: CapabilityStatementEndpoint[]
	/** Length if the receiver's reliable messaging cache in minutes (if a receiver) or how long the cache length on the receiver should be (if a sender). */
	reliableCache?: number

	_reliableCache?: Element
	/** Documentation about the system's messaging capabilities for this endpoint not otherwise documented by the capability statement.  For example, the process for becoming an authorized messaging exchange partner. */
	documentation?: string

	_documentation?: Element

	supportedMessage?: CapabilityStatementSupportedMessage[]
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementEndpoint {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	protocol: Coding

	address?: string

	_address?: Element
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementSupportedMessage {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	mode?: 'sender' | 'receiver'

	_mode?: Element

	definition: string
}

/** A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server for a particular version of FHIR that may be used as a statement of actual server functionality or a statement of required or desired server implementation. */

export interface CapabilityStatementDocument {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Mode of this document declaration - whether an application is a producer or consumer. */
	mode: 'producer' | 'consumer'

	_mode?: Element
	/** A description of how the application supports or uses the specified document profile.  For example, when documents are created, what action is taken with consumed documents, etc. */
	documentation?: string

	_documentation?: Element
	/** A profile on the document Bundle that constrains which resources are present, and their contents. */
	profile: string
}
