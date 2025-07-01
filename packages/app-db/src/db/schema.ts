import { createRandomStringGenerator } from '@better-auth/utils/random'
import { index, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

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
		metadata: jsonb('metadata'),
	},
	(table) => {
		return [
			index('note_title_idx').on(table.title),
			index('note_user_id_idx').on(table.userId),
			index('note_organization_id_idx').on(table.organizationId),
		]
	}
)
