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
import { organization, team, user } from './auth'

export const assistant = sqliteTable(
	'assistant',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		telephone: text('telephone').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'>().notNull(),
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

//A person with a formal responsibility in the provisioning of healthcare or related services
export const therapist = sqliteTable(
	'therapist',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		type: text('type'),
		title: text('title'),
		telephone: text('telephone').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'>().notNull(),
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

// Information about an individual or animal receiving health care services
export const patient = sqliteTable(
	'patient',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		name: text('name').notNull(),
		telephone: text('telephone').notNull(),
		email: text('email').notNull(),
		dob: text('dob').notNull(),
		gender: text('gender').$type<'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'>().notNull(),
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

export const caseStudy = sqliteTable(
	'case_study',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		patient: text('patient')
			.notNull()
			.references(() => patient.id),
		title: text('title').notNull(),
		careTeam: text('care_team')
			.notNull()
			.references(() => team.id, {
				onDelete: 'cascade',
			}), // The Care Team includes all the people in an organization who plan to participate in the coordination and delivery of care.
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
			index('case_study_patient_idx').on(table.patient),
			index('case_study_created_by_idx').on(table.createdBy),
		]
	}
)

export const caseStudyRelations = relations(caseStudy, ({ many }) => ({
	caseStudyRelation: many(caseStudyRelation),
}))

export const caseStudyTherapistRelations = relations(therapist, ({ many }) => ({
	caseStudyTherapist: many(caseStudyTherapist),
}))

export const caseStudyTreatmentRelations = relations(caseStudy, ({ many }) => ({
	caseStudyTreatment: many(caseStudyTreatment),
}))

export const caseStudyRelation = sqliteTable(
	'case_study_relation',
	{
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id),
		relatedCaseStudy: text('related_case_study')
			.notNull()
			.references(() => caseStudy.id),
		description: text(),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			primaryKey({
				columns: [table.caseStudy, table.relatedCaseStudy],
			}),
		]
	}
)

export const caseStudyTherapist = sqliteTable(
	'case_study_therapist',
	{
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		therapist: text('therapist')
			.notNull()
			.references(() => therapist.id),
		primaryTherapist: integer('primary_therapist', { mode: 'boolean' }).default(false),
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
			primaryKey({ columns: [table.caseStudy, table.therapist] }),
			index('case_study_therapist_case_study_idx').on(table.caseStudy),
			index('case_study_therapist_idx').on(table.therapist),
			index('case_study_therapist_primary_idx').on(table.primaryTherapist),
		]
	}
)

export const caseStudyTreatment = sqliteTable(
	'case_study_treatment',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		external: integer('external', { mode: 'boolean' }).default(false),
		startedAt: integer('started_at', { mode: 'timestamp' }),
		endedAt: integer('ended_at', { mode: 'timestamp' }),
		title: text('title').notNull(),
		description: text('description'),
		privateDescription: text('private_description'),
		score: integer('score'),
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
			index('case_study_treatment_case_study_idx').on(table.caseStudy),
			index('case_study_treatment_created_by_idx').on(table.createdBy),
			index('case_study_treatment_created_at_idx').on(table.createdAt),
			index('case_study_treatment_started_at_idx').on(table.startedAt),
			index('case_study_treatment_ended_at_idx').on(table.endedAt),
		]
	}
)

export const caseStudyTreatmentFile = sqliteTable(
	'case_study_treatment_file',
	{
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		file: text('file')
			.notNull()
			.references(() => file.id, { onDelete: 'cascade' }),
		primaryFile: integer('primary_file', { mode: 'boolean' }).default(false),
		index: integer('index'),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.caseStudy, table.file] }),
			index('case_study_treatment_file_case_study_idx').on(table.caseStudy),
			index('case_study_treatment_file_file_idx').on(table.file),
		]
	}
)

export const caseStudyConclusion = sqliteTable(
	'case_study_conclusion',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		type: text('type')
			.$type<
				| 'TREATMENT_COMPLETION'
				| 'CANCELLATION_BY_PATIENT'
				| 'CANCELLATION_BY_PARENT'
				| 'CANCELLATION_BY_CLIENT'
				| 'FURTHER_REFERRAL'
			>()
			.notNull(),
		description: text('description').notNull(),
		privateDescription: text('private_description'),
		concludedAt: integer('concluded_at', { mode: 'timestamp' }),
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
			uniqueIndex('case_study_conclusion_case_study_idx').on(table.caseStudy),
			index('case_study_conclusion_created_by_idx').on(table.createdBy),
			index('case_study_conclusion_created_at_idx').on(table.createdAt),
		]
	}
)

export const caseStudyConclusionFile = sqliteTable(
	'case_study_conclusion_file',
	{
		caseStudyConclusion: text('case_study_conclusion')
			.notNull()
			.references(() => caseStudyConclusion.id, { onDelete: 'cascade' }),
		file: text('file')
			.notNull()
			.references(() => file.id, { onDelete: 'cascade' }),
		primaryFile: integer('primary_file', { mode: 'boolean' }).default(false),
		index: integer('index'),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.caseStudyConclusion, table.file] }),
			index('case_study_conclusion_file_case_study_conclusion_idx').on(table.caseStudyConclusion),
			index('case_study_conclusion_file_file_idx').on(table.file),
		]
	}
)

export const file = sqliteTable(
	'file',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		name: text('name').notNull(),
		description: text('description'),
		hash: text('hash').notNull(),
		protected: integer('protected', { mode: 'boolean' }).default(true),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('file_name_idx').on(table.name),
			index('file_created_by_idx').on(table.createdBy),
			index('file_created_at_idx').on(table.createdAt),
		]
	}
)

export const form = sqliteTable(
	'form',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		name: text('name').notNull(),
		description: text('description'),
		enabled: integer('enabled', { mode: 'boolean' }).default(true),
		protected: integer('protected', { mode: 'boolean' }).default(false),
		visibility: text('type')
			.$type<'public' | 'private' | 'organization' | 'team'>()
			.default('organization'),
		organization: text('organization')
			.notNull()
			.references(() => organization.id, {
				onDelete: 'cascade',
			}),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('form_name_idx').on(table.name),
			index('form_description_idx').on(table.description),
			index('form_enabled_idx').on(table.enabled),
			index('form_created_by_idx').on(table.createdBy),
			index('form_created_at_idx').on(table.createdAt),
		]
	}
)

export const formQuestion = sqliteTable(
	'form_question',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		form: text('form')
			.notNull()
			.references(() => form.id, { onDelete: 'cascade' }),
		index: integer('index'),
		required: integer('required', { mode: 'boolean' }).default(false),
		type: text('type')
			.$type<
				| 'SHORT_ANSWER'
				| 'PARAGRAPH'
				| 'MULTIPLE_CHOICE'
				| 'CHECKBOXES'
				| 'DROPDOWN'
				| 'DATE'
				| 'DATE_TIME'
				| 'TIME'
			>()
			.notNull(),
		options: blob('options', { mode: 'json' }),
		name: text('name').notNull(),
		description: text('description'),
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
			() => /* @__PURE__ */ new Date()
		),
	},
	(table) => {
		return [
			index('form_question_form_idx').on(table.form),
			index('form_question_index_idx').on(table.index),
			index('form_question_created_at_idx').on(table.createdAt),
		]
	}
)

export const formResponse = sqliteTable(
	'form_response',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		form: text('form')
			.notNull()
			.references(() => form.id, { onDelete: 'cascade' }),
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		value: blob('value', { mode: 'json' }),
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
			index('form_response_form_idx').on(table.form),
			index('form_response_case_study_idx').on(table.caseStudy),
			index('form_response_created_by_idx').on(table.createdBy),
			index('form_response_created_at_idx').on(table.createdAt),
		]
	}
)

export const note = sqliteTable(
	'note',
	{
		id: text('id').primaryKey().$defaultFn(generateId),
		caseStudy: text('case_study')
			.notNull()
			.references(() => caseStudy.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		value: blob('value', { mode: 'json' }),
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
			index('note_title_idx').on(table.title),
			index('note_case_study_idx').on(table.caseStudy),
			index('note_created_by_idx').on(table.createdBy),
			index('note_created_at_idx').on(table.createdAt),
		]
	}
)
