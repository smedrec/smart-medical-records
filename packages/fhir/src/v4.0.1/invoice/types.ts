import type {
  Meta,
  Element,
  Extension,
  Identifier,
  CodeableConcept,
  Reference,
  Money,
  Annotation,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** Invoice containing collected ChargeItems from an Account with calculated individual and total price for Billing purpose. */

export interface Invoice<Contained = ResourceList> {
  resourceType: `Invoice`;
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
  /** Identifier of this Invoice, often used for reference in correspondence about this invoice or for tracking of payments. */
  identifier?: Identifier[];
  /** The current state of the Invoice. */
  status: "draft" | "issued" | "balanced" | "cancelled" | "entered-in-error";

  _status?: Element;
  /** In case of Invoice cancellation a reason must be given (entered in error, superseded by corrected invoice etc.). */
  cancelledReason?: string;

  _cancelledReason?: Element;
  /** Type of Invoice depending on domain, realm an usage (e.g. internal/external, dental, preliminary). */
  type?: CodeableConcept;
  /** The individual or set of individuals receiving the goods and services billed in this invoice. */
  subject?: Reference;
  /** The individual or Organization responsible for balancing of this invoice. */
  recipient?: Reference;
  /** Date/time(s) of when this Invoice was posted. */
  date?: string;

  _date?: Element;

  participant?: InvoiceParticipant[];
  /** The organizationissuing the Invoice. */
  issuer?: Reference;
  /** Account which is supposed to be balanced with this Invoice. */
  account?: Reference;

  lineItem?: InvoiceLineItem[];

  totalPriceComponent?: InvoicePriceComponent[];
  /** Invoice total , taxes excluded. */
  totalNet?: Money;
  /** Invoice total, tax included. */
  totalGross?: Money;
  /** Payment details such as banking details, period of payment, deductibles, methods of payment. */
  paymentTerms?: string;

  _paymentTerms?: Element;
  /** Comments made about the invoice by the issuer, subject, or other participants. */
  note?: Annotation[];
}

/** Invoice containing collected ChargeItems from an Account with calculated individual and total price for Billing purpose. */

export interface InvoiceParticipant {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Describes the type of involvement (e.g. transcriptionist, creator etc.). If the invoice has been created automatically, the Participant may be a billing engine or another kind of device. */
  role?: CodeableConcept;
  /** The device, practitioner, etc. who performed or participated in the service. */
  actor: Reference;
}

/** Invoice containing collected ChargeItems from an Account with calculated individual and total price for Billing purpose. */

export interface InvoiceLineItem {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Sequence in which the items appear on the invoice. */
  sequence?: number;

  _sequence?: Element;

  chargeItemReference?: Reference;

  chargeItemCodeableConcept?: CodeableConcept;

  priceComponent?: InvoicePriceComponent[];
}

/** Invoice containing collected ChargeItems from an Account with calculated individual and total price for Billing purpose. */

export interface InvoicePriceComponent {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  type?:
    | "base"
    | "surcharge"
    | "deduction"
    | "discount"
    | "tax"
    | "informational";

  _type?: Element;

  code?: CodeableConcept;

  factor?: number;

  _factor?: Element;

  amount?: Money;
}
