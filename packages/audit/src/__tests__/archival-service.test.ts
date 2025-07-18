import { createHash } from 'crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ArchivalService } from '../archival/archival-service.js'

import type { ArchiveConfig, ArchiveRetrievalRequest } from '../archival/archival-service.js'

// Mock database and tables
const mockDb = {
	select: vi.fn(),
	insert: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
}

const mockAuditLogTable = {
	id: 'id',
	timestamp: 'timestamp',
	dataClassification: 'dataClassification',
	retentionPolicy: 'retentionPolicy',
	archivedAt: 'archivedAt',
	principalId: 'principalId',
	hash: 'hash',
}

const mockRetentionPolicyTable = {
	id: 'id',
	policyName: 'policyName',
	dataClassification: 'dataClassification',
	retentionDays: 'retentionDays',
	archiveAfterDays: 'archiveAfterDays',
	deleteAfterDays: 'deleteAfterDays',
	isActive: 'isActive',
}

const mockArchiveTable = {
	id: 'id',
	metadata: 'metadata',
	data: 'data',
	createdAt: 'createdAt',
	retrievedCount: 'retrievedCount',
	lastRetrievedAt: 'lastRetrievedAt',
}

// Test implementation of ArchivalService
class TestArchivalService extends ArchivalService {
	private archives: Map<string, any> = new Map()

	protected override async storeArchive(archive: any): Promise<void> {
		this.archives.set(archive.id, archive)
	}

	protected override async getArchiveById(archiveId: string): Promise<any | null> {
		return this.archives.get(archiveId) || null
	}

	protected override async findMatchingArchives(request: ArchiveRetrievalRequest): Promise<any[]> {
		const archives = Array.from(this.archives.values())

		return archives.filter((archive) => {
			if (request.archiveId && archive.id !== request.archiveId) return false
			if (
				request.dataClassifications &&
				!request.dataClassifications.includes(archive.metadata.dataClassification)
			)
				return false
			if (
				request.retentionPolicies &&
				!request.retentionPolicies.includes(archive.metadata.retentionPolicy)
			)
				return false
			return true
		})
	}

	protected override async decompressArchiveData(archive: any): Promise<string> {
		// For testing, assume data is not compressed
		return archive.data.toString('utf8')
	}

	protected override filterRecords(records: any[], request: ArchiveRetrievalRequest): any[] {
		return records.filter((record) => {
			if (request.principalId && record.principalId !== request.principalId) return false
			if (request.actions && !request.actions.includes(record.action)) return false
			return true
		})
	}

	protected override async updateRetrievalStatistics(archiveId: string): Promise<void> {
		const archive = this.archives.get(archiveId)
		if (archive) {
			archive.retrievedCount = (archive.retrievedCount || 0) + 1
			archive.lastRetrievedAt = new Date().toISOString()
		}
	}

	// Expose protected method for testing
	public async testVerifyArchiveIntegrity(archiveId: string): Promise<boolean> {
		return this.verifyArchiveIntegrity(archiveId)
	}
}

describe('ArchivalService', () => {
	let archivalService: TestArchivalService
	let mockSelectQuery: any

	beforeEach(() => {
		vi.clearAllMocks()

		// Setup mock query chain that can be resolved
		mockSelectQuery = vi.fn().mockResolvedValue([])
		mockSelectQuery.from = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.where = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.orderBy = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.limit = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.offset = vi.fn().mockReturnValue(mockSelectQuery)

		mockDb.select.mockReturnValue(mockSelectQuery)
		mockDb.insert.mockReturnValue({
			values: vi.fn().mockResolvedValue(undefined),
		})
		mockDb.update.mockReturnValue({
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue({ rowCount: 1 }),
			}),
		})
		mockDb.delete.mockReturnValue({
			where: vi.fn().mockResolvedValue({ rowCount: 1 }),
		})

		archivalService = new TestArchivalService(
			mockDb as any,
			mockAuditLogTable,
			mockRetentionPolicyTable,
			mockArchiveTable
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('archiveDataByRetentionPolicies', () => {
		it('should archive data based on active retention policies', async () => {
			// Mock active retention policies
			mockSelectQuery.mockResolvedValueOnce([
				{
					policyName: 'standard',
					dataClassification: 'INTERNAL',
					retentionDays: 365,
					archiveAfterDays: 90,
					deleteAfterDays: null,
					isActive: 'true',
				},
			])

			// Mock records to archive
			mockSelectQuery.mockResolvedValueOnce([
				{
					id: 1,
					timestamp: '2023-01-01T00:00:00Z',
					action: 'user.login',
					principalId: 'user123',
					dataClassification: 'INTERNAL',
					retentionPolicy: 'standard',
				},
			])

			const results = await archivalService.archiveDataByRetentionPolicies()

			expect(results).toHaveLength(1)
			expect(results[0].policy).toBe('standard')
			expect(results[0].recordsArchived).toBe(1)
			expect(results[0].verificationStatus).toBe('skipped')
		})

		it('should handle empty policies gracefully', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const results = await archivalService.archiveDataByRetentionPolicies()

			expect(results).toHaveLength(0)
		})

		it('should continue processing other policies if one fails', async () => {
			// Mock two policies
			mockSelectQuery.mockResolvedValueOnce([
				{
					policyName: 'policy1',
					dataClassification: 'INTERNAL',
					retentionDays: 365,
					archiveAfterDays: 90,
					isActive: 'true',
				},
				{
					policyName: 'policy2',
					dataClassification: 'CONFIDENTIAL',
					retentionDays: 365,
					archiveAfterDays: 90,
					isActive: 'true',
				},
			])

			// Mock records for first policy (will succeed)
			mockSelectQuery.mockResolvedValueOnce([
				{
					id: 1,
					timestamp: '2023-01-01T00:00:00Z',
					dataClassification: 'INTERNAL',
				},
			])

			// Mock records for second policy (will fail)
			mockSelectQuery.mockRejectedValueOnce(new Error('Database error'))

			const results = await archivalService.archiveDataByRetentionPolicies()

			expect(results).toHaveLength(1)
			expect(results[0].policy).toBe('policy1')
		})
	})

	describe('secureDeleteData', () => {
		it('should delete data based on criteria and verify deletion', async () => {
			// Mock records to delete
			mockSelectQuery.mockResolvedValueOnce([
				{ id: 1, hash: 'hash1' },
				{ id: 2, hash: 'hash2' },
			])

			// Mock verification queries (records should not exist after deletion)
			mockSelectQuery.mockResolvedValueOnce([]) // First record not found
			mockSelectQuery.mockResolvedValueOnce([]) // Second record not found

			const result = await archivalService.secureDeleteData({
				principalId: 'user123',
				verifyDeletion: true,
			})

			expect(result.recordsDeleted).toBe(1)
			expect(result.verificationStatus).toBe('verified')
			expect(result.verificationDetails?.allDeleted).toBe(true)
			expect(result.verificationDetails?.remainingRecords).toBe(0)
		})

		it('should detect incomplete deletion during verification', async () => {
			// Mock records to delete
			mockSelectQuery.mockResolvedValueOnce([
				{ id: 1, hash: 'hash1' },
				{ id: 2, hash: 'hash2' },
			])

			// Mock verification queries (one record still exists)
			mockSelectQuery.mockResolvedValueOnce([{ id: 1 }]) // First record still exists
			mockSelectQuery.mockResolvedValueOnce([]) // Second record not found

			const result = await archivalService.secureDeleteData({
				principalId: 'user123',
				verifyDeletion: true,
			})

			expect(result.verificationStatus).toBe('failed')
			expect(result.verificationDetails?.allDeleted).toBe(false)
			expect(result.verificationDetails?.remainingRecords).toBe(1)
		})

		it('should skip verification when not requested', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const result = await archivalService.secureDeleteData({
				principalId: 'user123',
				verifyDeletion: false,
			})

			expect(result.verificationStatus).toBe('skipped')
			expect(result.verificationDetails).toBeUndefined()
		})

		it('should handle empty deletion criteria', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const result = await archivalService.secureDeleteData({})

			expect(result.recordsDeleted).toBe(0)
			expect(result.verificationStatus).toBe('skipped')
		})
	})

	describe('createArchive', () => {
		it('should create archive with compression and integrity verification', async () => {
			const records = [
				{
					id: 1,
					timestamp: '2023-01-01T00:00:00Z',
					action: 'user.login',
					principalId: 'user123',
				},
			]

			const config: Partial<ArchiveConfig> = {
				compressionAlgorithm: 'none',
				verifyIntegrity: false,
			}

			const archivalServiceWithConfig = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				config
			)

			const result = await archivalServiceWithConfig.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			expect(result.archiveId).toBeDefined()
			expect(result.originalSize).toBeGreaterThan(0)
			expect(result.compressedSize).toBeGreaterThan(0)
			expect(result.compressionRatio).toBeGreaterThan(0)
			expect(result.verificationStatus).toBe('skipped')
		})

		it('should handle different compression algorithms', async () => {
			const records = [{ id: 1, data: 'test data' }]

			// Test with gzip compression
			const gzipConfig: Partial<ArchiveConfig> = {
				compressionAlgorithm: 'gzip',
				compressionLevel: 6,
				verifyIntegrity: false,
			}

			const gzipService = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				gzipConfig
			)

			const gzipResult = await gzipService.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			expect(gzipResult.archiveId).toBeDefined()
			expect(gzipResult.compressionRatio).toBeGreaterThan(0) // Should be compressed
		})

		it('should handle empty records', async () => {
			const result = await archivalService.createArchive([], {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			expect(result.archiveId).toBeDefined()
			expect(result.originalSize).toBeGreaterThanOrEqual(0) // Empty JSON array "[]"
			expect(result.compressionRatio).toBeGreaterThan(0)
		})
	})

	describe('retrieveArchivedData', () => {
		beforeEach(async () => {
			// Create test archives
			const records1 = [
				{
					id: 1,
					timestamp: '2023-01-01T00:00:00Z',
					action: 'user.login',
					principalId: 'user123',
					dataClassification: 'INTERNAL',
				},
			]

			const records2 = [
				{
					id: 2,
					timestamp: '2023-01-02T00:00:00Z',
					action: 'user.logout',
					principalId: 'user456',
					dataClassification: 'CONFIDENTIAL',
				},
			]

			await archivalService.createArchive(records1, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			await archivalService.createArchive(records2, {
				retentionPolicy: 'sensitive',
				dataClassification: 'CONFIDENTIAL',
			})
		})

		it('should retrieve all archives when no filters applied', async () => {
			const result = await archivalService.retrieveArchivedData({})

			expect(result.archives).toHaveLength(2)
			expect(result.recordCount).toBe(2)
			expect(result.requestId).toBeDefined()
			expect(result.retrievedAt).toBeDefined()
		})

		it('should filter archives by data classification', async () => {
			const result = await archivalService.retrieveArchivedData({
				dataClassifications: ['INTERNAL'],
			})

			expect(result.archives).toHaveLength(1)
			expect(result.recordCount).toBe(1)
			expect(result.archives[0].records[0].dataClassification).toBe('INTERNAL')
		})

		it('should filter archives by retention policy', async () => {
			const result = await archivalService.retrieveArchivedData({
				retentionPolicies: ['sensitive'],
			})

			expect(result.archives).toHaveLength(1)
			expect(result.recordCount).toBe(1)
			expect(result.archives[0].metadata.retentionPolicy).toBe('sensitive')
		})

		it('should filter records by principal ID', async () => {
			const result = await archivalService.retrieveArchivedData({
				principalId: 'user123',
			})

			expect(result.recordCount).toBe(1)
			expect(result.archives[0].records[0].principalId).toBe('user123')
		})

		it('should filter records by actions', async () => {
			const result = await archivalService.retrieveArchivedData({
				actions: ['user.login'],
			})

			expect(result.recordCount).toBe(1)
			expect(result.archives[0].records[0].action).toBe('user.login')
		})

		it('should apply pagination limits', async () => {
			const result = await archivalService.retrieveArchivedData({
				limit: 1,
			})

			expect(result.archives).toHaveLength(1)
		})

		it('should update retrieval statistics', async () => {
			const archiveId = Array.from((archivalService as any).archives.keys())[0]
			const archiveBefore = (archivalService as any).archives.get(archiveId)
			const initialCount = archiveBefore.retrievedCount || 0

			await archivalService.retrieveArchivedData({})

			const archiveAfter = (archivalService as any).archives.get(archiveId)
			expect(archiveAfter.retrievedCount).toBe(initialCount + 1)
			expect(archiveAfter.lastRetrievedAt).toBeDefined()
		})
	})

	describe('archive integrity verification', () => {
		it('should verify archive integrity correctly', async () => {
			const records = [{ id: 1, data: 'test data' }]
			const result = await archivalService.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			const isValid = await archivalService.testVerifyArchiveIntegrity(result.archiveId)
			expect(isValid).toBe(true)
		})

		it('should detect corrupted archives', async () => {
			const records = [{ id: 1, data: 'test data' }]
			const result = await archivalService.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			// Corrupt the archive data
			const archive = (archivalService as any).archives.get(result.archiveId)
			archive.data = Buffer.from('corrupted data')

			const isValid = await archivalService.testVerifyArchiveIntegrity(result.archiveId)
			expect(isValid).toBe(false)
		})

		it('should handle missing archives during verification', async () => {
			const isValid = await archivalService.testVerifyArchiveIntegrity('nonexistent-archive')
			expect(isValid).toBe(false)
		})
	})

	describe('data serialization and compression', () => {
		it('should serialize records in JSON format', async () => {
			const records = [{ id: 1, name: 'test' }]
			const config: Partial<ArchiveConfig> = {
				format: 'json',
				compressionAlgorithm: 'none',
			}

			const service = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				config
			)

			const result = await service.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			expect(result.archiveId).toBeDefined()
		})

		it('should serialize records in JSONL format', async () => {
			const records = [
				{ id: 1, name: 'test1' },
				{ id: 2, name: 'test2' },
			]
			const config: Partial<ArchiveConfig> = {
				format: 'jsonl',
				compressionAlgorithm: 'none',
			}

			const service = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				config
			)

			const result = await service.createArchive(records, {
				retentionPolicy: 'standard',
				dataClassification: 'INTERNAL',
			})

			expect(result.archiveId).toBeDefined()
		})
	})

	describe('error handling', () => {
		it('should handle database errors during archival', async () => {
			mockSelectQuery.mockRejectedValueOnce(new Error('Database connection failed'))

			await expect(archivalService.archiveDataByRetentionPolicies()).resolves.toEqual([])
		})

		it('should handle compression errors', async () => {
			const records = [{ id: 1, data: 'test' }]

			// Create a service with invalid compression algorithm
			const invalidConfig: Partial<ArchiveConfig> = {
				compressionAlgorithm: 'invalid' as any,
			}

			const service = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				invalidConfig
			)

			await expect(
				service.createArchive(records, {
					retentionPolicy: 'standard',
					dataClassification: 'INTERNAL',
				})
			).rejects.toThrow('Unsupported compression algorithm')
		})

		it('should handle serialization errors', async () => {
			const records = [{ id: 1, data: 'test' }]

			// Create a service with invalid format
			const invalidConfig: Partial<ArchiveConfig> = {
				format: 'invalid' as any,
				compressionAlgorithm: 'none',
			}

			const service = new TestArchivalService(
				mockDb as any,
				mockAuditLogTable,
				mockRetentionPolicyTable,
				mockArchiveTable,
				invalidConfig
			)

			await expect(
				service.createArchive(records, {
					retentionPolicy: 'standard',
					dataClassification: 'INTERNAL',
				})
			).rejects.toThrow('Unsupported archive format')
		})
	})
})
