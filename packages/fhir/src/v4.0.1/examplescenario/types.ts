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

/** Example of workflow instance. */

export interface ExampleScenario<Contained = ResourceList> {
	resourceType: `ExampleScenario`
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
	/** An absolute URI that is used to identify this example scenario when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this example scenario is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the example scenario is stored on different servers. */
	url?: string

	_url?: Element
	/** A formal identifier that is used to identify this example scenario when it is represented in other formats, or referenced in a specification, model, design or an instance. */
	identifier?: Identifier[]
	/** The identifier that is used to identify this version of the example scenario when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the example scenario author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the example scenario. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name?: string

	_name?: Element
	/** The status of this example scenario. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** A Boolean value to indicate that this example scenario is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
	experimental?: boolean

	_experimental?: Element
	/** The date  (and optionally time) when the example scenario was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the example scenario changes. (e.g. the 'content logical definition'). */
	date?: string

	_date?: Element
	/** The name of the organization or individual that published the example scenario. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate example scenario instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the example scenario is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** A copyright statement relating to the example scenario and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the example scenario. */
	copyright?: string

	_copyright?: Element
	/** What the example scenario resource is created for. This should not be used to show the business purpose of the scenario itself, but the purpose of documenting a scenario. */
	purpose?: string

	_purpose?: Element

	actor?: ExampleScenarioActor[]

	instance?: ExampleScenarioInstance[]

	process?: ExampleScenarioProcess[]
	/** Another nested workflow. */
	workflow?: string[]
}

/** Example of workflow instance. */

export interface ExampleScenarioActor {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** ID or acronym of actor. */
	actorId: string

	_actorId?: Element
	/** The type of actor - person or system. */
	type: 'person' | 'entity'

	_type?: Element
	/** The name of the actor as shown in the page. */
	name?: string

	_name?: Element
	/** The description of the actor. */
	description?: string

	_description?: Element
}

/** Example of workflow instance. */

export interface ExampleScenarioInstance {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The id of the resource for referencing. */
	resourceId: string

	_resourceId?: Element
	resourceType: string

	_resourceType?: Element
	/** A short name for the resource instance. */
	name?: string

	_name?: Element
	/** Human-friendly description of the resource instance. */
	description?: string

	_description?: Element

	version?: ExampleScenarioVersion[]

	containedInstance?: ExampleScenarioContainedInstance[]
}

/** Example of workflow instance. */

export interface ExampleScenarioVersion {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	versionId?: string

	_versionId?: Element

	description?: string

	_description?: Element
}

/** Example of workflow instance. */

export interface ExampleScenarioContainedInstance {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	resourceId?: string

	_resourceId?: Element

	versionId?: string

	_versionId?: Element
}

/** Example of workflow instance. */

export interface ExampleScenarioProcess {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The diagram title of the group of operations. */
	title: string

	_title?: Element
	/** A longer description of the group of operations. */
	description?: string

	_description?: Element
	/** Description of initial status before the process starts. */
	preConditions?: string

	_preConditions?: Element
	/** Description of final status after the process ends. */
	postConditions?: string

	_postConditions?: Element

	step?: ExampleScenarioStep[]
}

/** Example of workflow instance. */

export interface ExampleScenarioStep {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	process?: ExampleScenarioProcess[]

	pause?: boolean

	_pause?: Element

	operation?: ExampleScenarioOperation

	alternative?: ExampleScenarioAlternative[]
}

/** Example of workflow instance. */

export interface ExampleScenarioOperation {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	number?: string

	_number?: Element

	type?: string

	_type?: Element

	name?: string

	_name?: Element

	initiator?: string

	_initiator?: Element

	receiver?: string

	_receiver?: Element

	description?: string

	_description?: Element

	initiatorActive?: boolean

	_initiatorActive?: Element

	receiverActive?: boolean

	_receiverActive?: Element

	request?: ExampleScenarioContainedInstance

	response?: ExampleScenarioContainedInstance
}

/** Example of workflow instance. */

export interface ExampleScenarioAlternative {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	title?: string

	_title?: Element

	description?: string

	_description?: Element

	step?: ExampleScenarioStep[]
}
