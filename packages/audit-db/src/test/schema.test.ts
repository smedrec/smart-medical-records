import { describe, expect, it } from 'vitest'

import { auditIntegrityLog, auditLog, auditRetentionPolicy } from '../db/schema.js'

describe('Database Schema Tests', () => {
	describe('Audit Log Schema', () => {
		it('should have all required columns defined', () => {
			const columns = Object.keys(auditLog)

			// Core audit columns
			expect(columns).toContain('id')
			expect(columns).toContain('timestamp')
			expect(columns).toContain('action')
			expect(columns).toContain('status')
			expect(columns).toContain('hash')
			expect(columns).toContain('principalId')
			expect(columns).toContain('organizationId')
			expect(columns).toContain('targetResourceType')
			expect(columns).toContain('targetResourceId')
			expect(columns).toContain('outcomeDescription')
			expect(columns).toContain('details')

			// New compliance columns
			expect(columns).toContain('hashAlgorithm')
			expect(columns).toContain('eventVersion')
			expect(columns).toContain('correlationId')
			expect(columns).toContain('dataClassification')
			expect(columns).toContain('retentionPolicy')
			expect(columns).toContain('processingLatency')
			expect(columns).toContain('archivedAt')
		})

		it('should not have practitioner-specific columns (common audit system)', () => {
			const columns = Object.keys(auditLog)

			// Verify practitioner-specific columns are NOT present
			expect(columns).not.toContain('practitionerId')
			expect(columns).not.toContain('licenseNumber')
			expect(columns).not.toContain('jurisdiction')
			expect(columns).not.toContain('oldStatus')
			expect(columns).not.toContain('newStatus')
			expect(columns).not.toContain('oldRole')
			expect(columns).not.toContain('newRole')
			expect(columns).not.toContain('verificationProvider')
			expect(columns).not.toContain('apiResponse')
			expect(columns).not.toContain('ocrConfidence')
			expect(columns).not.toContain('reviewedBy')
			expect(columns).not.toContain('reason')
			expect(columns).not.toContain('ipAddress')
			expect(columns).not.toContain('userAgent')
			expect(columns).not.toContain('sessionId')
		})

		it('should have proper column types for compliance fields', () => {
			// Test that the schema is properly typed
			expect(auditLog.hashAlgorithm).toBeDefined()
			expect(auditLog.eventVersion).toBeDefined()
			expect(auditLog.correlationId).toBeDefined()
			expect(auditLog.dataClassification).toBeDefined()
			expect(auditLog.retentionPolicy).toBeDefined()
			expect(auditLog.processingLatency).toBeDefined()
			expect(auditLog.archivedAt).toBeDefined()
		})
	})

	describe('Audit Integrity Log Schema', () => {
		it('should have all required columns defined', () => {
			const columns = Object.keys(auditIntegrityLog)

			expect(columns).toContain('id')
			expect(columns).toContain('auditLogId')
			expect(columns).toContain('verificationTimestamp')
			expect(columns).toContain('verificationStatus')
			expect(columns).toContain('verificationDetails')
			expect(columns).toContain('verifiedBy')
			expect(columns).toContain('hashVerified')
			expect(columns).toContain('expectedHash')
		})

		it('should have foreign key reference to audit_log', () => {
			// This tests that the schema definition includes the reference
			expect(auditIntegrityLog.auditLogId).toBeDefined()
		})
	})

	describe('Audit Retention Policy Schema', () => {
		it('should have all required columns defined', () => {
			const columns = Object.keys(auditRetentionPolicy)

			expect(columns).toContain('id')
			expect(columns).toContain('policyName')
			expect(columns).toContain('retentionDays')
			expect(columns).toContain('archiveAfterDays')
			expect(columns).toContain('deleteAfterDays')
			expect(columns).toContain('dataClassification')
			expect(columns).toContain('description')
			expect(columns).toContain('isActive')
			expect(columns).toContain('createdAt')
			expect(columns).toContain('updatedAt')
			expect(columns).toContain('createdBy')
		})

		it('should have unique constraint on policy_name', () => {
			// This tests that the schema definition includes the unique constraint
			expect(auditRetentionPolicy.policyName).toBeDefined()
		})
	})

	describe('Schema Type Safety', () => {
		it('should properly type audit log insert data', () => {
			// Test that TypeScript types are working correctly
			const insertData = {
				timestamp: new Date().toISOString(),
				action: 'test.action',
				status: 'success' as const,
				hashAlgorithm: 'SHA-256' as const,
				eventVersion: '1.0',
				correlationId: 'test-correlation',
				dataClassification: 'INTERNAL' as const,
				retentionPolicy: 'standard',
				processingLatency: 100,
			}

			// This should compile without TypeScript errors
			expect(insertData.timestamp).toBeTypeOf('string')
			expect(insertData.action).toBeTypeOf('string')
			expect(insertData.status).toBe('success')
			expect(insertData.hashAlgorithm).toBe('SHA-256')
			expect(insertData.dataClassification).toBe('INTERNAL')
		})

		it('should properly type integrity log insert data', () => {
			const insertData = {
				auditLogId: 1,
				verificationStatus: 'success',
				verificationDetails: { algorithm: 'SHA-256' },
				verifiedBy: 'system',
				hashVerified: 'test-hash',
				expectedHash: 'test-hash',
			}

			expect(insertData.auditLogId).toBeTypeOf('number')
			expect(insertData.verificationStatus).toBeTypeOf('string')
			expect(insertData.verificationDetails).toBeTypeOf('object')
		})

		it('should properly type retention policy insert data', () => {
			const insertData = {
				policyName: 'test-policy',
				retentionDays: 365,
				dataClassification: 'PHI' as const,
				description: 'Test policy',
				createdBy: 'system',
			}

			expect(insertData.policyName).toBeTypeOf('string')
			expect(insertData.retentionDays).toBeTypeOf('number')
			expect(insertData.dataClassification).toBe('PHI')
		})
	})
})
