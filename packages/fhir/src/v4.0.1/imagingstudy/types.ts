import type {
  Meta,
  Element,
  Extension,
  Identifier,
  Coding,
  Reference,
  CodeableConcept,
  Annotation,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";

/* Generated from FHIR JSON Schema */

/** Representation of the content produced in a DICOM imaging study. A study comprises a set of series, each of which includes a set of Service-Object Pair Instances (SOP Instances - images or other data) acquired or produced in a common context.  A series is of only one modality (e.g. X-ray, CT, MR, ultrasound), but a study may have multiple series of different modalities. */

export interface ImagingStudy<Contained = ResourceList> {
  resourceType: `ImagingStudy`;
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
  /** Identifiers for the ImagingStudy such as DICOM Study Instance UID, and Accession Number. */
  identifier?: Identifier[];
  /** The current state of the ImagingStudy. */
  status:
    | "registered"
    | "available"
    | "cancelled"
    | "entered-in-error"
    | "unknown";

  _status?: Element;
  /** A list of all the series.modality values that are actual acquisition modalities, i.e. those in the DICOM Context Group 29 (value set OID 1.2.840.10008.6.1.19). */
  modality?: Coding[];
  /** The subject, typically a patient, of the imaging study. */
  subject: Reference;
  /** The healthcare event (e.g. a patient and healthcare provider interaction) during which this ImagingStudy is made. */
  encounter?: Reference;
  /** Date and time the study started. */
  started?: string;

  _started?: Element;
  /** A list of the diagnostic requests that resulted in this imaging study being performed. */
  basedOn?: Reference[];
  /** The requesting/referring physician. */
  referrer?: Reference;
  /** Who read the study and interpreted the images or other content. */
  interpreter?: Reference[];
  /** The network service providing access (e.g., query, view, or retrieval) for the study. See implementation notes for information about using DICOM endpoints. A study-level endpoint applies to each series in the study, unless overridden by a series-level endpoint with the same Endpoint.connectionType. */
  endpoint?: Reference[];
  /** Number of Series in the Study. This value given may be larger than the number of series elements this Resource contains due to resource availability, security, or other factors. This element should be present if any series elements are present. */
  numberOfSeries?: number;

  _numberOfSeries?: Element;
  /** Number of SOP Instances in Study. This value given may be larger than the number of instance elements this resource contains due to resource availability, security, or other factors. This element should be present if any instance elements are present. */
  numberOfInstances?: number;

  _numberOfInstances?: Element;
  /** The procedure which this ImagingStudy was part of. */
  procedureReference?: Reference;
  /** The code for the performed procedure type. */
  procedureCode?: CodeableConcept[];
  /** The principal physical location where the ImagingStudy was performed. */
  location?: Reference;
  /** Description of clinical condition indicating why the ImagingStudy was requested. */
  reasonCode?: CodeableConcept[];
  /** Indicates another resource whose existence justifies this Study. */
  reasonReference?: Reference[];
  /** Per the recommended DICOM mapping, this element is derived from the Study Description attribute (0008,1030). Observations or findings about the imaging study should be recorded in another resource, e.g. Observation, and not in this element. */
  note?: Annotation[];
  /** The Imaging Manager description of the study. Institution-generated description or classification of the Study (component) performed. */
  description?: string;

  _description?: Element;

  series?: ImagingStudySeries[];
}

/** Representation of the content produced in a DICOM imaging study. A study comprises a set of series, each of which includes a set of Service-Object Pair Instances (SOP Instances - images or other data) acquired or produced in a common context.  A series is of only one modality (e.g. X-ray, CT, MR, ultrasound), but a study may have multiple series of different modalities. */

export interface ImagingStudySeries {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The DICOM Series Instance UID for the series. */
  uid: string;

  _uid?: Element;
  /** The numeric identifier of this series in the study. */
  number?: number;

  _number?: Element;
  /** The modality of this series sequence. */
  modality: Coding;
  /** A description of the series. */
  description?: string;

  _description?: Element;
  /** Number of SOP Instances in the Study. The value given may be larger than the number of instance elements this resource contains due to resource availability, security, or other factors. This element should be present if any instance elements are present. */
  numberOfInstances?: number;

  _numberOfInstances?: Element;
  /** The network service providing access (e.g., query, view, or retrieval) for this series. See implementation notes for information about using DICOM endpoints. A series-level endpoint, if present, has precedence over a study-level endpoint with the same Endpoint.connectionType. */
  endpoint?: Reference[];
  /** The anatomic structures examined. See DICOM Part 16 Annex L (http://dicom.nema.org/medical/dicom/current/output/chtml/part16/chapter_L.html) for DICOM to SNOMED-CT mappings. The bodySite may indicate the laterality of body part imaged; if so, it shall be consistent with any content of ImagingStudy.series.laterality. */
  bodySite?: Coding;
  /** The laterality of the (possibly paired) anatomic structures examined. E.g., the left knee, both lungs, or unpaired abdomen. If present, shall be consistent with any laterality information indicated in ImagingStudy.series.bodySite. */
  laterality?: Coding;
  /** The specimen imaged, e.g., for whole slide imaging of a biopsy. */
  specimen?: Reference[];
  /** The date and time the series was started. */
  started?: string;

  _started?: Element;

  performer?: ImagingStudyPerformer[];

  instance?: ImagingStudyInstance[];
}

/** Representation of the content produced in a DICOM imaging study. A study comprises a set of series, each of which includes a set of Service-Object Pair Instances (SOP Instances - images or other data) acquired or produced in a common context.  A series is of only one modality (e.g. X-ray, CT, MR, ultrasound), but a study may have multiple series of different modalities. */

export interface ImagingStudyPerformer {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  function?: CodeableConcept;

  actor: Reference;
}

/** Representation of the content produced in a DICOM imaging study. A study comprises a set of series, each of which includes a set of Service-Object Pair Instances (SOP Instances - images or other data) acquired or produced in a common context.  A series is of only one modality (e.g. X-ray, CT, MR, ultrasound), but a study may have multiple series of different modalities. */

export interface ImagingStudyInstance {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  uid?: string;

  _uid?: Element;

  sopClass: Coding;

  number?: number;

  _number?: Element;

  title?: string;

  _title?: Element;
}
