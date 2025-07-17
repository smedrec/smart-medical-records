/**
 * Tests for configuration integration system
 */

import { randomBytes } from 'crypto'
import { existsSync } from 'fs'
import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createDevelopmentConfig, createProductionConfig } from '../config/factory.js'
import {
	AuditConfigChangeHandler,
	createDefaultConfigFile,
	getConfigSummary,
	getDefaultConfigPath,
	initializeAuditConfig,
	setupAuditConfigIntegration,
	validateEnvironmentConfig,
} from '../config/integration.js'

import type { AuditConfig } from '../config/types.js'

describe('Configuration Integration', () => {
	let tempDir: string
	let configPath: string

	beforeEach(async () => {
		// Create temporary directory for test configs
		tempDir = join(process.cwd(), 'temp-config-integration-tests', randomBytes(8).toString('hex'))
		await mkdir(tempDir, { recursive: true })
		configPath = join(tempDir, 'audit-test.json')
	})

	afterEach(async () => {
		// Cleanup
		if (existsSync(tempDir)) {
			await rm(tempDir, { recursive: true, force: true })
		}
		// Clean up environment variables
		delete process.env.NODE_ENV
		delete process.env.AUDIT_CONFIG_DIR
	})

	describe('initializeAuditConfig', () => {
		it('should initialize with default configuration', async () => {
			const { config, manager } = await initializeAuditConfig({
				configPath,
				environment: 'test',
				createDefaultIfMissing: true,
			})

			expect(config.environment).toBe('test')
			expect(config.version).toBeDefined()
			expect(config.lastUpdated).toBeDefined()
			expect(existsSync(configPath)).toBe(true)

			await manager.shutdown()
		})

		it('should create default config file when missing', async () => {
			expect(existsSync(configPath)).toBe(false)

			await initializeAuditConfig({
				configPath,
				environment: 'development',
				createDefaultIfMissing: true,
			})

			expect(existsSync(configPath)).toBe(true)
			const configContent = JSON.parse(
				await import('fs/promises').then((fs) => fs.readFile(configPath, 'utf-8'))
			)
			expect(configContent.environment).toBe('development')
		})

		it('should enable hot reloading in non-production environments', async () => {
			const { manager } = await initializeAuditConfig({
				configPath,
				environment: 'development',
				createDefaultIfMissing: true,
			})

			const hotReloadSpy = vi.fn()
			manager.on('hotReloadStarted', hotReloadSpy)

			// Hot reload should be enabled by default in development
			expect(hotReloadSpy).toHaveBeenCalled()

			await manager.shutdown()
		})

		it('should disable hot reloading in production environment', async () => {
			const { manager } = await initializeAuditConfig({
				configPath,
				environment: 'production',
				enableHotReload: false,
				createDefaultIfMissing: true,
			})

			const hotReloadSpy = vi.fn()
			manager.on('hotReloadStarted', hotReloadSpy)

			// Hot reload should be disabled in production
			expect(hotReloadSpy).not.toHaveBeenCalled()

			await manager.shutdown()
		})

		it('should configure secure storage for production', async () => {
			process.env.AUDIT_CONFIG_PASSWORD = 'test-password-123'
			process.env.AUDIT_CONFIG_SALT = randomBytes(32).toString('hex')

			const { config, manager } = await initializeAuditConfig({
				configPath,
				environment: 'production',
				enableSecureStorage: true,
				createDefaultIfMissing: true,
			})

			expect(config.environment).toBe('production')

			// Configuration should be encrypted on disk
			const fileContent = await import('fs/promises').then((fs) => fs.readFile(configPath, 'utf-8'))
			const encryptedData = JSON.parse(fileContent)
			expect(encryptedData).toHaveProperty('algorithm')
			expect(encryptedData).toHaveProperty('iv')
			expect(encryptedData).toHaveProperty('data')

			await manager.shutdown()
			delete process.env.AUDIT_CONFIG_PASSWORD
			delete process.env.AUDIT_CONFIG_SALT
		})
	})

	describe('setupAuditConfigIntegration', () => {
		it('should setup configuration with change handler', async () => {
			const { config, manager, changeHandler } = await setupAuditConfigIntegration({
				configPath,
				environment: 'test',
				createDefaultIfMissing: true,
			})

			expect(config).toBeDefined()
			expect(manager).toBeDefined()
			expect(changeHandler).toBeInstanceOf(AuditConfigChangeHandler)

			await manager.shutdown()
		})

		it('should handle configuration changes through change handler', async () => {
			const { manager, changeHandler } = await setupAuditConfigIntegration({
				configPath,
				environment: 'test',
				enableHotReload: true,
				hotReloadConfig: {
					reloadableFields: ['worker.concurrency'],
				},
				createDefaultIfMissing: true,
			})

			const changeSpy = vi.fn()
			changeHandler.onConfigChange('worker.concurrency', changeSpy)

			// Update configuration to trigger change handler
			await manager.updateConfig('worker.concurrency', 8, 'test-user', 'performance tuning')

			expect(changeSpy).toHaveBeenCalledWith(8, expect.any(Number))

			await manager.shutdown()
		})

		it('should handle hot reload events', async () => {
			const { manager, changeHandler } = await setupAuditConfigIntegration({
				configPath,
				environment: 'development',
				enableHotReload: true,
				hotReloadConfig: {
					reloadableFields: ['monitoring.metricsInterval'],
				},
				createDefaultIfMissing: true,
			})

			const hotReloadSpy = vi.fn()
			changeHandler.onConfigChange('monitoring.metricsInterval', hotReloadSpy)

			// Update a hot-reloadable field
			await manager.updateConfig('monitoring.metricsInterval', 15000, 'test-user')

			expect(hotReloadSpy).toHaveBeenCalledWith(15000, expect.any(Number))

			await manager.shutdown()
		})
	})

	describe('AuditConfigChangeHandler', () => {
		let changeHandler: AuditConfigChangeHandler

		beforeEach(() => {
			changeHandler = new AuditConfigChangeHandler()
		})

		it('should register and execute callbacks for configuration changes', async () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			changeHandler.onConfigChange('worker.concurrency', callback1)
			changeHandler.onConfigChange('worker.concurrency', callback2)

			await changeHandler.handleChange('worker.concurrency', 5, 2)

			expect(callback1).toHaveBeenCalledWith(5, 2)
			expect(callback2).toHaveBeenCalledWith(5, 2)
		})

		it('should handle async callbacks', async () => {
			const asyncCallback = vi.fn().mockImplementation(async (newValue, oldValue) => {
				await new Promise((resolve) => setTimeout(resolve, 10))
				return `processed: ${newValue} from ${oldValue}`
			})

			changeHandler.onConfigChange('logging.level', asyncCallback)

			await changeHandler.handleChange('logging.level', 'info', 'debug')

			expect(asyncCallback).toHaveBeenCalledWith('info', 'debug')
		})

		it('should remove callbacks for specific fields', () => {
			const callback = vi.fn()
			changeHandler.onConfigChange('worker.port', callback)

			changeHandler.removeCallbacks('worker.port')

			// Should not execute callback after removal
			changeHandler.handleChange('worker.port', 3002, 3001)
			expect(callback).not.toHaveBeenCalled()
		})

		it('should remove all callbacks', () => {
			const callback1 = vi.fn()
			const callback2 = vi.fn()

			changeHandler.onConfigChange('worker.concurrency', callback1)
			changeHandler.onConfigChange('logging.level', callback2)

			changeHandler.removeAllCallbacks()

			// Should not execute any callbacks after removal
			changeHandler.handleChange('worker.concurrency', 5, 2)
			changeHandler.handleChange('logging.level', 'info', 'debug')

			expect(callback1).not.toHaveBeenCalled()
			expect(callback2).not.toHaveBeenCalled()
		})
	})

	describe('getDefaultConfigPath', () => {
		it('should return default path based on environment', () => {
			process.env.NODE_ENV = 'development'
			const path = getDefaultConfigPath()
			expect(path).toContain('audit-development.json')
		})

		it('should use custom config directory when specified', () => {
			process.env.AUDIT_CONFIG_DIR = '/custom/config'
			const path = getDefaultConfigPath()
			expect(path).toContain('/custom/config')
		})
	})

	describe('createDefaultConfigFile', () => {
		it('should create configuration file with correct environment', async () => {
			await createDefaultConfigFile(configPath, 'staging')

			expect(existsSync(configPath)).toBe(true)
			const configContent = JSON.parse(
				await import('fs/promises').then((fs) => fs.readFile(configPath, 'utf-8'))
			)
			expect(configContent.environment).toBe('staging')
		})

		it('should create directory if it does not exist', async () => {
			const nestedPath = join(tempDir, 'nested', 'config', 'audit.json')
			await createDefaultConfigFile(nestedPath, 'test')

			expect(existsSync(nestedPath)).toBe(true)
		})
	})

	describe('validateEnvironmentConfig', () => {
		it('should validate production configuration requirements', () => {
			const prodConfig = createProductionConfig()
			expect(() => validateEnvironmentConfig(prodConfig)).not.toThrow()
		})

		it('should throw error for production config without integrity verification', () => {
			const prodConfig = createProductionConfig()
			prodConfig.security.enableIntegrityVerification = false

			expect(() => validateEnvironmentConfig(prodConfig)).toThrow(
				'Integrity verification must be enabled in production'
			)
		})

		it('should throw error for production config without SSL', () => {
			const prodConfig = createProductionConfig()
			prodConfig.database.ssl = false

			expect(() => validateEnvironmentConfig(prodConfig)).toThrow(
				'Database SSL must be enabled in production'
			)
		})

		it('should warn about debug logging in production', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const prodConfig = createProductionConfig()
			prodConfig.logging.level = 'debug'

			validateEnvironmentConfig(prodConfig)

			expect(consoleSpy).toHaveBeenCalledWith('Warning: Debug logging is enabled in production')
			consoleSpy.mockRestore()
		})

		it('should throw error when log encryption is enabled without encryption key', () => {
			const prodConfig = createProductionConfig()
			prodConfig.security.enableLogEncryption = true
			prodConfig.security.encryptionKey = undefined

			expect(() => validateEnvironmentConfig(prodConfig)).toThrow(
				'Encryption key is required when log encryption is enabled in production'
			)
		})

		it('should warn about high concurrency in development', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const devConfig = createDevelopmentConfig()
			devConfig.worker.concurrency = 15

			validateEnvironmentConfig(devConfig)

			expect(consoleSpy).toHaveBeenCalledWith(
				'Warning: High concurrency in development environment may impact performance'
			)
			consoleSpy.mockRestore()
		})

		it('should warn about GDPR compliance in test environment', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			const testConfig: AuditConfig = {
				...createDevelopmentConfig(),
				environment: 'test',
				compliance: {
					...createDevelopmentConfig().compliance,
					enableGDPR: true,
				},
			}

			validateEnvironmentConfig(testConfig)

			expect(consoleSpy).toHaveBeenCalledWith(
				'Warning: GDPR compliance is enabled in test environment'
			)
			consoleSpy.mockRestore()
		})
	})

	describe('getConfigSummary', () => {
		it('should return configuration summary with key fields', () => {
			const config = createDevelopmentConfig()
			const summary = getConfigSummary(config)

			expect(summary).toMatchObject({
				environment: 'development',
				version: expect.any(String),
				lastUpdated: expect.any(String),
				worker: {
					concurrency: expect.any(Number),
					queueName: expect.any(String),
					port: expect.any(Number),
				},
				monitoring: {
					enabled: expect.any(Boolean),
					metricsInterval: expect.any(Number),
				},
				security: {
					integrityVerification: expect.any(Boolean),
					eventSigning: expect.any(Boolean),
					logEncryption: expect.any(Boolean),
				},
				compliance: {
					gdpr: expect.any(Boolean),
					retentionDays: expect.any(Number),
					autoArchival: expect.any(Boolean),
				},
			})
		})

		it('should include all expected summary fields', () => {
			const config = createProductionConfig()
			const summary = getConfigSummary(config)

			expect(summary).toHaveProperty('environment')
			expect(summary).toHaveProperty('version')
			expect(summary).toHaveProperty('lastUpdated')
			expect(summary).toHaveProperty('worker')
			expect(summary).toHaveProperty('monitoring')
			expect(summary).toHaveProperty('security')
			expect(summary).toHaveProperty('compliance')
		})
	})
})
