import type {
	Annotation,
	CodeableConcept,
	ContactPoint,
	Element,
	Extension,
	Identifier,
	Meta,
	Period,
	Quantity,
	Range,
	Reference,
	Timing,
} from '../core/types'
import type { Narrative } from '../narrative/types'
import type { ProdCharacteristic } from '../prodcharacteristic/types'
import type { ProductShelfLife } from '../productshelflife/types'
import type { ResourceList } from '../resourcelist/types'

/* Generated from FHIR JSON Schema */

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface Device<Contained = ResourceList> {
	resourceType: `Device`
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
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Unique instance identifiers assigned to a device by manufacturers other organizations or owners. */
	identifier?: Identifier[]
	/** The reference to the definition for the device. */
	definition?: Reference

	udiCarrier?: DeviceUdiCarrier[]
	/** Status of the Device availability. */
	status?: 'active' | 'inactive' | 'entered-in-error' | 'unknown'

	_status?: Element
	/** Reason for the dtatus of the Device availability. */
	statusReason?: CodeableConcept[]
	/** The distinct identification string as required by regulation for a human cell, tissue, or cellular and tissue-based product. */
	distinctIdentifier?: string

	_distinctIdentifier?: Element
	/** A name of the manufacturer. */
	manufacturer?: string

	_manufacturer?: Element
	/** The date and time when the device was manufactured. */
	manufactureDate?: string

	_manufactureDate?: Element
	/** The date and time beyond which this device is no longer valid or should not be used (if applicable). */
	expirationDate?: string

	_expirationDate?: Element
	/** Lot number assigned by the manufacturer. */
	lotNumber?: string

	_lotNumber?: Element
	/** The serial number assigned by the organization when the device was manufactured. */
	serialNumber?: string

	_serialNumber?: Element

	deviceName?: DeviceDeviceName[]
	/** The model number for the device. */
	modelNumber?: string

	_modelNumber?: Element
	/** The part number of the device. */
	partNumber?: string

	_partNumber?: Element
	/** The kind or type of device. */
	type?: CodeableConcept

	specialization?: DeviceSpecialization[]

	version?: DeviceVersion[]

	property?: DeviceProperty[]
	/** Patient information, If the device is affixed to a person. */
	patient?: Reference
	/** An organization that is responsible for the provision and ongoing maintenance of the device. */
	owner?: Reference
	/** Contact details for an organization or a particular human that is responsible for the device. */
	contact?: ContactPoint[]
	/** The place where the device can be found. */
	location?: Reference
	/** A network address on which the device may be contacted directly. */
	url?: string

	_url?: Element
	/** Descriptive information, usage information or implantation information that is not captured in an existing element. */
	note?: Annotation[]
	/** Provides additional safety characteristics about a medical device.  For example devices containing latex. */
	safety?: CodeableConcept[]
	/** The parent device. */
	parent?: Reference
}

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface DeviceUdiCarrier {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The device identifier (DI) is a mandatory, fixed portion of a UDI that identifies the labeler and the specific version or model of a device. */
	deviceIdentifier?: string

	_deviceIdentifier?: Element
	/** Organization that is charged with issuing UDIs for devices.  For example, the US FDA issuers include :
1) GS1: 
http://hl7.org/fhir/NamingSystem/gs1-di, 
2) HIBCC:
http://hl7.org/fhir/NamingSystem/hibcc-dI, 
3) ICCBBA for blood containers:
http://hl7.org/fhir/NamingSystem/iccbba-blood-di, 
4) ICCBA for other devices:
http://hl7.org/fhir/NamingSystem/iccbba-other-di. */
	issuer?: string

	_issuer?: Element
	/** The identity of the authoritative source for UDI generation within a  jurisdiction.  All UDIs are globally unique within a single namespace with the appropriate repository uri as the system.  For example,  UDIs of devices managed in the U.S. by the FDA, the value is  http://hl7.org/fhir/NamingSystem/fda-udi. */
	jurisdiction?: string

	_jurisdiction?: Element
	/** The full UDI carrier of the Automatic Identification and Data Capture (AIDC) technology representation of the barcode string as printed on the packaging of the device - e.g., a barcode or RFID.   Because of limitations on character sets in XML and the need to round-trip JSON data through XML, AIDC Formats *SHALL* be base64 encoded. */
	carrierAIDC?: string

	_carrierAIDC?: Element
	/** The full UDI carrier as the human readable form (HRF) representation of the barcode string as printed on the packaging of the device. */
	carrierHRF?: string

	_carrierHRF?: Element
	/** A coded entry to indicate how the data was entered. */
	entryType?: 'barcode' | 'rfid' | 'manual' | 'card' | 'self-reported' | 'unknown'

	_entryType?: Element
}

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface DeviceDeviceName {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The name of the device. */
	name: string

	_name?: Element
	/** The type of deviceName.
UDILabelName | UserFriendlyName | PatientReportedName | ManufactureDeviceName | ModelName. */
	type:
		| 'udi-label-name'
		| 'user-friendly-name'
		| 'patient-reported-name'
		| 'manufacturer-name'
		| 'model-name'
		| 'other'

	_type?: Element
}

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface DeviceSpecialization {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The standard that is used to operate and communicate. */
	systemType: CodeableConcept
	/** The version of the standard that is used to operate and communicate. */
	version?: string

	_version?: Element
}

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface DeviceVersion {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The type of the device version. */
	type?: CodeableConcept
	/** A single component of the device version. */
	component?: Identifier
	/** The version text. */
	value: string

	_value?: Element
}

/** A type of a manufactured item that is used in the provision of healthcare without being substantially changed through that activity. The device may be a medical or non-medical device. */

export interface DeviceProperty {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Code that specifies the property DeviceDefinitionPropetyCode (Extensible). */
	type: CodeableConcept
	/** Property value as a quantity. */
	valueQuantity?: Quantity[]
	/** Property value as a code, e.g., NTP4 (synced to NTP). */
	valueCode?: CodeableConcept[]
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinition<Contained = ResourceList> {
	resourceType: `DeviceDefinition`
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
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Unique instance identifiers assigned to a device by the software, manufacturers, other organizations or owners. For example: handle ID. */
	identifier?: Identifier[]

	udiDeviceIdentifier?: DeviceDefinitionUdiDeviceIdentifier[]

	manufacturerString?: string

	_manufacturerString?: Element

	manufacturerReference?: Reference

	deviceName?: DeviceDefinitionDeviceName[]
	/** The model number for the device. */
	modelNumber?: string

	_modelNumber?: Element
	/** What kind of device or device system this is. */
	type?: CodeableConcept

	specialization?: DeviceDefinitionSpecialization[]
	/** The available versions of the device, e.g., software versions. */
	version?: string[]

	_version?: Element[]
	/** Safety characteristics of the device. */
	safety?: CodeableConcept[]
	/** Shelf Life and storage information. */
	shelfLifeStorage?: ProductShelfLife[]
	/** Dimensions, color etc. */
	physicalCharacteristics?: ProdCharacteristic
	/** Language code for the human-readable text strings produced by the device (all supported). */
	languageCode?: CodeableConcept[]

	capability?: DeviceDefinitionCapability[]

	property?: DeviceDefinitionProperty[]
	/** An organization that is responsible for the provision and ongoing maintenance of the device. */
	owner?: Reference
	/** Contact details for an organization or a particular human that is responsible for the device. */
	contact?: ContactPoint[]
	/** A network address on which the device may be contacted directly. */
	url?: string

	_url?: Element
	/** Access to on-line information about the device. */
	onlineInformation?: string

	_onlineInformation?: Element
	/** Descriptive information, usage information or implantation information that is not captured in an existing element. */
	note?: Annotation[]
	/** The quantity of the device present in the packaging (e.g. the number of devices present in a pack, or the number of devices in the same package of the medicinal product). */
	quantity?: Quantity
	/** The parent device it can be part of. */
	parentDevice?: Reference

	material?: DeviceDefinitionMaterial[]
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionUdiDeviceIdentifier {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The identifier that is to be associated with every Device that references this DeviceDefintiion for the issuer and jurisdication porvided in the DeviceDefinition.udiDeviceIdentifier. */
	deviceIdentifier: string

	_deviceIdentifier?: Element
	/** The organization that assigns the identifier algorithm. */
	issuer: string

	_issuer?: Element
	/** The jurisdiction to which the deviceIdentifier applies. */
	jurisdiction: string

	_jurisdiction?: Element
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionDeviceName {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The name of the device. */
	name: string

	_name?: Element
	/** The type of deviceName.
UDILabelName | UserFriendlyName | PatientReportedName | ManufactureDeviceName | ModelName. */
	type:
		| 'udi-label-name'
		| 'user-friendly-name'
		| 'patient-reported-name'
		| 'manufacturer-name'
		| 'model-name'
		| 'other'

	_type?: Element
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionSpecialization {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The standard that is used to operate and communicate. */
	systemType: string

	_systemType?: Element
	/** The version of the standard that is used to operate and communicate. */
	version?: string

	_version?: Element
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionCapability {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Type of capability. */
	type: CodeableConcept
	/** Description of capability. */
	description?: CodeableConcept[]
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionProperty {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Code that specifies the property DeviceDefinitionPropetyCode (Extensible). */
	type: CodeableConcept
	/** Property value as a quantity. */
	valueQuantity?: Quantity[]
	/** Property value as a code, e.g., NTP4 (synced to NTP). */
	valueCode?: CodeableConcept[]
}

/** The characteristics, operational status and capabilities of a medical-related component of a medical device. */

export interface DeviceDefinitionMaterial {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** The substance. */
	substance: CodeableConcept
	/** Indicates an alternative material of the device. */
	alternate?: boolean

	_alternate?: Element
	/** Whether the substance is a known or suspected allergen. */
	allergenicIndicator?: boolean

	_allergenicIndicator?: Element
}

/** Describes a measurement, calculation or setting capability of a medical device. */

export interface DeviceMetric<Contained = ResourceList> {
	resourceType: `DeviceMetric`
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
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Unique instance identifiers assigned to a device by the device or gateway software, manufacturers, other organizations or owners. For example: handle ID. */
	identifier?: Identifier[]
	/** Describes the type of the metric. For example: Heart Rate, PEEP Setting, etc. */
	type: CodeableConcept
	/** Describes the unit that an observed value determined for this metric will have. For example: Percent, Seconds, etc. */
	unit?: CodeableConcept
	/** Describes the link to the  Device that this DeviceMetric belongs to and that contains administrative device information such as manufacturer, serial number, etc. */
	source?: Reference
	/** Describes the link to the  Device that this DeviceMetric belongs to and that provide information about the location of this DeviceMetric in the containment structure of the parent Device. An example would be a Device that represents a Channel. This reference can be used by a client application to distinguish DeviceMetrics that have the same type, but should be interpreted based on their containment location. */
	parent?: Reference
	/** Indicates current operational state of the device. For example: On, Off, Standby, etc. */
	operationalStatus?: 'on' | 'off' | 'standby' | 'entered-in-error'

	_operationalStatus?: Element
	/** Describes the color representation for the metric. This is often used to aid clinicians to track and identify parameter types by color. In practice, consider a Patient Monitor that has ECG/HR and Pleth for example; the parameters are displayed in different characteristic colors, such as HR-blue, BP-green, and PR and SpO2- magenta. */
	color?: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white'

	_color?: Element
	/** Indicates the category of the observation generation process. A DeviceMetric can be for example a setting, measurement, or calculation. */
	category: 'measurement' | 'setting' | 'calculation' | 'unspecified'

	_category?: Element
	/** Describes the measurement repetition time. This is not necessarily the same as the update period. The measurement repetition time can range from milliseconds up to hours. An example for a measurement repetition time in the range of milliseconds is the sampling rate of an ECG. An example for a measurement repetition time in the range of hours is a NIBP that is triggered automatically every hour. The update period may be different than the measurement repetition time, if the device does not update the published observed value with the same frequency as it was measured. */
	measurementPeriod?: Timing

	calibration?: DeviceMetricCalibration[]
}

/** Describes a measurement, calculation or setting capability of a medical device. */

export interface DeviceMetricCalibration {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Describes the type of the calibration method. */
	type?: 'unspecified' | 'offset' | 'gain' | 'two-point'

	_type?: Element
	/** Describes the state of the calibration. */
	state?: 'not-calibrated' | 'calibration-required' | 'calibrated' | 'unspecified'

	_state?: Element
	/** Describes the time last calibration has been performed. */
	time?: string

	_time?: Element
}

/** Represents a request for a patient to employ a medical device. The device may be an implantable device, or an external assistive device, such as a walker. */

export interface DeviceRequest<Contained = ResourceList> {
	resourceType: `DeviceRequest`
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
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** Identifiers assigned to this order by the orderer or by the receiver. */
	identifier?: Identifier[]
	/** The URL pointing to a FHIR-defined protocol, guideline, orderset or other definition that is adhered to in whole or in part by this DeviceRequest. */
	instantiatesCanonical?: string[]
	/** The URL pointing to an externally maintained protocol, guideline, orderset or other definition that is adhered to in whole or in part by this DeviceRequest. */
	instantiatesUri?: string[]

	_instantiatesUri?: Element[]
	/** Plan/proposal/order fulfilled by this request. */
	basedOn?: Reference[]
	/** The request takes the place of the referenced completed or terminated request(s). */
	priorRequest?: Reference[]
	/** Composite request this is part of. */
	groupIdentifier?: Identifier
	/** The status of the request. */
	status?: string

	_status?: Element
	/** Whether the request is a proposal, plan, an original order or a reflex order. */
	intent: string

	_intent?: Element
	/** Indicates how quickly the {{title}} should be addressed with respect to other requests. */
	priority?: string

	_priority?: Element

	codeReference?: Reference

	codeCodeableConcept?: CodeableConcept

	parameter?: DeviceRequestParameter[]
	/** The patient who will use the device. */
	subject: Reference
	/** An encounter that provides additional context in which this request is made. */
	encounter?: Reference

	occurrenceDateTime?: string

	_occurrenceDateTime?: Element

	occurrencePeriod?: Period

	occurrenceTiming?: Timing
	/** When the request transitioned to being actionable. */
	authoredOn?: string

	_authoredOn?: Element
	/** The individual who initiated the request and has responsibility for its activation. */
	requester?: Reference
	/** Desired type of performer for doing the diagnostic testing. */
	performerType?: CodeableConcept
	/** The desired performer for doing the diagnostic testing. */
	performer?: Reference
	/** Reason or justification for the use of this device. */
	reasonCode?: CodeableConcept[]
	/** Reason or justification for the use of this device. */
	reasonReference?: Reference[]
	/** Insurance plans, coverage extensions, pre-authorizations and/or pre-determinations that may be required for delivering the requested service. */
	insurance?: Reference[]
	/** Additional clinical information about the patient that may influence the request fulfilment.  For example, this may include where on the subject's body the device will be used (i.e. the target site). */
	supportingInfo?: Reference[]
	/** Details about this request that were not represented at all or sufficiently in one of the attributes provided in a class. These may include for example a comment, an instruction, or a note associated with the statement. */
	note?: Annotation[]
	/** Key events in the history of the request. */
	relevantHistory?: Reference[]
}

/** Represents a request for a patient to employ a medical device. The device may be an implantable device, or an external assistive device, such as a walker. */

export interface DeviceRequestParameter {
	/** Unique id for the element within a resource (for internal references). This may be any string value that does not contain spaces. */
	id?: string
	/** May be used to represent additional information that is not part of the basic definition of the element. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the element and that modifies the understanding of the element in which it is contained and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** A code or string that identifies the device detail being asserted. */
	code?: CodeableConcept

	valueCodeableConcept?: CodeableConcept

	valueQuantity?: Quantity

	valueRange?: Range

	valueBoolean?: boolean

	_valueBoolean?: Element
}

/** A record of a device being used by a patient where the record is the result of a report from the patient or another clinician. */

export interface DeviceUseStatement<Contained = ResourceList> {
	resourceType: `DeviceUseStatement`
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
	/** A human-readable narrative that contains a summary of the resource and can be used to represent the content of the resource to a human. The narrative need not encode all the structured data, but is required to contain sufficient detail to make it "clinically safe" for a human to just read the narrative. Resource definitions may define what content should be represented in the narrative to ensure clinical safety. */
	text?: Narrative
	contained?: Contained[]
	/** May be used to represent additional information that is not part of the basic definition of the resource. To make the use of extensions safe and manageable, there is a strict set of governance  applied to the definition and use of extensions. Though any implementer can define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. */
	extension?: Extension[]
	/** May be used to represent additional information that is not part of the basic definition of the resource and that modifies the understanding of the element that contains it and/or the understanding of the containing element's descendants. Usually modifier elements provide negation or qualification. To make the use of extensions safe and manageable, there is a strict set of governance applied to the definition and use of extensions. Though any implementer is allowed to define an extension, there is a set of requirements that SHALL be met as part of the definition of the extension. Applications processing a resource are required to check for modifier extensions.

Modifier extensions SHALL NOT change the meaning of any elements on Resource or DomainResource (including cannot change the meaning of modifierExtension itself). */
	modifierExtension?: Extension[]
	/** An external identifier for this statement such as an IRI. */
	identifier?: Identifier[]
	/** A plan, proposal or order that is fulfilled in whole or in part by this DeviceUseStatement. */
	basedOn?: Reference[]
	/** A code representing the patient or other source's judgment about the state of the device used that this statement is about.  Generally this will be active or completed. */
	status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold'

	_status?: Element
	/** The patient who used the device. */
	subject: Reference
	/** Allows linking the DeviceUseStatement to the underlying Request, or to other information that supports or is used to derive the DeviceUseStatement. */
	derivedFrom?: Reference[]

	timingTiming?: Timing

	timingPeriod?: Period

	timingDateTime?: string

	_timingDateTime?: Element
	/** The time at which the statement was made/recorded. */
	recordedOn?: string

	_recordedOn?: Element
	/** Who reported the device was being used by the patient. */
	source?: Reference
	/** The details of the device used. */
	device: Reference
	/** Reason or justification for the use of the device. */
	reasonCode?: CodeableConcept[]
	/** Indicates another resource whose existence justifies this DeviceUseStatement. */
	reasonReference?: Reference[]
	/** Indicates the anotomic location on the subject's body where the device was used ( i.e. the target). */
	bodySite?: CodeableConcept
	/** Details about the device statement that were not represented at all or sufficiently in one of the attributes provided in a class. These may include for example a comment, an instruction, or a note associated with the statement. */
	note?: Annotation[]
}
