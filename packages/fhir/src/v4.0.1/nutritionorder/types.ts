import type {
  Meta,
  Element,
  Extension,
  Identifier,
  Reference,
  CodeableConcept,
  Annotation,
  Timing,
  Quantity,
  Ratio,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrder<Contained = ResourceList> {
  resourceType: `NutritionOrder`;
  /** The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes. */
  id?: string;
  /** The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource. */
  meta?: Meta;
  /** A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc. */
  implicitRules?: string;

  _implicitRules?: Element;
  /** The base language in which the resource is written. */
  language?: string;

  _language?: Element;
  /** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
  text?: Narrative;
  contained?: Contained[];
  /** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Identifiers assigned to this order by the order sender or by the order receiver. */
  identifier?: Identifier[];
  /** The URL pointing to a FHIR-defined protocol, guideline, orderset or other definition that is adhered to in whole or in part by this NutritionOrder. */
  instantiatesCanonical?: string[];
  /** The URL pointing to an externally maintained protocol, guideline, orderset or other definition that is adhered to in whole or in part by this NutritionOrder. */
  instantiatesUri?: string[];

  _instantiatesUri?: Element[];
  /** The URL pointing to a protocol, guideline, orderset or other definition that is adhered to in whole or in part by this NutritionOrder. */
  instantiates?: string[];

  _instantiates?: Element[];
  /** The workflow status of the nutrition order/request. */
  status: string;

  _status?: Element;
  /** Indicates the level of authority/intentionality associated with the NutrionOrder and where the request fits into the workflow chain. */
  intent: string;

  _intent?: Element;
  /** The person (patient) who needs the nutrition order for an oral diet, nutritional supplement and/or enteral or formula feeding. */
  patient: Reference;
  /** An encounter that provides additional information about the healthcare context in which this request is made. */
  encounter?: Reference;
  /** The date and time that this nutrition order was requested. */
  dateTime: string;

  _dateTime?: Element;
  /** The practitioner that holds legal responsibility for ordering the diet, nutritional supplement, or formula feedings. */
  orderer?: Reference;
  /** A link to a record of allergies or intolerances  which should be included in the nutrition order. */
  allergyIntolerance?: Reference[];
  /** This modifier is used to convey order-specific modifiers about the type of food that should be given. These can be derived from patient allergies, intolerances, or preferences such as Halal, Vegan or Kosher. This modifier applies to the entire nutrition order inclusive of the oral diet, nutritional supplements and enteral formula feedings. */
  foodPreferenceModifier?: CodeableConcept[];
  /** This modifier is used to convey Order-specific modifier about the type of oral food or oral fluids that should not be given. These can be derived from patient allergies, intolerances, or preferences such as No Red Meat, No Soy or No Wheat or  Gluten-Free.  While it should not be necessary to repeat allergy or intolerance information captured in the referenced AllergyIntolerance resource in the excludeFoodModifier, this element may be used to convey additional specificity related to foods that should be eliminated from the patient’s diet for any reason.  This modifier applies to the entire nutrition order inclusive of the oral diet, nutritional supplements and enteral formula feedings. */
  excludeFoodModifier?: CodeableConcept[];

  oralDiet?: NutritionOrderOralDiet;

  supplement?: NutritionOrderSupplement[];

  enteralFormula?: NutritionOrderEnteralFormula;
  /** Comments made about the {{title}} by the requester, performer, subject or other participants. */
  note?: Annotation[];
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderOralDiet {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The kind of diet or dietary restriction such as fiber restricted diet or diabetic diet. */
  type?: CodeableConcept[];
  /** The time period and frequency at which the diet should be given.  The diet should be given for the combination of all schedules if more than one schedule is present. */
  schedule?: Timing[];

  nutrient?: NutritionOrderNutrient[];

  texture?: NutritionOrderTexture[];
  /** The required consistency (e.g. honey-thick, nectar-thick, thin, thickened.) of liquids or fluids served to the patient. */
  fluidConsistencyType?: CodeableConcept[];
  /** Free text or additional instructions or information pertaining to the oral diet. */
  instruction?: string;

  _instruction?: Element;
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderNutrient {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  modifier?: CodeableConcept;

  amount?: Quantity;
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderTexture {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  modifier?: CodeableConcept;

  foodType?: CodeableConcept;
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderSupplement {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The kind of nutritional supplement product required such as a high protein or pediatric clear liquid supplement. */
  type?: CodeableConcept;
  /** The product or brand name of the nutritional supplement such as "Acme Protein Shake". */
  productName?: string;

  _productName?: Element;
  /** The time period and frequency at which the supplement(s) should be given.  The supplement should be given for the combination of all schedules if more than one schedule is present. */
  schedule?: Timing[];
  /** The amount of the nutritional supplement to be given. */
  quantity?: Quantity;
  /** Free text or additional instructions or information pertaining to the oral supplement. */
  instruction?: string;

  _instruction?: Element;
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderEnteralFormula {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The type of enteral or infant formula such as an adult standard formula with fiber or a soy-based infant formula. */
  baseFormulaType?: CodeableConcept;
  /** The product or brand name of the enteral or infant formula product such as "ACME Adult Standard Formula". */
  baseFormulaProductName?: string;

  _baseFormulaProductName?: Element;
  /** Indicates the type of modular component such as protein, carbohydrate, fat or fiber to be provided in addition to or mixed with the base formula. */
  additiveType?: CodeableConcept;
  /** The product or brand name of the type of modular component to be added to the formula. */
  additiveProductName?: string;

  _additiveProductName?: Element;
  /** The amount of energy (calories) that the formula should provide per specified volume, typically per mL or fluid oz.  For example, an infant may require a formula that provides 24 calories per fluid ounce or an adult may require an enteral formula that provides 1.5 calorie/mL. */
  caloricDensity?: Quantity;
  /** The route or physiological path of administration into the patient's gastrointestinal  tract for purposes of providing the formula feeding, e.g. nasogastric tube. */
  routeofAdministration?: CodeableConcept;

  administration?: NutritionOrderAdministration[];
  /** The maximum total quantity of formula that may be administered to a subject over the period of time, e.g. 1440 mL over 24 hours. */
  maxVolumeToDeliver?: Quantity;
  /** Free text formula administration, feeding instructions or additional instructions or information. */
  administrationInstruction?: string;

  _administrationInstruction?: Element;
}

/** A request to supply a diet, formula feeding (enteral) or oral nutritional supplement to a patient/resident. */

export interface NutritionOrderAdministration {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  schedule?: Timing;

  quantity?: Quantity;

  rateQuantity?: Quantity;

  rateRatio?: Ratio;
}
