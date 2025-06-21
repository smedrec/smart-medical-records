import type {
  Extension,
  CodeableConcept,
  Period,
  Element,
} from "../core/types";

/* Generated from FHIR JSON Schema */

/** The marketing status describes the date when a medicinal product is actually put on the market or the date as of which it is no longer available. */

export interface MarketingStatus {
  id?: string;

  extension?: Extension[];

  modifierExtension?: Extension[];
  /** The country in which the marketing authorisation has been granted shall be specified It should be specified using the ISO 3166 ‑ 1 alpha-2 code elements. */
  country: CodeableConcept;
  /** Where a Medicines Regulatory Agency has granted a marketing authorisation for which specific provisions within a jurisdiction apply, the jurisdiction can be specified using an appropriate controlled terminology The controlled term and the controlled term identifier shall be specified. */
  jurisdiction?: CodeableConcept;
  /** This attribute provides information on the status of the marketing of the medicinal product See ISO/TS 20443 for more information and examples. */
  status: CodeableConcept;
  /** The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain. */
  dateRange: Period;
  /** The date when the Medicinal Product is placed on the market by the Marketing Authorisation Holder (or where applicable, the manufacturer/distributor) in a country and/or jurisdiction shall be provided A complete date consisting of day, month and year shall be specified using the ISO 8601 date format NOTE “Placed on the market” refers to the release of the Medicinal Product into the distribution chain. */
  restoreDate?: string;

  _restoreDate?: Element;
}
