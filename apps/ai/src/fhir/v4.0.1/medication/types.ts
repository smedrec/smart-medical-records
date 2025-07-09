import type {
	Annotation,
	CodeableConcept,
	Dosage,
	Duration,
	Element,
	Extension,
	Identifier,
	Meta,
	Money,
	Period,
	Quantity,
	Ratio,
	Reference,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** This resource is primarily used for the identification and definition of a medication for the purposes of prescribing, dispensing, and administering a medication as well as for making statements about medication use. */

export interface Medication<Contained = ResourceList> {
	resourceType: `Medication`
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
	/** Business identifier for this medication. */
	identifier?: Identifier[]
	/** A code (or set of codes) that specify this medication, or a textual description if no code is available. Usage note: This could be a standard medication code such as a code from RxNorm, SNOMED CT, IDMP etc. It could also be a national or local formulary code, optionally with translations to other code systems. */
	code?: CodeableConcept
	/** A code to indicate if the medication is in active use. */
	status?: string

	_status?: Element
	/** Describes the details of the manufacturer of the medication product.  This is not intended to represent the distributor of a medication product. */
	manufacturer?: Reference
	/** Describes the form of the item.  Powder; tablets; capsule. */
	form?: CodeableConcept
	/** Specific amount of the drug in the packaged product.  For example, when specifying a product that has the same strength (For example, Insulin glargine 100 unit per mL solution for injection), this attribute provides additional clarification of the package amount (For example, 3 mL, 10mL, etc.). */
	amount?: Ratio

	ingredient?: MedicationIngredient[]

	batch?: MedicationBatch
}

/** This resource is primarily used for the identification and definition of a medication for the purposes of prescribing, dispensing, and administering a medication as well as for making statements about medication use. */

export interface MedicationIngredient {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	itemCodeableConcept?: CodeableConcept

	itemReference?: Reference
	/** Indication of whether this ingredient affects the therapeutic action of the drug. */
	isActive?: boolean

	_isActive?: Element
	/** Specifies how many (or how much) of the items there are in this Medication.  For example, 250 mg per tablet.  This is expressed as a ratio where the numerator is 250mg and the denominator is 1 tablet. */
	strength?: Ratio
}

/** This resource is primarily used for the identification and definition of a medication for the purposes of prescribing, dispensing, and administering a medication as well as for making statements about medication use. */

export interface MedicationBatch {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The assigned lot number of a batch of the specified product. */
	lotNumber?: string

	_lotNumber?: Element
	/** When this specific batch of product will expire. */
	expirationDate?: string

	_expirationDate?: Element
}

/** Describes the event of a patient consuming or otherwise being administered a medication.  This may be as simple as swallowing a tablet or it may be a long running infusion.  Related resources tie this event to the authorizing prescription, and the specific encounter between patient and health care practitioner. */

export interface MedicationAdministration<Contained = ResourceList> {
	resourceType: `MedicationAdministration`
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
	/** Identifiers associated with this Medication Administration that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate. They are business identifiers assigned to this resource by the performer or other systems and remain constant as the resource is updated and propagates from server to server. */
	identifier?: Identifier[]
	/** A protocol, guideline, orderset, or other definition that was adhered to in whole or in part by this event. */
	instantiates?: string[]

	_instantiates?: Element[]
	/** A larger event of which this particular event is a component or step. */
	partOf?: Reference[]
	/** Will generally be set to show that the administration has been completed.  For some long running administrations such as infusions, it is possible for an administration to be started but not completed or it may be paused while some other process is under way. */
	status: string

	_status?: Element
	/** A code indicating why the administration was not performed. */
	statusReason?: CodeableConcept[]
	/** Indicates where the medication is expected to be consumed or administered. */
	category?: CodeableConcept

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
	/** The person or animal or group receiving the medication. */
	subject: Reference
	/** The visit, admission, or other contact between patient and health care provider during which the medication administration was performed. */
	context?: Reference
	/** Additional information (for example, patient height and weight) that supports the administration of the medication. */
	supportingInformation?: Reference[]

	effectiveDateTime?: string

	_effectiveDateTime?: Element

	effectivePeriod?: Period

	performer?: MedicationAdministrationPerformer[]
	/** A code indicating why the medication was given. */
	reasonCode?: CodeableConcept[]
	/** Condition or observation that supports why the medication was administered. */
	reasonReference?: Reference[]
	/** The original request, instruction or authority to perform the administration. */
	request?: Reference
	/** The device used in administering the medication to the patient.  For example, a particular infusion pump. */
	device?: Reference[]
	/** Extra information about the medication administration that is not conveyed by the other attributes. */
	note?: Annotation[]

	dosage?: MedicationAdministrationDosage
	/** A summary of the events of interest that have occurred, such as when the administration was verified. */
	eventHistory?: Reference[]
}

/** Describes the event of a patient consuming or otherwise being administered a medication.  This may be as simple as swallowing a tablet or it may be a long running infusion.  Related resources tie this event to the authorizing prescription, and the specific encounter between patient and health care practitioner. */

export interface MedicationAdministrationPerformer {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Distinguishes the type of involvement of the performer in the medication administration. */
	function?: CodeableConcept
	/** Indicates who or what performed the medication administration. */
	actor: Reference
}

/** Describes the event of a patient consuming or otherwise being administered a medication.  This may be as simple as swallowing a tablet or it may be a long running infusion.  Related resources tie this event to the authorizing prescription, and the specific encounter between patient and health care practitioner. */

export interface MedicationAdministrationDosage {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Free text dosage can be used for cases where the dosage administered is too complex to code. When coded dosage is present, the free text dosage may still be present for display to humans.

The dosage instructions should reflect the dosage of the medication that was administered. */
	text?: string

	_text?: Element
	/** A coded specification of the anatomic site where the medication first entered the body.  For example, "left arm". */
	site?: CodeableConcept
	/** A code specifying the route or physiological path of administration of a therapeutic agent into or onto the patient.  For example, topical, intravenous, etc. */
	route?: CodeableConcept
	/** A coded value indicating the method by which the medication is intended to be or was introduced into or on the body.  This attribute will most often NOT be populated.  It is most commonly used for injections.  For example, Slow Push, Deep IV. */
	method?: CodeableConcept
	/** The amount of the medication given at one administration event.   Use this value when the administration is essentially an instantaneous event such as a swallowing a tablet or giving an injection. */
	dose?: Quantity

	rateRatio?: Ratio

	rateQuantity?: Quantity
}

/** Indicates that a medication product is to be or has been dispensed for a named person/patient.  This includes a description of the medication product (supply) provided and the instructions for administering the medication.  The medication dispense is the result of a pharmacy system responding to a medication order. */

export interface MedicationDispense<Contained = ResourceList> {
	resourceType: `MedicationDispense`
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
	/** Identifiers associated with this Medication Dispense that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate. They are business identifiers assigned to this resource by the performer or other systems and remain constant as the resource is updated and propagates from server to server. */
	identifier?: Identifier[]
	/** The procedure that trigger the dispense. */
	partOf?: Reference[]
	/** A code specifying the state of the set of dispense events. */
	status: string

	_status?: Element

	statusReasonCodeableConcept?: CodeableConcept

	statusReasonReference?: Reference
	/** Indicates the type of medication dispense (for example, where the medication is expected to be consumed or administered (i.e. inpatient or outpatient)). */
	category?: CodeableConcept

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
	/** A link to a resource representing the person or the group to whom the medication will be given. */
	subject?: Reference
	/** The encounter or episode of care that establishes the context for this event. */
	context?: Reference
	/** Additional information that supports the medication being dispensed. */
	supportingInformation?: Reference[]

	performer?: MedicationDispensePerformer[]
	/** The principal physical location where the dispense was performed. */
	location?: Reference
	/** Indicates the medication order that is being dispensed against. */
	authorizingPrescription?: Reference[]
	/** Indicates the type of dispensing event that is performed. For example, Trial Fill, Completion of Trial, Partial Fill, Emergency Fill, Samples, etc. */
	type?: CodeableConcept
	/** The amount of medication that has been dispensed. Includes unit of measure. */
	quantity?: Quantity
	/** The amount of medication expressed as a timing amount. */
	daysSupply?: Quantity
	/** The time when the dispensed product was packaged and reviewed. */
	whenPrepared?: string

	_whenPrepared?: Element
	/** The time the dispensed product was provided to the patient or their representative. */
	whenHandedOver?: string

	_whenHandedOver?: Element
	/** Identification of the facility/location where the medication was shipped to, as part of the dispense event. */
	destination?: Reference
	/** Identifies the person who picked up the medication.  This will usually be a patient or their caregiver, but some cases exist where it can be a healthcare professional. */
	receiver?: Reference[]
	/** Extra information about the dispense that could not be conveyed in the other attributes. */
	note?: Annotation[]
	/** Indicates how the medication is to be used by the patient. */
	dosageInstruction?: Dosage[]

	substitution?: MedicationDispenseSubstitution
	/** Indicates an actual or potential clinical issue with or between one or more active or proposed clinical actions for a patient; e.g. drug-drug interaction, duplicate therapy, dosage alert etc. */
	detectedIssue?: Reference[]
	/** A summary of the events of interest that have occurred, such as when the dispense was verified. */
	eventHistory?: Reference[]
}

/** Indicates that a medication product is to be or has been dispensed for a named person/patient.  This includes a description of the medication product (supply) provided and the instructions for administering the medication.  The medication dispense is the result of a pharmacy system responding to a medication order. */

export interface MedicationDispensePerformer {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Distinguishes the type of performer in the dispense.  For example, date enterer, packager, final checker. */
	function?: CodeableConcept
	/** The device, practitioner, etc. who performed the action.  It should be assumed that the actor is the dispenser of the medication. */
	actor: Reference
}

/** Indicates that a medication product is to be or has been dispensed for a named person/patient.  This includes a description of the medication product (supply) provided and the instructions for administering the medication.  The medication dispense is the result of a pharmacy system responding to a medication order. */

export interface MedicationDispenseSubstitution {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** True if the dispenser dispensed a different drug or product from what was prescribed. */
	wasSubstituted: boolean

	_wasSubstituted?: Element
	/** A code signifying whether a different drug was dispensed from what was prescribed. */
	type?: CodeableConcept
	/** Indicates the reason for the substitution (or lack of substitution) from what was prescribed. */
	reason?: CodeableConcept[]
	/** The person or organization that has primary responsibility for the substitution. */
	responsibleParty?: Reference[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledge<Contained = ResourceList> {
	resourceType: `MedicationKnowledge`
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
	/** A code that specifies this medication, or a textual description if no code is available. Usage note: This could be a standard medication code such as a code from RxNorm, SNOMED CT, IDMP etc. It could also be a national or local formulary code, optionally with translations to other code systems. */
	code?: CodeableConcept
	/** A code to indicate if the medication is in active use.  The status refers to the validity about the information of the medication and not to its medicinal properties. */
	status?: string

	_status?: Element
	/** Describes the details of the manufacturer of the medication product.  This is not intended to represent the distributor of a medication product. */
	manufacturer?: Reference
	/** Describes the form of the item.  Powder; tablets; capsule. */
	doseForm?: CodeableConcept
	/** Specific amount of the drug in the packaged product.  For example, when specifying a product that has the same strength (For example, Insulin glargine 100 unit per mL solution for injection), this attribute provides additional clarification of the package amount (For example, 3 mL, 10mL, etc.). */
	amount?: Quantity
	/** Additional names for a medication, for example, the name(s) given to a medication in different countries.  For example, acetaminophen and paracetamol or salbutamol and albuterol. */
	synonym?: string[]

	_synonym?: Element[]

	relatedMedicationKnowledge?: MedicationKnowledgeRelatedMedicationKnowledge[]
	/** Associated or related medications.  For example, if the medication is a branded product (e.g. Crestor), this is the Therapeutic Moeity (e.g. Rosuvastatin) or if this is a generic medication (e.g. Rosuvastatin), this would link to a branded product (e.g. Crestor). */
	associatedMedication?: Reference[]
	/** Category of the medication or product (e.g. branded product, therapeutic moeity, generic product, innovator product, etc.). */
	productType?: CodeableConcept[]

	monograph?: MedicationKnowledgeMonograph[]

	ingredient?: MedicationKnowledgeIngredient[]
	/** The instructions for preparing the medication. */
	preparationInstruction?: string

	_preparationInstruction?: Element
	/** The intended or approved route of administration. */
	intendedRoute?: CodeableConcept[]

	cost?: MedicationKnowledgeCost[]

	monitoringProgram?: MedicationKnowledgeMonitoringProgram[]

	administrationGuidelines?: MedicationKnowledgeAdministrationGuidelines[]

	medicineClassification?: MedicationKnowledgeMedicineClassification[]

	packaging?: MedicationKnowledgePackaging

	drugCharacteristic?: MedicationKnowledgeDrugCharacteristic[]
	/** Potential clinical issue with or between medication(s) (for example, drug-drug interaction, drug-disease contraindication, drug-allergy interaction, etc.). */
	contraindication?: Reference[]

	regulatory?: MedicationKnowledgeRegulatory[]

	kinetics?: MedicationKnowledgeKinetics[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeRelatedMedicationKnowledge {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The category of the associated medication knowledge reference. */
	type: CodeableConcept
	/** Associated documentation about the associated medication knowledge. */
	reference: Reference[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeMonograph {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The category of documentation about the medication. (e.g. professional monograph, patient education monograph). */
	type?: CodeableConcept
	/** Associated documentation about the medication. */
	source?: Reference
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeIngredient {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	itemCodeableConcept?: CodeableConcept

	itemReference?: Reference
	/** Indication of whether this ingredient affects the therapeutic action of the drug. */
	isActive?: boolean

	_isActive?: Element
	/** Specifies how many (or how much) of the items there are in this Medication.  For example, 250 mg per tablet.  This is expressed as a ratio where the numerator is 250mg and the denominator is 1 tablet. */
	strength?: Ratio
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeCost {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The category of the cost information.  For example, manufacturers' cost, patient cost, claim reimbursement cost, actual acquisition cost. */
	type: CodeableConcept
	/** The source or owner that assigns the price to the medication. */
	source?: string

	_source?: Element
	/** The price of the medication. */
	cost: Money
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeMonitoringProgram {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Type of program under which the medication is monitored. */
	type?: CodeableConcept
	/** Name of the reviewing program. */
	name?: string

	_name?: Element
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeAdministrationGuidelines {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	dosage?: MedicationKnowledgeDosage[]

	indicationCodeableConcept?: CodeableConcept

	indicationReference?: Reference

	patientCharacteristics?: MedicationKnowledgePatientCharacteristics[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeDosage {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type: CodeableConcept

	dosage: Dosage[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgePatientCharacteristics {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	characteristicCodeableConcept?: CodeableConcept

	characteristicQuantity?: Quantity

	value?: string[]

	_value?: Element[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeMedicineClassification {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The type of category for the medication (for example, therapeutic classification, therapeutic sub-classification). */
	type: CodeableConcept
	/** Specific category assigned to the medication (e.g. anti-infective, anti-hypertensive, antibiotic, etc.). */
	classification?: CodeableConcept[]
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgePackaging {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A code that defines the specific type of packaging that the medication can be found in (e.g. blister sleeve, tube, bottle). */
	type?: CodeableConcept
	/** The number of product units the package would contain if fully loaded. */
	quantity?: Quantity
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeDrugCharacteristic {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A code specifying which characteristic of the medicine is being described (for example, colour, shape, imprint). */
	type?: CodeableConcept

	valueCodeableConcept?: CodeableConcept

	valueString?: string

	_valueString?: Element

	valueQuantity?: Quantity

	valueBase64Binary?: string

	_valueBase64Binary?: Element
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeRegulatory {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The authority that is specifying the regulations. */
	regulatoryAuthority: Reference

	substitution?: MedicationKnowledgeSubstitution[]

	schedule?: MedicationKnowledgeSchedule[]

	maxDispense?: MedicationKnowledgeMaxDispense
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeSubstitution {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	type: CodeableConcept

	allowed?: boolean

	_allowed?: Element
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeSchedule {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	schedule: CodeableConcept
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeMaxDispense {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	quantity: Quantity

	period?: Duration
}

/** Information about a medication that is used to support knowledge. */

export interface MedicationKnowledgeKinetics {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The drug concentration measured at certain discrete points in time. */
	areaUnderCurve?: Quantity[]
	/** The median lethal dose of a drug. */
	lethalDose50?: Quantity[]
	/** The time required for any specified property (e.g., the concentration of a substance in the body) to decrease by half. */
	halfLifePeriod?: Duration
}

/** An order or request for both supply of the medication and the instructions for administration of the medication to a patient. The resource is called "MedicationRequest" rather than "MedicationPrescription" or "MedicationOrder" to generalize the use across inpatient and outpatient settings, including care plans, etc., and to harmonize with workflow patterns. */

export interface MedicationRequest<Contained = ResourceList> {
	resourceType: `MedicationRequest`
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
	/** Identifiers associated with this medication request that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate. They are business identifiers assigned to this resource by the performer or other systems and remain constant as the resource is updated and propagates from server to server. */
	identifier?: Identifier[]
	/** A code specifying the current state of the order.  Generally, this will be active or completed state. */
	status: string

	_status?: Element
	/** Captures the reason for the current state of the MedicationRequest. */
	statusReason?: CodeableConcept
	/** Whether the request is a proposal, plan, or an original order. */
	intent: string

	_intent?: Element
	/** Indicates the type of medication request (for example, where the medication is expected to be consumed or administered (i.e. inpatient or outpatient)). */
	category?: CodeableConcept[]
	/** Indicates how quickly the Medication Request should be addressed with respect to other requests. */
	priority?: string

	_priority?: Element
	/** If true indicates that the provider is asking for the medication request not to occur. */
	doNotPerform?: boolean

	_doNotPerform?: Element

	reportedBoolean?: boolean

	_reportedBoolean?: Element

	reportedReference?: Reference

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
	/** A link to a resource representing the person or set of individuals to whom the medication will be given. */
	subject: Reference
	/** The Encounter during which this [x] was created or to which the creation of this record is tightly associated. */
	encounter?: Reference
	/** Include additional information (for example, patient height and weight) that supports the ordering of the medication. */
	supportingInformation?: Reference[]
	/** The date (and perhaps time) when the prescription was initially written or authored on. */
	authoredOn?: string

	_authoredOn?: Element
	/** The individual, organization, or device that initiated the request and has responsibility for its activation. */
	requester?: Reference
	/** The specified desired performer of the medication treatment (e.g. the performer of the medication administration). */
	performer?: Reference
	/** Indicates the type of performer of the administration of the medication. */
	performerType?: CodeableConcept
	/** The person who entered the order on behalf of another individual for example in the case of a verbal or a telephone order. */
	recorder?: Reference
	/** The reason or the indication for ordering or not ordering the medication. */
	reasonCode?: CodeableConcept[]
	/** Condition or observation that supports why the medication was ordered. */
	reasonReference?: Reference[]
	/** The URL pointing to a protocol, guideline, orderset, or other definition that is adhered to in whole or in part by this MedicationRequest. */
	instantiatesCanonical?: string[]

	_instantiatesCanonical?: Element[]
	/** The URL pointing to an externally maintained protocol, guideline, orderset or other definition that is adhered to in whole or in part by this MedicationRequest. */
	instantiatesUri?: string[]

	_instantiatesUri?: Element[]
	/** A plan or request that is fulfilled in whole or in part by this medication request. */
	basedOn?: Reference[]
	/** A shared identifier common to all requests that were authorized more or less simultaneously by a single author, representing the identifier of the requisition or prescription. */
	groupIdentifier?: Identifier
	/** The description of the overall patte3rn of the administration of the medication to the patient. */
	courseOfTherapyType?: CodeableConcept
	/** Insurance plans, coverage extensions, pre-authorizations and/or pre-determinations that may be required for delivering the requested service. */
	insurance?: Reference[]
	/** Extra information about the prescription that could not be conveyed by the other attributes. */
	note?: Annotation[]
	/** Indicates how the medication is to be used by the patient. */
	dosageInstruction?: Dosage[]

	dispenseRequest?: MedicationRequestDispenseRequest

	substitution?: MedicationRequestSubstitution
	/** A link to a resource representing an earlier order related order or prescription. */
	priorPrescription?: Reference
	/** Indicates an actual or potential clinical issue with or between one or more active or proposed clinical actions for a patient; e.g. Drug-drug interaction, duplicate therapy, dosage alert etc. */
	detectedIssue?: Reference[]
	/** Links to Provenance records for past versions of this resource or fulfilling request or event resources that identify key state transitions or updates that are likely to be relevant to a user looking at the current version of the resource. */
	eventHistory?: Reference[]
}

/** An order or request for both supply of the medication and the instructions for administration of the medication to a patient. The resource is called "MedicationRequest" rather than "MedicationPrescription" or "MedicationOrder" to generalize the use across inpatient and outpatient settings, including care plans, etc., and to harmonize with workflow patterns. */

export interface MedicationRequestDispenseRequest {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	initialFill?: MedicationRequestInitialFill
	/** The minimum period of time that must occur between dispenses of the medication. */
	dispenseInterval?: Duration
	/** This indicates the validity period of a prescription (stale dating the Prescription). */
	validityPeriod?: Period
	/** An integer indicating the number of times, in addition to the original dispense, (aka refills or repeats) that the patient can receive the prescribed medication. Usage Notes: This integer does not include the original order dispense. This means that if an order indicates dispense 30 tablets plus "3 repeats", then the order can be dispensed a total of 4 times and the patient can receive a total of 120 tablets.  A prescriber may explicitly say that zero refills are permitted after the initial dispense. */
	numberOfRepeatsAllowed?: number

	_numberOfRepeatsAllowed?: Element
	/** The amount that is to be dispensed for one fill. */
	quantity?: Quantity
	/** Identifies the period time over which the supplied product is expected to be used, or the length of time the dispense is expected to last. */
	expectedSupplyDuration?: Duration
	/** Indicates the intended dispensing Organization specified by the prescriber. */
	performer?: Reference
}

/** An order or request for both supply of the medication and the instructions for administration of the medication to a patient. The resource is called "MedicationRequest" rather than "MedicationPrescription" or "MedicationOrder" to generalize the use across inpatient and outpatient settings, including care plans, etc., and to harmonize with workflow patterns. */

export interface MedicationRequestInitialFill {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	quantity?: Quantity

	duration?: Duration
}

/** An order or request for both supply of the medication and the instructions for administration of the medication to a patient. The resource is called "MedicationRequest" rather than "MedicationPrescription" or "MedicationOrder" to generalize the use across inpatient and outpatient settings, including care plans, etc., and to harmonize with workflow patterns. */

export interface MedicationRequestSubstitution {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	allowedBoolean?: boolean

	_allowedBoolean?: Element

	allowedCodeableConcept?: CodeableConcept
	/** Indicates the reason for the substitution, or why substitution must or must not be performed. */
	reason?: CodeableConcept
}

/** A record of a medication that is being consumed by a patient.   A MedicationStatement may indicate that the patient may be taking the medication now or has taken the medication in the past or will be taking the medication in the future.  The source of this information can be the patient, significant other (such as a family member or spouse), or a clinician.  A common scenario where this information is captured is during the history taking process during a patient visit or stay.   The medication information may come from sources such as the patient's memory, from a prescription bottle,  or from a list of medications the patient, clinician or other party maintains. 

The primary difference between a medication statement and a medication administration is that the medication administration has complete administration information and is based on actual administration information from the person who administered the medication.  A medication statement is often, if not always, less specific.  There is no required date/time when the medication was administered, in fact we only know that a source has reported the patient is taking this medication, where details such as time, quantity, or rate or even medication product may be incomplete or missing or less precise.  As stated earlier, the medication statement information may come from the patient's memory, from a prescription bottle or from a list of medications the patient, clinician or other party maintains.  Medication administration is more formal and is not missing detailed information. */

export interface MedicationStatement<Contained = ResourceList> {
	resourceType: `MedicationStatement`
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
	/** Identifiers associated with this Medication Statement that are defined by business processes and/or used to refer to it when a direct URL reference to the resource itself is not appropriate. They are business identifiers assigned to this resource by the performer or other systems and remain constant as the resource is updated and propagates from server to server. */
	identifier?: Identifier[]
	/** A plan, proposal or order that is fulfilled in whole or in part by this event. */
	basedOn?: Reference[]
	/** A larger event of which this particular event is a component or step. */
	partOf?: Reference[]
	/** A code representing the patient or other source's judgment about the state of the medication used that this statement is about.  Generally, this will be active or completed. */
	status: string

	_status?: Element
	/** Captures the reason for the current state of the MedicationStatement. */
	statusReason?: CodeableConcept[]
	/** Indicates where the medication is expected to be consumed or administered. */
	category?: CodeableConcept

	medicationCodeableConcept?: CodeableConcept

	medicationReference?: Reference
	/** The person, animal or group who is/was taking the medication. */
	subject: Reference
	/** The encounter or episode of care that establishes the context for this MedicationStatement. */
	context?: Reference

	effectiveDateTime?: string

	_effectiveDateTime?: Element

	effectivePeriod?: Period
	/** The date when the medication statement was asserted by the information source. */
	dateAsserted?: string

	_dateAsserted?: Element
	/** The person or organization that provided the information about the taking of this medication. Note: Use derivedFrom when a MedicationStatement is derived from other resources, e.g. Claim or MedicationRequest. */
	informationSource?: Reference
	/** Allows linking the MedicationStatement to the underlying MedicationRequest, or to other information that supports or is used to derive the MedicationStatement. */
	derivedFrom?: Reference[]
	/** A reason for why the medication is being/was taken. */
	reasonCode?: CodeableConcept[]
	/** Condition or observation that supports why the medication is being/was taken. */
	reasonReference?: Reference[]
	/** Provides extra information about the medication statement that is not conveyed by the other attributes. */
	note?: Annotation[]
	/** Indicates how the medication is/was or should be taken by the patient. */
	dosage?: Dosage[]
}
