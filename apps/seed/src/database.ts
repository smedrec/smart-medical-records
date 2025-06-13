import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as authSchema from './schema/auth.js'
import * as r4Schema from './schema/r4.js'

export const db = drizzle(
	'/home/jose/Documents/workspace/smedrec/smart-medical-records/apps/api/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/a6da99fad13afe185e35c6bba63b6a15b4fa83b4da01b613de61e8caa68b44ab.sqlite'
)
