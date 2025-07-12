import { createRandomStringGenerator } from '@better-auth/utils/random'
import {
	index,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

type Metadata = Array<Record<string, any>>

const generateId = (size?: number) => {
	return createRandomStringGenerator('a-z', 'A-Z', '0-9')(size || 32)
}

export const note = pgTable(
	'note',
	{
		id: varchar('id', { length: 32 }).primaryKey().$defaultFn(generateId),
		title: varchar('title', { length: 100 }).notNull(),
		markdown: text('markdown'),
		userId: varchar('user_id', { length: 32 }).notNull(),
		organizationId: varchar('organization_id', { length: 32 }).notNull(),
		metadata: text('metadata').$type<Metadata>(),
	},
	(table) => {
		return [
			index('note_title_idx').on(table.title),
			index('note_user_id_idx').on(table.userId),
			index('note_organization_id_idx').on(table.organizationId),
		]
	}
)

type SubscriptionStatus = 'confirmed' | 'pending' | 'unsubscribed'

export const newsletter = pgTable(
	'newsletter',
	{
		email: varchar('email', { length: 100 }).notNull(),
		list: varchar('list', { length: 32 }).notNull(),
		status: varchar('status', { length: 12 })
			.$type<SubscriptionStatus>()
			.notNull()
			.default('pending'),
		metadata: text('metadata').$type<Metadata>(),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.email, table.list] }),
			index('newsletter_email_idx').on(table.email),
			index('newsletter_list_idx').on(table.list),
			index('newsletter_status_idx').on(table.status),
		]
	}
)
