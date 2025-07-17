/**
 * Tests for configuration manager
 */

import { randomBytes } from 'crypto'
import { existsSync } from 'fs'
import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createDevelopmentConfig } from '../config/factory.js'
import { ConfigurationManager } from '../config/manager.js'

import type { AuditConfig, HotReloadConfig, SecureStorageConfig } from '../config/types.js'

describe('ConfigurationManager', () => {
	let tempDir: string
	let configPath: string
	let manager: ConfigurationManager
	let testConfig: AuditConfig

	beforeEach(async () => {
		// Create temporary directory for test configs
		tempDir = join(process.cwd(), 'temp-config-tests', randomBytes(8).toString('hex'))
		await mkdir(tempDir, { recursive: true })
		configPath = join(tempDir, 'config.json')

		// Create test configuration
		testConfig = createDevelopmentConfig()
		await writeFile(configPath, JSON.stringify(testConfig, null, 2))

		// Create manager instance
		manager = new ConfigurationManager(configPath)
	})

	afterEach(async () => {
		// Cleanup
		if (manager) {
			await manager.shutdown()
		}
		if (existsSync(tempDir)) {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	describe('initialization', () => {
		it('should initialize successfully with valid config', async () => {
			await expect(manager.initialize()).resolves.not.toThrow()
			expect(manager.getConfig()).toEqual(testConfig)
		})

		it('should throw error if config file does not exist', async () => {
			const invalidPath = join(tempDir, 'nonexistent.json')
			const invalidManager = new ConfigurationManager(invalidPath)

			await expect(invalidManager.initialize()).rejects.toThrow('Configuration file not found')
		})

		it('should throw error for invalid JSON', async () => {
			await writeFile(configPath, 'invalid json')
			await expect(manager.initialize()).rejects.toThrow('Failed to load configuration')
		})

		it('should emit initialized event', async () => {
			const initSpy = vi.fn()
			manager.on('initialized', initSpy)

			await manager.initialize()
			expect(initSpy).toHaveBeenCalledWith(testConfig)
		})
	})

	describe('configuration access', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should get complete configuration', () => {
			const config = manager.getConfig()
			expect(config).toEqual(testConfig)
			expect(config).not.toBe(testConfig) // Should be a copy
		})

		it('should get specific configuration values', () => {
			expect(manager.getConfigValue('environment')).toBe('development')
			expect(manager.getConfigValue('redis.url')).toBe(testConfig.redis.url)
			expect(manager.getConfigValue('worker.concurrency')).toBe(testConfig.worker.concurrency)
		})

		it('should throw error for non-existent path', () => {
			expect(() => manager.getConfigValue('nonexistent.path')).toThrow(
				"Configuration path 'nonexistent.path' not found"
			)
		})

		it('should throw error if not initialized', () => {
			const uninitializedManager = new ConfigurationManager(configPath)
			expect(() => uninitializedManager.getConfig()).toThrow('Configuration not initialized')
		})
	})

	describe('configuration updates', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should update configuration value', async () => {
			const newConcurrency = 5
			await manager.updateConfig('worker.concurrency', newConcurrency, 'test-user', 'test update')

			expect(manager.getConfigValue('worker.concurrency')).toBe(newConcurrency)
		})

		it('should emit configChanged event', async () => {
			const changeSpy = vi.fn()
			manager.on('configChanged', changeSpy)

			await manager.updateConfig('worker.concurrency', 5, 'test-user')

			expect(changeSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					field: 'worker.concurrency',
					newValue: 5,
					previousValue: testConfig.worker.concurrency,
					changedBy: 'test-user',
				})
			)
		})

		it('should update version and lastUpdated on change', async () => {
			const originalVersion = manager.getVersion()
			const originalLastUpdated = manager.getConfigValue('lastUpdated')

			await manager.updateConfig('worker.concurrency', 5, 'test-user')

			expect(manager.getVersion()).not.toBe(originalVersion)
			expect(manager.getConfigValue('lastUpdated')).not.toBe(originalLastUpdated)
		})

		it('should validate configuration before applying changes', async () => {
			await expect(manager.updateConfig('worker.concurrency', -1, 'test-user')).rejects.toThrow()
		})

		it('should record change history', async () => {
			await manager.updateConfig('worker.concurrency', 5, 'test-user', 'performance tuning')

			const history = manager.getChangeHistory(1)
			expect(history).toHaveLength(1)
			expect(history[0]).toMatchObject({
				field: 'worker.concurrency',
				newValue: 5,
				previousValue: testConfig.worker.concurrency,
				changedBy: 'test-user',
				reason: 'performance tuning',
			})
		})
	})

	describe('hot reloading', () => {
		let hotReloadConfig: HotReloadConfig

		beforeEach(() => {
			hotReloadConfig = {
				enabled: true,
				reloadableFields: ['worker.concurrency', 'monitoring.metricsInterval'],
				checkInterval: 100,
			}
		})

		it('should start hot reloading when enabled', async () => {
			const hotReloadManager = new ConfigurationManager(configPath, hotReloadConfig)
			const startSpy = vi.fn()
			hotReloadManager.on('hotReloadStarted', startSpy)

			await hotReloadManager.initialize()
			expect(startSpy).toHaveBeenCalled()

			await hotReloadManager.shutdown()
		})

		it('should emit hotReload event for reloadable fields', async () => {
			const hotReloadManager = new ConfigurationManager(configPath, hotReloadConfig)
			await hotReloadManager.initialize()

			const hotReloadSpy = vi.fn()
			hotReloadManager.on('hotReload', hotReloadSpy)

			await hotReloadManager.updateConfig('worker.concurrency', 5, 'test-user')

			expect(hotReloadSpy).toHaveBeenCalledWith({
				path: 'worker.concurrency',
				newValue: 5,
				previousValue: testConfig.worker.concurrency,
			})

			await hotReloadManager.shutdown()
		})

		it('should not emit hotReload event for non-reloadable fields', async () => {
			const hotReloadManager = new ConfigurationManager(configPath, hotReloadConfig)
			await hotReloadManager.initialize()

			const hotReloadSpy = vi.fn()
			hotReloadManager.on('hotReload', hotReloadSpy)

			await hotReloadManager.updateConfig('database.poolSize', 15, 'test-user')

			expect(hotReloadSpy).not.toHaveBeenCalled()

			await hotReloadManager.shutdown()
		})
	})

	describe('secure storage', () => {
		let secureStorageConfig: SecureStorageConfig

		beforeEach(() => {
			secureStorageConfig = {
				enabled: true,
				algorithm: 'AES-256-GCM',
				kdf: 'PBKDF2',
				salt: randomBytes(32).toString('hex'),
				iterations: 1000, // Lower for tests
			}

			// Set password environment variable
			process.env.AUDIT_CONFIG_PASSWORD = 'test-password-123'
		})

		afterEach(() => {
			delete process.env.AUDIT_CONFIG_PASSWORD
		})

		it('should encrypt and decrypt configuration', async () => {
			const secureManager = new ConfigurationManager(configPath, undefined, secureStorageConfig)
			await secureManager.initialize()

			// Configuration should be encrypted on disk
			const fileContent = await import('fs/promises').then((fs) => fs.readFile(configPath, 'utf-8'))
			const encryptedData = JSON.parse(fileContent)
			expect(encryptedData).toHaveProperty('algorithm')
			expect(encryptedData).toHaveProperty('iv')
			expect(encryptedData).toHaveProperty('data')

			// But should be accessible normally
			expect(secureManager.getConfig()).toEqual(testConfig)

			await secureManager.shutdown()
		})

		it('should require password environment variable', async () => {
			delete process.env.AUDIT_CONFIG_PASSWORD

			const secureManager = new ConfigurationManager(configPath, undefined, secureStorageConfig)
			await expect(secureManager.initialize()).rejects.toThrow(
				'AUDIT_CONFIG_PASSWORD environment variable required'
			)
		})

		it('should handle different encryption algorithms', async () => {
			const cbcConfig = { ...secureStorageConfig, algorithm: 'AES-256-CBC' as const }
			const secureManager = new ConfigurationManager(configPath, undefined, cbcConfig)

			await expect(secureManager.initialize()).resolves.not.toThrow()
			expect(secureManager.getConfig()).toEqual(testConfig)

			await secureManager.shutdown()
		})
	})

	describe('configuration export', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should export configuration with sensitive data masked', () => {
			const exported = manager.exportConfig(false)
			expect(exported.redis?.url).toContain('***')
			expect(exported.database?.url).toContain('***')
		})

		it('should export configuration with sensitive data when requested', () => {
			const exported = manager.exportConfig(true)
			expect(exported.redis?.url).toBe(testConfig.redis.url)
			expect(exported.database?.url).toBe(testConfig.database.url)
		})
	})

	describe('validation', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should validate current configuration', async () => {
			await expect(manager.validateCurrentConfig()).resolves.not.toThrow()
		})

		it('should detect validation errors', async () => {
			// Manually corrupt the configuration
			const config = manager.getConfig()
			config.worker.concurrency = -1

			await expect(manager.validateCurrentConfig()).rejects.toThrow()
		})
	})

	describe('version management', () => {
		beforeEach(async () => {
			await manager.initialize()
		})

		it('should return current version', () => {
			const version = manager.getVersion()
			expect(typeof version).toBe('string')
			expect(version.length).toBeGreaterThan(0)
		})

		it('should generate new version on updates', async () => {
			const originalVersion = manager.getVersion()
			await manager.updateConfig('worker.concurrency', 5, 'test-user')
			const newVersion = manager.getVersion()

			expect(newVersion).not.toBe(originalVersion)
		})
	})

	describe('error handling', () => {
		it('should emit error events', async () => {
			const errorSpy = vi.fn()
			manager.on('error', errorSpy)

			// Corrupt the config file after initialization
			await manager.initialize()
			await writeFile(configPath, 'invalid json')

			// Try to reload
			await expect(manager.reloadConfiguration()).rejects.toThrow()
		})

		it('should handle missing configuration gracefully', () => {
			const uninitializedManager = new ConfigurationManager('/nonexistent/path')
			expect(() => uninitializedManager.getConfig()).toThrow('Configuration not initialized')
		})
	})
})
