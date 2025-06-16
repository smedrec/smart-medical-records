import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

//import postgres from 'postgres'

//import { drizzle } from 'drizzle-orm/node-postgres'
//import { Pool } from 'pg'

import * as schema from '../schema'

export const db = drizzle(env.DB, { schema: schema })

//import { drizzle } from 'drizzle-orm/postgres-js'
//import postgres from 'postgres'
//import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

/**const pool = new Pool({
	connectionString: env.DATABASE_URL!,
})

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema })
const queryClient = postgres(env.DATABASE_URL, {
	// Workers limit the number of concurrent external connections, so be sure to limit
	// the size of the local connection pool that postgres.js may establish.
	max: 5,

	// If you are using array types in your Postgres schema, it is necessary to fetch
	// type information to correctly de/serialize them. However, if you are not using
	// those, disabling this will save you an extra round-trip every time you connect.
	fetch_types: false,
})

export const db: PostgresJsDatabase<typeof schema> = drizzle({
	client: queryClient,
	schema: schema,
})

export type DB = PostgresJsDatabase<typeof schema>

export class WorkerDb {
	private static instance: PostgresJsDatabase<typeof schema> | null = null

	static async getInstance(): Promise<DB> {
		const pg = postgres(env.DATABASE_URL, {
			// Workers limit the number of concurrent external connections, so be sure to limit
			// the size of the local connection pool that postgres.js may establish.
			max: 5,

			// If you are using array types in your Postgres schema, it is necessary to fetch
			// type information to correctly de/serialize them. However, if you are not using
			// those, disabling this will save you an extra round-trip every time you connect.
			fetch_types: false,
		})
		/**
		 * The following line is to check if the connection is successful.
		 
		await pg.unsafe('SELECT 1')

		this.instance = drizzle({
			client: pg,
			schema: schema,
		})
		return this.instance
	}

	static async close() {
		if (this.instance) {
			//await this.instance.destroy()
		}
	}
}*/
