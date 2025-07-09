import { z } from 'zod/v4'

import {
	createCodeableConceptSchema,
	createContactDetailSchema,
	createElementSchema,
	createExtensionSchema,
	createMetaSchema,
	createReferenceSchema,
	createUsageContextSchema,
} from '../core/schema'
import { createNarrativeSchema } from '../narrative/schema'
import * as primitives from '../primitives'
import { createResourceListSchema } from '../resourcelist/schema'
import { getCachedSchema, ZodNever } from '../schema-cache'
import * as types from './types'

/* Generated from FHIR JSON Schema */

export function createImplementationGuideSchema<C extends z.ZodTypeAny = z.ZodUnknown>(options?: {
	contained?: C
	allowContained?: boolean
}) {
	const contained =
		options?.allowContained === false
			? ZodNever
			: (options?.contained ?? createResourceListSchema())

	return getCachedSchema('ImplementationGuide', [contained], () => {
		const baseSchema: z.ZodType<types.ImplementationGuide<z.infer<C>>> = z.strictObject({
			resourceType: z.literal('ImplementationGuide'),
			id: primitives.getIdSchema().optional(),
			meta: createMetaSchema().optional(),
			implicitRules: primitives.getUriSchema().optional(),
			_implicitRules: createElementSchema().optional(),
			language: primitives.getCodeSchema().optional(),
			_language: createElementSchema().optional(),
			text: createNarrativeSchema().optional(),
			contained: z.array(contained).optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			url: primitives.getUriSchema(),
			_url: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
			name: primitives.getStringSchema(),
			_name: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			status: z.enum(['draft', 'active', 'retired', 'unknown']),
			_status: createElementSchema().optional(),
			experimental: primitives.getBooleanSchema().optional(),
			_experimental: createElementSchema().optional(),
			date: primitives.getDateTimeSchema().optional(),
			_date: createElementSchema().optional(),
			publisher: primitives.getStringSchema().optional(),
			_publisher: createElementSchema().optional(),
			contact: z.array(createContactDetailSchema()).optional(),
			description: primitives.getMarkdownSchema().optional(),
			_description: createElementSchema().optional(),
			useContext: z.array(createUsageContextSchema()).optional(),
			jurisdiction: z.array(createCodeableConceptSchema()).optional(),
			copyright: primitives.getMarkdownSchema().optional(),
			_copyright: createElementSchema().optional(),
			packageId: primitives.getIdSchema(),
			_packageId: createElementSchema().optional(),
			license: z
				.enum([
					'not-open-source',
					'0BSD',
					'AAL',
					'Abstyles',
					'Adobe-2006',
					'Adobe-Glyph',
					'ADSL',
					'AFL-1.1',
					'AFL-1.2',
					'AFL-2.0',
					'AFL-2.1',
					'AFL-3.0',
					'Afmparse',
					'AGPL-1.0-only',
					'AGPL-1.0-or-later',
					'AGPL-3.0-only',
					'AGPL-3.0-or-later',
					'Aladdin',
					'AMDPLPA',
					'AML',
					'AMPAS',
					'ANTLR-PD',
					'Apache-1.0',
					'Apache-1.1',
					'Apache-2.0',
					'APAFML',
					'APL-1.0',
					'APSL-1.0',
					'APSL-1.1',
					'APSL-1.2',
					'APSL-2.0',
					'Artistic-1.0-cl8',
					'Artistic-1.0-Perl',
					'Artistic-1.0',
					'Artistic-2.0',
					'Bahyph',
					'Barr',
					'Beerware',
					'BitTorrent-1.0',
					'BitTorrent-1.1',
					'Borceux',
					'BSD-1-Clause',
					'BSD-2-Clause-FreeBSD',
					'BSD-2-Clause-NetBSD',
					'BSD-2-Clause-Patent',
					'BSD-2-Clause',
					'BSD-3-Clause-Attribution',
					'BSD-3-Clause-Clear',
					'BSD-3-Clause-LBNL',
					'BSD-3-Clause-No-Nuclear-License-2014',
					'BSD-3-Clause-No-Nuclear-License',
					'BSD-3-Clause-No-Nuclear-Warranty',
					'BSD-3-Clause',
					'BSD-4-Clause-UC',
					'BSD-4-Clause',
					'BSD-Protection',
					'BSD-Source-Code',
					'BSL-1.0',
					'bzip2-1.0.5',
					'bzip2-1.0.6',
					'Caldera',
					'CATOSL-1.1',
					'CC-BY-1.0',
					'CC-BY-2.0',
					'CC-BY-2.5',
					'CC-BY-3.0',
					'CC-BY-4.0',
					'CC-BY-NC-1.0',
					'CC-BY-NC-2.0',
					'CC-BY-NC-2.5',
					'CC-BY-NC-3.0',
					'CC-BY-NC-4.0',
					'CC-BY-NC-ND-1.0',
					'CC-BY-NC-ND-2.0',
					'CC-BY-NC-ND-2.5',
					'CC-BY-NC-ND-3.0',
					'CC-BY-NC-ND-4.0',
					'CC-BY-NC-SA-1.0',
					'CC-BY-NC-SA-2.0',
					'CC-BY-NC-SA-2.5',
					'CC-BY-NC-SA-3.0',
					'CC-BY-NC-SA-4.0',
					'CC-BY-ND-1.0',
					'CC-BY-ND-2.0',
					'CC-BY-ND-2.5',
					'CC-BY-ND-3.0',
					'CC-BY-ND-4.0',
					'CC-BY-SA-1.0',
					'CC-BY-SA-2.0',
					'CC-BY-SA-2.5',
					'CC-BY-SA-3.0',
					'CC-BY-SA-4.0',
					'CC0-1.0',
					'CDDL-1.0',
					'CDDL-1.1',
					'CDLA-Permissive-1.0',
					'CDLA-Sharing-1.0',
					'CECILL-1.0',
					'CECILL-1.1',
					'CECILL-2.0',
					'CECILL-2.1',
					'CECILL-B',
					'CECILL-C',
					'ClArtistic',
					'CNRI-Jython',
					'CNRI-Python-GPL-Compatible',
					'CNRI-Python',
					'Condor-1.1',
					'CPAL-1.0',
					'CPL-1.0',
					'CPOL-1.02',
					'Crossword',
					'CrystalStacker',
					'CUA-OPL-1.0',
					'Cube',
					'curl',
					'D-FSL-1.0',
					'diffmark',
					'DOC',
					'Dotseqn',
					'DSDP',
					'dvipdfm',
					'ECL-1.0',
					'ECL-2.0',
					'EFL-1.0',
					'EFL-2.0',
					'eGenix',
					'Entessa',
					'EPL-1.0',
					'EPL-2.0',
					'ErlPL-1.1',
					'EUDatagrid',
					'EUPL-1.0',
					'EUPL-1.1',
					'EUPL-1.2',
					'Eurosym',
					'Fair',
					'Frameworx-1.0',
					'FreeImage',
					'FSFAP',
					'FSFUL',
					'FSFULLR',
					'FTL',
					'GFDL-1.1-only',
					'GFDL-1.1-or-later',
					'GFDL-1.2-only',
					'GFDL-1.2-or-later',
					'GFDL-1.3-only',
					'GFDL-1.3-or-later',
					'Giftware',
					'GL2PS',
					'Glide',
					'Glulxe',
					'gnuplot',
					'GPL-1.0-only',
					'GPL-1.0-or-later',
					'GPL-2.0-only',
					'GPL-2.0-or-later',
					'GPL-3.0-only',
					'GPL-3.0-or-later',
					'gSOAP-1.3b',
					'HaskellReport',
					'HPND',
					'IBM-pibs',
					'ICU',
					'IJG',
					'ImageMagick',
					'iMatix',
					'Imlib2',
					'Info-ZIP',
					'Intel-ACPI',
					'Intel',
					'Interbase-1.0',
					'IPA',
					'IPL-1.0',
					'ISC',
					'JasPer-2.0',
					'JSON',
					'LAL-1.2',
					'LAL-1.3',
					'Latex2e',
					'Leptonica',
					'LGPL-2.0-only',
					'LGPL-2.0-or-later',
					'LGPL-2.1-only',
					'LGPL-2.1-or-later',
					'LGPL-3.0-only',
					'LGPL-3.0-or-later',
					'LGPLLR',
					'Libpng',
					'libtiff',
					'LiLiQ-P-1.1',
					'LiLiQ-R-1.1',
					'LiLiQ-Rplus-1.1',
					'Linux-OpenIB',
					'LPL-1.0',
					'LPL-1.02',
					'LPPL-1.0',
					'LPPL-1.1',
					'LPPL-1.2',
					'LPPL-1.3a',
					'LPPL-1.3c',
					'MakeIndex',
					'MirOS',
					'MIT-0',
					'MIT-advertising',
					'MIT-CMU',
					'MIT-enna',
					'MIT-feh',
					'MIT',
					'MITNFA',
					'Motosoto',
					'mpich2',
					'MPL-1.0',
					'MPL-1.1',
					'MPL-2.0-no-copyleft-exception',
					'MPL-2.0',
					'MS-PL',
					'MS-RL',
					'MTLL',
					'Multics',
					'Mup',
					'NASA-1.3',
					'Naumen',
					'NBPL-1.0',
					'NCSA',
					'Net-SNMP',
					'NetCDF',
					'Newsletr',
					'NGPL',
					'NLOD-1.0',
					'NLPL',
					'Nokia',
					'NOSL',
					'Noweb',
					'NPL-1.0',
					'NPL-1.1',
					'NPOSL-3.0',
					'NRL',
					'NTP',
					'OCCT-PL',
					'OCLC-2.0',
					'ODbL-1.0',
					'OFL-1.0',
					'OFL-1.1',
					'OGTSL',
					'OLDAP-1.1',
					'OLDAP-1.2',
					'OLDAP-1.3',
					'OLDAP-1.4',
					'OLDAP-2.0.1',
					'OLDAP-2.0',
					'OLDAP-2.1',
					'OLDAP-2.2.1',
					'OLDAP-2.2.2',
					'OLDAP-2.2',
					'OLDAP-2.3',
					'OLDAP-2.4',
					'OLDAP-2.5',
					'OLDAP-2.6',
					'OLDAP-2.7',
					'OLDAP-2.8',
					'OML',
					'OpenSSL',
					'OPL-1.0',
					'OSET-PL-2.1',
					'OSL-1.0',
					'OSL-1.1',
					'OSL-2.0',
					'OSL-2.1',
					'OSL-3.0',
					'PDDL-1.0',
					'PHP-3.0',
					'PHP-3.01',
					'Plexus',
					'PostgreSQL',
					'psfrag',
					'psutils',
					'Python-2.0',
					'Qhull',
					'QPL-1.0',
					'Rdisc',
					'RHeCos-1.1',
					'RPL-1.1',
					'RPL-1.5',
					'RPSL-1.0',
					'RSA-MD',
					'RSCPL',
					'Ruby',
					'SAX-PD',
					'Saxpath',
					'SCEA',
					'Sendmail',
					'SGI-B-1.0',
					'SGI-B-1.1',
					'SGI-B-2.0',
					'SimPL-2.0',
					'SISSL-1.2',
					'SISSL',
					'Sleepycat',
					'SMLNJ',
					'SMPPL',
					'SNIA',
					'Spencer-86',
					'Spencer-94',
					'Spencer-99',
					'SPL-1.0',
					'SugarCRM-1.1.3',
					'SWL',
					'TCL',
					'TCP-wrappers',
					'TMate',
					'TORQUE-1.1',
					'TOSL',
					'Unicode-DFS-2015',
					'Unicode-DFS-2016',
					'Unicode-TOU',
					'Unlicense',
					'UPL-1.0',
					'Vim',
					'VOSTROM',
					'VSL-1.0',
					'W3C-19980720',
					'W3C-20150513',
					'W3C',
					'Watcom-1.0',
					'Wsuipa',
					'WTFPL',
					'X11',
					'Xerox',
					'XFree86-1.1',
					'xinetd',
					'Xnet',
					'xpp',
					'XSkat',
					'YPL-1.0',
					'YPL-1.1',
					'Zed',
					'Zend-2.0',
					'Zimbra-1.3',
					'Zimbra-1.4',
					'zlib-acknowledgement',
					'Zlib',
					'ZPL-1.1',
					'ZPL-2.0',
					'ZPL-2.1',
				])
				.optional(),
			_license: createElementSchema().optional(),
			fhirVersion: z
				.enum([
					'0.01',
					'0.05',
					'0.06',
					'0.11',
					'0.0.80',
					'0.0.81',
					'0.0.82',
					'0.4.0',
					'0.5.0',
					'1.0.0',
					'1.0.1',
					'1.0.2',
					'1.1.0',
					'1.4.0',
					'1.6.0',
					'1.8.0',
					'3.0.0',
					'3.0.1',
					'3.3.0',
					'3.5.0',
					'4.0.0',
					'4.0.1',
				])
				.array(),
			_fhirVersion: z.array(createElementSchema()).optional(),
			dependsOn: z.array(createImplementationGuideDependsOnSchema()).optional(),
			global: z.array(createImplementationGuideGlobalSchema()).optional(),
			definition: createImplementationGuideDefinitionSchema().optional(),
			manifest: createImplementationGuideManifestSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideDependsOnSchema() {
	return getCachedSchema('ImplementationGuideDependsOn', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideDependsOn> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			uri: primitives.getCanonicalSchema(),
			packageId: primitives.getIdSchema().optional(),
			_packageId: createElementSchema().optional(),
			version: primitives.getStringSchema().optional(),
			_version: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideGlobalSchema() {
	return getCachedSchema('ImplementationGuideGlobal', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideGlobal> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			type: primitives.getCodeSchema(),
			_type: createElementSchema().optional(),
			profile: primitives.getCanonicalSchema(),
		})

		return baseSchema
	})
}

export function createImplementationGuideDefinitionSchema() {
	return getCachedSchema('ImplementationGuideDefinition', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideDefinition> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			grouping: z.array(createImplementationGuideGroupingSchema()).optional(),
			resource: z.array(createImplementationGuideResourceSchema()),
			page: createImplementationGuidePageSchema().optional(),
			parameter: z.array(createImplementationGuideParameterSchema()).optional(),
			template: z.array(createImplementationGuideTemplateSchema()).optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideGroupingSchema() {
	return getCachedSchema('ImplementationGuideGrouping', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideGrouping> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideResourceSchema() {
	return getCachedSchema('ImplementationGuideResource', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideResource> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			reference: createReferenceSchema(),
			fhirVersion: z
				.enum([
					'0.01',
					'0.05',
					'0.06',
					'0.11',
					'0.0.80',
					'0.0.81',
					'0.0.82',
					'0.4.0',
					'0.5.0',
					'1.0.0',
					'1.0.1',
					'1.0.2',
					'1.1.0',
					'1.4.0',
					'1.6.0',
					'1.8.0',
					'3.0.0',
					'3.0.1',
					'3.3.0',
					'3.5.0',
					'4.0.0',
					'4.0.1',
				])
				.array()
				.optional(),
			_fhirVersion: z.array(createElementSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			description: primitives.getStringSchema().optional(),
			_description: createElementSchema().optional(),
			exampleBoolean: z.boolean().optional(),
			_exampleBoolean: createElementSchema().optional(),
			exampleCanonical: z.string().optional(),
			_exampleCanonical: createElementSchema().optional(),
			groupingId: primitives.getIdSchema().optional(),
			_groupingId: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuidePageSchema() {
	return getCachedSchema('ImplementationGuidePage', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuidePage> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			nameUrl: z.string().optional(),
			_nameUrl: createElementSchema().optional(),
			nameReference: createReferenceSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			generation: z.enum(['html', 'markdown', 'xml', 'generated']).optional(),
			_generation: createElementSchema().optional(),
			page: z.array(createImplementationGuidePageSchema()).optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideParameterSchema() {
	return getCachedSchema('ImplementationGuideParameter', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideParameter> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: z
				.enum([
					'apply',
					'path-resource',
					'path-pages',
					'path-tx-cache',
					'expansion-parameter',
					'rule-broken-links',
					'generate-xml',
					'generate-json',
					'generate-turtle',
					'html-template',
				])
				.optional(),
			_code: createElementSchema().optional(),
			value: primitives.getStringSchema().optional(),
			_value: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideTemplateSchema() {
	return getCachedSchema('ImplementationGuideTemplate', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideTemplate> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			code: primitives.getCodeSchema().optional(),
			_code: createElementSchema().optional(),
			source: primitives.getStringSchema().optional(),
			_source: createElementSchema().optional(),
			scope: primitives.getStringSchema().optional(),
			_scope: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideManifestSchema() {
	return getCachedSchema('ImplementationGuideManifest', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideManifest> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			rendering: primitives.getUrlSchema().optional(),
			_rendering: createElementSchema().optional(),
			resource: z.array(createImplementationGuideResource1Schema()),
			page: z.array(createImplementationGuidePage1Schema()).optional(),
			image: z.array(primitives.getStringSchema()).optional(),
			_image: z.array(createElementSchema()).optional(),
			other: z.array(primitives.getStringSchema()).optional(),
			_other: z.array(createElementSchema()).optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuideResource1Schema() {
	return getCachedSchema('ImplementationGuideResource1', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuideResource1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			reference: createReferenceSchema(),
			exampleBoolean: z.boolean().optional(),
			_exampleBoolean: createElementSchema().optional(),
			exampleCanonical: z.string().optional(),
			_exampleCanonical: createElementSchema().optional(),
			relativePath: primitives.getUrlSchema().optional(),
			_relativePath: createElementSchema().optional(),
		})

		return baseSchema
	})
}

export function createImplementationGuidePage1Schema() {
	return getCachedSchema('ImplementationGuidePage1', [], () => {
		const baseSchema: z.ZodType<types.ImplementationGuidePage1> = z.strictObject({
			id: primitives.getStringSchema().optional(),
			extension: z.array(createExtensionSchema()).optional(),
			modifierExtension: z.array(createExtensionSchema()).optional(),
			name: primitives.getStringSchema().optional(),
			_name: createElementSchema().optional(),
			title: primitives.getStringSchema().optional(),
			_title: createElementSchema().optional(),
			anchor: z.array(primitives.getStringSchema()).optional(),
			_anchor: z.array(createElementSchema()).optional(),
		})

		return baseSchema
	})
}
