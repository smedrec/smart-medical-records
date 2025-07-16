#!/usr/bin/env node
import { runMigrationCommand } from './migration-utils.js'

/**
 * CLI script for audit database migration operations
 * Usage: tsx src/cli.ts <command> [migration-name]
 */
async function main() {
	const args = process.argv.slice(2)
	const command = args[0]
	const migrationName = args[1]

	if (!command) {
		console.log('Usage: tsx src/cli.ts <command> [migration-name]')
		console.log('Commands:')
		console.log('  migrate              - Apply all pending migrations')
		console.log('  rollback <name>      - Execute rollback for specific migration')
		console.log('  verify               - Verify database schema')
		console.log('  verify-compliance    - Verify compliance features are present')
		console.log('  seed-policies        - Insert default retention policies')
		process.exit(1)
	}

	try {
		await runMigrationCommand(command, migrationName)
		process.exit(0)
	} catch (error) {
		console.error('Command failed:', error)
		process.exit(1)
	}
}

main().catch(console.error)
