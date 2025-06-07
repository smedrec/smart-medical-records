/**
 * Drizzle Kit configuration file
 *
 * Docs: https://orm.drizzle.team/docs/drizzle-config-file
 */

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle',
	schema: [
		'../../packages/db/src/database/schema/auth.ts',
		'../../packages/db/src/database/schema/app.ts',
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
