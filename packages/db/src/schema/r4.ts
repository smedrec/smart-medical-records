import { index, integer, jsonb, pgSchema, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { generateId } from '../utils/id'
import { tenant, user } from './auth'

import type {
	CareTeam,
	CodeSystem,
	ImplementationGuide,
	List,
	Location,
	NamingSystem,
	Organization,
	Patient,
	Person,
	Practitioner,
	RelatedPerson,
	StructureDefinition,
	ValueSet,
} from '@solarahealth/fhir-r4'

export const r4Schema = pgSchema('r4')

export const resourceStatus = r4Schema.enum('resource_status', [
	'create',
	'updated',
	'deleted',
	'recreated',
])

export const visibility = r4Schema.enum('visibility', ['public', 'private'])

/**
 * Module: Conformance
 *
 * A set of rules of how a particular interoperability or standards problem is solved - typically through the use of FHIR resources. This resource is used to gather all the parts of an implementation guide into a logical whole and to publish a computable definition of all the parts.
 */
export const implementationguide = r4Schema.table(
	'implementationguide',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<ImplementationGuide>(), // resource body
		visibility: visibility('visibility').default('public'), // visibility of the resource
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('implementationguide_tenant_idx').on(table.tenant),
			index('implementationguide_created_by_idx').on(table.createdBy),
		]
	}
)

export const implementationguideHistory = r4Schema.table(
	'implementationguide_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<ImplementationGuide>(), // resource body
		visibility: visibility('visibility'), // visibility of the resource
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('implementationguide_history_tenant_idx').on(table.tenant),
			index('implementationguide_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module: Terminology
 *
 * The CodeSystem resource is used to declare the existence of and describe a code system or code system supplement and its key properties, and optionally define a part or all of its content.
 */
export const codesystem = r4Schema.table(
	'codesystem',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<CodeSystem>(), // resource body
		visibility: visibility('visibility').default('public'), // visibility of the resource
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('codesystem_tenant_idx').on(table.tenant),
			index('codesystem_created_by_idx').on(table.createdBy),
		]
	}
)

export const codesystemHistory = r4Schema.table(
	'codesystem_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<CodeSystem>(), // resource body
		visibility: visibility('visibility'),
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('codesystem_history_tenant_idx').on(table.tenant),
			index('codesystem_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module: Terminology
 *
 * A ValueSet resource instance specifies a set of codes drawn from one or more code systems, intended for use in a particular context. Value sets link between CodeSystem definitions and their use in coded elements.
 */
export const valueset = r4Schema.table(
	'valueset',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<ValueSet>(), // resource body
		visibility: visibility('visibility').default('public'), // visibility of the resource
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('valueset_tenant_idx').on(table.tenant),
			index('valueset_created_by_idx').on(table.createdBy),
		]
	}
)

export const valuesetHistory = r4Schema.table(
	'valueset_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<ValueSet>(), // resource body
		visibility: visibility('visibility'),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('valueset_history_tenant_idx').on(table.tenant),
			index('valueset_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module: Foundation
 *
 * A list is a curated collection of resources.
 */
export const list = r4Schema.table(
	'list',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		visibility: visibility('visibility').default('public'), // visibility of the resource
		resource: jsonb('resource').$type<List>(), // resource body
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('list_tenant_idx').on(table.tenant),
			index('list_created_by_idx').on(table.createdBy),
		]
	}
)

export const listHistory = r4Schema.table(
	'list_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<List>(), // resource body
		visibility: visibility('visibility'),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('list_history_tenant_idx').on(table.tenant),
			index('list_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module: Terminology
 *
 * A curated namespace that issues unique symbols within that namespace for the identification of concepts, people, devices, etc. Represents a "System" used within the Identifier and Coding data types.
 */
export const namingsystem = r4Schema.table(
	'namingsystem',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		visibility: visibility('visibility').default('public'), // visibility of the resource
		resource: jsonb('resource').$type<NamingSystem>(), // resource body
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, {
				onDelete: 'cascade',
			}),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id, {
				onDelete: 'cascade',
			}),
	},
	(table) => {
		return [
			index('namingsystem_tenant_idx').on(table.tenant),
			index('namingsystem_created_by_idx').on(table.createdBy),
		]
	}
)

export const namingsystemHistory = r4Schema.table(
	'namingsystem_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<NamingSystem>(), // resource body
		visibility: visibility('visibility'),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('namingsystem_history_tenant_idx').on(table.tenant),
			index('namingsystem_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module: Conformance
 *
 * A definition of a FHIR structure. This resource is used to describe the underlying resources, data types defined in FHIR, and also for describing extensions and constraints on resources and data types.
 */
export const structuredefinition = r4Schema.table(
	'structuredefinition',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<StructureDefinition>(), // resource body
		visibility: visibility('visibility').default('public'), // visibility of the resource
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('structuredefinition_tenant_idx').on(table.tenant),
			index('structuredefinition_created_by_idx').on(table.createdBy),
		]
	}
)

export const structuredefinitionHistory = r4Schema.table(
	'structuredefinition_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<StructureDefinition>(), // resource body
		visibility: visibility('visibility'),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('structuredefinition_history_tenant_idx').on(table.tenant),
			index('structuredefinition_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * A formally or informally recognized grouping of people or organizations formed for the purpose of achieving some form of collective action. Includes companies, institutions, corporations, departments, community groups, healthcare practice groups, payer/insurer, etc.
 */
export const organization = r4Schema.table(
	'organization',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<Organization>(), // resource body
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('organization_tenant_idx').on(table.tenant),
			index('organization_created_by_idx').on(table.createdBy),
		]
	}
)

export const organizationHistory = r4Schema.table(
	'organization_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<Organization>(), // resource body
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('organization_history_tenant_idx').on(table.tenant),
			index('organization_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * The Care Team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient.
 */
export const careteam = r4Schema.table(
	'careteam',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<CareTeam>(), // resource body
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('careteam_tenant_idx').on(table.tenant),
			index('careteam_created_by_idx').on(table.createdBy),
		]
	}
)

export const careteamHistory = r4Schema.table(
	'careteam_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<CareTeam>(), // resource body
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('careteam_history_tenant_idx').on(table.tenant),
			index('careteam_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated.
 */
export const location = r4Schema.table(
	'location',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<CareTeam>(), // resource body
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('location_tenant_idx').on(table.tenant),
			index('location_created_by_idx').on(table.createdBy),
		]
	}
)

export const locationHistory = r4Schema.table(
	'location_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<Location>(), // resource body
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('location_history_tenant_idx').on(table.tenant),
			index('location_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * Demographics and administrative information about a person independent of a specific health-related context.
 */
export const person = r4Schema.table(
	'person',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<Person>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		tenant: text('tenant').references(() => tenant.id, {
			onDelete: 'cascade',
		}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('person_user_idx').on(table.user),
			index('person_tenant_idx').on(table.tenant),
			index('person_created_by_idx').on(table.createdBy),
		]
	}
)

export const personHistory = r4Schema.table(
	'person_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<Person>(), // resource body
		user: text('user').references(() => user.id),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('person_history_user_idx').on(table.user),
			index('person_history_tenant_idx').on(table.tenant),
			index('person_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * Information about a person that is involved in the care for a patient, but who is not the target of healthcare, nor has a formal responsibility in the care process.
 */
export const relatedperson = r4Schema.table(
	'relatedperson',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<RelatedPerson>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('relatedperson_user_idx').on(table.user),
			index('relatedperson_tenant_idx').on(table.tenant),
			index('relatedperson_created_by_idx').on(table.createdBy),
		]
	}
)

export const relatedpersonHistory = r4Schema.table(
	'relatedperson_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<RelatedPerson>(), // resource body
		user: text('user').references(() => user.id),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('relatedperson_history_user_idx').on(table.user),
			index('relatedperson_history_tenant_idx').on(table.tenant),
			index('relatedperson_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * A person with a formal responsibility in the provisioning of healthcare or related services
 */
export const practitioner = r4Schema.table(
	'practitioner',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<Practitioner>(), // resource body
		user: text('user')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('practitioner_user_idx').on(table.user),
			index('practitioner_tenant_idx').on(table.tenant),
			index('practitioner_created_by_idx').on(table.createdBy),
		]
	}
)

export const practitionerHistory = r4Schema.table(
	'practitioner_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<Practitioner>(), // resource body
		user: text('user').references(() => user.id),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('practitioner_history_user_idx').on(table.user),
			index('practitioner_history_tenant_idx').on(table.tenant),
			index('practitioner_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Module:  Administration
 *
 * Demographics and other administrative information about an individual or animal receiving care or other health-related services.
 */
export const patient = r4Schema.table(
	'patient',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: timestamp('ts').$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: resourceStatus('status').default('create'), // resource status
		resource: jsonb('resource').$type<Patient>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		tenant: text('tenant')
			.notNull()
			.references(() => tenant.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by')
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return [
			index('patient_user_idx').on(table.user),
			index('patient_tenant_idx').on(table.tenant),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const patientHistory = r4Schema.table(
	'patient_history',
	{
		id: text('id'),
		version: integer('version'), // version of history
		ts: timestamp('ts'), // last updated time
		status: resourceStatus('status'), // resource status
		resource: jsonb('resource').$type<Patient>(), // resource body
		user: text('user').references(() => user.id),
		tenant: text('tenant').references(() => tenant.id),
		createdBy: text('created_by').references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_user_idx').on(table.user),
			index('patient_history_tenant_idx').on(table.tenant),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)
