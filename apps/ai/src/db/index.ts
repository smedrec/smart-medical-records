import { getSecret } from '@/infisical'

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

export function initializeDb() {
	if (!appDbService) {
		appDbService = new AppDb()
	}
	if (!authDbService) {
		authDbService = new AuthDb()
	}

	return { appDbService, authDbService }
}

export function getDbInstance(): Databases {
	if (!authDbService) {
		throw new Error('Auth db not initialized. Call initializeDb first.')
	}
	if (!appDbService) {
		throw new Error('App db not initialized. Call initializeDb first.')
	}

	return {
		auth: authDbService.getDrizzleInstance(),
		app: appDbService.getDrizzleInstance(),
	}
}
