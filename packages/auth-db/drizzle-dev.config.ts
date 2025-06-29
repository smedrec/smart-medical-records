import type { Config } from 'drizzle-kit'

import 'dotenv/config' // To load .env variables for drizzle-kit

if (!process.env.AUTH_DB_URL) {
	throw new Error('DATABASE_URL environment variable is required for Drizzle Kit')
}

export default {
	schema: './src/db/schema.ts',
	out: './drizzle/migrations', // Output directory for migrations
	dialect: 'postgresql', // Specify PostgreSQL dialect
	dbCredentials: {
		url: process.env.AUTH_DB_URL,
	},
	// Optionally, you can specify the migrations table name
	migrations: {
		table: '_journal',
		schema: 'drizzle',
	},
	// verbose: true, // For more detailed output from Drizzle Kit
	// strict: true, // To enable strict mode
} satisfies Config
