export type RefTypes = {
	hl7?: string
	simplifier?: string
	nav?: string
}

export const hl7Refs = {
	patient: 'https://hl7.org/fhir/R4/patient.html',
	practitioner: 'https://hl7.org/fhir/R4/practitioner.html',
	condition: 'https://hl7.org/fhir/R4/condition.html',
	encounter: 'https://hl7.org/fhir/R4/encounter.html',
	documentReference: 'https://hl7.org/fhir/R4/documentreference.html',
	smartLaunch: 'https://build.fhir.org/ig/HL7/smart-app-launch/app-launch.html',
	idToken:
		'https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html#scopes-for-requesting-identity-data',
	organization: 'https://hl7.org/fhir/R4/organization.html',
}

export const simplifierRefs = {
	noBasisPasient: 'https://simplifier.net/HL7Norwayno-basis/NoBasisPatient',
	noBasisPractitioner: 'https://simplifier.net/hl7norwayno-basis/nobasispractitioner',
	noBasisOrganization: 'https://simplifier.net/hl7norwayno-basis/NoBasisOrganization',
	telecom: 'https://simplifier.net/packages/hl7.fhir.r4.core/4.0.1/files/83048',
}

export const navRefs = {
	patient: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/patient.md',
	practitioner: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/practitioner.md',
	condition: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/condition.md',
	encounter: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/encounter.md',
	documentReference: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/document-reference.md',
	organization: 'https://github.com/navikt/syk-inn/blob/main/docs/fhir/organization.md',
}

export const organizationRefs = {}

export const fullRefs = {
	pasient: {
		hl7: hl7Refs.patient,
		simplifier: simplifierRefs.noBasisPasient,
		nav: navRefs.patient,
	},
	practitioner: {
		hl7: hl7Refs.practitioner,
		simplifier: simplifierRefs.noBasisPractitioner,
		nav: navRefs.practitioner,
	},
	condition: {
		hl7: hl7Refs.condition,
		nav: navRefs.condition,
	},
	encounter: {
		hl7: hl7Refs.encounter,
		nav: navRefs.encounter,
	},
	documentReference: {
		hl7: hl7Refs.documentReference,
		nav: navRefs.documentReference,
	},
	organization: {
		hl7: hl7Refs.organization,
	},
} satisfies Record<string, RefTypes>
