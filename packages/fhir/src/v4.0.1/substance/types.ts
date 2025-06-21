import type {
  Meta,
  Element,
  Extension,
  Identifier,
  CodeableConcept,
  Quantity,
  Ratio,
  Reference,
  Attachment,
  Range,
} from "../core/types";
import type { Narrative } from "../narrative/types";
import type { ResourceList } from "../resourcelist/types";
import type { SubstanceAmount } from "../substanceamount/types";

/* Generated from FHIR JSON Schema */

/** A homogeneous material with a definite composition. */

export interface Substance<Contained = ResourceList> {
  resourceType: `Substance`;
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
  /** Unique identifier for the substance. */
  identifier?: Identifier[];
  /** A code to indicate if the substance is actively used. */
  status?: "active" | "inactive" | "entered-in-error";

  _status?: Element;
  /** A code that classifies the general type of substance.  This is used  for searching, sorting and display purposes. */
  category?: CodeableConcept[];
  /** A code (or set of codes) that identify this substance. */
  code: CodeableConcept;
  /** A description of the substance - its appearance, handling requirements, and other usage notes. */
  description?: string;

  _description?: Element;

  instance?: SubstanceInstance[];

  ingredient?: SubstanceIngredient[];
}

/** A homogeneous material with a definite composition. */

export interface SubstanceInstance {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Identifier associated with the package/container (usually a label affixed directly). */
  identifier?: Identifier;
  /** When the substance is no longer valid to use. For some substances, a single arbitrary date is used for expiry. */
  expiry?: string;

  _expiry?: Element;
  /** The amount of the substance. */
  quantity?: Quantity;
}

/** A homogeneous material with a definite composition. */

export interface SubstanceIngredient {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The amount of the ingredient in the substance - a concentration ratio. */
  quantity?: Ratio;

  substanceCodeableConcept?: CodeableConcept;

  substanceReference?: Reference;
}

/** Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction. */

export interface SubstanceNucleicAcid<Contained = ResourceList> {
  resourceType: `SubstanceNucleicAcid`;
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
  /** The type of the sequence shall be specified based on a controlled vocabulary. */
  sequenceType?: CodeableConcept;
  /** The number of linear sequences of nucleotides linked through phosphodiester bonds shall be described. Subunits would be strands of nucleic acids that are tightly associated typically through Watson-Crick base pairing. NOTE: If not specified in the reference source, the assumption is that there is 1 subunit. */
  numberOfSubunits?: number;

  _numberOfSubunits?: Element;
  /** The area of hybridisation shall be described if applicable for double stranded RNA or DNA. The number associated with the subunit followed by the number associated to the residue shall be specified in increasing order. The underscore “” shall be used as separator as follows: “Subunitnumber Residue”. */
  areaOfHybridisation?: string;

  _areaOfHybridisation?: Element;
  /** (TBC). */
  oligoNucleotideType?: CodeableConcept;

  subunit?: SubstanceNucleicAcidSubunit[];
}

/** Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction. */

export interface SubstanceNucleicAcidSubunit {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Index of linear sequences of nucleic acids in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts. */
  subunit?: number;

  _subunit?: Element;
  /** Actual nucleotide sequence notation from 5' to 3' end using standard single letter codes. In addition to the base sequence, sugar and type of phosphate or non-phosphate linkage should also be captured. */
  sequence?: string;

  _sequence?: Element;
  /** The length of the sequence shall be captured. */
  length?: number;

  _length?: Element;
  /** (TBC). */
  sequenceAttachment?: Attachment;
  /** The nucleotide present at the 5’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the first position in the sequence. A separate representation would be redundant. */
  fivePrime?: CodeableConcept;
  /** The nucleotide present at the 3’ terminal shall be specified based on a controlled vocabulary. Since the sequence is represented from the 5' to the 3' end, the 5’ prime nucleotide is the letter at the last position in the sequence. A separate representation would be redundant. */
  threePrime?: CodeableConcept;

  linkage?: SubstanceNucleicAcidLinkage[];

  sugar?: SubstanceNucleicAcidSugar[];
}

/** Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction. */

export interface SubstanceNucleicAcidLinkage {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  connectivity?: string;

  _connectivity?: Element;

  identifier?: Identifier;

  name?: string;

  _name?: Element;

  residueSite?: string;

  _residueSite?: Element;
}

/** Nucleic acids are defined by three distinct elements: the base, sugar and linkage. Individual substance/moiety IDs will be created for each of these elements. The nucleotide sequence will be always entered in the 5’-3’ direction. */

export interface SubstanceNucleicAcidSugar {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  identifier?: Identifier;

  name?: string;

  _name?: Element;

  residueSite?: string;

  _residueSite?: Element;
}

/** Todo. */

export interface SubstancePolymer<Contained = ResourceList> {
  resourceType: `SubstancePolymer`;
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
  /** Todo. */
  class?: CodeableConcept;
  /** Todo. */
  geometry?: CodeableConcept;
  /** Todo. */
  copolymerConnectivity?: CodeableConcept[];
  /** Todo. */
  modification?: string[];

  _modification?: Element[];

  monomerSet?: SubstancePolymerMonomerSet[];

  repeat?: SubstancePolymerRepeat[];
}

/** Todo. */

export interface SubstancePolymerMonomerSet {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  ratioType?: CodeableConcept;

  startingMaterial?: SubstancePolymerStartingMaterial[];
}

/** Todo. */

export interface SubstancePolymerStartingMaterial {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  material?: CodeableConcept;

  type?: CodeableConcept;

  isDefining?: boolean;

  _isDefining?: Element;

  amount?: SubstanceAmount;
}

/** Todo. */

export interface SubstancePolymerRepeat {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  numberOfUnits?: number;

  _numberOfUnits?: Element;
  /** Todo. */
  averageMolecularFormula?: string;

  _averageMolecularFormula?: Element;
  /** Todo. */
  repeatUnitAmountType?: CodeableConcept;

  repeatUnit?: SubstancePolymerRepeatUnit[];
}

/** Todo. */

export interface SubstancePolymerRepeatUnit {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  orientationOfPolymerisation?: CodeableConcept;

  repeatUnit?: string;

  _repeatUnit?: Element;

  amount?: SubstanceAmount;

  degreeOfPolymerisation?: SubstancePolymerDegreeOfPolymerisation[];

  structuralRepresentation?: SubstancePolymerStructuralRepresentation[];
}

/** Todo. */

export interface SubstancePolymerDegreeOfPolymerisation {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  degree?: CodeableConcept;

  amount?: SubstanceAmount;
}

/** Todo. */

export interface SubstancePolymerStructuralRepresentation {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  type?: CodeableConcept;

  representation?: string;

  _representation?: Element;

  attachment?: Attachment;
}

/** A SubstanceProtein is defined as a single unit of a linear amino acid sequence, or a combination of subunits that are either covalently linked or have a defined invariant stoichiometric relationship. This includes all synthetic, recombinant and purified SubstanceProteins of defined sequence, whether the use is therapeutic or prophylactic. This set of elements will be used to describe albumins, coagulation factors, cytokines, growth factors, peptide/SubstanceProtein hormones, enzymes, toxins, toxoids, recombinant vaccines, and immunomodulators. */

export interface SubstanceProtein<Contained = ResourceList> {
  resourceType: `SubstanceProtein`;
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
  /** The SubstanceProtein descriptive elements will only be used when a complete or partial amino acid sequence is available or derivable from a nucleic acid sequence. */
  sequenceType?: CodeableConcept;
  /** Number of linear sequences of amino acids linked through peptide bonds. The number of subunits constituting the SubstanceProtein shall be described. It is possible that the number of subunits can be variable. */
  numberOfSubunits?: number;

  _numberOfSubunits?: Element;
  /** The disulphide bond between two cysteine residues either on the same subunit or on two different subunits shall be described. The position of the disulfide bonds in the SubstanceProtein shall be listed in increasing order of subunit number and position within subunit followed by the abbreviation of the amino acids involved. The disulfide linkage positions shall actually contain the amino acid Cysteine at the respective positions. */
  disulfideLinkage?: string[];

  _disulfideLinkage?: Element[];

  subunit?: SubstanceProteinSubunit[];
}

/** A SubstanceProtein is defined as a single unit of a linear amino acid sequence, or a combination of subunits that are either covalently linked or have a defined invariant stoichiometric relationship. This includes all synthetic, recombinant and purified SubstanceProteins of defined sequence, whether the use is therapeutic or prophylactic. This set of elements will be used to describe albumins, coagulation factors, cytokines, growth factors, peptide/SubstanceProtein hormones, enzymes, toxins, toxoids, recombinant vaccines, and immunomodulators. */

export interface SubstanceProteinSubunit {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Index of primary sequences of amino acids linked through peptide bonds in order of decreasing length. Sequences of the same length will be ordered by molecular weight. Subunits that have identical sequences will be repeated and have sequential subscripts. */
  subunit?: number;

  _subunit?: Element;
  /** The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence. */
  sequence?: string;

  _sequence?: Element;
  /** Length of linear sequences of amino acids contained in the subunit. */
  length?: number;

  _length?: Element;
  /** The sequence information shall be provided enumerating the amino acids from N- to C-terminal end using standard single-letter amino acid codes. Uppercase shall be used for L-amino acids and lowercase for D-amino acids. Transcribed SubstanceProteins will always be described using the translated sequence; for synthetic peptide containing amino acids that are not represented with a single letter code an X should be used within the sequence. The modified amino acids will be distinguished by their position in the sequence. */
  sequenceAttachment?: Attachment;
  /** Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID. */
  nTerminalModificationId?: Identifier;
  /** The name of the fragment modified at the N-terminal of the SubstanceProtein shall be specified. */
  nTerminalModification?: string;

  _nTerminalModification?: Element;
  /** Unique identifier for molecular fragment modification based on the ISO 11238 Substance ID. */
  cTerminalModificationId?: Identifier;
  /** The modification at the C-terminal shall be specified. */
  cTerminalModification?: string;

  _cTerminalModification?: Element;
}

/** Todo. */

export interface SubstanceReferenceInformation<Contained = ResourceList> {
  resourceType: `SubstanceReferenceInformation`;
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
  /** Todo. */
  comment?: string;

  _comment?: Element;

  gene?: SubstanceReferenceInformationGene[];

  geneElement?: SubstanceReferenceInformationGeneElement[];

  classification?: SubstanceReferenceInformationClassification[];

  target?: SubstanceReferenceInformationTarget[];
}

/** Todo. */

export interface SubstanceReferenceInformationGene {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  geneSequenceOrigin?: CodeableConcept;
  /** Todo. */
  gene?: CodeableConcept;
  /** Todo. */
  source?: Reference[];
}

/** Todo. */

export interface SubstanceReferenceInformationGeneElement {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  type?: CodeableConcept;
  /** Todo. */
  element?: Identifier;
  /** Todo. */
  source?: Reference[];
}

/** Todo. */

export interface SubstanceReferenceInformationClassification {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  domain?: CodeableConcept;
  /** Todo. */
  classification?: CodeableConcept;
  /** Todo. */
  subtype?: CodeableConcept[];
  /** Todo. */
  source?: Reference[];
}

/** Todo. */

export interface SubstanceReferenceInformationTarget {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Todo. */
  target?: Identifier;
  /** Todo. */
  type?: CodeableConcept;
  /** Todo. */
  interaction?: CodeableConcept;
  /** Todo. */
  organism?: CodeableConcept;
  /** Todo. */
  organismType?: CodeableConcept;

  amountQuantity?: Quantity;

  amountRange?: Range;

  amountString?: string;

  _amountString?: Element;
  /** Todo. */
  amountType?: CodeableConcept;
  /** Todo. */
  source?: Reference[];
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterial<Contained = ResourceList> {
  resourceType: `SubstanceSourceMaterial`;
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
  /** General high level classification of the source material specific to the origin of the material. */
  sourceMaterialClass?: CodeableConcept;
  /** The type of the source material shall be specified based on a controlled vocabulary. For vaccines, this subclause refers to the class of infectious agent. */
  sourceMaterialType?: CodeableConcept;
  /** The state of the source material when extracted. */
  sourceMaterialState?: CodeableConcept;
  /** The unique identifier associated with the source material parent organism shall be specified. */
  organismId?: Identifier;
  /** The organism accepted Scientific name shall be provided based on the organism taxonomy. */
  organismName?: string;

  _organismName?: Element;
  /** The parent of the herbal drug Ginkgo biloba, Leaf is the substance ID of the substance (fresh) of Ginkgo biloba L. or Ginkgo biloba L. (Whole plant). */
  parentSubstanceId?: Identifier[];
  /** The parent substance of the Herbal Drug, or Herbal preparation. */
  parentSubstanceName?: string[];

  _parentSubstanceName?: Element[];
  /** The country where the plant material is harvested or the countries where the plasma is sourced from as laid down in accordance with the Plasma Master File. For “Plasma-derived substances” the attribute country of origin provides information about the countries used for the manufacturing of the Cryopoor plama or Crioprecipitate. */
  countryOfOrigin?: CodeableConcept[];
  /** The place/region where the plant is harvested or the places/regions where the animal source material has its habitat. */
  geographicalLocation?: string[];

  _geographicalLocation?: Element[];
  /** Stage of life for animals, plants, insects and microorganisms. This information shall be provided only when the substance is significantly different in these stages (e.g. foetal bovine serum). */
  developmentStage?: CodeableConcept;

  fractionDescription?: SubstanceSourceMaterialFractionDescription[];

  organism?: SubstanceSourceMaterialOrganism;

  partDescription?: SubstanceSourceMaterialPartDescription[];
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialFractionDescription {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** This element is capturing information about the fraction of a plant part, or human plasma for fractionation. */
  fraction?: string;

  _fraction?: Element;
  /** The specific type of the material constituting the component. For Herbal preparations the particulars of the extracts (liquid/dry) is described in Specified Substance Group 1. */
  materialType?: CodeableConcept;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialOrganism {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The family of an organism shall be specified. */
  family?: CodeableConcept;
  /** The genus of an organism shall be specified; refers to the Latin epithet of the genus element of the plant/animal scientific name; it is present in names for genera, species and infraspecies. */
  genus?: CodeableConcept;
  /** The species of an organism shall be specified; refers to the Latin epithet of the species of the plant/animal; it is present in names for species and infraspecies. */
  species?: CodeableConcept;
  /** The Intraspecific type of an organism shall be specified. */
  intraspecificType?: CodeableConcept;
  /** The intraspecific description of an organism shall be specified based on a controlled vocabulary. For Influenza Vaccine, the intraspecific description shall contain the syntax of the antigen in line with the WHO convention. */
  intraspecificDescription?: string;

  _intraspecificDescription?: Element;

  author?: SubstanceSourceMaterialAuthor[];

  hybrid?: SubstanceSourceMaterialHybrid;

  organismGeneral?: SubstanceSourceMaterialOrganismGeneral;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialAuthor {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  authorType?: CodeableConcept;

  authorDescription?: string;

  _authorDescription?: Element;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialHybrid {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  maternalOrganismId?: string;

  _maternalOrganismId?: Element;

  maternalOrganismName?: string;

  _maternalOrganismName?: Element;

  paternalOrganismId?: string;

  _paternalOrganismId?: Element;

  paternalOrganismName?: string;

  _paternalOrganismName?: Element;

  hybridType?: CodeableConcept;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialOrganismGeneral {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  kingdom?: CodeableConcept;

  phylum?: CodeableConcept;

  class?: CodeableConcept;

  order?: CodeableConcept;
}

/** Source material shall capture information on the taxonomic and anatomical origins as well as the fraction of a material that can result in or can be modified to form a substance. This set of data elements shall be used to define polymer substances isolated from biological matrices. Taxonomic and anatomical origins shall be described using a controlled vocabulary as required. This information is captured for naturally derived polymers ( . starch) and structurally diverse substances. For Organisms belonging to the Kingdom Plantae the Substance level defines the fresh material of a single species or infraspecies, the Herbal Drug and the Herbal preparation. For Herbal preparations, the fraction information will be captured at the Substance information level and additional information for herbal extracts will be captured at the Specified Substance Group 1 information level. See for further explanation the Substance Class: Structurally Diverse and the herbal annex. */

export interface SubstanceSourceMaterialPartDescription {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Entity of anatomical origin of source material within an organism. */
  part?: CodeableConcept;
  /** The detailed anatomic location when the part can be extracted from different anatomical locations of the organism. Multiple alternative locations may apply. */
  partLocation?: CodeableConcept;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecification<Contained = ResourceList> {
  resourceType: `SubstanceSpecification`;
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
  /** Identifier by which this substance is known. */
  identifier?: Identifier;
  /** High level categorization, e.g. polymer or nucleic acid. */
  type?: CodeableConcept;
  /** Status of substance within the catalogue e.g. approved. */
  status?: CodeableConcept;
  /** If the substance applies to only human or veterinary use. */
  domain?: CodeableConcept;
  /** Textual description of the substance. */
  description?: string;

  _description?: Element;
  /** Supporting literature. */
  source?: Reference[];
  /** Textual comment about this record of a substance. */
  comment?: string;

  _comment?: Element;

  moiety?: SubstanceSpecificationMoiety[];

  property?: SubstanceSpecificationProperty[];
  /** General information detailing this substance. */
  referenceInformation?: Reference;

  structure?: SubstanceSpecificationStructure;

  code?: SubstanceSpecificationCode[];

  name?: SubstanceSpecificationName[];

  molecularWeight?: SubstanceSpecificationMolecularWeight[];

  relationship?: SubstanceSpecificationRelationship[];
  /** Data items specific to nucleic acids. */
  nucleicAcid?: Reference;
  /** Data items specific to polymers. */
  polymer?: Reference;
  /** Data items specific to proteins. */
  protein?: Reference;
  /** Material or taxonomic/anatomical source for the substance. */
  sourceMaterial?: Reference;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationMoiety {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Role that the moiety is playing. */
  role?: CodeableConcept;
  /** Identifier by which this moiety substance is known. */
  identifier?: Identifier;
  /** Textual name for this moiety substance. */
  name?: string;

  _name?: Element;
  /** Stereochemistry type. */
  stereochemistry?: CodeableConcept;
  /** Optical activity type. */
  opticalActivity?: CodeableConcept;
  /** Molecular formula. */
  molecularFormula?: string;

  _molecularFormula?: Element;

  amountQuantity?: Quantity;

  amountString?: string;

  _amountString?: Element;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationProperty {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** A category for this property, e.g. Physical, Chemical, Enzymatic. */
  category?: CodeableConcept;
  /** Property type e.g. viscosity, pH, isoelectric point. */
  code?: CodeableConcept;
  /** Parameters that were used in the measurement of a property (e.g. for viscosity: measured at 20C with a pH of 7.1). */
  parameters?: string;

  _parameters?: Element;

  definingSubstanceReference?: Reference;

  definingSubstanceCodeableConcept?: CodeableConcept;

  amountQuantity?: Quantity;

  amountString?: string;

  _amountString?: Element;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationStructure {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** Stereochemistry type. */
  stereochemistry?: CodeableConcept;
  /** Optical activity type. */
  opticalActivity?: CodeableConcept;
  /** Molecular formula. */
  molecularFormula?: string;

  _molecularFormula?: Element;
  /** Specified per moiety according to the Hill system, i.e. first C, then H, then alphabetical, each moiety separated by a dot. */
  molecularFormulaByMoiety?: string;

  _molecularFormulaByMoiety?: Element;

  isotope?: SubstanceSpecificationIsotope[];

  molecularWeight?: SubstanceSpecificationMolecularWeight;
  /** Supporting literature. */
  source?: Reference[];

  representation?: SubstanceSpecificationRepresentation[];
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationIsotope {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  identifier?: Identifier;

  name?: CodeableConcept;

  substitution?: CodeableConcept;

  halfLife?: Quantity;

  molecularWeight?: SubstanceSpecificationMolecularWeight;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationMolecularWeight {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  method?: CodeableConcept;

  type?: CodeableConcept;

  amount?: Quantity;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationRepresentation {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  type?: CodeableConcept;

  representation?: string;

  _representation?: Element;

  attachment?: Attachment;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationCode {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The specific code. */
  code?: CodeableConcept;
  /** Status of the code assignment. */
  status?: CodeableConcept;
  /** The date at which the code status is changed as part of the terminology maintenance. */
  statusDate?: string;

  _statusDate?: Element;
  /** Any comment can be provided in this field, if necessary. */
  comment?: string;

  _comment?: Element;
  /** Supporting literature. */
  source?: Reference[];
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationName {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];
  /** The actual name. */
  name: string;

  _name?: Element;
  /** Name type. */
  type?: CodeableConcept;
  /** The status of the name. */
  status?: CodeableConcept;
  /** If this is the preferred name for this substance. */
  preferred?: boolean;

  _preferred?: Element;
  /** Language of the name. */
  language?: CodeableConcept[];
  /** The use context of this name for example if there is a different name a drug active ingredient as opposed to a food colour additive. */
  domain?: CodeableConcept[];
  /** The jurisdiction where this name applies. */
  jurisdiction?: CodeableConcept[];

  synonym?: SubstanceSpecificationName[];

  translation?: SubstanceSpecificationName[];

  official?: SubstanceSpecificationOfficial[];
  /** Supporting literature. */
  source?: Reference[];
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationOfficial {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];

  authority?: CodeableConcept;

  status?: CodeableConcept;

  date?: string;

  _date?: Element;
}

/** The detailed description of a substance, typically at a level beyond what is used for prescribing. */

export interface SubstanceSpecificationRelationship {
  /** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
  id?: string;
  /** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
  extension?: Extension[];
  /** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
  modifierExtension?: Extension[];

  substanceReference?: Reference;

  substanceCodeableConcept?: CodeableConcept;
  /** For example "salt to parent", "active moiety", "starting material". */
  relationship?: CodeableConcept;
  /** For example where an enzyme strongly bonds with a particular substance, this is a defining relationship for that enzyme, out of several possible substance relationships. */
  isDefining?: boolean;

  _isDefining?: Element;

  amountQuantity?: Quantity;

  amountRange?: Range;

  amountRatio?: Ratio;

  amountString?: string;

  _amountString?: Element;
  /** For use when the numeric. */
  amountRatioLowLimit?: Ratio;
  /** An operator for the amount, for example "average", "approximately", "less than". */
  amountType?: CodeableConcept;
  /** Supporting literature. */
  source?: Reference[];
}
