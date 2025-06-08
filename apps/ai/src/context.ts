import type { D1Database } from '@cloudflare/workers-types'

export type Env = {
	// add Bindings here
	DB: D1Database
}
