import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema/index.js'

export const db = drizzle(process.env.DATABASE_URL!, { schema: schema })
