import { relations } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { createId } from '../utils/id'
import { organization, user } from './auth'

export const assistant = sqliteTable(
	'assistant',
	{
		id: text('id').primaryKey().$defaultFn(createId('assistant')),
		telephone: text('telephone').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER'>().notNull(),
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
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('assistant_user_idx').on(table.user),
			index('assistant_organization_idx').on(table.organization),
			index('assistant_created_by_idx').on(table.createdBy),
		]
	}
)

export const therapist = sqliteTable(
	'therapist',
	{
		id: text('id').primaryKey().$defaultFn(createId('therapist')),
		type: text('type'),
		title: text('title'),
		telephone: text('telephone').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER'>().notNull(),
		disabled: integer('disabled', { mode: 'boolean' }).default(false),
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
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('therapist_user_id_idx').on(table.user),
			index('therapist_organization_idx').on(table.organization),
			index('therapist_created_by_idx').on(table.createdBy),
		]
	}
)

export const patient = sqliteTable(
	'patient',
	{
		id: text('id').primaryKey().$defaultFn(createId('patient')),
		name: text('name').notNull(),
		telephone: text('telephone').notNull(),
		email: text('email').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER'>().notNull(),
		city: text('city').notNull(),
		address: text('address').notNull(),
		note: text('note'),
		discrete: integer('disabled', { mode: 'boolean' }).default(false),
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
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('patient_created_by_idx').on(table.createdBy),
			index('patient_name_idx').on(table.name),
			uniqueIndex('patient_email_organization_idx').on(table.email, table.organization),
			index('patient_organization_idx').on(table.organization),
		]
	}
)

export const patientRelations = relations(patient, ({ many }) => ({
	patientToTherapists: many(patientsToTherapists),
}))

export const therapistRelations = relations(therapist, ({ many }) => ({
	therapistToPatients: many(patientsToTherapists),
}))

export const patientsToTherapists = sqliteTable(
	'patients_to_therapists',
	{
		patient: text('patient')
			.notNull()
			.references(() => patient.id),
		therapist: text('therapist')
			.notNull()
			.references(() => therapist.id),
		disabled: integer('disabled', { mode: 'boolean' }).default(false),
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
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => [
		primaryKey({ columns: [table.patient, table.therapist] }),
		index('patients_to_therapists_created_by_idx').on(table.createdBy),
	]
)

export const patientsToTherapistsRelations = relations(patientsToTherapists, ({ one }) => ({
	therapist: one(therapist, {
		fields: [patientsToTherapists.therapist],
		references: [therapist.id],
	}),
	patient: one(patient, {
		fields: [patientsToTherapists.patient],
		references: [patient.id],
	}),
}))
