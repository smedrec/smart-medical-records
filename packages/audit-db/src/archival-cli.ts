#!/usr/bin/env node
import { AuditDb } from './index.js'
import { Command } from 'commander'

import { PostgresArchivalService } from '@repo/audit'

import { archiveStorage, auditLog, auditRetentionPolicy } from './db/schema.js'

/**
 * CLI tool for audit data archival and cleanup operations
 * Provides command-line interface for managing audit data lifecycle
 */

const program = new Command()

program
	.name('audit-archival')
	.description('Audit data archival and cleanup CLI tool')
	.version('1.0.0')

// Create archival service instance
function createArchivalService(): PostgresArchivalService {
	const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL
	if (!postgresUrl) {
		console.error('Error: POSTGRES_URL or DATABASE_URL environment variable is required')
		process.exit(1)
	}

	const auditDb = new AuditDb(postgresUrl)
	const db = auditDb.getDrizzleInstance()

	return new PostgresArchivalService(db, auditLog, auditRetentionPolicy, archiveStorage)
}

// Archive data based on retention policies
program
	.command('archive')
	.description('Archive audit data based on retention policies')
	.option('--dry-run', 'Show what would be archived without actually archiving')
	.option('--policy <policy>', 'Archive data for specific retention policy only')
	.option('--verbose', 'Show detailed output')
	.action(async (options) => {
		try {
			console.log('Starting audit data archival...')

			const archivalService = createArchivalService()

			if (options.dryRun) {
				console.log('DRY RUN MODE - No data will be archived')
				// TODO: Implement dry run functionality
				return
			}

			const results = await archivalService.archiveDataByRetentionPolicies()

			console.log('\nArchival Results:')
			console.log('================')

			let totalRecordsArchived = 0
			let totalRecordsDeleted = 0
			let totalOriginalSize = 0
			let totalCompressedSize = 0

			for (const result of results) {
				totalRecordsArchived += result.recordsArchived
				totalRecordsDeleted += result.recordsDeleted
				totalOriginalSize += result.originalDataSize
				totalCompressedSize += result.compressedDataSize

				console.log(`\nPolicy: ${result.policy}`)
				console.log(`  Records Archived: ${result.recordsArchived}`)
				console.log(`  Records Deleted: ${result.recordsDeleted}`)
				console.log(`  Original Size: ${(result.originalDataSize / 1024 / 1024).toFixed(2)} MB`)
				console.log(`  Compressed Size: ${(result.compressedDataSize / 1024 / 1024).toFixed(2)} MB`)
				console.log(`  Compression Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`)
				console.log(`  Processing Time: ${result.processingTime}ms`)
				console.log(`  Verification: ${result.verificationStatus}`)

				if (options.verbose && result.summary) {
					console.log(`  By Classification:`, result.summary.byClassification)
					console.log(`  By Action:`, result.summary.byAction)
				}
			}

			console.log('\nTotal Summary:')
			console.log(`  Total Records Archived: ${totalRecordsArchived}`)
			console.log(`  Total Records Deleted: ${totalRecordsDeleted}`)
			console.log(`  Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`)
			console.log(`  Total Compressed Size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`)
			console.log(
				`  Overall Compression: ${totalOriginalSize > 0 ? ((totalCompressedSize / totalOriginalSize) * 100).toFixed(1) : 0}%`
			)
		} catch (error) {
			console.error('Archival failed:', error)
			process.exit(1)
		}
	})

// Delete data securely
program
	.command('delete')
	.description('Securely delete audit data with verification')
	.option('--principal-id <id>', 'Delete data for specific principal ID')
	.option('--date-range <range>', 'Delete data in date range (format: start,end)')
	.option(
		'--classification <classifications>',
		'Delete data with specific classifications (comma-separated)'
	)
	.option('--policy <policies>', 'Delete data with specific retention policies (comma-separated)')
	.option('--verify', 'Verify deletion completion', true)
	.option('--dry-run', 'Show what would be deleted without actually deleting')
	.action(async (options) => {
		try {
			console.log('Starting secure data deletion...')

			const archivalService = createArchivalService()

			// Parse options
			const criteria: any = {
				verifyDeletion: options.verify,
			}

			if (options.principalId) {
				criteria.principalId = options.principalId
			}

			if (options.dateRange) {
				const [start, end] = options.dateRange.split(',')
				criteria.dateRange = { start: start.trim(), end: end.trim() }
			}

			if (options.classification) {
				criteria.dataClassifications = options.classification
					.split(',')
					.map((c: string) => c.trim())
			}

			if (options.policy) {
				criteria.retentionPolicies = options.policy.split(',').map((p: string) => p.trim())
			}

			if (options.dryRun) {
				console.log('DRY RUN MODE - No data will be deleted')
				console.log('Deletion criteria:', criteria)
				return
			}

			const result = await archivalService.secureDeleteData(criteria)

			console.log('\nDeletion Results:')
			console.log('================')
			console.log(`Records Deleted: ${result.recordsDeleted}`)
			console.log(`Verification Status: ${result.verificationStatus}`)
			console.log(`Deletion Timestamp: ${result.deletionTimestamp}`)

			if (result.verificationDetails) {
				console.log(`Verification Details:`)
				console.log(`  All Deleted: ${result.verificationDetails.allDeleted}`)
				console.log(`  Remaining Records: ${result.verificationDetails.remainingRecords}`)
			}
		} catch (error) {
			console.error('Deletion failed:', error)
			process.exit(1)
		}
	})

// Retrieve archived data
program
	.command('retrieve')
	.description('Retrieve archived audit data for compliance investigations')
	.option('--archive-id <id>', 'Retrieve specific archive by ID')
	.option('--principal-id <id>', 'Retrieve data for specific principal ID')
	.option('--date-range <range>', 'Retrieve data in date range (format: start,end)')
	.option('--actions <actions>', 'Retrieve data with specific actions (comma-separated)')
	.option(
		'--classification <classifications>',
		'Retrieve data with specific classifications (comma-separated)'
	)
	.option('--policy <policies>', 'Retrieve data with specific retention policies (comma-separated)')
	.option('--limit <limit>', 'Limit number of records returned', '1000')
	.option('--output <file>', 'Output file path (default: stdout)')
	.action(async (options) => {
		try {
			console.log('Retrieving archived data...')

			const archivalService = createArchivalService()

			// Parse retrieval request
			const request: any = {
				limit: parseInt(options.limit),
			}

			if (options.archiveId) {
				request.archiveId = options.archiveId
			}

			if (options.principalId) {
				request.principalId = options.principalId
			}

			if (options.dateRange) {
				const [start, end] = options.dateRange.split(',')
				request.dateRange = { start: start.trim(), end: end.trim() }
			}

			if (options.actions) {
				request.actions = options.actions.split(',').map((a: string) => a.trim())
			}

			if (options.classification) {
				request.dataClassifications = options.classification.split(',').map((c: string) => c.trim())
			}

			if (options.policy) {
				request.retentionPolicies = options.policy.split(',').map((p: string) => p.trim())
			}

			const result = await archivalService.retrieveArchivedData(request)

			console.log('\nRetrieval Results:')
			console.log('=================')
			console.log(`Request ID: ${result.requestId}`)
			console.log(`Retrieved At: ${result.retrievedAt}`)
			console.log(`Record Count: ${result.recordCount}`)
			console.log(`Archives Found: ${result.archives.length}`)
			console.log(`Total Size: ${(result.totalSize / 1024 / 1024).toFixed(2)} MB`)
			console.log(`Retrieval Time: ${result.retrievalTime}ms`)

			// Output data
			const outputData = JSON.stringify(result, null, 2)

			if (options.output) {
				const fs = await import('fs/promises')
				await fs.writeFile(options.output, outputData)
				console.log(`\nData written to: ${options.output}`)
			} else {
				console.log('\nRetrieved Data:')
				console.log(outputData)
			}
		} catch (error) {
			console.error('Retrieval failed:', error)
			process.exit(1)
		}
	})

// Show archive statistics
program
	.command('stats')
	.description('Show archive statistics and health information')
	.action(async () => {
		try {
			console.log('Gathering archive statistics...')

			const archivalService = createArchivalService()
			const stats = await archivalService.getArchiveStatistics()

			console.log('\nArchive Statistics:')
			console.log('==================')
			console.log(`Total Archives: ${stats.totalArchives}`)
			console.log(
				`Total Compressed Size: ${(stats.totalCompressedSize / 1024 / 1024).toFixed(2)} MB`
			)
			console.log(`Total Original Size: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`)
			console.log(`Average Compression Ratio: ${(stats.averageCompressionRatio * 100).toFixed(1)}%`)

			if (stats.oldestArchive) {
				console.log(`Oldest Archive: ${stats.oldestArchive}`)
			}
			if (stats.newestArchive) {
				console.log(`Newest Archive: ${stats.newestArchive}`)
			}

			console.log('\nArchives by Policy:')
			for (const [policy, count] of Object.entries(stats.archivesByPolicy)) {
				console.log(`  ${policy}: ${count}`)
			}

			console.log('\nArchives by Classification:')
			for (const [classification, count] of Object.entries(stats.archivesByClassification)) {
				console.log(`  ${classification}: ${count}`)
			}
		} catch (error) {
			console.error('Failed to get statistics:', error)
			process.exit(1)
		}
	})

// Validate archive integrity
program
	.command('validate')
	.description('Validate integrity of all stored archives')
	.option('--archive-id <id>', 'Validate specific archive by ID')
	.action(async (options) => {
		try {
			console.log('Validating archive integrity...')

			const archivalService = createArchivalService()

			if (options.archiveId) {
				// Validate specific archive
				const isValid = await (archivalService as any).verifyArchiveIntegrity(options.archiveId)
				console.log(`\nArchive ${options.archiveId}: ${isValid ? 'VALID' : 'CORRUPTED'}`)
			} else {
				// Validate all archives
				const result = await archivalService.validateAllArchives()

				console.log('\nValidation Results:')
				console.log('==================')
				console.log(`Total Archives: ${result.totalArchives}`)
				console.log(`Valid Archives: ${result.validArchives}`)
				console.log(`Corrupted Archives: ${result.corruptedArchives}`)
				console.log(`Validation Timestamp: ${result.validationTimestamp}`)

				if (result.corruptedArchiveIds.length > 0) {
					console.log('\nCorrupted Archive IDs:')
					for (const id of result.corruptedArchiveIds) {
						console.log(`  ${id}`)
					}
				}
			}
		} catch (error) {
			console.error('Validation failed:', error)
			process.exit(1)
		}
	})

// Cleanup old archives
program
	.command('cleanup')
	.description('Clean up old archives based on retention policies')
	.option('--dry-run', 'Show what would be cleaned up without actually deleting')
	.action(async (options) => {
		try {
			console.log('Starting archive cleanup...')

			const archivalService = createArchivalService()

			if (options.dryRun) {
				console.log('DRY RUN MODE - No archives will be deleted')
				// TODO: Implement dry run functionality
				return
			}

			const result = await archivalService.cleanupOldArchives()

			console.log('\nCleanup Results:')
			console.log('===============')
			console.log(`Archives Deleted: ${result.archivesDeleted}`)
			console.log(`Space Freed: ${(result.spaceFreed / 1024 / 1024).toFixed(2)} MB`)
			console.log(`Cleanup Timestamp: ${result.cleanupTimestamp}`)
		} catch (error) {
			console.error('Cleanup failed:', error)
			process.exit(1)
		}
	})

// Parse command line arguments
program.parse()
