/**
 * Drizzle Kit configuration file
 *
 * Docs: https://orm.drizzle.team/docs/drizzle-config-file
 */

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle',
	schema: [
		'/home/jose/Documents/workspace/smedrec/smart-medical-records/packages/db/src/schema/auth.ts',
		'/home/jose/Documents/workspace/smedrec/smart-medical-records/packages/db/src/schema/r4.ts',
	],
	dialect: 'sqlite',
	driver: 'd1-http',
	dbCredentials: {
		//url: process.env.DATABASE_URL!,
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!,
	},
})
