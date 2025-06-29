import type { cerbos } from '@/lib/cerbos'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { Audit } from '@repo/audit'
import type * as schema from '@repo/auth-db'
import type { auth, Session, User } from '@repo/better-auth'
import type { fhir } from '@repo/fhir'
import type { HonoApp } from '@repo/hono-helpers'
import type { SharedHonoEnv, SharedHonoVariables } from '@repo/hono-helpers/src/types'
import type { Logger } from '../logs'

export type Env = SharedHonoEnv & {
	// add additional Bindings here
	ALLOWED_ORIGINS: string

	CLOUDFLARE_R2_IMAGES_URL: string

	DB: D1Database
	KV: KVNamespace
	IMAGES_DEV: R2Bucket
}

export type ServiceContext = {
	auth: typeof auth
	cerbos: typeof cerbos
	fhir: typeof fhir
	//cache: Cache;
	//db: { primary: Database; readonly: Database };
	db: PostgresJsDatabase<typeof schema>
	//redis:  Redis,
	audit: Audit
	logger: Logger
}

/** Variables can be extended */
export type Variables = SharedHonoVariables & {
	isolateId: string
	isolateCreatedAt: number
	requestId: string
	requestStartedAt: number
	session: {
		session: Session
		user: User
	} | null
	services: ServiceContext
	/**
	 * IP address or region information
	 */
	location: string
	userAgent?: string
}

export interface HonoEnv extends HonoApp {
	Bindings: Env
	Variables: Variables
}
