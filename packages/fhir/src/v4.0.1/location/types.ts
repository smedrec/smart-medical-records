import type {
  Meta,
  Element,
  Extension,
  Identifier,
  Coding,
  CodeableConcept,
  ContactPoint,
  Address,
  Reference,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated. */

export interface Location<Contained = ResourceList> {
  resourceType: `Location`;
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
  /** Unique code or number identifying the location to its users. */
  identifier?: Identifier[];
  /** The status property covers the general availability of the resource, not the current value which may be covered by the operationStatus, or by a schedule/slots if they are configured for the location. */
  status?: "active" | "suspended" | "inactive";

  _status?: Element;
  /** The operational status covers operation values most relevant to beds (but can also apply to rooms/units/chairs/etc. such as an isolation unit/dialysis chair). This typically covers concepts such as contamination, housekeeping, and other activities like maintenance. */
  operationalStatus?: Coding;
  /** Name of the location as used by humans. Does not need to be unique. */
  name?: string;

  _name?: Element;
  /** A list of alternate names that the location is known as, or was known as, in the past. */
  alias?: string[];

  _alias?: Element[];
  /** Description of the Location, which helps in finding or referencing the place. */
  description?: string;

  _description?: Element;
  /** Indicates whether a resource instance represents a specific location or a class of locations. */
  mode?: "instance" | "kind";

  _mode?: Element;
  /** Indicates the type of function performed at the location. */
  type?: CodeableConcept[];
  /** The contact details of communication devices available at the location. This can include phone numbers, fax numbers, mobile numbers, email addresses and web sites. */
  telecom?: ContactPoint[];
  /** Physical location. */
  address?: Address;
  /** Physical form of the location, e.g. building, room, vehicle, road. */
  physicalType?: CodeableConcept;

  position?: LocationPosition;
  /** The organization responsible for the provisioning and upkeep of the location. */
  managingOrganization?: Reference;
  /** Another Location of which this Location is physically a part of. */
  partOf?: Reference;

  hoursOfOperation?: LocationHoursOfOperation[];
  /** A description of when the locations opening ours are different to normal, e.g. public holiday availability. Succinctly describing all possible exceptions to normal site availability as detailed in the opening hours Times. */
  availabilityExceptions?: string;

  _availabilityExceptions?: Element;
  /** Technical endpoints providing access to services operated for the location. */
  endpoint?: Reference[];
}

/** Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated. */

export interface LocationPosition {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Longitude. The value domain and the interpretation are the same as for the text of the longitude element in KML (see notes below). */
  longitude: number;

  _longitude?: Element;
  /** Latitude. The value domain and the interpretation are the same as for the text of the latitude element in KML (see notes below). */
  latitude: number;

  _latitude?: Element;
  /** Altitude. The value domain and the interpretation are the same as for the text of the altitude element in KML (see notes below). */
  altitude?: number;

  _altitude?: Element;
}

/** Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated. */

export interface LocationHoursOfOperation {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Indicates which days of the week are available between the start and end Times. */
  daysOfWeek?: string[];

  _daysOfWeek?: Element[];
  /** The Location is open all day. */
  allDay?: boolean;

  _allDay?: Element;
  /** Time that the Location opens. */
  openingTime?: string;

  _openingTime?: Element;
  /** Time that the Location closes. */
  closingTime?: string;

  _closingTime?: Element;
}
