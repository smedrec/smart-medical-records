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
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** This resource is a non-persisted resource used to pass information into and back from an [operation](operations.html). It has no other use, and there is no RESTful endpoint associated with it. */

export interface Parameters {
	resourceType: `Parameters`
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

	parameter?: ParametersParameter[]
}

/** This resource is a non-persisted resource used to pass information into and back from an [operation](operations.html). It has no other use, and there is no RESTful endpoint associated with it. */

export interface ParametersParameter {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The name of the parameter (reference to the operation definition). */
	name: string

	_name?: Element

	valueBase64Binary?: string

	_valueBase64Binary?: Element

	valueBoolean?: boolean

	_valueBoolean?: Element

	valueCanonical?: string

	_valueCanonical?: Element

	valueCode?: string

	_valueCode?: Element

	valueDate?: string

	_valueDate?: Element

	valueDateTime?: string

	_valueDateTime?: Element

	valueDecimal?: number

	_valueDecimal?: Element

	valueId?: string

	_valueId?: Element

	valueInstant?: string

	_valueInstant?: Element

	valueInteger?: number

	_valueInteger?: Element

	valueMarkdown?: string

	_valueMarkdown?: Element

	valueOid?: string

	_valueOid?: Element

	valuePositiveInt?: number

	_valuePositiveInt?: Element

	valueString?: string

	_valueString?: Element

	valueTime?: string

	_valueTime?: Element

	valueUnsignedInt?: number

	_valueUnsignedInt?: Element

	valueUri?: string

	_valueUri?: Element

	valueUrl?: string

	_valueUrl?: Element

	valueUuid?: string

	_valueUuid?: Element

	valueAddress?: Address

	valueAge?: Age

	valueAnnotation?: Annotation

	valueAttachment?: Attachment

	valueCodeableConcept?: CodeableConcept

	valueCoding?: Coding

	valueContactPoint?: ContactPoint

	valueCount?: Count

	valueDistance?: Distance

	valueDuration?: Duration

	valueHumanName?: HumanName

	valueIdentifier?: Identifier

	valueMoney?: Money

	valuePeriod?: Period

	valueQuantity?: Quantity

	valueRange?: Range

	valueRatio?: Ratio

	valueReference?: Reference

	valueSampledData?: SampledData

	valueSignature?: Signature

	valueTiming?: Timing

	valueContactDetail?: ContactDetail

	valueContributor?: Contributor

	valueDataRequirement?: DataRequirement

	valueExpression?: Expression

	valueParameterDefinition?: ParameterDefinition

	valueRelatedArtifact?: RelatedArtifact

	valueTriggerDefinition?: TriggerDefinition

	valueUsageContext?: UsageContext

	valueDosage?: Dosage

	valueMeta?: Meta
	/** If the parameter is a whole resource. */
	resource?: ResourceList

	part?: ParametersParameter[]
}
