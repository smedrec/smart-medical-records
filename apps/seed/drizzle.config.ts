/**
 * Drizzle Kit configuration file
 *
 * Docs: https://orm.drizzle.team/docs/drizzle-config-file
 */

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: [
		'/home/jose/Documents/workspace/smedrec/smart-medical-records/packages/db/src/schema/auth.ts',
		'/home/jose/Documents/workspace/smedrec/smart-medical-records/packages/db/src/schema/r4.ts',
	],
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
})
