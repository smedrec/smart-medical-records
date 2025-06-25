import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema.js'

import 'dotenv/config' // To load .env variables

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
	console.error(
		'🔴 DATABASE_URL environment variable is not set. Please check your .env file or environment configuration.'
	)
	process.exit(1) // Exit if DB URL is not found
}

// For Serverless environments, it's often recommended to configure the client
// to close connections quickly or manage a small pool.
// For a long-running worker, the default settings of `postgres` are usually fine.
// You might want to expose some options via environment variables if needed, e.g., pool size.
const client = postgres(connectionString, {
	// Example: Configure max connections
	// max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS, 10) : 5,
})

// The schema object containing all your table definitions
export const db = drizzle(client, { schema })

// Optionally, you could export the schema separately if needed elsewhere
// export * as auditSchema from './schema';

// It's good practice to also export the raw client if direct access is ever needed,
// though typically all interactions should go through Drizzle.
// export { client as rawDbClient };

// A simple function to test the connection
export async function checkDbConnection() {
	try {
		await client`SELECT 1` // Simple query to check connection
		console.log('🟢 Database connection successful.')
		return true
	} catch (error) {
		console.error('🔴 Database connection failed:', error)
		// In a real app, you might want to throw the error or handle it more gracefully
		// For the worker, if the DB isn't available, it might retry or exit.
		// process.exit(1); // Consider if failure to connect on startup is fatal
		return false
	}
}

// You might want to call checkDbConnection() when the application starts
// to ensure the database is reachable.
// For example, in your main application file (e.g., src/index.ts):
// import { checkDbConnection } from './db';
// async function startApp() {
//   await checkDbConnection();
//   // ... rest of your app initialization
// }
// startApp();
