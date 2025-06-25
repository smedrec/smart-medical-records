import type {
	CodeableConcept,
	Coding,
	ContactDetail,
	Element,
	Extension,
	Identifier,
	Meta,
	Reference,
	UsageContext,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScript<Contained = ResourceList> {
	resourceType: `TestScript`
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
	/** An absolute URI that is used to identify this test script when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this test script is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the test script is stored on different servers. */
	url: string

	_url?: Element
	/** A formal identifier that is used to identify this test script when it is represented in other formats, or referenced in a specification, model, design or an instance. */
	identifier?: Identifier
	/** The identifier that is used to identify this version of the test script when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the test script author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the test script. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name: string

	_name?: Element
	/** A short, descriptive, user-friendly title for the test script. */
	title?: string

	_title?: Element
	/** The status of this test script. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** A Boolean value to indicate that this test script is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
	experimental?: boolean

	_experimental?: Element
	/** The date  (and optionally time) when the test script was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the test script changes. */
	date?: string

	_date?: Element
	/** The name of the organization or individual that published the test script. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** A free text natural language description of the test script from a consumer's perspective. */
	description?: string

	_description?: Element
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate test script instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the test script is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** Explanation of why this test script is needed and why it has been designed as it has. */
	purpose?: string

	_purpose?: Element
	/** A copyright statement relating to the test script and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the test script. */
	copyright?: string

	_copyright?: Element

	origin?: TestScriptOrigin[]

	destination?: TestScriptDestination[]

	metadata?: TestScriptMetadata

	fixture?: TestScriptFixture[]
	/** Reference to the profile to be used for validation. */
	profile?: Reference[]

	variable?: TestScriptVariable[]

	setup?: TestScriptSetup

	test?: TestScriptTest[]

	teardown?: TestScriptTeardown
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptOrigin {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Abstract name given to an origin server in this test script.  The name is provided as a number starting at 1. */
	index: number

	_index?: Element
	/** The type of origin profile the test system supports. */
	profile: Coding
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptDestination {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Abstract name given to a destination server in this test script.  The name is provided as a number starting at 1. */
	index: number

	_index?: Element
	/** The type of destination profile the test system supports. */
	profile: Coding
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptMetadata {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	link?: TestScriptLink[]

	capability: TestScriptCapability[]
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptLink {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	url?: string

	_url?: Element

	description?: string

	_description?: Element
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptCapability {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	required?: boolean

	_required?: Element

	validated?: boolean

	_validated?: Element

	description?: string

	_description?: Element

	origin?: number[]

	_origin?: Element[]

	destination?: number

	_destination?: Element

	link?: string[]

	_link?: Element[]

	capabilities: string
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptFixture {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Whether or not to implicitly create the fixture during setup. If true, the fixture is automatically created on each server being tested during setup, therefore no create operation is required for this fixture in the TestScript.setup section. */
	autocreate: boolean

	_autocreate?: Element
	/** Whether or not to implicitly delete the fixture during teardown. If true, the fixture is automatically deleted on each server being tested during teardown, therefore no delete operation is required for this fixture in the TestScript.teardown section. */
	autodelete: boolean

	_autodelete?: Element
	/** Reference to the resource (containing the contents of the resource needed for operations). */
	resource?: Reference
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptVariable {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Descriptive name for this variable. */
	name: string

	_name?: Element
	/** A default, hard-coded, or user-defined value for this variable. */
	defaultValue?: string

	_defaultValue?: Element
	/** A free text natural language description of the variable and its purpose. */
	description?: string

	_description?: Element
	/** The FHIRPath expression to evaluate against the fixture body. When variables are defined, only one of either expression, headerField or path must be specified. */
	expression?: string

	_expression?: Element
	/** Will be used to grab the HTTP header field value from the headers that sourceId is pointing to. */
	headerField?: string

	_headerField?: Element
	/** Displayable text string with hint help information to the user when entering a default value. */
	hint?: string

	_hint?: Element
	/** XPath or JSONPath to evaluate against the fixture body.  When variables are defined, only one of either expression, headerField or path must be specified. */
	path?: string

	_path?: Element
	/** Fixture to evaluate the XPath/JSONPath expression or the headerField  against within this variable. */
	sourceId?: string

	_sourceId?: Element
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptSetup {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	action: TestScriptAction[]
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptAction {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	operation?: TestScriptOperation

	assert?: TestScriptAssert
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptOperation {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type?: Coding

	resource?: string

	_resource?: Element

	label?: string

	_label?: Element

	description?: string

	_description?: Element

	accept?: string

	_accept?: Element

	contentType?: string

	_contentType?: Element

	destination?: number

	_destination?: Element

	encodeRequestUrl?: boolean

	_encodeRequestUrl?: Element

	method?: 'delete' | 'get' | 'options' | 'patch' | 'post' | 'put' | 'head'

	_method?: Element

	origin?: number

	_origin?: Element

	params?: string

	_params?: Element

	requestHeader?: TestScriptRequestHeader[]

	requestId?: string

	_requestId?: Element

	responseId?: string

	_responseId?: Element

	sourceId?: string

	_sourceId?: Element

	targetId?: string

	_targetId?: Element

	url?: string

	_url?: Element
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptRequestHeader {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	field?: string

	_field?: Element

	value?: string

	_value?: Element
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptAssert {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	label?: string

	_label?: Element

	description?: string

	_description?: Element

	direction?: 'response' | 'request'

	_direction?: Element

	compareToSourceId?: string

	_compareToSourceId?: Element

	compareToSourceExpression?: string

	_compareToSourceExpression?: Element

	compareToSourcePath?: string

	_compareToSourcePath?: Element

	contentType?: string

	_contentType?: Element

	expression?: string

	_expression?: Element

	headerField?: string

	_headerField?: Element

	minimumId?: string

	_minimumId?: Element

	navigationLinks?: boolean

	_navigationLinks?: Element

	operator?:
		| 'equals'
		| 'notEquals'
		| 'in'
		| 'notIn'
		| 'greaterThan'
		| 'lessThan'
		| 'empty'
		| 'notEmpty'
		| 'contains'
		| 'notContains'
		| 'eval'

	_operator?: Element

	path?: string

	_path?: Element

	requestMethod?: 'delete' | 'get' | 'options' | 'patch' | 'post' | 'put' | 'head'

	_requestMethod?: Element

	requestURL?: string

	_requestURL?: Element

	resource?: string

	_resource?: Element

	response?:
		| 'okay'
		| 'created'
		| 'noContent'
		| 'notModified'
		| 'bad'
		| 'forbidden'
		| 'notFound'
		| 'methodNotAllowed'
		| 'conflict'
		| 'gone'
		| 'preconditionFailed'
		| 'unprocessable'

	_response?: Element

	responseCode?: string

	_responseCode?: Element

	sourceId?: string

	_sourceId?: Element

	validateProfileId?: string

	_validateProfileId?: Element

	value?: string

	_value?: Element

	warningOnly?: boolean

	_warningOnly?: Element
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptTest {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The name of this test used for tracking/logging purposes by test engines. */
	name?: string

	_name?: Element
	/** A short description of the test used by test engines for tracking and reporting purposes. */
	description?: string

	_description?: Element

	action: TestScriptAction1[]
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptAction1 {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	operation?: TestScriptOperation

	assert?: TestScriptAssert
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptTeardown {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	action: TestScriptAction2[]
}

/** A structured set of tests against a FHIR server or client implementation to determine compliance against the FHIR specification. */

export interface TestScriptAction2 {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	operation: TestScriptOperation
}
