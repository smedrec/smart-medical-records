import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../schema'

const queryClient = postgres(env.DATABASE_URL, {
	// Workers limit the number of concurrent external connections, so be sure to limit
	// the size of the local connection pool that postgres.js may establish.
	max: 5,

	// If you are using array types in your Postgres schema, it is necessary to fetch
	// type information to correctly de/serialize them. However, if you are not using
	// those, disabling this will save you an extra round-trip every time you connect.
	fetch_types: false,
})

export const db = drizzle({ client: queryClient, schema: schema })
