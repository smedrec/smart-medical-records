import type {
  Meta,
  Element,
  Extension,
  Identifier,
  ContactDetail,
  UsageContext,
  CodeableConcept,
  Period,
  Coding,
  Quantity,
  Reference,
  Attachment,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */

export interface Questionnaire<Contained = ResourceList> {
  resourceType: `Questionnaire`;
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
  /** An absolute URI that is used to identify this questionnaire when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which at which an authoritative instance of this questionnaire is (or will be) published. This URL can be the target of a canonical reference. It SHALL remain the same when the questionnaire is stored on different servers. */
  url?: string;

  _url?: Element;
  /** A formal identifier that is used to identify this questionnaire when it is represented in other formats, or referenced in a specification, model, design or an instance. */
  identifier?: Identifier[];
  /** The identifier that is used to identify this version of the questionnaire when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the questionnaire author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence. */
  version?: string;

  _version?: Element;
  /** A natural language name identifying the questionnaire. This name should be usable as an identifier for the module by machine processing applications such as code generation. */
  name?: string;

  _name?: Element;
  /** A short, descriptive, user-friendly title for the questionnaire. */
  title?: string;

  _title?: Element;
  /** The URL of a Questionnaire that this Questionnaire is based on. */
  derivedFrom?: string[];
  /** The status of this questionnaire. Enables tracking the life-cycle of the content. */
  status: "draft" | "active" | "retired" | "unknown";

  _status?: Element;
  /** A Boolean value to indicate that this questionnaire is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage. */
  experimental?: boolean;

  _experimental?: Element;
  /** The types of subjects that can be the subject of responses created for the questionnaire. */
  subjectType?: string[];

  _subjectType?: Element[];
  /** The date  (and optionally time) when the questionnaire was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the questionnaire changes. */
  date?: string;

  _date?: Element;
  /** The name of the organization or individual that published the questionnaire. */
  publisher?: string;

  _publisher?: Element;
  /** Contact details to assist a user in finding and communicating with the publisher. */
  contact?: ContactDetail[];
  /** A free text natural language description of the questionnaire from a consumer's perspective. */
  description?: string;

  _description?: Element;
  /** The content was developed with a focus and intent of supporting the contexts that are listed. These contexts may be general categories (gender, age, ...) or may be references to specific programs (insurance plans, studies, ...) and may be used to assist with indexing and searching for appropriate questionnaire instances. */
  useContext?: UsageContext[];
  /** A legal or geographic region in which the questionnaire is intended to be used. */
  jurisdiction?: CodeableConcept[];
  /** Explanation of why this questionnaire is needed and why it has been designed as it has. */
  purpose?: string;

  _purpose?: Element;
  /** A copyright statement relating to the questionnaire and/or its contents. Copyright statements are generally legal restrictions on the use and publishing of the questionnaire. */
  copyright?: string;

  _copyright?: Element;
  /** The date on which the resource content was approved by the publisher. Approval happens once when the content is officially approved for usage. */
  approvalDate?: string;

  _approvalDate?: Element;
  /** The date on which the resource content was last reviewed. Review happens periodically after approval but does not change the original approval date. */
  lastReviewDate?: string;

  _lastReviewDate?: Element;
  /** The period during which the questionnaire content was or is planned to be in active use. */
  effectivePeriod?: Period;
  /** An identifier for this question or group of questions in a particular terminology such as LOINC. */
  code?: Coding[];

  item?: QuestionnaireItem[];
}

/** A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */

export interface QuestionnaireItem {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  linkId?: string;

  _linkId?: Element;
  /** This element is a URI that refers to an [ElementDefinition](elementdefinition.html) that provides information about this item, including information that might otherwise be included in the instance of the Questionnaire resource. A detailed description of the construction of the URI is shown in Comments, below. If this element is present then the following element values MAY be derived from the Element Definition if the corresponding elements of this Questionnaire resource instance have no value:

* code (ElementDefinition.code) 
* type (ElementDefinition.type) 
* required (ElementDefinition.min) 
* repeats (ElementDefinition.max) 
* maxLength (ElementDefinition.maxLength) 
* answerValueSet (ElementDefinition.binding)
* options (ElementDefinition.binding). */
  definition?: string;

  _definition?: Element;
  /** A terminology code that corresponds to this group or question (e.g. a code from LOINC, which defines many questions and answers). */
  code?: Coding[];
  /** A short label for a particular group, question or set of display text within the questionnaire used for reference by the individual completing the questionnaire. */
  prefix?: string;

  _prefix?: Element;
  /** The name of a section, the text of a question or text content for a display item. */
  text?: string;

  _text?: Element;
  /** The type of questionnaire item this is - whether text for display, a grouping of other items or a particular type of data to be captured (string, integer, coded choice, etc.). */
  type:
    | "group"
    | "display"
    | "boolean"
    | "decimal"
    | "integer"
    | "date"
    | "dateTime"
    | "time"
    | "string"
    | "text"
    | "url"
    | "choice"
    | "open-choice"
    | "attachment"
    | "reference"
    | "quantity";

  _type?: Element;

  enableWhen?: QuestionnaireEnableWhen[];
  /** Controls how multiple enableWhen values are interpreted -  whether all or any must be true. */
  enableBehavior?: "all" | "any";

  _enableBehavior?: Element;
  /** An indication, if true, that the item must be present in a "completed" QuestionnaireResponse.  If false, the item may be skipped when answering the questionnaire. */
  required?: boolean;

  _required?: Element;
  /** An indication, if true, that the item may occur multiple times in the response, collecting multiple answers for questions or multiple sets of answers for groups. */
  repeats?: boolean;

  _repeats?: Element;
  /** An indication, when true, that the value cannot be changed by a human respondent to the Questionnaire. */
  readOnly?: boolean;

  _readOnly?: Element;
  /** The maximum number of characters that are permitted in the answer to be considered a "valid" QuestionnaireResponse. */
  maxLength?: number;

  _maxLength?: Element;
  /** A reference to a value set containing a list of codes representing permitted answers for a "choice" or "open-choice" question. */
  answerValueSet?: string;

  answerOption?: QuestionnaireAnswerOption[];

  initial?: QuestionnaireInitial[];

  item?: QuestionnaireItem[];
}

/** A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */

export interface QuestionnaireEnableWhen {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  question?: string;

  _question?: Element;

  operator?: "exists" | "=" | "!=" | ">" | "<" | ">=" | "<=";

  _operator?: Element;

  answerBoolean?: boolean;

  _answerBoolean?: Element;

  answerDecimal?: number;

  _answerDecimal?: Element;

  answerInteger?: number;

  _answerInteger?: Element;

  answerDate?: string;

  _answerDate?: Element;

  answerDateTime?: string;

  _answerDateTime?: Element;

  answerTime?: string;

  _answerTime?: Element;

  answerString?: string;

  _answerString?: Element;

  answerCoding?: Coding;

  answerQuantity?: Quantity;

  answerReference?: Reference;
}

/** A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */

export interface QuestionnaireAnswerOption {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  valueInteger?: number;

  _valueInteger?: Element;

  valueDate?: string;

  _valueDate?: Element;

  valueTime?: string;

  _valueTime?: Element;

  valueString?: string;

  _valueString?: Element;

  valueCoding?: Coding;

  valueReference?: Reference;

  initialSelected?: boolean;

  _initialSelected?: Element;
}

/** A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection. */

export interface QuestionnaireInitial {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  valueBoolean?: boolean;

  _valueBoolean?: Element;

  valueDecimal?: number;

  _valueDecimal?: Element;

  valueInteger?: number;

  _valueInteger?: Element;

  valueDate?: string;

  _valueDate?: Element;

  valueDateTime?: string;

  _valueDateTime?: Element;

  valueTime?: string;

  _valueTime?: Element;

  valueString?: string;

  _valueString?: Element;

  valueUri?: string;

  _valueUri?: Element;

  valueAttachment?: Attachment;

  valueCoding?: Coding;

  valueQuantity?: Quantity;

  valueReference?: Reference;
}

/** A structured set of questions and their answers. The questions are ordered and grouped into coherent subsets, corresponding to the structure of the grouping of the questionnaire being responded to. */

export interface QuestionnaireResponse<Contained = ResourceList> {
  resourceType: `QuestionnaireResponse`;
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
  /** A business identifier assigned to a particular completed (or partially completed) questionnaire. */
  identifier?: Identifier;
  /** The order, proposal or plan that is fulfilled in whole or in part by this QuestionnaireResponse.  For example, a ServiceRequest seeking an intake assessment or a decision support recommendation to assess for post-partum depression. */
  basedOn?: Reference[];
  /** A procedure or observation that this questionnaire was performed as part of the execution of.  For example, the surgery a checklist was executed as part of. */
  partOf?: Reference[];
  /** The Questionnaire that defines and organizes the questions for which answers are being provided. */
  questionnaire?: string;
  /** The position of the questionnaire response within its overall lifecycle. */
  status:
    | "in-progress"
    | "completed"
    | "amended"
    | "entered-in-error"
    | "stopped";

  _status?: Element;
  /** The subject of the questionnaire response.  This could be a patient, organization, practitioner, device, etc.  This is who/what the answers apply to, but is not necessarily the source of information. */
  subject?: Reference;
  /** The Encounter during which this questionnaire response was created or to which the creation of this record is tightly associated. */
  encounter?: Reference;
  /** The date and/or time that this set of answers were last changed. */
  authored?: string;

  _authored?: Element;
  /** Person who received the answers to the questions in the QuestionnaireResponse and recorded them in the system. */
  author?: Reference;
  /** The person who answered the questions about the subject. */
  source?: Reference;

  item?: QuestionnaireResponseItem[];
}

/** A structured set of questions and their answers. The questions are ordered and grouped into coherent subsets, corresponding to the structure of the grouping of the questionnaire being responded to. */

export interface QuestionnaireResponseItem {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The item from the Questionnaire that corresponds to this item in the QuestionnaireResponse resource. */
  linkId: string;

  _linkId?: Element;
  /** A reference to an [ElementDefinition](elementdefinition.html) that provides the details for the item. */
  definition?: string;

  _definition?: Element;
  /** Text that is displayed above the contents of the group or as the text of the question being answered. */
  text?: string;

  _text?: Element;

  answer?: QuestionnaireResponseAnswer[];

  item?: QuestionnaireResponseItem[];
}

/** A structured set of questions and their answers. The questions are ordered and grouped into coherent subsets, corresponding to the structure of the grouping of the questionnaire being responded to. */

export interface QuestionnaireResponseAnswer {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  valueBoolean?: boolean;

  _valueBoolean?: Element;

  valueDecimal?: number;

  _valueDecimal?: Element;

  valueInteger?: number;

  _valueInteger?: Element;

  valueDate?: string;

  _valueDate?: Element;

  valueDateTime?: string;

  _valueDateTime?: Element;

  valueTime?: string;

  _valueTime?: Element;

  valueString?: string;

  _valueString?: Element;

  valueUri?: string;

  _valueUri?: Element;

  valueAttachment?: Attachment;

  valueCoding?: Coding;

  valueQuantity?: Quantity;

  valueReference?: Reference;

  item?: QuestionnaireResponseItem[];
}
