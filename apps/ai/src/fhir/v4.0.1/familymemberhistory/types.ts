import type {
  Meta,
  Element,
  Extension,
  Identifier,
  CodeableConcept,
  Reference,
  Period,
  Age,
  Range,
  Annotation,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** Significant health conditions for a person related to the patient relevant in the context of care for the patient. */

export interface FamilyMemberHistory<Contained = ResourceList> {
  resourceType: `FamilyMemberHistory`;
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
  /** Business identifiers assigned to this family member history by the performer or other systems which remain constant as the resource is updated and propagates from server to server. */
  identifier?: Identifier[];
  /** The URL pointing to a FHIR-defined protocol, guideline, orderset or other definition that is adhered to in whole or in part by this FamilyMemberHistory. */
  instantiatesCanonical?: string[];
  /** The URL pointing to an externally maintained protocol, guideline, orderset or other definition that is adhered to in whole or in part by this FamilyMemberHistory. */
  instantiatesUri?: string[];

  _instantiatesUri?: Element[];
  /** A code specifying the status of the record of the family history of a specific family member. */
  status: "partial" | "completed" | "entered-in-error" | "health-unknown";

  _status?: Element;
  /** Describes why the family member's history is not available. */
  dataAbsentReason?: CodeableConcept;
  /** The person who this history concerns. */
  patient: Reference;
  /** The date (and possibly time) when the family member history was recorded or last updated. */
  date?: string;

  _date?: Element;
  /** This will either be a name or a description; e.g. "Aunt Susan", "my cousin with the red hair". */
  name?: string;

  _name?: Element;
  /** The type of relationship this person has to the patient (father, mother, brother etc.). */
  relationship: CodeableConcept;
  /** The birth sex of the family member. */
  sex?: CodeableConcept;

  bornPeriod?: Period;

  bornDate?: string;

  _bornDate?: Element;

  bornString?: string;

  _bornString?: Element;

  ageAge?: Age;

  ageRange?: Range;

  ageString?: string;

  _ageString?: Element;
  /** If true, indicates that the age value specified is an estimated value. */
  estimatedAge?: boolean;

  _estimatedAge?: Element;

  deceasedBoolean?: boolean;

  _deceasedBoolean?: Element;

  deceasedAge?: Age;

  deceasedRange?: Range;

  deceasedDate?: string;

  _deceasedDate?: Element;

  deceasedString?: string;

  _deceasedString?: Element;
  /** Describes why the family member history occurred in coded or textual form. */
  reasonCode?: CodeableConcept[];
  /** Indicates a Condition, Observation, AllergyIntolerance, or QuestionnaireResponse that justifies this family member history event. */
  reasonReference?: Reference[];
  /** This property allows a non condition-specific note to the made about the related person. Ideally, the note would be in the condition property, but this is not always possible. */
  note?: Annotation[];

  condition?: FamilyMemberHistoryCondition[];
}

/** Significant health conditions for a person related to the patient relevant in the context of care for the patient. */

export interface FamilyMemberHistoryCondition {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The actual condition specified. Could be a coded condition (like MI or Diabetes) or a less specific string like 'cancer' depending on how much is known about the condition and the capabilities of the creating system. */
  code: CodeableConcept;
  /** Indicates what happened following the condition.  If the condition resulted in death, deceased date is captured on the relation. */
  outcome?: CodeableConcept;
  /** This condition contributed to the cause of death of the related person. If contributedToDeath is not populated, then it is unknown. */
  contributedToDeath?: boolean;

  _contributedToDeath?: Element;

  onsetAge?: Age;

  onsetRange?: Range;

  onsetPeriod?: Period;

  onsetString?: string;

  _onsetString?: Element;
  /** An area where general notes can be placed about this specific condition. */
  note?: Annotation[];
}
