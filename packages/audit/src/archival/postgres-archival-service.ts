import { createGunzip, createInflate } from 'zlib'

import { ArchivalService } from './archival-service.js'

import type { ArchiveConfig, ArchiveRetrievalRequest } from './archival-service.js'

/**
 * PostgreSQL implementation of the ArchivalService
 * Provides PostgreSQL-specific functionality for archiving, retrieving, and managing audit data
 */
export class PostgresArchivalService extends ArchivalService {
	/**
	 * Create a new PostgresArchivalService
	 *
	 * @param db PostgreSQL database instance
	 * @param auditLogTable Audit log table
	 * @param retentionPolicyTable Retention policy table
	 * @param archiveTable Archive storage table
	 * @param config Archive configuration
	 */
	constructor(
		db: any,
		auditLogTable: any,
		retentionPolicyTable: any,
		archiveTable: any,
		config: Partial<ArchiveConfig> = {}
	) {
		super(db, auditLogTable, retentionPolicyTable, archiveTable, config)
	}

	/**
	 * Store an archive in PostgreSQL
	 *
	 * @param archive Archive to store
	 */
	protected async storeArchive(archive: any): Promise<void> {
		try {
			// Convert Buffer to base64 string for storage
			const base64Data = archive.data.toString('base64')

			await this.db.insert(this.archiveTable).values({
				id: archive.id,
				metadata: archive.metadata,
				data: base64Data,
				createdAt: archive.createdAt,
				retrievedCount: archive.retrievedCount || 0,
				lastRetrievedAt: archive.lastRetrievedAt,
			})
		} catch (error) {
			console.error('Error storing archive:', error)
			throw error
		}
	}

	/**
	 * Get an archive by ID from PostgreSQL
	 *
	 * @param archiveId Archive ID
	 * @returns Archive or null if not found
	 */
	protected async getArchiveById(archiveId: string): Promise<any | null> {
		try {
			const result = await this.db
				.select()
				.from(this.archiveTable)
				.where({ id: archiveId })
				.limit(1)

			if (result.length === 0) {
				return null
			}

			const archive = result[0]

			// Convert base64 string back to Buffer
			archive.data = Buffer.from(archive.data, 'base64')

			return archive
		} catch (error) {
			console.error(`Error retrieving archive ${archiveId}:`, error)
			throw error
		}
	}

	/**
	 * Find archives matching retrieval criteria in PostgreSQL
	 *
	 * @param request Retrieval request
	 * @returns Matching archives
	 */
	protected async findMatchingArchives(request: ArchiveRetrievalRequest): Promise<any[]> {
		try {
			let query = this.db.select().from(this.archiveTable)

			// Apply filters
			if (request.archiveId) {
				query = query.where({ id: request.archiveId })
			}

			if (request.dataClassifications && request.dataClassifications.length > 0) {
				// Use JSON path query for metadata.dataClassification
				for (const classification of request.dataClassifications) {
					query = query.where('metadata->dataClassification', '=', classification)
				}
			}

			if (request.retentionPolicies && request.retentionPolicies.length > 0) {
				// Use JSON path query for metadata.retentionPolicy
				for (const policy of request.retentionPolicies) {
					query = query.where('metadata->retentionPolicy', '=', policy)
				}
			}

			if (request.dateRange) {
				// Use JSON path query for metadata.dateRange.start and metadata.dateRange.end
				query = query.where('metadata->dateRange->start', '>=', request.dateRange.start)
				query = query.where('metadata->dateRange->end', '<=', request.dateRange.end)
			}

			// Apply pagination
			const limit = request.limit || 100
			const offset = request.offset || 0
			query = query.limit(limit).offset(offset)

			// Order by creation date
			query = query.orderBy('createdAt', 'desc')

			const results = await query

			// Convert base64 data to Buffer for each archive
			return results.map((archive: any) => ({
				...archive,
				data: Buffer.from(archive.data, 'base64'),
			}))
		} catch (error) {
			console.error('Error finding matching archives:', error)
			throw error
		}
	}

	/**
	 * Decompress archive data
	 *
	 * @param archive Archive to decompress
	 * @returns Decompressed data
	 */
	protected async decompressArchiveData(archive: any): Promise<string> {
		try {
			const compressionAlgorithm = archive.metadata.config?.compressionAlgorithm || 'gzip'

			switch (compressionAlgorithm) {
				case 'gzip': {
					return this.decompressGzip(archive.data)
				}
				case 'deflate': {
					return this.decompressDeflate(archive.data)
				}
				case 'none':
					return archive.data.toString('utf8')
				default:
					throw new Error(`Unsupported compression algorithm: ${compressionAlgorithm}`)
			}
		} catch (error) {
			console.error('Error decompressing archive data:', error)
			throw error
		}
	}

	/**
	 * Decompress gzip data
	 */
	private async decompressGzip(data: Buffer): Promise<string> {
		return new Promise((resolve, reject) => {
			const gunzip = createGunzip()
			const chunks: Buffer[] = []

			gunzip.on('data', (chunk) => chunks.push(chunk))
			gunzip.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
			gunzip.on('error', reject)

			gunzip.end(data)
		})
	}

	/**
	 * Decompress deflate data
	 */
	private async decompressDeflate(data: Buffer): Promise<string> {
		return new Promise((resolve, reject) => {
			const inflate = createInflate()
			const chunks: Buffer[] = []

			inflate.on('data', (chunk) => chunks.push(chunk))
			inflate.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
			inflate.on('error', reject)

			inflate.end(data)
		})
	}

	/**
	 * Update retrieval statistics for an archive in PostgreSQL
	 *
	 * @param archiveId Archive ID
	 */
	protected async updateRetrievalStatistics(archiveId: string): Promise<void> {
		try {
			await this.db
				.update(this.archiveTable)
				.set({
					retrievedCount: this.db.sql`${this.archiveTable.retrievedCount} + 1`,
					lastRetrievedAt: new Date().toISOString(),
				})
				.where({ id: archiveId })
		} catch (error) {
			console.error(`Error updating retrieval statistics for archive ${archiveId}:`, error)
			throw error
		}
	}
}
