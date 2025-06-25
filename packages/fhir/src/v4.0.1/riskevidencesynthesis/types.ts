import type {
	Annotation,
	CodeableConcept,
	ContactDetail,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Reference,
	RelatedArtifact,
	UsageContext,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesis<Contained = ResourceList> {
	resourceType: `RiskEvidenceSynthesis`
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
	/** An absolute URI that is used to identify this risk evidence synthesis when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this risk evidence synthesis is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the risk evidence synthesis is stored on different servers. */
	url?: string

	_url?: Element
	/** A formal identifier that is used to identify this risk evidence synthesis when it is represented in other formats, or referenced in a specification, model, design or an instance. */
	identifier?: Identifier[]
	/** The identifier that is used to identify this version of the risk evidence synthesis when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the risk evidence synthesis author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
	version?: string

	_version?: Element
	/** A natural language name identifying the risk evidence synthesis. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
	name?: string

	_name?: Element
	/** A short, descriptive, user-friendly title for the risk evidence synthesis. */
	title?: string

	_title?: Element
	/** The status of this risk evidence synthesis. Enables tracking the life-cycle of the content. */
	status: 'draft' | 'active' | 'retired' | 'unknown'

	_status?: Element
	/** The date  (and optionally time) when the risk evidence synthesis was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the risk evidence synthesis changes. */
	date?: string

	_date?: Element
	/** The name of the organization or individual that published the risk evidence synthesis. */
	publisher?: string

	_publisher?: Element
	/** Contact details to assist a user in finding and communicating with the publisher. */
	contact?: ContactDetail[]
	/** A free text natural language description of the risk evidence synthesis from a consumer's perspective. */
	description?: string

	_description?: Element
	/** A human-readable string to clarify or explain concepts about the resource. */
	note?: Annotation[]
	/** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate risk evidence synthesis instances. */
	useContext?: UsageContext[]
	/** A legal or geographic region in which the risk evidence synthesis is intended to be used. */
	jurisdiction?: CodeableConcept[]
	/** A copyright statement relating to the risk evidence synthesis and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the risk evidence synthesis. */
	copyright?: string

	_copyright?: Element
	/** The date on which the resource content was approved by the publisher. Approval happens once when the content is officially approved for usage. */
	approvalDate?: string

	_approvalDate?: Element
	/** The date on which the resource content was last reviewed. Review happens periodically after approval but does not change the original approval date. */
	lastReviewDate?: string

	_lastReviewDate?: Element
	/** The period during which the risk evidence synthesis content was or is planned to be in active use. */
	effectivePeriod?: Period
	/** Descriptive topics related to the content of the RiskEvidenceSynthesis. Topics provide a high-level categorization grouping types of EffectEvidenceSynthesiss that can be useful for filtering and searching. */
	topic?: CodeableConcept[]
	/** An individiual or organization primarily involved in the creation and maintenance of the content. */
	author?: ContactDetail[]
	/** An individual or organization primarily responsible for internal coherence of the content. */
	editor?: ContactDetail[]
	/** An individual or organization primarily responsible for review of some aspect of the content. */
	reviewer?: ContactDetail[]
	/** An individual or organization responsible for officially endorsing the content for use in some setting. */
	endorser?: ContactDetail[]
	/** Related artifacts such as additional documentation, justification, or bibliographic references. */
	relatedArtifact?: RelatedArtifact[]
	/** Type of synthesis eg meta-analysis. */
	synthesisType?: CodeableConcept
	/** Type of study eg randomized trial. */
	studyType?: CodeableConcept
	/** A reference to a EvidenceVariable resource that defines the population for the research. */
	population: Reference
	/** A reference to a EvidenceVariable resource that defines the exposure for the research. */
	exposure?: Reference
	/** A reference to a EvidenceVariable resomece that defines the outcome for the research. */
	outcome: Reference

	sampleSize?: RiskEvidenceSynthesisSampleSize

	riskEstimate?: RiskEvidenceSynthesisRiskEstimate

	certainty?: RiskEvidenceSynthesisCertainty[]
}

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesisSampleSize {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Human-readable summary of sample size. */
	description?: string

	_description?: Element
	/** Number of studies included in this evidence synthesis. */
	numberOfStudies?: number

	_numberOfStudies?: Element
	/** Number of participants included in this evidence synthesis. */
	numberOfParticipants?: number

	_numberOfParticipants?: Element
}

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesisRiskEstimate {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Human-readable summary of risk estimate. */
	description?: string

	_description?: Element
	/** Examples include proportion and mean. */
	type?: CodeableConcept
	/** The point estimate of the risk estimate. */
	value?: number

	_value?: Element
	/** Specifies the UCUM unit for the outcome. */
	unitOfMeasure?: CodeableConcept
	/** The sample size for the group that was measured for this risk estimate. */
	denominatorCount?: number

	_denominatorCount?: Element
	/** The number of group members with the outcome of interest. */
	numeratorCount?: number

	_numeratorCount?: Element

	precisionEstimate?: RiskEvidenceSynthesisPrecisionEstimate[]
}

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesisPrecisionEstimate {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type?: CodeableConcept

	level?: number

	_level?: Element

	from?: number

	_from?: Element

	to?: number

	_to?: Element
}

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesisCertainty {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A rating of the certainty of the effect estimate. */
	rating?: CodeableConcept[]
	/** A human-readable string to clarify or explain concepts about the resource. */
	note?: Annotation[]

	certaintySubcomponent?: RiskEvidenceSynthesisCertaintySubcomponent[]
}

/** The RiskEvidenceSynthesis resource describes the likelihood of an outcome in a population plus exposure state where the risk estimate is derived from a combination of research studies. */

export interface RiskEvidenceSynthesisCertaintySubcomponent {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type?: CodeableConcept

	rating?: CodeableConcept[]

	note?: Annotation[]
}
