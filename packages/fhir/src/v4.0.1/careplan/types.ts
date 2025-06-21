import type {
  Meta,
  Element,
  Extension,
  Identifier,
  Reference,
  CodeableConcept,
  Period,
  Annotation,
  Timing,
  Quantity,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** Describes the intention of how one or more practitioners intend to deliver care for a particular patient, group or community for a period of time, possibly limited to care for a specific condition or set of conditions. */

export interface CarePlan<Contained = ResourceList> {
  resourceType: `CarePlan`;
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
  /** Business identifiers assigned to this care plan by the performer or other systems which remain constant as the resource is updated and propagates from server to server. */
  identifier?: Identifier[];
  /** The URL pointing to a FHIR-defined protocol, guideline, questionnaire or other definition that is adhered to in whole or in part by this CarePlan. */
  instantiatesCanonical?: string[];
  /** The URL pointing to an externally maintained protocol, guideline, questionnaire or other definition that is adhered to in whole or in part by this CarePlan. */
  instantiatesUri?: string[];

  _instantiatesUri?: Element[];
  /** A care plan that is fulfilled in whole or in part by this care plan. */
  basedOn?: Reference[];
  /** Completed or terminated care plan whose function is taken by this new care plan. */
  replaces?: Reference[];
  /** A larger care plan of which this particular care plan is a component or step. */
  partOf?: Reference[];
  /** Indicates whether the plan is currently being acted upon, represents future intentions or is now a historical record. */
  status: string;

  _status?: Element;
  /** Indicates the level of authority/intentionality associated with the care plan and where the care plan fits into the workflow chain. */
  intent: string;

  _intent?: Element;
  /** Identifies what "kind" of plan this is to support differentiation between multiple co-existing plans; e.g. "Home health", "psychiatric", "asthma", "disease management", "wellness plan", etc. */
  category?: CodeableConcept[];
  /** Human-friendly name for the care plan. */
  title?: string;

  _title?: Element;
  /** A description of the scope and nature of the plan. */
  description?: string;

  _description?: Element;
  /** Identifies the patient or group whose intended care is described by the plan. */
  subject: Reference;
  /** The Encounter during which this CarePlan was created or to which the creation of this record is tightly associated. */
  encounter?: Reference;
  /** Indicates when the plan did (or is intended to) come into effect and end. */
  period?: Period;
  /** Represents when this particular CarePlan record was created in the system, which is often a system-generated date. */
  created?: string;

  _created?: Element;
  /** When populated, the author is responsible for the care plan.  The care plan is attributed to the author. */
  author?: Reference;
  /** Identifies the individual(s) or organization who provided the contents of the care plan. */
  contributor?: Reference[];
  /** Identifies all people and organizations who are expected to be involved in the care envisioned by this plan. */
  careTeam?: Reference[];
  /** Identifies the conditions/problems/concerns/diagnoses/etc. whose management and/or mitigation are handled by this plan. */
  addresses?: Reference[];
  /** Identifies portions of the patient's record that specifically influenced the formation of the plan.  These might include comorbidities, recent procedures, limitations, recent assessments, etc. */
  supportingInfo?: Reference[];
  /** Describes the intended objective(s) of carrying out the care plan. */
  goal?: Reference[];

  activity?: CarePlanActivity[];
  /** General notes about the care plan not covered elsewhere. */
  note?: Annotation[];
}

/** Describes the intention of how one or more practitioners intend to deliver care for a particular patient, group or community for a period of time, possibly limited to care for a specific condition or set of conditions. */

export interface CarePlanActivity {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Identifies the outcome at the point when the status of the activity is assessed.  For example, the outcome of an education activity could be patient understands (or not). */
  outcomeCodeableConcept?: CodeableConcept[];
  /** Details of the outcome or action resulting from the activity.  The reference to an "event" resource, such as Procedure or Encounter or Observation, is the result/outcome of the activity itself.  The activity can be conveyed using CarePlan.activity.detail OR using the CarePlan.activity.reference (a reference to a “request” resource). */
  outcomeReference?: Reference[];
  /** Notes about the adherence/status/progress of the activity. */
  progress?: Annotation[];
  /** The details of the proposed activity represented in a specific resource. */
  reference?: Reference;

  detail?: CarePlanDetail;
}

/** Describes the intention of how one or more practitioners intend to deliver care for a particular patient, group or community for a period of time, possibly limited to care for a specific condition or set of conditions. */

export interface CarePlanDetail {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  kind?: string;

  _kind?: Element;

  instantiatesCanonical?: string[];

  instantiatesUri?: string[];

  _instantiatesUri?: Element[];

  code?: CodeableConcept;

  reasonCode?: CodeableConcept[];

  reasonReference?: Reference[];

  goal?: Reference[];

  status?:
    | "not-started"
    | "scheduled"
    | "in-progress"
    | "on-hold"
    | "completed"
    | "cancelled"
    | "stopped"
    | "unknown"
    | "entered-in-error";

  _status?: Element;

  statusReason?: CodeableConcept;

  doNotPerform?: boolean;

  _doNotPerform?: Element;

  scheduledTiming?: Timing;

  scheduledPeriod?: Period;

  scheduledString?: string;

  _scheduledString?: Element;

  location?: Reference;

  performer?: Reference[];

  productCodeableConcept?: CodeableConcept;

  productReference?: Reference;

  dailyAmount?: Quantity;

  quantity?: Quantity;

  description?: string;

  _description?: Element;
}
