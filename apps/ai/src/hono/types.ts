import type { User } from '@repo/auth'

export interface RuntimeContextSession {
	tokenResponse: {
		access_token?: string
		id_token?: string // Often contains user identity info
		[key: string]: any // Other token response fields like expires_in, refresh_token
	}
	serverUrl: string
	userId?: string // Added for Cerbos Principal ID
	user?: User
	roles?: string[] // Added for Cerbos Principal roles
	activeOrganizationId?: string
}
