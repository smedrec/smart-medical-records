import type {
  Meta,
  Element,
  Extension,
  Identifier,
  Reference,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** A summary of information based on the results of executing a TestScript. */

export interface TestReport<Contained = ResourceList> {
  resourceType: `TestReport`;
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
  /** Identifier for the TestScript assigned for external purposes outside the context of FHIR. */
  identifier?: Identifier;
  /** A free text natural language name identifying the executed TestScript. */
  name?: string;

  _name?: Element;
  /** The current state of this test report. */
  status:
    | "completed"
    | "in-progress"
    | "waiting"
    | "stopped"
    | "entered-in-error";

  _status?: Element;
  /** Ideally this is an absolute URL that is used to identify the version-specific TestScript that was executed, matching the `TestScript.url`. */
  testScript: Reference;
  /** The overall result from the execution of the TestScript. */
  result: "pass" | "fail" | "pending";

  _result?: Element;
  /** The final score (percentage of tests passed) resulting from the execution of the TestScript. */
  score?: number;

  _score?: Element;
  /** Name of the tester producing this report (Organization or individual). */
  tester?: string;

  _tester?: Element;
  /** When the TestScript was executed and this TestReport was generated. */
  issued?: string;

  _issued?: Element;

  participant?: TestReportParticipant[];

  setup?: TestReportSetup;

  test?: TestReportTest[];

  teardown?: TestReportTeardown;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportParticipant {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The type of participant. */
  type: "test-engine" | "client" | "server";

  _type?: Element;
  /** The uri of the participant. An absolute URL is preferred. */
  uri: string;

  _uri?: Element;
  /** The display name of the participant. */
  display?: string;

  _display?: Element;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportSetup {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];

  action: TestReportAction[];
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportAction {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  operation?: TestReportOperation;

  assert?: TestReportAssert;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportOperation {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  result?: "pass" | "skip" | "fail" | "warning" | "error";

  _result?: Element;

  message?: string;

  _message?: Element;

  detail?: string;

  _detail?: Element;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportAssert {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  result?: "pass" | "skip" | "fail" | "warning" | "error";

  _result?: Element;

  message?: string;

  _message?: Element;

  detail?: string;

  _detail?: Element;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportTest {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The name of this test used for tracking/logging purposes by test engines. */
  name?: string;

  _name?: Element;
  /** A short description of the test used by test engines for tracking and reporting purposes. */
  description?: string;

  _description?: Element;

  action: TestReportAction1[];
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportAction1 {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  operation?: TestReportOperation;

  assert?: TestReportAssert;
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportTeardown {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];

  action: TestReportAction2[];
}

/** A summary of information based on the results of executing a TestScript. */

export interface TestReportAction2 {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  operation: TestReportOperation;
}
