import type { cerbos } from '@/lib/cerbos'
import type { auth, Session, User } from '@repo/auth'
import type { db } from '@repo/db'
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

type SessionWithRole<T> = T & { activeOrganizationRole: string | null }

export type ServiceContext = {
	auth: typeof auth
	cerbos: typeof cerbos
	fhir: typeof fhir
	//cache: Cache;
	//db: { primary: Database; readonly: Database };
	db: typeof db
	//redis:  Redis,
	logger: Logger
}

/** Variables can be extended */
export type Variables = SharedHonoVariables & {
	isolateId: string
	isolateCreatedAt: number
	requestId: string
	requestStartedAt: number
	session: {
		session: SessionWithRole<Session>
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
