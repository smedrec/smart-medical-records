import { D1Store } from '@mastra/cloudflare-d1'
import { env } from 'cloudflare:workers'

export const d1Storage = new D1Store({
	binding: env.DB, // D1Database binding provided by the Workers runtime
	tablePrefix: 'dev_', // Optional: isolate tables per environment
})
