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

import type { Patient, Practitioner } from '@solarahealth/fhir-r4'

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
			primaryKey({ columns: [table.id, table.version] }),
			index('patient_history_user_idx').on(table.user),
			index('patient_history_organization_idx').on(table.organization),
			index('patient_history_created_by_idx').on(table.createdBy),
		]
	}
)
