import { PgVector, PostgresStore } from '@mastra/pg'

export const pgStorage = new PostgresStore({
	connectionString: process.env.POSTGRES_DB_URL!,
})

export const pgVector = new PgVector({
	connectionString: process.env.POSTGRES_DB_URL!,
})
