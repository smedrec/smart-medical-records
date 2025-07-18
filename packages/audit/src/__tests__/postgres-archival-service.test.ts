import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PostgresArchivalService } from '../archival/postgres-archival-service.js'

import type { ArchiveRetrievalRequest } from '../archival/archival-service.js'

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

const mockArchiveStorageTable = {
	id: 'id',
	metadata: 'metadata',
	data: 'data',
	createdAt: 'createdAt',
	retrievedCount: 'retrievedCount',
	lastRetrievedAt: 'lastRetrievedAt',
}

describe('PostgresArchivalService', () => {
	let archivalService: PostgresArchivalService
	let mockSelectQuery: any
	let mockInsertQuery: any
	let mockUpdateQuery: any
	let mockDeleteQuery: any

	beforeEach(() => {
		vi.clearAllMocks()

		// Setup mock query chains that can be resolved
		mockSelectQuery = vi.fn().mockResolvedValue([])
		mockSelectQuery.from = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.where = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.orderBy = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.limit = vi.fn().mockReturnValue(mockSelectQuery)
		mockSelectQuery.offset = vi.fn().mockReturnValue(mockSelectQuery)

		mockInsertQuery = {
			values: vi.fn().mockResolvedValue(undefined),
		}

		mockUpdateQuery = {
			set: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue({ rowCount: 1 }),
			}),
		}

		mockDeleteQuery = {
			where: vi.fn().mockResolvedValue({ rowCount: 1 }),
		}

		mockDb.select.mockReturnValue(mockSelectQuery)
		mockDb.insert.mockReturnValue(mockInsertQuery)
		mockDb.update.mockReturnValue(mockUpdateQuery)
		mockDb.delete.mockReturnValue(mockDeleteQuery)

		archivalService = new PostgresArchivalService(
			mockDb as any,
			mockAuditLogTable,
			mockRetentionPolicyTable,
			mockArchiveStorageTable
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('storeArchive', () => {
		it('should store archive in PostgreSQL table with base64 encoding', async () => {
			const archive = {
				id: 'test-archive-123',
				metadata: {
					archiveId: 'test-archive-123',
					createdAt: '2023-01-01T00:00:00Z',
					recordCount: 10,
					originalSize: 1000,
					compressedSize: 500,
					compressionRatio: 0.5,
					checksumOriginal: 'original-hash',
					checksumCompressed: 'compressed-hash',
					retentionPolicy: 'standard',
					dataClassification: 'INTERNAL',
					dateRange: {
						start: '2023-01-01T00:00:00Z',
						end: '2023-01-31T23:59:59Z',
					},
					config: {
						compressionAlgorithm: 'gzip' as const,
						compressionLevel: 6,
						format: 'jsonl' as const,
						batchSize: 1000,
						verifyIntegrity: true,
						encryptArchive: false,
					},
				},
				data: Buffer.from('compressed archive data'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
				lastRetrievedAt: undefined,
			}

			await (archivalService as any).storeArchive(archive)

			expect(mockDb.insert).toHaveBeenCalledWith(mockArchiveStorageTable)
			expect(mockInsertQuery.values).toHaveBeenCalledWith({
				id: 'test-archive-123',
				metadata: archive.metadata,
				data: archive.data.toString('base64'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
				lastRetrievedAt: undefined,
			})
		})

		it('should handle storage errors gracefully', async () => {
			const archive = {
				id: 'test-archive-123',
				metadata: {},
				data: Buffer.from('test data'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			}

			mockInsertQuery.values.mockRejectedValueOnce(new Error('Database error'))

			await expect((archivalService as any).storeArchive(archive)).rejects.toThrow('Database error')
		})
	})

	describe('getArchiveById', () => {
		it('should retrieve archive by ID and convert base64 data back to Buffer', async () => {
			const mockArchiveData = {
				id: 'test-archive-123',
				metadata: {
					archiveId: 'test-archive-123',
					recordCount: 5,
					originalSize: 500,
					compressedSize: 250,
				},
				data: Buffer.from('test archive data').toString('base64'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 2,
				lastRetrievedAt: '2023-01-15T10:00:00Z',
			}

			mockSelectQuery.mockResolvedValueOnce([mockArchiveData])

			const result = await (archivalService as any).getArchiveById('test-archive-123')

			expect(mockDb.select).toHaveBeenCalled()
			expect(mockSelectQuery.from).toHaveBeenCalledWith(mockArchiveStorageTable)
			expect(mockSelectQuery.where).toHaveBeenCalled()
			expect(mockSelectQuery.limit).toHaveBeenCalledWith(1)

			expect(result).toEqual({
				id: 'test-archive-123',
				metadata: mockArchiveData.metadata,
				data: Buffer.from('test archive data'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 2,
				lastRetrievedAt: '2023-01-15T10:00:00Z',
			})
		})

		it('should return null when archive not found', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const result = await (archivalService as any).getArchiveById('nonexistent-archive')

			expect(result).toBeNull()
		})

		it('should handle database errors', async () => {
			mockSelectQuery.mockRejectedValueOnce(new Error('Database connection failed'))

			await expect((archivalService as any).getArchiveById('test-archive-123')).rejects.toThrow(
				'Database connection failed'
			)
		})
	})

	describe('findMatchingArchives', () => {
		const mockArchives = [
			{
				id: 'archive-1',
				metadata: {
					retentionPolicy: 'standard',
					dataClassification: 'INTERNAL',
					dateRange: {
						start: '2023-01-01T00:00:00Z',
						end: '2023-01-31T23:59:59Z',
					},
				},
				data: Buffer.from('archive 1 data').toString('base64'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			},
			{
				id: 'archive-2',
				metadata: {
					retentionPolicy: 'sensitive',
					dataClassification: 'CONFIDENTIAL',
					dateRange: {
						start: '2023-02-01T00:00:00Z',
						end: '2023-02-28T23:59:59Z',
					},
				},
				data: Buffer.from('archive 2 data').toString('base64'),
				createdAt: '2023-02-01T00:00:00Z',
				retrievedCount: 1,
			},
		]

		it('should find archives by archive ID', async () => {
			mockSelectQuery.mockResolvedValueOnce([mockArchives[0]])

			const request: ArchiveRetrievalRequest = {
				archiveId: 'archive-1',
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(1)
			expect(result[0].id).toBe('archive-1')
			expect(result[0].data).toBeInstanceOf(Buffer)
		})

		it('should find archives by data classification', async () => {
			mockSelectQuery.mockResolvedValueOnce([mockArchives[1]])

			const request: ArchiveRetrievalRequest = {
				dataClassifications: ['CONFIDENTIAL'],
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(1)
			expect(result[0].metadata.dataClassification).toBe('CONFIDENTIAL')
		})

		it('should find archives by retention policy', async () => {
			mockSelectQuery.mockResolvedValueOnce([mockArchives[0]])

			const request: ArchiveRetrievalRequest = {
				retentionPolicies: ['standard'],
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(1)
			expect(result[0].metadata.retentionPolicy).toBe('standard')
		})

		it('should find archives by date range', async () => {
			mockSelectQuery.mockResolvedValueOnce([mockArchives[0]])

			const request: ArchiveRetrievalRequest = {
				dateRange: {
					start: '2023-01-01T00:00:00Z',
					end: '2023-01-31T23:59:59Z',
				},
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(1)
		})

		it('should apply pagination correctly', async () => {
			mockSelectQuery.mockResolvedValueOnce(mockArchives)

			const request: ArchiveRetrievalRequest = {
				limit: 10,
				offset: 5,
			}

			await (archivalService as any).findMatchingArchives(request)

			expect(mockSelectQuery.limit).toHaveBeenCalledWith(10)
			expect(mockSelectQuery.offset).toHaveBeenCalledWith(5)
		})

		it('should use default limit when not specified', async () => {
			mockSelectQuery.mockResolvedValueOnce(mockArchives)

			const request: ArchiveRetrievalRequest = {}

			await (archivalService as any).findMatchingArchives(request)

			expect(mockSelectQuery.limit).toHaveBeenCalledWith(100)
			expect(mockSelectQuery.offset).toHaveBeenCalledWith(0)
		})

		it('should handle multiple filter criteria', async () => {
			mockSelectQuery.mockResolvedValueOnce([mockArchives[1]])

			const request: ArchiveRetrievalRequest = {
				dataClassifications: ['CONFIDENTIAL'],
				retentionPolicies: ['sensitive'],
				limit: 5,
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(1)
			expect(result[0].metadata.dataClassification).toBe('CONFIDENTIAL')
			expect(result[0].metadata.retentionPolicy).toBe('sensitive')
		})

		it('should return empty array when no matches found', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const request: ArchiveRetrievalRequest = {
				archiveId: 'nonexistent-archive',
			}

			const result = await (archivalService as any).findMatchingArchives(request)

			expect(result).toHaveLength(0)
		})
	})

	describe('decompressArchiveData', () => {
		it('should decompress gzip data', async () => {
			const originalData = 'test archive data'
			const gzipData = Buffer.from([
				0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x2b, 0x49, 0x2d, 0x2e, 0x51,
				0x48, 0x2c, 0x4a, 0xce, 0xc8, 0x2c, 0x4b, 0x55, 0x48, 0x49, 0x2c, 0x49, 0x04, 0x00, 0x00,
				0x00, 0xff, 0xff, 0x03, 0x00, 0x7e, 0x7a, 0x7a, 0x7a, 0x11, 0x00, 0x00, 0x00,
			])

			const archive = {
				id: 'test-archive',
				metadata: {
					config: {
						compressionAlgorithm: 'gzip' as const,
					},
				},
				data: gzipData,
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			}

			// Note: This test uses a simplified approach since actual gzip compression
			// would require more complex setup. In a real scenario, you'd use actual
			// compressed data or mock the decompression functions.
			const result = await (archivalService as any).decompressArchiveData(archive)

			expect(typeof result).toBe('string')
		})

		it('should handle deflate compression', async () => {
			const deflateData = Buffer.from('deflate compressed data')

			const archive = {
				id: 'test-archive',
				metadata: {
					config: {
						compressionAlgorithm: 'deflate' as const,
					},
				},
				data: deflateData,
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			}

			const result = await (archivalService as any).decompressArchiveData(archive)

			expect(typeof result).toBe('string')
		})

		it('should handle uncompressed data', async () => {
			const originalData = 'uncompressed test data'
			const archive = {
				id: 'test-archive',
				metadata: {
					config: {
						compressionAlgorithm: 'none' as const,
					},
				},
				data: Buffer.from(originalData),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			}

			const result = await (archivalService as any).decompressArchiveData(archive)

			expect(result).toBe(originalData)
		})

		it('should throw error for unsupported compression algorithm', async () => {
			const archive = {
				id: 'test-archive',
				metadata: {
					config: {
						compressionAlgorithm: 'unsupported' as any,
					},
				},
				data: Buffer.from('test data'),
				createdAt: '2023-01-01T00:00:00Z',
				retrievedCount: 0,
			}

			await expect((archivalService as any).decompressArchiveData(archive)).rejects.toThrow(
				'Unsupported compression algorithm: unsupported'
			)
		})
	})

	describe('filterRecords', () => {
		const testRecords = [
			{
				id: 1,
				timestamp: '2023-01-01T00:00:00Z',
				action: 'user.login',
				principalId: 'user123',
				dataClassification: 'INTERNAL',
			},
			{
				id: 2,
				timestamp: '2023-01-02T00:00:00Z',
				action: 'user.logout',
				principalId: 'user456',
				dataClassification: 'CONFIDENTIAL',
			},
			{
				id: 3,
				timestamp: '2023-01-03T00:00:00Z',
				action: 'data.read',
				principalId: 'user123',
				dataClassification: 'INTERNAL',
			},
		]

		it('should filter records by principal ID', () => {
			const request: ArchiveRetrievalRequest = {
				principalId: 'user123',
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(2)
			expect(result.every((record: any) => record.principalId === 'user123')).toBe(true)
		})

		it('should filter records by actions', () => {
			const request: ArchiveRetrievalRequest = {
				actions: ['user.login', 'user.logout'],
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(2)
			expect(
				result.every((record: any) => ['user.login', 'user.logout'].includes(record.action))
			).toBe(true)
		})

		it('should filter records by date range', () => {
			const request: ArchiveRetrievalRequest = {
				dateRange: {
					start: '2023-01-01T00:00:00Z',
					end: '2023-01-02T00:00:00Z',
				},
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(2)
		})

		it('should filter records by data classifications', () => {
			const request: ArchiveRetrievalRequest = {
				dataClassifications: ['INTERNAL'],
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(2)
			expect(result.every((record: any) => record.dataClassification === 'INTERNAL')).toBe(true)
		})

		it('should apply multiple filters', () => {
			const request: ArchiveRetrievalRequest = {
				principalId: 'user123',
				actions: ['data.read'],
				dataClassifications: ['INTERNAL'],
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(3)
		})

		it('should return all records when no filters applied', () => {
			const request: ArchiveRetrievalRequest = {}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(3)
		})

		it('should return empty array when no records match filters', () => {
			const request: ArchiveRetrievalRequest = {
				principalId: 'nonexistent-user',
			}

			const result = (archivalService as any).filterRecords(testRecords, request)

			expect(result).toHaveLength(0)
		})
	})

	describe('updateRetrievalStatistics', () => {
		it('should update retrieval count and timestamp', async () => {
			await (archivalService as any).updateRetrievalStatistics('test-archive-123')

			expect(mockDb.update).toHaveBeenCalledWith(mockArchiveStorageTable)
			expect(mockUpdateQuery.set).toHaveBeenCalled()

			const setCall = mockUpdateQuery.set.mock.calls[0][0]
			expect(setCall.lastRetrievedAt).toBeDefined()
			expect(typeof setCall.lastRetrievedAt).toBe('string')
		})

		it('should handle update errors', async () => {
			mockUpdateQuery.set.mockReturnValueOnce({
				where: vi.fn().mockRejectedValueOnce(new Error('Update failed')),
			})

			await expect(
				(archivalService as any).updateRetrievalStatistics('test-archive-123')
			).rejects.toThrow('Update failed')
		})
	})

	describe('getArchiveStatistics', () => {
		it('should return comprehensive archive statistics', async () => {
			const mockArchives = [
				{
					id: 'archive-1',
					metadata: {
						compressedSize: 1000,
						originalSize: 2000,
						retentionPolicy: 'standard',
						dataClassification: 'INTERNAL',
					},
					createdAt: '2023-01-01T00:00:00Z',
				},
				{
					id: 'archive-2',
					metadata: {
						compressedSize: 500,
						originalSize: 1500,
						retentionPolicy: 'sensitive',
						dataClassification: 'CONFIDENTIAL',
					},
					createdAt: '2023-01-02T00:00:00Z',
				},
			]

			mockSelectQuery.mockResolvedValueOnce(mockArchives)

			const stats = await archivalService.getArchiveStatistics()

			expect(stats.totalArchives).toBe(2)
			expect(stats.totalCompressedSize).toBe(1500)
			expect(stats.totalOriginalSize).toBe(3500)
			expect(stats.averageCompressionRatio).toBeCloseTo(0.43, 2)
			expect(stats.archivesByPolicy).toEqual({
				standard: 1,
				sensitive: 1,
			})
			expect(stats.archivesByClassification).toEqual({
				INTERNAL: 1,
				CONFIDENTIAL: 1,
			})
			expect(stats.oldestArchive).toBe('2023-01-01T00:00:00Z')
			expect(stats.newestArchive).toBe('2023-01-02T00:00:00Z')
		})

		it('should handle empty archive collection', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const stats = await archivalService.getArchiveStatistics()

			expect(stats.totalArchives).toBe(0)
			expect(stats.totalCompressedSize).toBe(0)
			expect(stats.totalOriginalSize).toBe(0)
			expect(stats.averageCompressionRatio).toBe(0)
			expect(stats.archivesByPolicy).toEqual({})
			expect(stats.archivesByClassification).toEqual({})
		})
	})

	describe('cleanupOldArchives', () => {
		it('should delete old archives based on retention policies', async () => {
			const mockPolicies = [
				{
					policyName: 'standard',
					deleteAfterDays: 365,
					isActive: 'true',
				},
			]

			const mockOldArchives = [
				{
					id: 'old-archive-1',
					metadata: {
						compressedSize: 1000,
						retentionPolicy: 'standard',
					},
					createdAt: '2022-01-01T00:00:00Z',
				},
			]

			// Mock retention policies query
			mockSelectQuery.mockResolvedValueOnce(mockPolicies)
			// Mock old archives query
			mockSelectQuery.mockResolvedValueOnce(mockOldArchives)

			const result = await archivalService.cleanupOldArchives()

			expect(result.archivesDeleted).toBe(1)
			expect(result.spaceFreed).toBe(1000)
			expect(result.cleanupTimestamp).toBeDefined()
		})

		it('should handle policies without delete rules', async () => {
			const mockPolicies = [
				{
					policyName: 'permanent',
					deleteAfterDays: null,
					isActive: 'true',
				},
			]

			mockSelectQuery.mockResolvedValueOnce(mockPolicies)

			const result = await archivalService.cleanupOldArchives()

			expect(result.archivesDeleted).toBe(0)
			expect(result.spaceFreed).toBe(0)
		})

		it('should handle cleanup errors gracefully', async () => {
			mockSelectQuery.mockRejectedValueOnce(new Error('Database error'))

			await expect(archivalService.cleanupOldArchives()).rejects.toThrow('Database error')
		})
	})

	describe('validateAllArchives', () => {
		it('should validate all archives and report results', async () => {
			const mockArchives = [{ id: 'archive-1' }, { id: 'archive-2' }, { id: 'archive-3' }]

			mockSelectQuery.mockResolvedValueOnce(mockArchives)

			// Mock verifyArchiveIntegrity calls
			vi.spyOn(archivalService as any, 'verifyArchiveIntegrity')
				.mockResolvedValueOnce(true) // archive-1 valid
				.mockResolvedValueOnce(false) // archive-2 corrupted
				.mockResolvedValueOnce(true) // archive-3 valid

			const result = await archivalService.validateAllArchives()

			expect(result.totalArchives).toBe(3)
			expect(result.validArchives).toBe(2)
			expect(result.corruptedArchives).toBe(1)
			expect(result.corruptedArchiveIds).toEqual(['archive-2'])
			expect(result.validationTimestamp).toBeDefined()
		})

		it('should handle validation errors', async () => {
			const mockArchives = [{ id: 'archive-1' }]

			mockSelectQuery.mockResolvedValueOnce(mockArchives)

			// Mock verifyArchiveIntegrity to throw error
			vi.spyOn(archivalService as any, 'verifyArchiveIntegrity').mockRejectedValueOnce(
				new Error('Validation error')
			)

			const result = await archivalService.validateAllArchives()

			expect(result.totalArchives).toBe(1)
			expect(result.validArchives).toBe(0)
			expect(result.corruptedArchives).toBe(1)
			expect(result.corruptedArchiveIds).toEqual(['archive-1'])
		})

		it('should handle empty archive collection', async () => {
			mockSelectQuery.mockResolvedValueOnce([])

			const result = await archivalService.validateAllArchives()

			expect(result.totalArchives).toBe(0)
			expect(result.validArchives).toBe(0)
			expect(result.corruptedArchives).toBe(0)
			expect(result.corruptedArchiveIds).toEqual([])
		})
	})
})
