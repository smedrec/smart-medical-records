import { readFileSync } from 'fs'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

describe('Database Rollback Tests', () => {
	let client: postgres.Sql
	let db: PostgresJsDatabase

	beforeAll(async () => {
		// Use test database URL or fallback to development
		const testDbUrl =
			process.env.TEST_AUDIT_DB_URL || process.env.AUDIT_DB_URL || process.env.DATABASE_URL

		if (!testDbUrl) {
			throw new Error('No database URL provided for testing')
		}

		client = postgres(testDbUrl, { max: 1 })
		db = drizzle(client)

		// Run migrations to get to the latest state
		await migrate(db, { migrationsFolder: './drizzle/migrations' })
	})

	afterAll(async () => {
		await client.end()
	})

	describe('Rollback Procedure', () => {
		it('should successfully execute rollback script', async () => {
			// Read and execute the rollback script
			const rollbackScript = readFileSync(
				join(process.cwd(), 'drizzle/migrations/0005_magenta_peter_quill_rollback.sql'),
				'utf-8'
			)

			// Execute rollback script
			await client.unsafe(rollbackScript)

			// Verify that new tables are dropped
			const tablesResult = await client`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = 'public' 
				AND table_name IN ('audit_integrity_log', 'audit_retention_policy')
			`

			expect(tablesResult).toHaveLength(0)
		})

		it('should verify audit_log table no longer has new compliance columns after rollback', async () => {
			const result = await client`
				SELECT column_name
				FROM information_schema.columns 
				WHERE table_name = 'audit_log'
				ORDER BY column_name
			`

			const columnNames = result.map((row) => row.column_name)

			// Verify new compliance columns are removed
			expect(columnNames).not.toContain('hash_algorithm')
			expect(columnNames).not.toContain('event_version')
			expect(columnNames).not.toContain('correlation_id')
			expect(columnNames).not.toContain('data_classification')
			expect(columnNames).not.toContain('retention_policy')
			expect(columnNames).not.toContain('processing_latency')
			expect(columnNames).not.toContain('archived_at')

			// Verify original columns still exist
			expect(columnNames).toContain('id')
			expect(columnNames).toContain('timestamp')
			expect(columnNames).toContain('action')
			expect(columnNames).toContain('status')
			expect(columnNames).toContain('hash')
		})

		it('should verify new indexes are removed after rollback', async () => {
			const result = await client`
				SELECT indexname 
				FROM pg_indexes 
				WHERE tablename = 'audit_log'
				ORDER BY indexname
			`

			const indexNames = result.map((row) => row.indexname)

			// Verify new compliance indexes are removed
			expect(indexNames).not.toContain('audit_log_correlation_id_idx')
			expect(indexNames).not.toContain('audit_log_data_classification_idx')
			expect(indexNames).not.toContain('audit_log_retention_policy_idx')
			expect(indexNames).not.toContain('audit_log_archived_at_idx')
			expect(indexNames).not.toContain('audit_log_timestamp_status_idx')
			expect(indexNames).not.toContain('audit_log_principal_action_idx')
			expect(indexNames).not.toContain('audit_log_classification_retention_idx')

			// Verify original indexes still exist
			expect(indexNames).toContain('audit_log_timestamp_idx')
			expect(indexNames).toContain('audit_log_action_idx')
			expect(indexNames).toContain('audit_log_hash_idx')
		})

		it('should be able to re-apply migration after rollback', async () => {
			// Re-run the migration
			await migrate(db, { migrationsFolder: './drizzle/migrations' })

			// Verify tables are recreated
			const tablesResult = await client`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = 'public' 
				AND table_name IN ('audit_integrity_log', 'audit_retention_policy')
				ORDER BY table_name
			`

			expect(tablesResult).toHaveLength(2)
			expect(tablesResult[0].table_name).toBe('audit_integrity_log')
			expect(tablesResult[1].table_name).toBe('audit_retention_policy')

			// Verify audit_log columns are recreated
			const columnsResult = await client`
				SELECT column_name
				FROM information_schema.columns 
				WHERE table_name = 'audit_log'
				AND column_name IN ('hash_algorithm', 'event_version', 'correlation_id', 'data_classification', 'retention_policy', 'processing_latency', 'archived_at')
				ORDER BY column_name
			`

			expect(columnsResult).toHaveLength(7)
		})
	})

	describe('Data Integrity After Rollback and Re-migration', () => {
		it('should preserve existing audit_log data through rollback and re-migration', async () => {
			// Insert test data
			const testData = await client`
				INSERT INTO audit_log (timestamp, action, status, hash)
				VALUES (${new Date().toISOString()}, 'test.rollback', 'success', 'test-hash-rollback')
				RETURNING id
			`

			const insertedId = testData[0].id

			// Execute rollback
			const rollbackScript = readFileSync(
				join(process.cwd(), 'drizzle/migrations/0005_magenta_peter_quill_rollback.sql'),
				'utf-8'
			)
			await client.unsafe(rollbackScript)

			// Verify data still exists after rollback
			const dataAfterRollback = await client`
				SELECT id, timestamp, action, status, hash
				FROM audit_log 
				WHERE id = ${insertedId}
			`

			expect(dataAfterRollback).toHaveLength(1)
			expect(dataAfterRollback[0].action).toBe('test.rollback')

			// Re-apply migration
			await migrate(db, { migrationsFolder: './drizzle/migrations' })

			// Verify data still exists after re-migration
			const dataAfterMigration = await client`
				SELECT id, timestamp, action, status, hash, hash_algorithm, event_version
				FROM audit_log 
				WHERE id = ${insertedId}
			`

			expect(dataAfterMigration).toHaveLength(1)
			expect(dataAfterMigration[0].action).toBe('test.rollback')
			expect(dataAfterMigration[0].hash_algorithm).toBe('SHA-256') // Default value applied
			expect(dataAfterMigration[0].event_version).toBe('1.0') // Default value applied

			// Clean up
			await client`DELETE FROM audit_log WHERE id = ${insertedId}`
		})
	})
})
