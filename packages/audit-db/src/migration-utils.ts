import { readFileSync } from 'fs'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import 'dotenv/config'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

/**
 * Migration utility class for managing database schema changes
 * Provides methods for applying migrations, rollbacks, and verification
 */
export class MigrationUtils {
	private client: postgres.Sql
	private db: PostgresJsDatabase

	constructor(connectionUrl: string) {
		this.client = postgres(connectionUrl, { max: 10 })
		this.db = drizzle(this.client)
	}

	/**
	 * Apply all pending migrations
	 */
	async applyMigrations(): Promise<void> {
		try {
			await migrate(this.db, { migrationsFolder: './drizzle/migrations' })
			console.log('✅ Migrations applied successfully')
		} catch (error) {
			console.error('❌ Migration failed:', error)
			throw error
		}
	}

	/**
	 * Execute a specific rollback script
	 */
	async executeRollback(migrationName: string): Promise<void> {
		try {
			const rollbackPath = join(
				process.cwd(),
				'drizzle/migrations',
				`${migrationName}_rollback.sql`
			)
			const rollbackScript = readFileSync(rollbackPath, 'utf-8')

			await this.client.unsafe(rollbackScript)
			console.log(`✅ Rollback executed successfully for ${migrationName}`)
		} catch (error) {
			console.error(`❌ Rollback failed for ${migrationName}:`, error)
			throw error
		}
	}

	/**
	 * Verify database schema integrity
	 */
	async verifySchema(): Promise<{
		tables: string[]
		auditLogColumns: string[]
		indexes: string[]
		constraints: string[]
	}> {
		try {
			// Get all tables
			const tablesResult = await this.client`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = 'public'
				ORDER BY table_name
			`
			const tables = tablesResult.map((row) => row.table_name)

			// Get audit_log columns
			const columnsResult = await this.client`
				SELECT column_name
				FROM information_schema.columns 
				WHERE table_name = 'audit_log'
				ORDER BY column_name
			`
			const auditLogColumns = columnsResult.map((row) => row.column_name)

			// Get indexes
			const indexesResult = await this.client`
				SELECT indexname, tablename
				FROM pg_indexes 
				WHERE schemaname = 'public'
				ORDER BY tablename, indexname
			`
			const indexes = indexesResult.map((row) => `${row.tablename}.${row.indexname}`)

			// Get constraints
			const constraintsResult = await this.client`
				SELECT constraint_name, table_name, constraint_type
				FROM information_schema.table_constraints
				WHERE table_schema = 'public'
				ORDER BY table_name, constraint_name
			`
			const constraints = constraintsResult.map(
				(row) => `${row.table_name}.${row.constraint_name} (${row.constraint_type})`
			)

			return {
				tables,
				auditLogColumns,
				indexes,
				constraints,
			}
		} catch (error) {
			console.error('❌ Schema verification failed:', error)
			throw error
		}
	}

	/**
	 * Check if specific compliance features are present
	 */
	async verifyComplianceFeatures(): Promise<{
		hasComplianceColumns: boolean
		hasIntegrityTable: boolean
		hasRetentionTable: boolean
		hasComplianceIndexes: boolean
	}> {
		const schema = await this.verifySchema()

		const complianceColumns = [
			'hash_algorithm',
			'event_version',
			'correlation_id',
			'data_classification',
			'retention_policy',
			'processing_latency',
			'archived_at',
		]

		const complianceIndexes = [
			'audit_log.audit_log_correlation_id_idx',
			'audit_log.audit_log_data_classification_idx',
			'audit_log.audit_log_retention_policy_idx',
			'audit_log.audit_log_archived_at_idx',
		]

		return {
			hasComplianceColumns: complianceColumns.every((col) => schema.auditLogColumns.includes(col)),
			hasIntegrityTable: schema.tables.includes('audit_integrity_log'),
			hasRetentionTable: schema.tables.includes('audit_retention_policy'),
			hasComplianceIndexes: complianceIndexes.every((idx) => schema.indexes.includes(idx)),
		}
	}

	/**
	 * Insert default retention policies
	 */
	async insertDefaultRetentionPolicies(): Promise<void> {
		try {
			const defaultPolicies = [
				{
					policy_name: 'standard',
					retention_days: 2555, // 7 years
					archive_after_days: 365, // 1 year
					data_classification: 'INTERNAL',
					description: 'Standard retention policy for internal audit data',
					created_by: 'system',
				},
				{
					policy_name: 'phi_extended',
					retention_days: 2555, // 7 years (HIPAA requirement)
					archive_after_days: 365, // 1 year
					data_classification: 'PHI',
					description: 'Extended retention policy for PHI data to meet HIPAA requirements',
					created_by: 'system',
				},
				{
					policy_name: 'minimal',
					retention_days: 90, // 3 months
					archive_after_days: 30, // 1 month
					data_classification: 'PUBLIC',
					description: 'Minimal retention policy for public data',
					created_by: 'system',
				},
				{
					policy_name: 'confidential',
					retention_days: 1825, // 5 years
					archive_after_days: 365, // 1 year
					data_classification: 'CONFIDENTIAL',
					description: 'Extended retention policy for confidential business data',
					created_by: 'system',
				},
			]

			for (const policy of defaultPolicies) {
				await this.client`
					INSERT INTO audit_retention_policy (
						policy_name, retention_days, archive_after_days, 
						data_classification, description, created_by
					) VALUES (
						${policy.policy_name}, ${policy.retention_days}, ${policy.archive_after_days},
						${policy.data_classification}, ${policy.description}, ${policy.created_by}
					)
					ON CONFLICT (policy_name) DO NOTHING
				`
			}

			console.log('✅ Default retention policies inserted successfully')
		} catch (error) {
			console.error('❌ Failed to insert default retention policies:', error)
			throw error
		}
	}

	/**
	 * Close database connection
	 */
	async close(): Promise<void> {
		await this.client.end()
	}
}

/**
 * CLI utility for running migration operations
 */
export async function runMigrationCommand(command: string, migrationName?: string): Promise<void> {
	const dbUrl = process.env.AUDIT_DB_URL || process.env.DATABASE_URL

	if (!dbUrl) {
		throw new Error('Database URL not found in environment variables')
	}

	const migrationUtils = new MigrationUtils(dbUrl)

	try {
		switch (command) {
			case 'migrate':
				await migrationUtils.applyMigrations()
				break

			case 'rollback':
				if (!migrationName) {
					throw new Error('Migration name required for rollback')
				}
				await migrationUtils.executeRollback(migrationName)
				break

			case 'verify': {
				const schema = await migrationUtils.verifySchema()
				console.log('📊 Database Schema:')
				console.log('Tables:', schema.tables)
				console.log('Audit Log Columns:', schema.auditLogColumns)
				console.log('Indexes:', schema.indexes.length)
				console.log('Constraints:', schema.constraints.length)
				break
			}

			case 'verify-compliance': {
				const compliance = await migrationUtils.verifyComplianceFeatures()
				console.log('🔍 Compliance Features:')
				console.log('Compliance Columns:', compliance.hasComplianceColumns ? '✅' : '❌')
				console.log('Integrity Table:', compliance.hasIntegrityTable ? '✅' : '❌')
				console.log('Retention Table:', compliance.hasRetentionTable ? '✅' : '❌')
				console.log('Compliance Indexes:', compliance.hasComplianceIndexes ? '✅' : '❌')
				break
			}

			case 'seed-policies':
				await migrationUtils.insertDefaultRetentionPolicies()
				break

			default:
				console.error('Unknown command:', command)
				console.log(
					'Available commands: migrate, rollback, verify, verify-compliance, seed-policies'
				)
		}
	} finally {
		await migrationUtils.close()
	}
}
