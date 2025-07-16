import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { auditIntegrityLog, auditLog, auditRetentionPolicy } from '../db/schema.js'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

describe('Database Migration Tests', () => {
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

		// Run migrations
		await migrate(db, { migrationsFolder: './drizzle/migrations' })
	})

	afterAll(async () => {
		await client.end()
	})

	describe('Schema Validation', () => {
		it('should have audit_log table with all required columns', async () => {
			const result = await client`
				SELECT column_name, data_type, is_nullable, column_default
				FROM information_schema.columns 
				WHERE table_name = 'audit_log' 
				ORDER BY column_name
			`

			const columnNames = result.map((row) => row.column_name)

			// Check for existing columns
			expect(columnNames).toContain('id')
			expect(columnNames).toContain('timestamp')
			expect(columnNames).toContain('action')
			expect(columnNames).toContain('status')
			expect(columnNames).toContain('hash')

			// Check for new compliance columns
			expect(columnNames).toContain('hash_algorithm')
			expect(columnNames).toContain('event_version')
			expect(columnNames).toContain('correlation_id')
			expect(columnNames).toContain('data_classification')
			expect(columnNames).toContain('retention_policy')
			expect(columnNames).toContain('processing_latency')
			expect(columnNames).toContain('archived_at')
		})

		it('should have audit_integrity_log table with correct structure', async () => {
			const result = await client`
				SELECT column_name, data_type, is_nullable
				FROM information_schema.columns 
				WHERE table_name = 'audit_integrity_log' 
				ORDER BY column_name
			`

			const columnNames = result.map((row) => row.column_name)

			expect(columnNames).toContain('id')
			expect(columnNames).toContain('audit_log_id')
			expect(columnNames).toContain('verification_timestamp')
			expect(columnNames).toContain('verification_status')
			expect(columnNames).toContain('verification_details')
			expect(columnNames).toContain('verified_by')
			expect(columnNames).toContain('hash_verified')
			expect(columnNames).toContain('expected_hash')
		})

		it('should have audit_retention_policy table with correct structure', async () => {
			const result = await client`
				SELECT column_name, data_type, is_nullable
				FROM information_schema.columns 
				WHERE table_name = 'audit_retention_policy' 
				ORDER BY column_name
			`

			const columnNames = result.map((row) => row.column_name)

			expect(columnNames).toContain('id')
			expect(columnNames).toContain('policy_name')
			expect(columnNames).toContain('retention_days')
			expect(columnNames).toContain('archive_after_days')
			expect(columnNames).toContain('delete_after_days')
			expect(columnNames).toContain('data_classification')
			expect(columnNames).toContain('description')
			expect(columnNames).toContain('is_active')
			expect(columnNames).toContain('created_at')
			expect(columnNames).toContain('updated_at')
			expect(columnNames).toContain('created_by')
		})

		it('should have foreign key constraint between audit_integrity_log and audit_log', async () => {
			const result = await client`
				SELECT constraint_name, table_name, column_name, foreign_table_name, foreign_column_name
				FROM information_schema.key_column_usage kcu
				JOIN information_schema.referential_constraints rc ON kcu.constraint_name = rc.constraint_name
				JOIN information_schema.key_column_usage fkcu ON rc.unique_constraint_name = fkcu.constraint_name
				WHERE kcu.table_name = 'audit_integrity_log'
			`

			expect(result.length).toBeGreaterThan(0)
			expect(result[0].foreign_table_name).toBe('audit_log')
		})
	})

	describe('Index Validation', () => {
		it('should have all required indexes on audit_log table', async () => {
			const result = await client`
				SELECT indexname 
				FROM pg_indexes 
				WHERE tablename = 'audit_log'
				ORDER BY indexname
			`

			const indexNames = result.map((row) => row.indexname)

			// Check for new compliance indexes
			expect(indexNames).toContain('audit_log_correlation_id_idx')
			expect(indexNames).toContain('audit_log_data_classification_idx')
			expect(indexNames).toContain('audit_log_retention_policy_idx')
			expect(indexNames).toContain('audit_log_archived_at_idx')
			expect(indexNames).toContain('audit_log_timestamp_status_idx')
			expect(indexNames).toContain('audit_log_principal_action_idx')
			expect(indexNames).toContain('audit_log_classification_retention_idx')
		})

		it('should have all required indexes on audit_integrity_log table', async () => {
			const result = await client`
				SELECT indexname 
				FROM pg_indexes 
				WHERE tablename = 'audit_integrity_log'
				ORDER BY indexname
			`

			const indexNames = result.map((row) => row.indexname)

			expect(indexNames).toContain('audit_integrity_log_audit_log_id_idx')
			expect(indexNames).toContain('audit_integrity_log_verification_timestamp_idx')
			expect(indexNames).toContain('audit_integrity_log_verification_status_idx')
			expect(indexNames).toContain('audit_integrity_log_verified_by_idx')
		})

		it('should have all required indexes on audit_retention_policy table', async () => {
			const result = await client`
				SELECT indexname 
				FROM pg_indexes 
				WHERE tablename = 'audit_retention_policy'
				ORDER BY indexname
			`

			const indexNames = result.map((row) => row.indexname)

			expect(indexNames).toContain('audit_retention_policy_policy_name_idx')
			expect(indexNames).toContain('audit_retention_policy_data_classification_idx')
			expect(indexNames).toContain('audit_retention_policy_is_active_idx')
			expect(indexNames).toContain('audit_retention_policy_created_at_idx')
		})
	})

	describe('Data Operations', () => {
		it('should be able to insert data into audit_log with new compliance fields', async () => {
			const testEvent = {
				timestamp: new Date().toISOString(),
				action: 'test.action',
				status: 'success' as const,
				hash: 'test-hash-123',
				hashAlgorithm: 'SHA-256' as const,
				eventVersion: '1.0',
				correlationId: 'test-correlation-123',
				dataClassification: 'INTERNAL' as const,
				retentionPolicy: 'standard',
				processingLatency: 150,
			}

			const result = await db.insert(auditLog).values(testEvent).returning({ id: auditLog.id })

			expect(result).toHaveLength(1)
			expect(result[0].id).toBeTypeOf('number')

			// Clean up
			await db.delete(auditLog).where(sql`id = ${result[0].id}`)
		})

		it('should be able to insert data into audit_integrity_log', async () => {
			// First insert an audit log entry
			const auditResult = await db
				.insert(auditLog)
				.values({
					timestamp: new Date().toISOString(),
					action: 'test.integrity',
					status: 'success' as const,
					hash: 'test-hash-456',
				})
				.returning({ id: auditLog.id })

			const integrityEntry = {
				auditLogId: auditResult[0].id,
				verificationStatus: 'success',
				verificationDetails: { algorithm: 'SHA-256', verified: true },
				verifiedBy: 'system',
				hashVerified: 'test-hash-456',
				expectedHash: 'test-hash-456',
			}

			const result = await db
				.insert(auditIntegrityLog)
				.values(integrityEntry)
				.returning({ id: auditIntegrityLog.id })

			expect(result).toHaveLength(1)
			expect(result[0].id).toBeTypeOf('number')

			// Clean up
			await db.delete(auditIntegrityLog).where(sql`id = ${result[0].id}`)
			await db.delete(auditLog).where(sql`id = ${auditResult[0].id}`)
		})

		it('should be able to insert data into audit_retention_policy', async () => {
			const policyEntry = {
				policyName: 'test-policy',
				retentionDays: 365,
				archiveAfterDays: 90,
				deleteAfterDays: 2555, // 7 years
				dataClassification: 'PHI' as const,
				description: 'Test retention policy for PHI data',
				createdBy: 'test-user',
			}

			const result = await db
				.insert(auditRetentionPolicy)
				.values(policyEntry)
				.returning({ id: auditRetentionPolicy.id })

			expect(result).toHaveLength(1)
			expect(result[0].id).toBeTypeOf('number')

			// Clean up
			await db.delete(auditRetentionPolicy).where(sql`id = ${result[0].id}`)
		})

		it('should enforce unique constraint on policy_name', async () => {
			const policyEntry = {
				policyName: 'duplicate-policy',
				retentionDays: 365,
				dataClassification: 'INTERNAL' as const,
			}

			// Insert first policy
			const result1 = await db
				.insert(auditRetentionPolicy)
				.values(policyEntry)
				.returning({ id: auditRetentionPolicy.id })

			// Try to insert duplicate policy name
			await expect(db.insert(auditRetentionPolicy).values(policyEntry)).rejects.toThrow()

			// Clean up
			await db.delete(auditRetentionPolicy).where(sql`id = ${result1[0].id}`)
		})
	})

	describe('Default Values', () => {
		it('should apply default values for new compliance fields', async () => {
			const testEvent = {
				timestamp: new Date().toISOString(),
				action: 'test.defaults',
				status: 'success' as const,
			}

			const result = await db.insert(auditLog).values(testEvent).returning({
				id: auditLog.id,
				hashAlgorithm: auditLog.hashAlgorithm,
				eventVersion: auditLog.eventVersion,
				dataClassification: auditLog.dataClassification,
				retentionPolicy: auditLog.retentionPolicy,
			})

			expect(result[0].hashAlgorithm).toBe('SHA-256')
			expect(result[0].eventVersion).toBe('1.0')
			expect(result[0].dataClassification).toBe('INTERNAL')
			expect(result[0].retentionPolicy).toBe('standard')

			// Clean up
			await db.delete(auditLog).where(sql`id = ${result[0].id}`)
		})
	})
})
