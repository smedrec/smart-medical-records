import { relations } from 'drizzle-orm'
import {
	blob,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core'

import { generateId } from '../utils/id'
import { organization, user } from './auth'

import type {
	CareTeam,
	CodeSystem,
	ImplementationGuide,
	Location,
	Organization,
	Patient,
	Person,
	Practitioner,
	RelatedPerson,
} from '@solarahealth/fhir-r4'

/**
 * A set of rules of how a particular interoperability or standards problem is solved - typically through the use of FHIR resources. This resource is used to gather all the parts of an implementation guide into a logical whole and to publish a computable definition of all the parts.
 */
export const implementationguide = sqliteTable(
	'implementationguide',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<ImplementationGuide>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('patient_organization_idx').on(table.organization),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const implementationguideHistory = sqliteTable(
	'implementationguide_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<ImplementationGuide>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)

export const organizationHistory = sqliteTable(
	'organization_history',
	{
		id: text('id'),
		name: text('name').notNull(),
		slug: text('slug').unique(),
		logo: text('logo'),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
		metadata: text('metadata'),
		// fhir fields
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Organization>(), // resource body
	},
	(table) => {
		return [primaryKey({ columns: [table.id, table.version] })]
	}
)

/**
 * The CodeSystem resource is used to declare the existence of and describe a code system or code system supplement and its key properties, and optionally define a part or all of its content.
 */
export const codesystem = sqliteTable(
	'codesystem',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<CodeSystem>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('patient_organization_idx').on(table.organization),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const codesystemHistory = sqliteTable(
	'codesystem_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<CodeSystem>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * The Care Team includes all the people and organizations who plan to participate in the coordination and delivery of care for a patient.
 */
export const careteam = sqliteTable(
	'careteam',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<CareTeam>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('patient_organization_idx').on(table.organization),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const careteamHistory = sqliteTable(
	'careteam_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<CareTeam>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Details and position information for a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated.
 */
export const location = sqliteTable(
	'location',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<CareTeam>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('patient_organization_idx').on(table.organization),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const locationHistory = sqliteTable(
	'location_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Location>(), // resource body
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Demographics and administrative information about a person independent of a specific health-related context.
 */
export const person = sqliteTable(
	'person',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Person>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('practitioner_user_idx').on(table.user),
			index('practitioner_organization_idx').on(table.organization),
			index('practitioner_created_by_idx').on(table.createdBy),
		]
	}
)

export const personHistory = sqliteTable(
	'person_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Person>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('practitioner_history_user_idx').on(table.user),
			index('practitioner_history_organization_idx').on(table.organization),
			index('practitioner_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Information about a person that is involved in the care for a patient, but who is not the target of healthcare, nor has a formal responsibility in the care process.
 */
export const relatedperson = sqliteTable(
	'relatedperson',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<RelatedPerson>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('practitioner_user_idx').on(table.user),
			index('practitioner_organization_idx').on(table.organization),
			index('practitioner_created_by_idx').on(table.createdBy),
		]
	}
)

export const relatedpersonHistory = sqliteTable(
	'relatedperson_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<RelatedPerson>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('practitioner_history_user_idx').on(table.user),
			index('practitioner_history_organization_idx').on(table.organization),
			index('practitioner_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * A person with a formal responsibility in the provisioning of healthcare or related services
 */
export const practitioner = sqliteTable(
	'practitioner',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Practitioner>(), // resource body
		user: text('user')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('practitioner_user_idx').on(table.user),
			index('practitioner_organization_idx').on(table.organization),
			index('practitioner_created_by_idx').on(table.createdBy),
		]
	}
)

export const practitionerHistory = sqliteTable(
	'practitioner_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Practitioner>(), // resource body
		user: text('user')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('practitioner_history_user_idx').on(table.user),
			index('practitioner_history_organization_idx').on(table.organization),
			index('practitioner_history_created_by_idx').on(table.createdBy),
		]
	}
)

/**
 * Demographics and other administrative information about an individual or animal receiving care or other health-related services.
 */
export const patient = sqliteTable(
	'patient',
	{
		id: text('id').primaryKey().$defaultFn(generateId), // id of resource
		version: integer('version').default(0), // version id and logical transaction id
		ts: integer('ts', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()), // last updated time
		status: text('status')
			.$type<'create' | 'updated' | 'deleted' | 'recreated'>()
			.default('create'), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Patient>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			index('patient_user_idx').on(table.user),
			index('patient_organization_idx').on(table.organization),
			index('patient_created_by_idx').on(table.createdBy),
		]
	}
)

export const patientHistory = sqliteTable(
	'patient_history',
	{
		id: text('id'),
		version: integer('version', { mode: 'number' }), // version of history
		ts: integer('ts', { mode: 'timestamp' }), // last updated time
		status: text('status').$type<'create' | 'updated' | 'deleted' | 'recreated'>(), // resource status
		resource: blob('resource', { mode: 'json' }).$type<Patient>(), // resource body
		user: text('user').references(() => user.id, { onDelete: 'cascade' }),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_user_idx').on(table.user),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)
