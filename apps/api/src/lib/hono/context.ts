import type { auth, Session } from '@repo/auth'
import type { db } from '@repo/db'
import type { HonoApp } from '@repo/hono-helpers'
import type { SharedHonoEnv, SharedHonoVariables } from '@repo/hono-helpers/src/types'
import type { Logger } from '../logs'

export type Env = SharedHonoEnv & {
	// add additional Bindings here
}

export type ServiceContext = {
	auth: typeof auth
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
