import type {
	Address,
	Age,
	Annotation,
	Attachment,
	CodeableConcept,
	Coding,
	ContactDetail,
	ContactPoint,
	Contributor,
	Count,
	DataRequirement,
	Distance,
	Dosage,
	Duration,
	Element,
	Expression,
	Extension,
	HumanName,
	Identifier,
	Meta,
	Money,
	ParameterDefinition,
	Period,
	Quantity,
	Range,
	Ratio,
	Reference,
	RelatedArtifact,
	SampledData,
	Signature,
	Timing,
	TriggerDefinition,
	UsageContext,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMap<Contained = ResourceList> {
	resourceType: `StructureMap`
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
	/** An absolute URI that is used to identify this structure map when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this structure map is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the structure map is stored on different servers. */
	url: string

	_url?: Element
	/** A formal identifier that is used to identify this structure map when it is represented in other formats, or referenced in a specification, model, design or an instance. */
	identifier?: Identifier[]
	/** The identifier that is used to identify this version of the structure map when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the structure map author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the structure map. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name: string

	_name?: Element
	/** A short, descriptive, user-friendly title for the structure map. */
	title?: string

	_title?: Element
	/** The status of this structure map. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** A Boolean value to indicate that this structure map is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
	experimental?: boolean

	_experimental?: Element
	/** The date  (and optionally time) when the structure map was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the structure map changes. */
	date?: string

	_date?: Element
	/** The name of the organization or individual that published the structure map. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** A free text natural language description of the structure map from a consumer's perspective. */
	description?: string

	_description?: Element
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate structure map instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the structure map is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** Explanation of why this structure map is needed and why it has been designed as it has. */
	purpose?: string

	_purpose?: Element
	/** A copyright statement relating to the structure map and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the structure map. */
	copyright?: string

	_copyright?: Element

	structure?: StructureMapStructure[]
	/** Other maps used by this map (canonical URLs). */
	import?: string[]

	group: StructureMapGroup[]
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapStructure {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The canonical reference to the structure. */
	url: string
	/** How the referenced structure is used in this mapping. */
	mode: 'source' | 'queried' | 'target' | 'produced'

	_mode?: Element
	/** The name used for this type in the map. */
	alias?: string

	_alias?: Element
	/** Documentation that describes how the structure is used in the mapping. */
	documentation?: string

	_documentation?: Element
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapGroup {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A unique name for the group for the convenience of human readers. */
	name: string

	_name?: Element
	/** Another group that this group adds rules to. */
	extends?: string

	_extends?: Element
	/** If this is the default rule set to apply for the source type or this combination of types. */
	typeMode: 'none' | 'types' | 'type-and-types'

	_typeMode?: Element
	/** Additional supporting documentation that explains the purpose of the group and the types of mappings within it. */
	documentation?: string

	_documentation?: Element

	input: StructureMapInput[]

	rule: StructureMapRule[]
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapInput {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	name?: string

	_name?: Element

	type?: string

	_type?: Element

	mode?: 'source' | 'target'

	_mode?: Element

	documentation?: string

	_documentation?: Element
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapRule {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	name?: string

	_name?: Element

	source: StructureMapSource[]

	target?: StructureMapTarget[]

	rule?: StructureMapRule[]

	dependent?: StructureMapDependent[]

	documentation?: string

	_documentation?: Element
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapSource {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	context?: string

	_context?: Element

	min?: number

	_min?: Element

	max?: string

	_max?: Element

	type?: string

	_type?: Element

	defaultValueBase64Binary?: string

	_defaultValueBase64Binary?: Element

	defaultValueBoolean?: boolean

	_defaultValueBoolean?: Element

	defaultValueCanonical?: string

	_defaultValueCanonical?: Element

	defaultValueCode?: string

	_defaultValueCode?: Element

	defaultValueDate?: string

	_defaultValueDate?: Element

	defaultValueDateTime?: string

	_defaultValueDateTime?: Element

	defaultValueDecimal?: number

	_defaultValueDecimal?: Element

	defaultValueId?: string

	_defaultValueId?: Element

	defaultValueInstant?: string

	_defaultValueInstant?: Element

	defaultValueInteger?: number

	_defaultValueInteger?: Element

	defaultValueMarkdown?: string

	_defaultValueMarkdown?: Element

	defaultValueOid?: string

	_defaultValueOid?: Element

	defaultValuePositiveInt?: number

	_defaultValuePositiveInt?: Element

	defaultValueString?: string

	_defaultValueString?: Element

	defaultValueTime?: string

	_defaultValueTime?: Element

	defaultValueUnsignedInt?: number

	_defaultValueUnsignedInt?: Element

	defaultValueUri?: string

	_defaultValueUri?: Element

	defaultValueUrl?: string

	_defaultValueUrl?: Element

	defaultValueUuid?: string

	_defaultValueUuid?: Element

	defaultValueAddress?: Address

	defaultValueAge?: Age

	defaultValueAnnotation?: Annotation

	defaultValueAttachment?: Attachment

	defaultValueCodeableConcept?: CodeableConcept

	defaultValueCoding?: Coding

	defaultValueContactPoint?: ContactPoint

	defaultValueCount?: Count

	defaultValueDistance?: Distance

	defaultValueDuration?: Duration

	defaultValueHumanName?: HumanName

	defaultValueIdentifier?: Identifier

	defaultValueMoney?: Money

	defaultValuePeriod?: Period

	defaultValueQuantity?: Quantity

	defaultValueRange?: Range

	defaultValueRatio?: Ratio

	defaultValueReference?: Reference

	defaultValueSampledData?: SampledData

	defaultValueSignature?: Signature

	defaultValueTiming?: Timing

	defaultValueContactDetail?: ContactDetail

	defaultValueContributor?: Contributor

	defaultValueDataRequirement?: DataRequirement

	defaultValueExpression?: Expression

	defaultValueParameterDefinition?: ParameterDefinition

	defaultValueRelatedArtifact?: RelatedArtifact

	defaultValueTriggerDefinition?: TriggerDefinition

	defaultValueUsageContext?: UsageContext

	defaultValueDosage?: Dosage

	defaultValueMeta?: Meta

	element?: string

	_element?: Element

	listMode?: 'first' | 'not_first' | 'last' | 'not_last' | 'only_one'

	_listMode?: Element

	variable?: string

	_variable?: Element

	condition?: string

	_condition?: Element

	check?: string

	_check?: Element

	logMessage?: string

	_logMessage?: Element
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapTarget {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	context?: string

	_context?: Element

	contextType?: 'type' | 'variable'

	_contextType?: Element

	element?: string

	_element?: Element

	variable?: string

	_variable?: Element

	listMode?: ('first' | 'share' | 'last' | 'collate')[]

	_listMode?: Element[]

	listRuleId?: string

	_listRuleId?: Element

	transform?:
		| 'create'
		| 'copy'
		| 'truncate'
		| 'escape'
		| 'cast'
		| 'append'
		| 'translate'
		| 'reference'
		| 'dateOp'
		| 'uuid'
		| 'pointer'
		| 'evaluate'
		| 'cc'
		| 'c'
		| 'qty'
		| 'id'
		| 'cp'

	_transform?: Element

	parameter?: StructureMapParameter[]
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapParameter {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	valueId?: string

	_valueId?: Element

	valueString?: string

	_valueString?: Element

	valueBoolean?: boolean

	_valueBoolean?: Element

	valueInteger?: number

	_valueInteger?: Element

	valueDecimal?: number

	_valueDecimal?: Element
}

/** A Map of relationships between 2 structures that can be used to transform data. */

export interface StructureMapDependent {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	name?: string

	_name?: Element

	variable?: string[]

	_variable?: Element[]
}
