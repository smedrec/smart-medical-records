import type { SharedHonoEnv } from '@repo/hono-helpers/src/types'

export type Env = SharedHonoEnv & {
	// add additional Bindings here

	DB: D1Database
	KV: KVNamespace
}
