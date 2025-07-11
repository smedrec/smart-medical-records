import { PgVector, PostgresStore } from '@mastra/pg'

interface PostgresDb {
	storage: PostgresStore
	vector: PgVector
}

export const storage = new PostgresStore({
	connectionString: process.env.POSTGRES_DB_URL!,
})

export const vector = new PgVector({
	connectionString: process.env.POSTGRES_DB_URL!,
})

export const pg: PostgresDb = { storage, vector }
