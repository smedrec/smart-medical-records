/* Generated from FHIR JSON Schema */

/** Base definition for all elements in a resource. */

export interface Element {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
}

/** Optional Extension Element - found in all resources. */

export interface Extension {
	id?: string

	extension?: Extension[]
	/** Source of the definition for the extension code - a logical name or a URL. */
	url: string

	_url?: Element

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
}

/** A  text note which also  contains information about who made the statement and when. */

export interface Annotation {
	id?: string

	extension?: Extension[]

	authorReference?: Reference

	authorString?: string

	_authorString?: Element
	/** Indicates when this particular annotation was made. */
	time?: string

	_time?: Element
	/** The text of the annotation in markdown format. */
	text: string

	_text?: Element
}

/** For referring to data content defined in other formats. */

export interface Attachment {
	id?: string

	extension?: Extension[]
	/** Identifies the type of the data in the attachment and allows a method to be chosen to interpret or render the data. Includes mime type parameters such as charset where appropriate. */
	contentType?: string

	_contentType?: Element
	/** The human language of the content. The value can be any valid value according to BCP 47. */
	language?: string

	_language?: Element
	/** The actual data of the attachment - a sequence of bytes, base64 encoded. */
	data?: string

	_data?: Element
	/** A location where the data can be accessed. */
	url?: string

	_url?: Element
	/** The number of bytes of data that make up this attachment (before base64 encoding, if that is done). */
	size?: number

	_size?: Element
	/** The calculated hash of the data using SHA-1. Represented using base64. */
	hash?: string

	_hash?: Element
	/** A label or set of text to display in place of the data. */
	title?: string

	_title?: Element
	/** The date that the attachment was first created. */
	creation?: string

	_creation?: Element
}

/** An identifier - identifies some entity uniquely and unambiguously. Typically this is used for business identifiers. */

export interface Identifier {
	id?: string

	extension?: Extension[]
	/** The purpose of this identifier. */
	use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old'

	_use?: Element
	/** A coded type for the identifier that can be used to determine which identifier to use for a specific purpose. */
	type?: CodeableConcept
	/** Establishes the namespace for the value - that is, a URL that describes a set values that are unique. */
	system?: string

	_system?: Element
	/** The portion of the identifier typically relevant to the user and which is unique within the context of the system. */
	value?: string

	_value?: Element
	/** Time period during which identifier is/was valid for use. */
	period?: Period
	/** Organization that issued/manages the identifier. */
	assigner?: Reference
}

/** A concept that may be defined by a formal reference to a terminology or ontology or may be provided by text. */

export interface CodeableConcept {
	id?: string

	extension?: Extension[]
	/** A reference to a code defined by a terminology system. */
	coding?: Coding[]
	/** A human language representation of the concept as seen/selected/uttered by the user who entered the data and/or which represents the intended meaning of the user. */
	text?: string

	_text?: Element
}

/** A reference to a code defined by a terminology system. */

export interface Coding {
	id?: string

	extension?: Extension[]
	/** The identification of the code system that defines the meaning of the symbol in the code. */
	system?: string

	_system?: Element
	/** The version of the code system which was used when choosing this code. Note that a well-maintained code system does not need the version reported, because the meaning of codes is consistent across versions. However this cannot consistently be assured, and when the meaning is not guaranteed to be consistent, the version SHOULD be exchanged. */
	version?: string

	_version?: Element
	/** A symbol in syntax defined by the system. The symbol may be a predefined code or an expression in a syntax defined by the coding system (e.g. post-coordination). */
	code?: string

	_code?: Element
	/** A representation of the meaning of the code in the system, following the rules of the system. */
	display?: string

	_display?: Element
	/** Indicates that this coding was chosen by a user directly - e.g. off a pick list of available items (codes or displays). */
	userSelected?: boolean

	_userSelected?: Element
}

/** A measured amount (or an amount that can potentially be measured). Note that measured amounts include amounts that are not precisely quantified, including amounts involving arbitrary units and floating currencies. */

export interface Quantity {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** The value of the measured amount. The value includes an implicit precision in the presentation of the value. */
	value?: number

	_value?: Element
	/** Not allowed to be used in this context */
	comparator?: '<' | '<=' | '>=' | '>'

	_comparator?: Element
	/** A human-readable form of the unit. */
	unit?: string

	_unit?: Element
	/** The identification of the system that provides the coded form of the unit. */
	system?: string

	_system?: Element
	/** A computer processable form of the unit in some unit representation system. */
	code?: string

	_code?: Element
}

/** A length of time. */

export interface Duration {
	id?: string

	extension?: Extension[]

	value?: number

	_value?: Element

	comparator?: '<' | '<=' | '>=' | '>'

	_comparator?: Element

	unit?: string

	_unit?: Element

	system?: string

	_system?: Element

	code?: string

	_code?: Element
}

/** A length - a value with a unit that is a physical distance. */

export interface Distance {
	id?: string

	extension?: Extension[]

	value?: number

	_value?: Element

	comparator?: '<' | '<=' | '>=' | '>'

	_comparator?: Element

	unit?: string

	_unit?: Element

	system?: string

	_system?: Element

	code?: string

	_code?: Element
}

/** A measured amount (or an amount that can potentially be measured). Note that measured amounts include amounts that are not precisely quantified, including amounts involving arbitrary units and floating currencies. */

export interface Count {
	id?: string

	extension?: Extension[]

	value?: number

	_value?: Element

	comparator?: '<' | '<=' | '>=' | '>'

	_comparator?: Element

	unit?: string

	_unit?: Element

	system?: string

	_system?: Element

	code?: string

	_code?: Element
}

/** An amount of economic utility in some recognized currency. */

export interface Money {
	id?: string

	extension?: Extension[]
	/** Numerical value (with implicit precision). */
	value?: number

	_value?: Element
	/** ISO 4217 Currency Code. */
	currency?: string

	_currency?: Element
}

/** A duration of time during which an organism (or a process) has existed. */

export interface Age {
	id?: string

	extension?: Extension[]

	value?: number

	_value?: Element

	comparator?: '<' | '<=' | '>=' | '>'

	_comparator?: Element

	unit?: string

	_unit?: Element

	system?: string

	_system?: Element

	code?: string

	_code?: Element
}

/** A set of ordered Quantities defined by a low and high limit. */

export interface Range {
	id?: string

	extension?: Extension[]
	/** The low limit. The boundary is inclusive. */
	low?: Quantity
	/** The high limit. The boundary is inclusive. */
	high?: Quantity
}

/** A time period defined by a start and end date and optionally time. */

export interface Period {
	id?: string

	extension?: Extension[]
	/** The start of the period. The boundary is inclusive. */
	start?: string

	_start?: Element
	/** The end of the period. If the end of the period is missing, it means no end was known or planned at the time the instance was created. The start may be in the past, and the end date in the future, which means that period is expected/planned to end at that time. */
	end?: string

	_end?: Element
}

/** A relationship of two Quantity values - expressed as a numerator and a denominator. */

export interface Ratio {
	id?: string

	extension?: Extension[]
	/** The value of the numerator. */
	numerator?: Quantity
	/** The value of the denominator. */
	denominator?: Quantity
}

/** A reference from one resource to another. */

export interface Reference {
	id?: string

	extension?: Extension[]
	/** A reference to a location at which the other resource is found. The reference may be a relative reference, in which case it is relative to the service base URL, or an absolute URL that resolves to the location where the resource is found. The reference may be version specific or not. If the reference is not to a FHIR RESTful server, then it should be assumed to be version specific. Internal fragment references (start with '#') refer to contained resources. */
	reference?: string

	_reference?: Element
	/** The expected type of the target of the reference. If both Reference.type and Reference.reference are populated and Reference.reference is a FHIR URL, both SHALL be consistent.

The type is the Canonical URL of Resource Definition that is the type this reference refers to. References are URLs that are relative to http://hl7.org/fhir/StructureDefinition/ e.g. "Patient" is a reference to http://hl7.org/fhir/StructureDefinition/Patient. Absolute URLs are only allowed for logical models (and can only be used in references in logical models, not resources). */
	type?: string

	_type?: Element
	/** An identifier for the target resource. This is used when there is no way to reference the other resource directly, either because the entity it represents is not available through a FHIR server, or because there is no way for the author of the resource to convert a known identifier to an actual location. There is no requirement that a Reference.identifier point to something that is actually exposed as a FHIR instance, but it SHALL point to a business concept that would be expected to be exposed as a FHIR instance, and that instance would need to be of a FHIR resource type allowed by the reference. */
	identifier?: Identifier
	/** Plain text narrative that identifies the resource in addition to the resource reference. */
	display?: string

	_display?: Element
}

/** A series of measurements taken by a device, with upper and lower limits. There may be more than one dimension in the data. */

export interface SampledData {
	id?: string

	extension?: Extension[]
	/** The base quantity that a measured value of zero represents. In addition, this provides the units of the entire measurement series. */
	origin: Quantity
	/** The length of time between sampling times, measured in milliseconds. */
	period: number

	_period?: Element
	/** A correction factor that is applied to the sampled data points before they are added to the origin. */
	factor?: number

	_factor?: Element
	/** The lower limit of detection of the measured points. This is needed if any of the data points have the value "L" (lower than detection limit). */
	lowerLimit?: number

	_lowerLimit?: Element
	/** The upper limit of detection of the measured points. This is needed if any of the data points have the value "U" (higher than detection limit). */
	upperLimit?: number

	_upperLimit?: Element
	/** The number of sample points at each time point. If this value is greater than one, then the dimensions will be interlaced - all the sample points for a point in time will be recorded at once. */
	dimensions: number

	_dimensions?: Element
	/** A series of data points which are decimal values separated by a single space (character u20). The special values "E" (error), "L" (below detection limit) and "U" (above detection limit) can also be used in place of a decimal value. */
	data?: string

	_data?: Element
}

/** A signature along with supporting context. The signature may be a digital signature that is cryptographic in nature, or some other signature acceptable to the domain. This other signature may be as simple as a graphical image representing a hand-written signature, or a signature ceremony Different signature approaches have different utilities. */

export interface Signature {
	id?: string

	extension?: Extension[]
	/** An indication of the reason that the entity signed this document. This may be explicitly included as part of the signature information and can be used when determining accountability for various actions concerning the document. */
	type: Coding[]
	/** When the digital signature was signed. */
	when: string

	_when?: Element
	/** A reference to an application-usable description of the identity that signed  (e.g. the signature used their private key). */
	who: Reference
	/** A reference to an application-usable description of the identity that is represented by the signature. */
	onBehalfOf?: Reference
	/** A mime type that indicates the technical format of the target resources signed by the signature. */
	targetFormat?: string

	_targetFormat?: Element
	/** A mime type that indicates the technical format of the signature. Important mime types are application/signature+xml for X ML DigSig, application/jose for JWS, and image/* for a graphical image of a signature, etc. */
	sigFormat?: string

	_sigFormat?: Element
	/** The base64 encoding of the Signature content. When signature is not recorded electronically this element would be empty. */
	data?: string

	_data?: Element
}

/** A human's name with the ability to identify parts and usage. */

export interface HumanName {
	id?: string

	extension?: Extension[]
	/** Identifies the purpose for this name. */
	use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden'

	_use?: Element
	/** Specifies the entire name as it should be displayed e.g. on an application UI. This may be provided instead of or as well as the specific parts. */
	text?: string

	_text?: Element
	/** The part of a name that links to the genealogy. In some cultures (e.g. Eritrea) the family name of a son is the first name of his father. */
	family?: string

	_family?: Element
	/** Given name. */
	given?: string[]

	_given?: Element[]
	/** Part of the name that is acquired as a title due to academic, legal, employment or nobility status, etc. and that appears at the start of the name. */
	prefix?: string[]

	_prefix?: Element[]
	/** Part of the name that is acquired as a title due to academic, legal, employment or nobility status, etc. and that appears at the end of the name. */
	suffix?: string[]

	_suffix?: Element[]
	/** Indicates the period of time when this name was valid for the named person. */
	period?: Period
}

/** An address expressed using postal conventions (as opposed to GPS or other location definition formats).  This data type may be used to convey addresses for use in delivering mail as well as for visiting locations which might not be valid for mail delivery.  There are a variety of postal address formats defined around the world. */

export interface Address {
	id?: string

	extension?: Extension[]
	/** The purpose of this address. */
	use?: 'home' | 'work' | 'temp' | 'old' | 'billing'

	_use?: Element
	/** Distinguishes between physical addresses (those you can visit) and mailing addresses (e.g. PO Boxes and care-of addresses). Most addresses are both. */
	type?: 'postal' | 'physical' | 'both'

	_type?: Element
	/** Specifies the entire address as it should be displayed e.g. on a postal label. This may be provided instead of or as well as the specific parts. */
	text?: string

	_text?: Element
	/** This component contains the house number, apartment number, street name, street direction,  P.O. Box number, delivery hints, and similar address information. */
	line?: string[]

	_line?: Element[]
	/** The name of the city, town, suburb, village or other community or delivery center. */
	city?: string

	_city?: Element
	/** The name of the administrative area (county). */
	district?: string

	_district?: Element
	/** Sub-unit of a country with limited sovereignty in a federally organized country. A code may be used if codes are in common use (e.g. US 2 letter state codes). */
	state?: string

	_state?: Element
	/** A postal code designating a region defined by the postal service. */
	postalCode?: string

	_postalCode?: Element
	/** Country - a nation as commonly understood or generally accepted. */
	country?: string

	_country?: Element
	/** Time period when address was/is in use. */
	period?: Period
}

/** Details for all kinds of technology mediated contact points for a person or organization, including telephone, email, etc. */

export interface ContactPoint {
	id?: string

	extension?: Extension[]
	/** Telecommunications form for contact point - what communications system is required to make use of the contact. */
	system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other'

	_system?: Element
	/** The actual contact point details, in a form that is meaningful to the designated communication system (i.e. phone number or email address). */
	value?: string

	_value?: Element
	/** Identifies the purpose for the contact point. */
	use?: 'home' | 'work' | 'temp' | 'old' | 'mobile'

	_use?: Element
	/** Specifies a preferred order in which to use a set of contacts. ContactPoints with lower rank values are more preferred than those with higher rank values. */
	rank?: number

	_rank?: Element
	/** Time period when the contact point was/is in use. */
	period?: Period
}

/** Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur. The most common usage is in dosage instructions for medications. They are also used when planning care of various kinds, and may be used for reporting the schedule to which past regular activities were carried out. */

export interface Timing {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** Identifies specific times when the event occurs. */
	event?: string[]

	_event?: Element[]

	repeat?: TimingRepeat
	/** A code for the timing schedule (or just text in code.text). Some codes such as BID are ubiquitous, but many institutions define their own additional codes. If a code is provided, the code is understood to be a complete statement of whatever is specified in the structured timing data, and either the code or the data may be used to interpret the Timing, with the exception that .repeat.bounds still applies over the code (and is not contained in the code). */
	code?: CodeableConcept
}

/** Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur. The most common usage is in dosage instructions for medications. They are also used when planning care of various kinds, and may be used for reporting the schedule to which past regular activities were carried out. */

export interface TimingRepeat {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	boundsDuration?: Duration

	boundsRange?: Range

	boundsPeriod?: Period
	/** A total count of the desired number of repetitions across the duration of the entire timing specification. If countMax is present, this element indicates the lower bound of the allowed range of count values. */
	count?: number

	_count?: Element
	/** If present, indicates that the count is a range - so to perform the action between [count] and [countMax] times. */
	countMax?: number

	_countMax?: Element
	/** How long this thing happens for when it happens. If durationMax is present, this element indicates the lower bound of the allowed range of the duration. */
	duration?: number

	_duration?: Element
	/** If present, indicates that the duration is a range - so to perform the action between [duration] and [durationMax] time length. */
	durationMax?: number

	_durationMax?: Element
	/** The units of time for the duration, in UCUM units. */
	durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a'

	_durationUnit?: Element
	/** The number of times to repeat the action within the specified period. If frequencyMax is present, this element indicates the lower bound of the allowed range of the frequency. */
	frequency?: number

	_frequency?: Element
	/** If present, indicates that the frequency is a range - so to repeat between [frequency] and [frequencyMax] times within the period or period range. */
	frequencyMax?: number

	_frequencyMax?: Element
	/** Indicates the duration of time over which repetitions are to occur; e.g. to express "3 times per day", 3 would be the frequency and "1 day" would be the period. If periodMax is present, this element indicates the lower bound of the allowed range of the period length. */
	period?: number

	_period?: Element
	/** If present, indicates that the period is a range from [period] to [periodMax], allowing expressing concepts such as "do this once every 3-5 days. */
	periodMax?: number

	_periodMax?: Element
	/** The units of time for the period in UCUM units. */
	periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a'

	_periodUnit?: Element
	/** If one or more days of week is provided, then the action happens only on the specified day(s). */
	dayOfWeek?: string[]

	_dayOfWeek?: Element[]
	/** Specified time of day for action to take place. */
	timeOfDay?: string[]

	_timeOfDay?: Element[]
	/** An approximate time period during the day, potentially linked to an event of daily living that indicates when the action should occur. */
	when?: (
		| 'MORN'
		| 'MORN.early'
		| 'MORN.late'
		| 'NOON'
		| 'AFT'
		| 'AFT.early'
		| 'AFT.late'
		| 'EVE'
		| 'EVE.early'
		| 'EVE.late'
		| 'NIGHT'
		| 'PHS'
		| 'HS'
		| 'WAKE'
		| 'C'
		| 'CM'
		| 'CD'
		| 'CV'
		| 'AC'
		| 'ACM'
		| 'ACD'
		| 'ACV'
		| 'PC'
		| 'PCM'
		| 'PCD'
		| 'PCV'
	)[]

	_when?: Element[]
	/** The number of minutes from the event. If the event code does not indicate whether the minutes is before or after the event, then the offset is assumed to be after the event. */
	offset?: number

	_offset?: Element
}

/** The metadata about a resource. This is content in the resource that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource. */

export interface Meta {
	id?: string

	extension?: Extension[]
	/** The version specific identifier, as it appears in the version portion of the URL. This value changes when the resource is created, updated, or deleted. */
	versionId?: string

	_versionId?: Element
	/** When the resource last changed - e.g. when the version changed. */
	lastUpdated?: string

	_lastUpdated?: Element
	/** A uri that identifies the source system of the resource. This provides a minimal amount of [Provenance](provenance.html#) information that can be used to track or differentiate the source of information in the resource. The source may identify another FHIR server, document, message, database, etc. */
	source?: string

	_source?: Element
	/** A list of profiles (references to [StructureDefinition](structuredefinition.html#) resources) that this resource claims to conform to. The URL is a reference to [StructureDefinition.url](structuredefinition-definitions.html#StructureDefinition.url). */
	profile?: string[]
	/** Security labels applied to this resource. These tags connect specific resources to the overall security policy and infrastructure. */
	security?: Coding[]
	/** Tags applied to this resource. Tags are intended to be used to identify and relate resources to process and workflow, and applications are not required to consider the tags when interpreting the meaning of a resource. */
	tag?: Coding[]
}

/** Specifies contact information for a person or organization. */

export interface ContactDetail {
	id?: string

	extension?: Extension[]
	/** The name of an individual to contact. */
	name?: string

	_name?: Element
	/** The contact details for the individual (if a name was provided) or the organization. */
	telecom?: ContactPoint[]
}

/** A contributor to the content of a knowledge asset, including authors, editors, reviewers, and endorsers. */

export interface Contributor {
	id?: string

	extension?: Extension[]
	/** The type of contributor. */
	type: 'author' | 'editor' | 'reviewer' | 'endorser'

	_type?: Element
	/** The name of the individual or organization responsible for the contribution. */
	name: string

	_name?: Element
	/** Contact details to assist a user in finding and communicating with the contributor. */
	contact?: ContactDetail[]
}

/** Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data. */

export interface DataRequirement {
	id?: string

	extension?: Extension[]
	/** The type of the required data, specified as the type name of a resource. For profiles, this value is set to the type of the base resource of the profile. */
	type: string

	_type?: Element
	/** The profile of the required data, specified as the uri of the profile definition. */
	profile?: string[]

	subjectCodeableConcept?: CodeableConcept

	subjectReference?: Reference
	/** Indicates that specific elements of the type are referenced by the knowledge module and must be supported by the consumer in order to obtain an effective evaluation. This does not mean that a value is required for this element, only that the consuming system must understand the element and be able to provide values for it if they are available. 

The value of mustSupport SHALL be a FHIRPath resolveable on the type of the DataRequirement. The path SHALL consist only of identifiers, constant indexers, and .resolve() (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details). */
	mustSupport?: string[]

	_mustSupport?: Element[]

	codeFilter?: DataRequirementCodeFilter[]

	dateFilter?: DataRequirementDateFilter[]
	/** Specifies a maximum number of results that are required (uses the _count search parameter). */
	limit?: number

	_limit?: Element

	sort?: DataRequirementSort[]
}

/** Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data. */

export interface DataRequirementCodeFilter {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** The code-valued attribute of the filter. The specified path SHALL be a FHIRPath resolveable on the specified type of the DataRequirement, and SHALL consist only of identifiers, constant indexers, and .resolve(). The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details). Note that the index must be an integer constant. The path must resolve to an element of type code, Coding, or CodeableConcept. */
	path?: string

	_path?: Element
	/** A token parameter that refers to a search parameter defined on the specified type of the DataRequirement, and which searches on elements of type code, Coding, or CodeableConcept. */
	searchParam?: string

	_searchParam?: Element
	/** The valueset for the code filter. The valueSet and code elements are additive. If valueSet is specified, the filter will return only those data items for which the value of the code-valued element specified in the path is a member of the specified valueset. */
	valueSet?: string
	/** The codes for the code filter. If values are given, the filter will return only those data items for which the code-valued attribute specified by the path has a value that is one of the specified codes. If codes are specified in addition to a value set, the filter returns items matching a code in the value set or one of the specified codes. */
	code?: Coding[]
}

/** Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data. */

export interface DataRequirementDateFilter {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** The date-valued attribute of the filter. The specified path SHALL be a FHIRPath resolveable on the specified type of the DataRequirement, and SHALL consist only of identifiers, constant indexers, and .resolve(). The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements (see the [Simple FHIRPath Profile](fhirpath.html#simple) for full details). Note that the index must be an integer constant. The path must resolve to an element of type date, dateTime, Period, Schedule, or Timing. */
	path?: string

	_path?: Element
	/** A date parameter that refers to a search parameter defined on the specified type of the DataRequirement, and which searches on elements of type date, dateTime, Period, Schedule, or Timing. */
	searchParam?: string

	_searchParam?: Element

	valueDateTime?: string

	_valueDateTime?: Element

	valuePeriod?: Period

	valueDuration?: Duration
}

/** Describes a required data item for evaluation in terms of the type of data, and optional code or date-based filters of the data. */

export interface DataRequirementSort {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** The attribute of the sort. The specified path must be resolvable from the type of the required data. The path is allowed to contain qualifiers (.) to traverse sub-elements, as well as indexers ([x]) to traverse multiple-cardinality sub-elements. Note that the index must be an integer constant. */
	path: string

	_path?: Element
	/** The direction of the sort, ascending or descending. */
	direction: 'ascending' | 'descending'

	_direction?: Element
}

/** The parameters to the module. This collection specifies both the input and output parameters. Input parameters are provided by the caller as part of the $evaluate operation. Output parameters are included in the GuidanceResponse. */

export interface ParameterDefinition {
	id?: string

	extension?: Extension[]
	/** The name of the parameter used to allow access to the value of the parameter in evaluation contexts. */
	name?: string

	_name?: Element
	/** Whether the parameter is input or output for the module. */
	use: string

	_use?: Element
	/** The minimum number of times this parameter SHALL appear in the request or response. */
	min?: number

	_min?: Element
	/** The maximum number of times this element is permitted to appear in the request or response. */
	max?: string

	_max?: Element
	/** A brief discussion of what the parameter is for and how it is used by the module. */
	documentation?: string

	_documentation?: Element
	/** The type of the parameter. */
	type: string

	_type?: Element
	/** If specified, this indicates a profile that the input data must conform to, or that the output data will conform to. */
	profile?: string
}

/** Related artifacts such as additional documentation, justification, or bibliographic references. */

export interface RelatedArtifact {
	id?: string

	extension?: Extension[]
	/** The type of relationship to the related artifact. */
	type:
		| 'documentation'
		| 'justification'
		| 'citation'
		| 'predecessor'
		| 'successor'
		| 'derived-from'
		| 'depends-on'
		| 'composed-of'

	_type?: Element
	/** A short label that can be used to reference the citation from elsewhere in the containing artifact, such as a footnote index. */
	label?: string

	_label?: Element
	/** A brief description of the document or knowledge resource being referenced, suitable for display to a consumer. */
	display?: string

	_display?: Element
	/** A bibliographic citation for the related artifact. This text SHOULD be formatted according to an accepted citation format. */
	citation?: string

	_citation?: Element
	/** A url for the artifact that can be followed to access the actual content. */
	url?: string

	_url?: Element
	/** The document being referenced, represented as an attachment. This is exclusive with the resource element. */
	document?: Attachment
	/** The related resource, such as a library, value set, profile, or other knowledge resource. */
	resource?: string
}

/** A description of a triggering event. Triggering events can be named events, data events, or periodic, as determined by the type element. */

export interface TriggerDefinition {
	id?: string

	extension?: Extension[]
	/** The type of triggering event. */
	type:
		| 'named-event'
		| 'periodic'
		| 'data-changed'
		| 'data-added'
		| 'data-modified'
		| 'data-removed'
		| 'data-accessed'
		| 'data-access-ended'

	_type?: Element
	/** A formal name for the event. This may be an absolute URI that identifies the event formally (e.g. from a trigger registry), or a simple relative URI that identifies the event in a local context. */
	name?: string

	_name?: Element

	timingTiming?: Timing

	timingReference?: Reference

	timingDate?: string

	_timingDate?: Element

	timingDateTime?: string

	_timingDateTime?: Element
	/** The triggering data of the event (if this is a data trigger). If more than one data is requirement is specified, then all the data requirements must be true. */
	data?: DataRequirement[]
	/** A boolean-valued expression that is evaluated in the context of the container of the trigger definition and returns whether or not the trigger fires. */
	condition?: Expression
}

/** Specifies clinical/business/etc. metadata that can be used to retrieve, index and/or categorize an artifact. This metadata can either be specific to the applicable population (e.g., age category, DRG) or the specific context of care (e.g., venue, care setting, provider of care). */

export interface UsageContext {
	id?: string

	extension?: Extension[]
	/** A code that identifies the type of context being specified by this usage context. */
	code: Coding

	valueCodeableConcept?: CodeableConcept

	valueQuantity?: Quantity

	valueRange?: Range

	valueReference?: Reference
}

/** Indicates how the medication is/was taken or should be taken by the patient. */

export interface Dosage {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** Indicates the order in which the dosage instructions should be applied or interpreted. */
	sequence?: number

	_sequence?: Element
	/** Free text dosage instructions e.g. SIG. */
	text?: string

	_text?: Element
	/** Supplemental instructions to the patient on how to take the medication  (e.g. "with meals" or"take half to one hour before food") or warnings for the patient about the medication (e.g. "may cause drowsiness" or "avoid exposure of skin to direct sunlight or sunlamps"). */
	additionalInstruction?: CodeableConcept[]
	/** Instructions in terms that are understood by the patient or consumer. */
	patientInstruction?: string

	_patientInstruction?: Element
	/** When medication should be administered. */
	timing?: Timing

	asNeededBoolean?: boolean

	_asNeededBoolean?: Element

	asNeededCodeableConcept?: CodeableConcept
	/** Body site to administer to. */
	site?: CodeableConcept
	/** How drug should enter body. */
	route?: CodeableConcept
	/** Technique for administering medication. */
	method?: CodeableConcept

	doseAndRate?: DosageDoseAndRate[]
	/** Upper limit on medication per unit of time. */
	maxDosePerPeriod?: Ratio
	/** Upper limit on medication per administration. */
	maxDosePerAdministration?: Quantity
	/** Upper limit on medication per lifetime of the patient. */
	maxDosePerLifetime?: Quantity
}

/** Indicates how the medication is/was taken or should be taken by the patient. */

export interface DosageDoseAndRate {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]
	/** The kind of dose or rate specified, for example, ordered or calculated. */
	type?: CodeableConcept

	doseRange?: Range

	doseQuantity?: Quantity

	rateRatio?: Ratio

	rateRange?: Range

	rateQuantity?: Quantity
}

/** A expression that is evaluated in a specified context and returns a value. The context of use of the expression must specify the context in which the expression is evaluated, and how the result of the expression is used. */

export interface Expression {
	id?: string

	extension?: Extension[]
	/** A brief, natural language description of the condition that effectively communicates the intended semantics. */
	description?: string

	_description?: Element
	/** A short name assigned to the expression to allow for multiple reuse of the expression in the context where it is defined. */
	name?: string

	_name?: Element
	/** The media type of the language for the expression. */
	language: 'text/cql' | 'text/fhirpath' | 'application/x-fhir-query'

	_language?: Element
	/** An expression in the specified language that returns a value. */
	expression?: string

	_expression?: Element
	/** A URI that defines where the expression is found. */
	reference?: string

	_reference?: Element
}
