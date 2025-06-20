import type { Context as GenericContext } from 'hono'
import type { auth, Session } from '@repo/auth'
import type { HonoApp } from '@repo/hono-helpers'
import type { SharedHonoEnv, SharedHonoVariables } from '@repo/hono-helpers/src/types'
import type { cerbos } from '../cerbos'
import type { FhirApiClient, FhirSessionData } from './middleware/fhir-auth' // Added import

export type Env = SharedHonoEnv & {
	// add additional Bindings here
	ALLOWED_ORIGINS: string
	OPENROUTER_API_KEY: string
}

type SessionWithRole<T> = T & { activeOrganizationRole: string | null }

export type ServiceContext = {
	auth: typeof auth
	cerbos: typeof cerbos
	//fhir: typeof fhir
	//cache: Cache;
	//db: { primary: Database; readonly: Database };
	//db: typeof db
	//redis:  Redis,
	//logger: Logger
}

/** Variables can be extended */
export type Variables = SharedHonoVariables & {
	isolateId: string
	isolateCreatedAt: number
	requestId?: string
	requestStartedAt: number
	session: SessionWithRole<Session> | null
	services: ServiceContext
	/**
	 * IP address or region information
	 */
	location: string
	userAgent?: string
	// FHIR client and session data added to context
	fhirClient?: FhirApiClient | null
	fhirSessionData?: FhirSessionData | null
}

export interface HonoEnv extends HonoApp {
	Bindings: Env
	Variables: Variables
}

export type Context = GenericContext<HonoEnv>
