/**
 * Tests for database error logger implementation
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DatabaseErrorLogger } from '../error/database-error-logger.js'

import type { ErrorAggregation, StructuredError } from '../error/error-handling.js'

// Mock database and table schemas
const mockDb = {
	insert: vi.fn().mockReturnValue({
		values: vi.fn().mockResolvedValue(undefined),
		onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
	}),
	select: vi.fn().mockReturnValue({
		from: vi.fn().mockReturnValue({
			where: vi.fn().mockReturnValue({
				orderBy: vi.fn().mockReturnValue({
					limit: vi.fn().mockResolvedValue([]),
				}),
			}),
			orderBy: vi.fn().mockReturnValue({
				limit: vi.fn().mockResolvedValue([]),
			}),
			groupBy: vi.fn().mockReturnValue({
				orderBy: vi.fn().mockReturnValue({
					limit: vi.fn().mockResolvedValue([]),
				}),
			}),
		}),
	}),
	delete: vi.fn().mockReturnValue({
		where: vi.fn().mockResolvedValue({ rowCount: 5 }),
	}),
	count: vi.fn(),
	eq: vi.fn(),
	and: vi.fn(),
	gte: vi.fn(),
	lte: vi.fn(),
	lt: vi.fn(),
	desc: vi.fn(),
	sql: vi.fn(),
}

const mockErrorLogTable = {
	id: 'id',
	category: 'category',
	severity: 'severity',
	component: 'component',
	correlationId: 'correlationId',
	timestamp: 'timestamp',
	createdAt: 'createdAt',
}

const mockErrorAggregationTable = {
	aggregationKey: 'aggregationKey',
	category: 'category',
	severity: 'severity',
	count: 'count',
	firstOccurrence: 'firstOccurrence',
	lastOccurrence: 'lastOccurrence',
	affectedComponents: 'affectedComponents',
}

describe('DatabaseErrorLogger', () => {
	let logger: DatabaseErrorLogger

	beforeEach(() => {
		vi.clearAllMocks()
		logger = new DatabaseErrorLogger(mockDb, mockErrorLogTable, mockErrorAggregationTable)
	})

	describe('logError', () => {
		it('should log structured error to database', async () => {
			const structuredError: StructuredError = {
				id: 'error-123',
				category: 'DATABASE_ERROR',
				severity: 'HIGH',
				code: 'DAT-abc123',
				message: 'Connection failed',
				context: {
					correlationId: 'corr-123',
					timestamp: '2023-01-01T00:00:00.000Z',
					component: 'db-client',
					operation: 'connect',
					metadata: { key: 'value' },
					environment: {
						nodeVersion: 'v18.0.0',
						platform: 'linux',
						hostname: 'test-host',
						processId: 1234,
					},
				},
				retryable: true,
				troubleshooting: {
					possibleCauses: ['Database server down'],
					suggestedActions: ['Check server status'],
				},
				aggregationKey: 'DATABASE_ERROR:db-client:abc123',
			}

			await logger.logError(structuredError)

			expect(mockDb.insert).toHaveBeenCalledWith(mockErrorLogTable)
			expect(mockDb.insert().values).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'error-123',
					category: 'DATABASE_ERROR',
					severity: 'HIGH',
					code: 'DAT-abc123',
					message: 'Connection failed',
					component: 'db-client',
					operation: 'connect',
					correlationId: 'corr-123',
					retryable: true,
					aggregationKey: 'DATABASE_ERROR:db-client:abc123',
				})
			)
		})

		it('should handle database insert failures gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			mockDb.insert().values.mockRejectedValueOnce(new Error('Database insert failed'))

			const structuredError: StructuredError = {
				id: 'error-456',
				category: 'NETWORK_ERROR',
				severity: 'MEDIUM',
				code: 'NET-def456',
				message: 'Network timeout',
				context: {
					correlationId: 'corr-456',
					timestamp: '2023-01-01T00:00:00.000Z',
					component: 'api-client',
					operation: 'request',
					metadata: {},
					environment: {
						nodeVersion: 'v18.0.0',
						platform: 'linux',
						hostname: 'test-host',
						processId: 1234,
					},
				},
				retryable: true,
				troubleshooting: {
					possibleCauses: ['Network issues'],
					suggestedActions: ['Check connectivity'],
				},
				aggregationKey: 'NETWORK_ERROR:api-client:def456',
			}

			// Should not throw error
			await expect(logger.logError(structuredError)).resolves.toBeUndefined()

			expect(consoleSpy).toHaveBeenCalledWith('Failed to log error to database:', expect.any(Error))
			consoleSpy.mockRestore()
		})
	})

	describe('logAggregation', () => {
		it('should log error aggregation with upsert', async () => {
			const aggregation: ErrorAggregation = {
				aggregationKey: 'DATABASE_ERROR:db-client:abc123',
				category: 'DATABASE_ERROR',
				severity: 'HIGH',
				count: 5,
				errorRate: 0.5,
				trend: 'INCREASING',
				firstOccurrence: '2023-01-01T00:00:00.000Z',
				lastOccurrence: '2023-01-01T01:00:00.000Z',
				affectedComponents: ['db-client'],
				affectedUsers: ['user-123'],
				samples: [],
			}

			await logger.logAggregation(aggregation)

			expect(mockDb.insert).toHaveBeenCalledWith(mockErrorAggregationTable)
			expect(mockDb.insert().values).toHaveBeenCalledWith(
				expect.objectContaining({
					aggregationKey: 'DATABASE_ERROR:db-client:abc123',
					category: 'DATABASE_ERROR',
					severity: 'HIGH',
					count: 5,
					errorRate: 0.5,
					trend: 'INCREASING',
					affectedComponents: ['db-client'],
					affectedUsers: ['user-123'],
				})
			)
		})

		it('should handle aggregation logging failures gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			mockDb.insert().values.mockRejectedValueOnce(new Error('Aggregation insert failed'))

			const aggregation: ErrorAggregation = {
				aggregationKey: 'test-key',
				category: 'UNKNOWN_ERROR',
				severity: 'LOW',
				count: 1,
				errorRate: 0.1,
				trend: 'STABLE',
				firstOccurrence: '2023-01-01T00:00:00.000Z',
				lastOccurrence: '2023-01-01T00:00:00.000Z',
				affectedComponents: ['test-component'],
				affectedUsers: [],
				samples: [],
			}

			// Should not throw error
			await expect(logger.logAggregation(aggregation)).resolves.toBeUndefined()

			expect(consoleSpy).toHaveBeenCalledWith(
				'Failed to log aggregation to database:',
				expect.any(Error)
			)
			consoleSpy.mockRestore()
		})
	})

	describe('getErrorHistory', () => {
		it('should retrieve error history with filters', async () => {
			const mockResults = [
				{
					id: 'error-123',
					category: 'DATABASE_ERROR',
					severity: 'HIGH',
					code: 'DAT-abc123',
					message: 'Connection failed',
					component: 'db-client',
					operation: 'connect',
					correlationId: 'corr-123',
					retryable: true,
					aggregationKey: 'test-key',
					context: { metadata: {} },
					troubleshooting: { possibleCauses: [], suggestedActions: [] },
					timestamp: new Date('2023-01-01T00:00:00.000Z'),
					createdAt: new Date('2023-01-01T00:00:00.000Z'),
				},
			]

			mockDb.select().from().where().orderBy().limit.mockResolvedValueOnce(mockResults)

			const filters = {
				category: 'DATABASE_ERROR' as const,
				severity: 'HIGH' as const,
				limit: 10,
			}

			const history = await logger.getErrorHistory(filters)

			expect(history).toHaveLength(1)
			expect(history[0].id).toBe('error-123')
			expect(history[0].category).toBe('DATABASE_ERROR')
		})

		it('should handle database query failures gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			mockDb
				.select()
				.from()
				.where()
				.orderBy()
				.limit.mockRejectedValueOnce(new Error('Query failed'))

			const history = await logger.getErrorHistory()

			expect(history).toEqual([])
			expect(consoleSpy).toHaveBeenCalledWith(
				'Failed to get error history from database:',
				expect.any(Error)
			)
			consoleSpy.mockRestore()
		})
	})

	describe('cleanupOldErrors', () => {
		it('should clean up old error logs', async () => {
			const result = await logger.cleanupOldErrors(30)

			expect(mockDb.delete).toHaveBeenCalledWith(mockErrorLogTable)
			expect(result).toBe(5) // Mock returns rowCount: 5
		})

		it('should handle cleanup failures gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			mockDb.delete().where.mockRejectedValueOnce(new Error('Delete failed'))

			const result = await logger.cleanupOldErrors(30)

			expect(result).toBe(0)
			expect(consoleSpy).toHaveBeenCalledWith('Failed to cleanup old errors:', expect.any(Error))
			consoleSpy.mockRestore()
		})
	})

	describe('getErrorStatistics', () => {
		it('should return error statistics', async () => {
			// Set up mock implementations for each query
			// Total count query
			const mockTotalQuery = {
				where: vi.fn().mockResolvedValue([{ count: 10 }]),
			}
			mockDb.select.mockReturnValueOnce({
				from: vi.fn().mockReturnValue(mockTotalQuery),
			})

			// Category counts query
			const categoryGroupByMock = vi.fn().mockResolvedValue([
				{ category: 'DATABASE_ERROR', count: 5 },
				{ category: 'NETWORK_ERROR', count: 3 },
			])
			const categoryWhereMock = {
				groupBy: categoryGroupByMock,
			}
			mockDb.select.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue(categoryWhereMock),
				}),
			})

			// Severity counts query
			const severityGroupByMock = vi.fn().mockResolvedValue([
				{ severity: 'HIGH', count: 6 },
				{ severity: 'MEDIUM', count: 4 },
			])
			const severityWhereMock = {
				groupBy: severityGroupByMock,
			}
			mockDb.select.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue(severityWhereMock),
				}),
			})

			// Component counts query
			const componentLimitMock = vi.fn().mockResolvedValue([
				{ component: 'db-client', count: 7 },
				{ component: 'api-client', count: 3 },
			])
			const componentOrderByMock = {
				limit: componentLimitMock,
			}
			const componentGroupByMock = {
				orderBy: vi.fn().mockReturnValue(componentOrderByMock),
			}
			const componentWhereMock = {
				groupBy: vi.fn().mockReturnValue(componentGroupByMock),
			}
			mockDb.select.mockReturnValueOnce({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockReturnValue(componentWhereMock),
				}),
			})

			const stats = await logger.getErrorStatistics()

			expect(stats.totalErrors).toBe(10)
			expect(stats.errorsByCategory['DATABASE_ERROR']).toBe(5)
			expect(stats.errorsByCategory['NETWORK_ERROR']).toBe(3)
			expect(stats.errorsBySeverity['HIGH']).toBe(6)
			expect(stats.errorsBySeverity['MEDIUM']).toBe(4)
			expect(stats.topComponents).toHaveLength(2)
		})

		it('should handle statistics query failures gracefully', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
			mockDb.select.mockRejectedValueOnce(new Error('Statistics query failed'))

			const stats = await logger.getErrorStatistics()

			expect(stats.totalErrors).toBe(0)
			expect(stats.errorsByCategory).toEqual({})
			expect(stats.errorsBySeverity).toEqual({})
			expect(stats.topComponents).toEqual([])
			expect(consoleSpy).toHaveBeenCalledWith(
				'Failed to get error statistics from database:',
				expect.any(Error)
			)
			consoleSpy.mockRestore()
		})
	})
})
