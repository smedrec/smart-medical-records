import { AppDb } from '@repo/app-db'
import { AuthDb } from '@repo/auth-db'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as appSchema from '@repo/app-db/dist/db/schema.js'
import type * as authSchema from '@repo/auth-db/dist/db/schema.js'

export interface Databases {
	auth: PostgresJsDatabase<typeof authSchema>
	app: PostgresJsDatabase<typeof appSchema>
}

let appDbService: AppDb | undefined = undefined
export { appDbService }

let authDbService: AuthDb | undefined = undefined
export { authDbService }

if (!appDbService) {
	appDbService = new AppDb(process.env.APP_DB_URL)
}

if (!authDbService) {
	authDbService = new AuthDb(process.env.AUTH_DB_URL)
}

export const db: Databases = {
	auth: authDbService.getDrizzleInstance(),
	app: appDbService.getDrizzleInstance(),
}
