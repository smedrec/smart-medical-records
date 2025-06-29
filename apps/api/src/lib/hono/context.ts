import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type { Audit } from '@repo/audit'
import type { auth, Session, User } from '@repo/auth'
import type * as schema from '@repo/auth-db/dist/db/schema.js'
//import type { fhir } from '@repo/fhir'
import type { HonoApp } from '@repo/hono-helpers'
import type { SharedHonoEnv, SharedHonoVariables } from '@repo/hono-helpers/src/types.js'
import type { cerbos } from '../cerbos/index.js'
import type { Logger } from '../logs/index.js'

export type Env = SharedHonoEnv & {
	// add additional Bindings here
	ALLOWED_ORIGINS: string

	CLOUDFLARE_R2_IMAGES_URL: string
}

export type ServiceContext = {
	auth: typeof auth
	cerbos: typeof cerbos
	//fhir: typeof fhir
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
	session: Session | null
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
