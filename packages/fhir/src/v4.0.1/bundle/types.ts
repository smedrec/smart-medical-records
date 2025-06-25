import type { Element, Extension, Identifier, Meta, Signature } from '../core/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A container for a collection of resources. */
export interface Bundle<O = ResourceList, R = ResourceList> {
	resourceType: `Bundle`
	/** The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes. */
	id?: string
	/** The metadata about the resource. This is content that is maintained by the infrastructure. Changes to the content might not always be associated with version changes to the resource. */
	meta?: Meta
	/** A reference to a set of rules that were followed when the resource was constructed, and which must be understood when processing the content. Often, this is a reference to an implementation guide that defines the special rules along with other profiles etc. */
	implicitRules?: string

	_implicitRules?: Element
	/** The base language in which the resource is written. */
	language?: string

	_language?: Element
	/** A persistent identifier for the bundle that won't change as a bundle is copied from server to server. */
	identifier?: Identifier
	/** Indicates the purpose of this bundle - how it is intended to be used. */
	type:
		| 'document'
		| 'message'
		| 'transaction'
		| 'transaction-response'
		| 'batch'
		| 'batch-response'
		| 'history'
		| 'searchset'
		| 'collection'

	_type?: Element
	/** The date/time that the bundle was assembled - i.e. when the resources were placed in the bundle. */
	timestamp?: string

	_timestamp?: Element
	/** If a set of search matches, this is the total number of entries of type 'match' across all pages in the search.  It does not include search.mode = 'include' or 'outcome' entries and it does not provide a count of the number of entries in the Bundle. */
	total?: number

	_total?: Element

	link?: BundleLink[]
	entry?: BundleEntry<O, R>[]
	/** Digital Signature - base64 encoded. XML-DSig or a JWT. */
	signature?: Signature
}

/** A container for a collection of resources. */

export interface BundleLink {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A name which details the functional use for this link - see [http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1](http://www.iana.org/assignments/link-relations/link-relations.xhtml#link-relations-1). */
	relation: string

	_relation?: Element
	/** The reference details for the link. */
	url: string

	_url?: Element
}

/** A container for a collection of resources. */
export interface BundleEntry<O = ResourceList, R = ResourceList> {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]

	link?: BundleLink[]
	/** The Absolute URL for the resource.  The fullUrl SHALL NOT disagree with the id in the resource - i.e. if the fullUrl is not a urn:uuid, the URL shall be version-independent URL consistent with the Resource.id. The fullUrl is a version independent reference to the resource. The fullUrl element SHALL have a value except that:
	 * fullUrl can be empty on a POST (although it does not need to when specifying a temporary id for reference in the bundle)
	 * Results from operations might involve resources that are not identified. */
	fullUrl?: string

	_fullUrl?: Element
	resource?: R

	search?: BundleSearch

	request?: BundleRequest
	response?: BundleResponse<O>
}

/** A container for a collection of resources. */

export interface BundleSearch {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	mode?: 'match' | 'include' | 'outcome'

	_mode?: Element

	score?: number

	_score?: Element
}

/** A container for a collection of resources. */

export interface BundleRequest {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

	_method?: Element

	url?: string

	_url?: Element

	ifNoneMatch?: string

	_ifNoneMatch?: Element

	ifModifiedSince?: string

	_ifModifiedSince?: Element

	ifMatch?: string

	_ifMatch?: Element

	ifNoneExist?: string

	_ifNoneExist?: Element
}

/** A container for a collection of resources. */
export interface BundleResponse<O = ResourceList> {
	id?: string

	extension?: Extension[]

	modifierExtension?: Extension[]

	status?: string

	_status?: Element

	location?: string

	_location?: Element

	etag?: string

	_etag?: Element

	lastModified?: string

	_lastModified?: Element
	outcome?: O
}
