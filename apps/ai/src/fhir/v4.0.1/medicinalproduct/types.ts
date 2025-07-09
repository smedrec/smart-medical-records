import type {
	CodeableConcept,
	Coding,
	Duration,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Quantity,
	Ratio,
	Reference,
} from '../core/types'
import type { MarketingStatus } from '../marketingstatus/types'
import type { Narrative } from '../narrative/types'
import type { Population } from '../population/types'
import type { ProdCharacteristic } from '../prodcharacteristic/types'
import type { ProductShelfLife } from '../productshelflife/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProduct<Contained = ResourceList> {
	resourceType: `MedicinalProduct`
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
	/** Business identifier for this product. Could be an MPID. */
	identifier?: Identifier[]
	/** Regulatory type, e.g. Investigational or Authorized. */
	type?: CodeableConcept
	/** If this medicine applies to human or veterinary uses. */
	domain?: Coding
	/** The dose form for a single part product, or combined form of a multiple part product. */
	combinedPharmaceuticalDoseForm?: CodeableConcept
	/** The legal status of supply of the medicinal product as classified by the regulator. */
	legalStatusOfSupply?: CodeableConcept
	/** Whether the Medicinal Product is subject to additional monitoring for regulatory reasons. */
	additionalMonitoringIndicator?: CodeableConcept
	/** Whether the Medicinal Product is subject to special measures for regulatory reasons. */
	specialMeasures?: string[]

	_specialMeasures?: Element[]
	/** If authorised for use in children. */
	paediatricUseIndicator?: CodeableConcept
	/** Allows the product to be classified by various systems. */
	productClassification?: CodeableConcept[]
	/** Marketing status of the medicinal product, in contrast to marketing authorizaton. */
	marketingStatus?: MarketingStatus[]
	/** Pharmaceutical aspects of product. */
	pharmaceuticalProduct?: Reference[]
	/** Package representation for the product. */
	packagedMedicinalProduct?: Reference[]
	/** Supporting documentation, typically for regulatory submission. */
	attachedDocument?: Reference[]
	/** A master file for to the medicinal product (e.g. Pharmacovigilance System Master File). */
	masterFile?: Reference[]
	/** A product specific contact, person (in a role), or an organization. */
	contact?: Reference[]
	/** Clinical trials or studies that this product is involved in. */
	clinicalTrial?: Reference[]

	name: MedicinalProductName[]
	/** Reference to another product, e.g. for linking authorised to investigational product. */
	crossReference?: Identifier[]

	manufacturingBusinessOperation?: MedicinalProductManufacturingBusinessOperation[]

	specialDesignation?: MedicinalProductSpecialDesignation[]
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProductName {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The full product name. */
	productName: string

	_productName?: Element

	namePart?: MedicinalProductNamePart[]

	countryLanguage?: MedicinalProductCountryLanguage[]
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProductNamePart {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	part?: string

	_part?: Element

	type: Coding
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProductCountryLanguage {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	country: CodeableConcept

	jurisdiction?: CodeableConcept

	language: CodeableConcept
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProductManufacturingBusinessOperation {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The type of manufacturing operation. */
	operationType?: CodeableConcept
	/** Regulatory authorization reference number. */
	authorisationReferenceNumber?: Identifier
	/** Regulatory authorization date. */
	effectiveDate?: string

	_effectiveDate?: Element
	/** To indicate if this proces is commercially confidential. */
	confidentialityIndicator?: CodeableConcept
	/** The manufacturer or establishment associated with the process. */
	manufacturer?: Reference[]
	/** A regulator which oversees the operation. */
	regulator?: Reference
}

/** Detailed definition of a medicinal product, typically for uses other than direct patient care (e.g. regulatory use). */

export interface MedicinalProductSpecialDesignation {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Identifier for the designation, or procedure number. */
	identifier?: Identifier[]
	/** The type of special designation, e.g. orphan drug, minor use. */
	type?: CodeableConcept
	/** The intended use of the product, e.g. prevention, treatment. */
	intendedUse?: CodeableConcept

	indicationCodeableConcept?: CodeableConcept

	indicationReference?: Reference
	/** For example granted, pending, expired or withdrawn. */
	status?: CodeableConcept
	/** Date when the designation was granted. */
	date?: string

	_date?: Element
	/** Animal species for which this applies. */
	species?: CodeableConcept
}

/** The regulatory authorization of a medicinal product. */

export interface MedicinalProductAuthorization<Contained = ResourceList> {
	resourceType: `MedicinalProductAuthorization`
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
	/** Business identifier for the marketing authorization, as assigned by a regulator. */
	identifier?: Identifier[]
	/** The medicinal product that is being authorized. */
	subject?: Reference
	/** The country in which the marketing authorization has been granted. */
	country?: CodeableConcept[]
	/** Jurisdiction within a country. */
	jurisdiction?: CodeableConcept[]
	/** The status of the marketing authorization. */
	status?: CodeableConcept
	/** The date at which the given status has become applicable. */
	statusDate?: string

	_statusDate?: Element
	/** The date when a suspended the marketing or the marketing authorization of the product is anticipated to be restored. */
	restoreDate?: string

	_restoreDate?: Element
	/** The beginning of the time period in which the marketing authorization is in the specific status shall be specified A complete date consisting of day, month and year shall be specified using the ISO 8601 date format. */
	validityPeriod?: Period
	/** A period of time after authorization before generic product applicatiosn can be submitted. */
	dataExclusivityPeriod?: Period
	/** The date when the first authorization was granted by a Medicines Regulatory Agency. */
	dateOfFirstAuthorization?: string

	_dateOfFirstAuthorization?: Element
	/** Date of first marketing authorization for a company's new medicinal product in any country in the World. */
	internationalBirthDate?: string

	_internationalBirthDate?: Element
	/** The legal framework against which this authorization is granted. */
	legalBasis?: CodeableConcept

	jurisdictionalAuthorization?: MedicinalProductAuthorizationJurisdictionalAuthorization[]
	/** Marketing Authorization Holder. */
	holder?: Reference
	/** Medicines Regulatory Agency. */
	regulator?: Reference

	procedure?: MedicinalProductAuthorizationProcedure
}

/** The regulatory authorization of a medicinal product. */

export interface MedicinalProductAuthorizationJurisdictionalAuthorization {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The assigned number for the marketing authorization. */
	identifier?: Identifier[]
	/** Country of authorization. */
	country?: CodeableConcept
	/** Jurisdiction within a country. */
	jurisdiction?: CodeableConcept[]
	/** The legal status of supply in a jurisdiction or region. */
	legalStatusOfSupply?: CodeableConcept
	/** The start and expected end date of the authorization. */
	validityPeriod?: Period
}

/** The regulatory authorization of a medicinal product. */

export interface MedicinalProductAuthorizationProcedure {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Identifier for this procedure. */
	identifier?: Identifier
	/** Type of procedure. */
	type: CodeableConcept

	datePeriod?: Period

	dateDateTime?: string

	_dateDateTime?: Element

	application?: MedicinalProductAuthorizationProcedure[]
}

/** The clinical particulars - indications, contraindications etc. of a medicinal product, including for regulatory purposes. */

export interface MedicinalProductContraindication<Contained = ResourceList> {
	resourceType: `MedicinalProductContraindication`
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
	/** The medication for which this is an indication. */
	subject?: Reference[]
	/** The disease, symptom or procedure for the contraindication. */
	disease?: CodeableConcept
	/** The status of the disease or symptom for the contraindication. */
	diseaseStatus?: CodeableConcept
	/** A comorbidity (concurrent condition) or coinfection. */
	comorbidity?: CodeableConcept[]
	/** Information about the use of the medicinal product in relation to other therapies as part of the indication. */
	therapeuticIndication?: Reference[]

	otherTherapy?: MedicinalProductContraindicationOtherTherapy[]
	/** The population group to which this applies. */
	population?: Population[]
}

/** The clinical particulars - indications, contraindications etc. of a medicinal product, including for regulatory purposes. */

export interface MedicinalProductContraindicationOtherTherapy {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The type of relationship between the medicinal product indication or contraindication and another therapy. */
	therapyRelationshipType: CodeableConcept

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
}

/** Indication for the Medicinal Product. */

export interface MedicinalProductIndication<Contained = ResourceList> {
	resourceType: `MedicinalProductIndication`
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
	/** The medication for which this is an indication. */
	subject?: Reference[]
	/** The disease, symptom or procedure that is the indication for treatment. */
	diseaseSymptomProcedure?: CodeableConcept
	/** The status of the disease or symptom for which the indication applies. */
	diseaseStatus?: CodeableConcept
	/** Comorbidity (concurrent condition) or co-infection as part of the indication. */
	comorbidity?: CodeableConcept[]
	/** The intended effect, aim or strategy to be achieved by the indication. */
	intendedEffect?: CodeableConcept
	/** Timing or duration information as part of the indication. */
	duration?: Quantity

	otherTherapy?: MedicinalProductIndicationOtherTherapy[]
	/** Describe the undesirable effects of the medicinal product. */
	undesirableEffect?: Reference[]
	/** The population group to which this applies. */
	population?: Population[]
}

/** Indication for the Medicinal Product. */

export interface MedicinalProductIndicationOtherTherapy {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The type of relationship between the medicinal product indication or contraindication and another therapy. */
	therapyRelationshipType: CodeableConcept

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
}

/** An ingredient of a manufactured item or pharmaceutical product. */

export interface MedicinalProductIngredient<Contained = ResourceList> {
	resourceType: `MedicinalProductIngredient`
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
	/** The identifier(s) of this Ingredient that are assigned by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate. */
	identifier?: Identifier
	/** Ingredient role e.g. Active ingredient, excipient. */
	role: CodeableConcept
	/** If the ingredient is a known or suspected allergen. */
	allergenicIndicator?: boolean

	_allergenicIndicator?: Element
	/** Manufacturer of this Ingredient. */
	manufacturer?: Reference[]

	specifiedSubstance?: MedicinalProductIngredientSpecifiedSubstance[]

	substance?: MedicinalProductIngredientSubstance
}

/** An ingredient of a manufactured item or pharmaceutical product. */

export interface MedicinalProductIngredientSpecifiedSubstance {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The specified substance. */
	code: CodeableConcept
	/** The group of specified substance, e.g. group 1 to 4. */
	group: CodeableConcept
	/** Confidentiality level of the specified substance as the ingredient. */
	confidentiality?: CodeableConcept

	strength?: MedicinalProductIngredientStrength[]
}

/** An ingredient of a manufactured item or pharmaceutical product. */

export interface MedicinalProductIngredientStrength {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	presentation: Ratio

	presentationLowLimit?: Ratio

	concentration?: Ratio

	concentrationLowLimit?: Ratio

	measurementPoint?: string

	_measurementPoint?: Element

	country?: CodeableConcept[]

	referenceStrength?: MedicinalProductIngredientReferenceStrength[]
}

/** An ingredient of a manufactured item or pharmaceutical product. */

export interface MedicinalProductIngredientReferenceStrength {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	substance?: CodeableConcept

	strength: Ratio

	strengthLowLimit?: Ratio

	measurementPoint?: string

	_measurementPoint?: Element

	country?: CodeableConcept[]
}

/** An ingredient of a manufactured item or pharmaceutical product. */

export interface MedicinalProductIngredientSubstance {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The ingredient substance. */
	code: CodeableConcept

	strength?: MedicinalProductIngredientStrength[]
}

/** The interactions of the medicinal product with other medicinal products, or other forms of interactions. */

export interface MedicinalProductInteraction<Contained = ResourceList> {
	resourceType: `MedicinalProductInteraction`
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
	/** The medication for which this is a described interaction. */
	subject?: Reference[]
	/** The interaction described. */
	description?: string

	_description?: Element

	interactant?: MedicinalProductInteractionInteractant[]
	/** The type of the interaction e.g. drug-drug interaction, drug-food interaction, drug-lab test interaction. */
	type?: CodeableConcept
	/** The effect of the interaction, for example "reduced gastric absorption of primary medication". */
	effect?: CodeableConcept
	/** The incidence of the interaction, e.g. theoretical, observed. */
	incidence?: CodeableConcept
	/** Actions for managing the interaction. */
	management?: CodeableConcept
}

/** The interactions of the medicinal product with other medicinal products, or other forms of interactions. */

export interface MedicinalProductInteractionInteractant {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	itemReference?: Reference

	itemCodeableConcept?: CodeableConcept
}

/** The manufactured item as contained in the packaged medicinal product. */

export interface MedicinalProductManufactured<Contained = ResourceList> {
	resourceType: `MedicinalProductManufactured`
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
	/** Dose form as manufactured and before any transformation into the pharmaceutical product. */
	manufacturedDoseForm: CodeableConcept
	/** The “real world” units in which the quantity of the manufactured item is described. */
	unitOfPresentation?: CodeableConcept
	/** The quantity or "count number" of the manufactured item. */
	quantity: Quantity
	/** Manufacturer of the item (Note that this should be named "manufacturer" but it currently causes technical issues). */
	manufacturer?: Reference[]
	/** Ingredient. */
	ingredient?: Reference[]
	/** Dimensions, color etc. */
	physicalCharacteristics?: ProdCharacteristic
	/** Other codeable characteristics. */
	otherCharacteristics?: CodeableConcept[]
}

/** A medicinal product in a container or package. */

export interface MedicinalProductPackaged<Contained = ResourceList> {
	resourceType: `MedicinalProductPackaged`
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
	/** Unique identifier. */
	identifier?: Identifier[]
	/** The product with this is a pack for. */
	subject?: Reference[]
	/** Textual description. */
	description?: string

	_description?: Element
	/** The legal status of supply of the medicinal product as classified by the regulator. */
	legalStatusOfSupply?: CodeableConcept
	/** Marketing information. */
	marketingStatus?: MarketingStatus[]
	/** Manufacturer of this Package Item. */
	marketingAuthorization?: Reference
	/** Manufacturer of this Package Item. */
	manufacturer?: Reference[]

	batchIdentifier?: MedicinalProductPackagedBatchIdentifier[]

	packageItem: MedicinalProductPackagedPackageItem[]
}

/** A medicinal product in a container or package. */

export interface MedicinalProductPackagedBatchIdentifier {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A number appearing on the outer packaging of a specific batch. */
	outerPackaging: Identifier
	/** A number appearing on the immediate packaging (and not the outer packaging). */
	immediatePackaging?: Identifier
}

/** A medicinal product in a container or package. */

export interface MedicinalProductPackagedPackageItem {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Including possibly Data Carrier Identifier. */
	identifier?: Identifier[]
	/** The physical type of the container of the medicine. */
	type: CodeableConcept
	/** The quantity of this package in the medicinal product, at the current level of packaging. The outermost is always 1. */
	quantity: Quantity
	/** Material type of the package item. */
	material?: CodeableConcept[]
	/** A possible alternate material for the packaging. */
	alternateMaterial?: CodeableConcept[]
	/** A device accompanying a medicinal product. */
	device?: Reference[]
	/** The manufactured item as contained in the packaged medicinal product. */
	manufacturedItem?: Reference[]

	packageItem?: MedicinalProductPackagedPackageItem[]
	/** Dimensions, color etc. */
	physicalCharacteristics?: ProdCharacteristic
	/** Other codeable characteristics. */
	otherCharacteristics?: CodeableConcept[]
	/** Shelf Life and storage information. */
	shelfLifeStorage?: ProductShelfLife[]
	/** Manufacturer of this Package Item. */
	manufacturer?: Reference[]
}

/** A pharmaceutical product described in terms of its composition and dose form. */

export interface MedicinalProductPharmaceutical<Contained = ResourceList> {
	resourceType: `MedicinalProductPharmaceutical`
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
	/** An identifier for the pharmaceutical medicinal product. */
	identifier?: Identifier[]
	/** The administrable dose form, after necessary reconstitution. */
	administrableDoseForm: CodeableConcept
	/** Todo. */
	unitOfPresentation?: CodeableConcept
	/** Ingredient. */
	ingredient?: Reference[]
	/** Accompanying device. */
	device?: Reference[]

	characteristics?: MedicinalProductPharmaceuticalCharacteristics[]

	routeOfAdministration: MedicinalProductPharmaceuticalRouteOfAdministration[]
}

/** A pharmaceutical product described in terms of its composition and dose form. */

export interface MedicinalProductPharmaceuticalCharacteristics {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A coded characteristic. */
	code: CodeableConcept
	/** The status of characteristic e.g. assigned or pending. */
	status?: CodeableConcept
}

/** A pharmaceutical product described in terms of its composition and dose form. */

export interface MedicinalProductPharmaceuticalRouteOfAdministration {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Coded expression for the route. */
	code: CodeableConcept
	/** The first dose (dose quantity) administered in humans can be specified, for a product under investigation, using a numerical value and its unit of measurement. */
	firstDose?: Quantity
	/** The maximum single dose that can be administered as per the protocol of a clinical trial can be specified using a numerical value and its unit of measurement. */
	maxSingleDose?: Quantity

	maxDosePerDay?: Quantity
	/** The maximum dose per treatment period that can be administered as per the protocol referenced in the clinical trial authorisation. */
	maxDosePerTreatmentPeriod?: Ratio
	/** The maximum treatment period during which an Investigational Medicinal Product can be administered as per the protocol referenced in the clinical trial authorisation. */
	maxTreatmentPeriod?: Duration

	targetSpecies?: MedicinalProductPharmaceuticalTargetSpecies[]
}

/** A pharmaceutical product described in terms of its composition and dose form. */

export interface MedicinalProductPharmaceuticalTargetSpecies {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	code: CodeableConcept

	withdrawalPeriod?: MedicinalProductPharmaceuticalWithdrawalPeriod[]
}

/** A pharmaceutical product described in terms of its composition and dose form. */

export interface MedicinalProductPharmaceuticalWithdrawalPeriod {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	tissue: CodeableConcept

	value: Quantity

	supportingInformation?: string

	_supportingInformation?: Element
}

/** Describe the undesirable effects of the medicinal product. */

export interface MedicinalProductUndesirableEffect<Contained = ResourceList> {
	resourceType: `MedicinalProductUndesirableEffect`
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
	/** The medication for which this is an indication. */
	subject?: Reference[]
	/** The symptom, condition or undesirable effect. */
	symptomConditionEffect?: CodeableConcept
	/** Classification of the effect. */
	classification?: CodeableConcept
	/** The frequency of occurrence of the effect. */
	frequencyOfOccurrence?: CodeableConcept
	/** The population group to which this applies. */
	population?: Population[]
}
