/**
 * Configuration management system for the audit service
 * Provides environment-specific configuration, validation, hot-reloading, and secure storage
 */

import { createCipheriv, createDecipheriv, createHash, pbkdf2, randomBytes, scrypt } from 'crypto'
import { EventEmitter } from 'events'
import { existsSync, unwatchFile, watchFile } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { promisify } from 'util'

import { validateConfiguration } from './validator.js'

import type {
	AuditConfig,
	ConfigChangeEvent,
	HotReloadConfig,
	SecureStorageConfig,
} from './types.js'

const pbkdf2Async = promisify(pbkdf2)
const scryptAsync = promisify(scrypt)

/**
 * Configuration manager with hot-reloading, versioning, and secure storage
 */
export class ConfigurationManager extends EventEmitter {
	private config: AuditConfig | null = null
	private configPath: string
	private hotReloadConfig: HotReloadConfig
	private secureStorageConfig: SecureStorageConfig
	private changeHistory: ConfigChangeEvent[] = []
	private watcherActive = false
	private encryptionKey: Buffer | null = null

	constructor(
		configPath: string,
		hotReloadConfig: HotReloadConfig = {
			enabled: false,
			reloadableFields: [],
			checkInterval: 30000,
		},
		secureStorageConfig?: SecureStorageConfig
	) {
		super()
		this.configPath = configPath
		this.hotReloadConfig = hotReloadConfig
		this.secureStorageConfig = secureStorageConfig || {
			enabled: false,
			algorithm: 'AES-256-GCM',
			kdf: 'PBKDF2',
			salt: randomBytes(32).toString('hex'),
			iterations: 100000,
		}
	}

	/**
	 * Initialize the configuration manager
	 */
	async initialize(): Promise<void> {
		try {
			// Initialize encryption key if secure storage is enabled
			if (this.secureStorageConfig.enabled) {
				await this.initializeEncryption()
			}

			// Load initial configuration
			await this.loadConfiguration()

			// Start hot reloading if enabled
			if (this.hotReloadConfig.enabled) {
				await this.startHotReloading()
			}

			this.emit('initialized', this.config)
		} catch (error) {
			this.emit('error', error)
			throw error
		}
	}

	/**
	 * Get current configuration
	 */
	getConfig(): AuditConfig {
		if (!this.config) {
			throw new Error('Configuration not initialized. Call initialize() first.')
		}
		return { ...this.config }
	}

	/**
	 * Get specific configuration value by path
	 */
	getConfigValue<T = any>(path: string): T {
		if (!this.config) {
			throw new Error('Configuration not initialized')
		}

		const keys = path.split('.')
		let value: any = this.config

		for (const key of keys) {
			if (value && typeof value === 'object' && key in value) {
				value = value[key]
			} else {
				throw new Error(`Configuration path '${path}' not found`)
			}
		}

		return value as T
	}

	/**
	 * Update configuration value
	 */
	async updateConfig(
		path: string,
		newValue: any,
		changedBy: string,
		reason?: string
	): Promise<void> {
		if (!this.config) {
			throw new Error('Configuration not initialized')
		}

		const keys = path.split('.')
		const lastKey = keys.pop()!
		let target: any = this.config

		// Navigate to the parent object
		for (const key of keys) {
			if (target && typeof target === 'object' && key in target) {
				target = target[key]
			} else {
				throw new Error(`Configuration path '${path}' not found`)
			}
		}

		const previousValue = target[lastKey]

		// Validate the new configuration
		const testConfig = { ...this.config }
		const testTarget = this.getNestedObject(testConfig, keys)
		testTarget[lastKey] = newValue

		await validateConfiguration(testConfig)

		// Apply the change
		target[lastKey] = newValue
		this.config.lastUpdated = new Date().toISOString()
		this.config.version = this.generateVersion()

		// Record the change
		const changeEvent: ConfigChangeEvent = {
			id: randomBytes(16).toString('hex'),
			timestamp: new Date().toISOString(),
			field: path,
			previousValue,
			newValue,
			changedBy,
			reason,
			environment: this.config.environment,
		}

		this.changeHistory.push(changeEvent)

		// Persist the configuration
		await this.saveConfiguration()

		// Emit change event
		this.emit('configChanged', changeEvent)

		// Check if hot reload is supported for this field
		if (this.hotReloadConfig.enabled && this.isHotReloadable(path)) {
			this.emit('hotReload', { path, newValue, previousValue })
		}
	}

	/**
	 * Get configuration change history
	 */
	getChangeHistory(limit?: number): ConfigChangeEvent[] {
		const history = [...this.changeHistory].reverse()
		return limit ? history.slice(0, limit) : history
	}

	/**
	 * Get configuration version
	 */
	getVersion(): string {
		return this.config?.version || '1.0.0'
	}

	/**
	 * Reload configuration from file
	 */
	async reloadConfiguration(): Promise<void> {
		const previousConfig = this.config ? { ...this.config } : null
		await this.loadConfiguration()

		if (previousConfig && this.config) {
			const changes = this.detectChanges(previousConfig, this.config)
			if (changes.length > 0) {
				this.emit('configReloaded', { changes, config: this.config })
			}
		}
	}

	/**
	 * Validate current configuration
	 */
	async validateCurrentConfig(): Promise<void> {
		if (!this.config) {
			throw new Error('Configuration not initialized')
		}
		await validateConfiguration(this.config)
	}

	/**
	 * Export configuration (with sensitive data masked)
	 */
	exportConfig(includeSensitive = false): Partial<AuditConfig> {
		if (!this.config) {
			throw new Error('Configuration not initialized')
		}

		const exported = { ...this.config }

		if (!includeSensitive) {
			// Mask sensitive fields
			if (exported.redis?.url) {
				exported.redis.url = this.maskSensitiveUrl(exported.redis.url)
			}
			if (exported.database?.url) {
				exported.database.url = this.maskSensitiveUrl(exported.database.url)
			}
			if (exported.security?.encryptionKey) {
				exported.security.encryptionKey = '***MASKED***'
			}
		}

		return exported
	}

	/**
	 * Shutdown the configuration manager
	 */
	async shutdown(): Promise<void> {
		if (this.watcherActive) {
			await this.stopHotReloading()
		}
		this.removeAllListeners()
	}

	/**
	 * Load configuration from file
	 */
	private async loadConfiguration(): Promise<void> {
		try {
			if (!existsSync(this.configPath)) {
				throw new Error(`Configuration file not found: ${this.configPath}`)
			}

			let configData: string
			if (this.secureStorageConfig.enabled) {
				configData = await this.decryptConfigFile()
			} else {
				configData = await readFile(this.configPath, 'utf-8')
			}

			const parsedConfig = JSON.parse(configData) as AuditConfig

			// Validate configuration
			await validateConfiguration(parsedConfig)

			// Set version if not present
			if (!parsedConfig.version) {
				parsedConfig.version = this.generateVersion()
			}

			// Set last updated if not present
			if (!parsedConfig.lastUpdated) {
				parsedConfig.lastUpdated = new Date().toISOString()
			}

			this.config = parsedConfig
		} catch (error) {
			throw new Error(
				`Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		}
	}

	/**
	 * Save configuration to file
	 */
	private async saveConfiguration(): Promise<void> {
		if (!this.config) {
			throw new Error('No configuration to save')
		}

		try {
			const configData = JSON.stringify(this.config, null, 2)

			if (this.secureStorageConfig.enabled) {
				await this.encryptConfigFile(configData)
			} else {
				await writeFile(this.configPath, configData, 'utf-8')
			}
		} catch (error) {
			throw new Error(
				`Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
			)
		}
	}

	/**
	 * Initialize encryption for secure storage
	 */
	private async initializeEncryption(): Promise<void> {
		const password = process.env.AUDIT_CONFIG_PASSWORD
		if (!password) {
			throw new Error('AUDIT_CONFIG_PASSWORD environment variable required for secure storage')
		}

		const salt = Buffer.from(this.secureStorageConfig.salt, 'hex')

		if (this.secureStorageConfig.kdf === 'PBKDF2') {
			this.encryptionKey = await pbkdf2Async(
				password,
				salt,
				this.secureStorageConfig.iterations,
				32,
				'sha256'
			)
		} else if (this.secureStorageConfig.kdf === 'scrypt') {
			this.encryptionKey = (await scryptAsync(password, salt, 32)) as Buffer
		}
	}

	/**
	 * Encrypt configuration file
	 */
	private async encryptConfigFile(data: string): Promise<void> {
		if (!this.encryptionKey) {
			throw new Error('Encryption key not initialized')
		}

		const iv = randomBytes(16)
		const cipher = createCipheriv(this.secureStorageConfig.algorithm, this.encryptionKey, iv)

		let encrypted = cipher.update(data, 'utf8', 'hex')
		encrypted += cipher.final('hex')

		const encryptedData: any = {
			algorithm: this.secureStorageConfig.algorithm,
			iv: iv.toString('hex'),
			data: encrypted,
		}

		// Add authentication tag for GCM mode
		if (this.secureStorageConfig.algorithm === 'AES-256-GCM') {
			encryptedData.authTag = (cipher as any).getAuthTag().toString('hex')
		}

		await writeFile(this.configPath, JSON.stringify(encryptedData), 'utf-8')
	}

	/**
	 * Decrypt configuration file
	 */
	private async decryptConfigFile(): Promise<string> {
		if (!this.encryptionKey) {
			throw new Error('Encryption key not initialized')
		}

		const encryptedData = JSON.parse(await readFile(this.configPath, 'utf-8'))
		const iv = Buffer.from(encryptedData.iv, 'hex')
		const decipher = createDecipheriv(encryptedData.algorithm, this.encryptionKey, iv)

		// Set authentication tag for GCM mode
		if (this.secureStorageConfig.algorithm === 'AES-256-GCM' && encryptedData.authTag) {
			;(decipher as any).setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
		}

		let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8')
		decrypted += decipher.final('utf8')

		return decrypted
	}

	/**
	 * Start hot reloading
	 */
	private async startHotReloading(): Promise<void> {
		if (this.watcherActive) {
			return
		}

		this.watcherActive = true

		watchFile(this.configPath, { interval: this.hotReloadConfig.checkInterval }, async () => {
			try {
				await this.reloadConfiguration()
			} catch (error) {
				this.emit(
					'error',
					new Error(
						`Hot reload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
					)
				)
			}
		})

		this.emit('hotReloadStarted')
	}

	/**
	 * Stop hot reloading
	 */
	private async stopHotReloading(): Promise<void> {
		if (!this.watcherActive) {
			return
		}

		unwatchFile(this.configPath)
		this.watcherActive = false
		this.emit('hotReloadStopped')
	}

	/**
	 * Check if a field supports hot reloading
	 */
	private isHotReloadable(path: string): boolean {
		return this.hotReloadConfig.reloadableFields.includes(path)
	}

	/**
	 * Generate a new version string
	 */
	private generateVersion(): string {
		const timestamp = Date.now()
		const hash = createHash('sha256').update(timestamp.toString()).digest('hex').substring(0, 8)
		return `${new Date().toISOString().split('T')[0]}-${hash}`
	}

	/**
	 * Get nested object by path
	 */
	private getNestedObject(obj: any, keys: string[]): any {
		let target = obj
		for (const key of keys) {
			if (target && typeof target === 'object' && key in target) {
				target = target[key]
			} else {
				throw new Error(`Path not found: ${keys.join('.')}`)
			}
		}
		return target
	}

	/**
	 * Detect changes between two configurations
	 */
	private detectChanges(
		oldConfig: AuditConfig,
		newConfig: AuditConfig
	): Array<{ path: string; oldValue: any; newValue: any }> {
		const changes: Array<{ path: string; oldValue: any; newValue: any }> = []

		const compareObjects = (obj1: any, obj2: any, path = ''): void => {
			for (const key in obj2) {
				const currentPath = path ? `${path}.${key}` : key

				if (!(key in obj1)) {
					changes.push({ path: currentPath, oldValue: undefined, newValue: obj2[key] })
				} else if (
					typeof obj2[key] === 'object' &&
					obj2[key] !== null &&
					!Array.isArray(obj2[key])
				) {
					compareObjects(obj1[key], obj2[key], currentPath)
				} else if (obj1[key] !== obj2[key]) {
					changes.push({ path: currentPath, oldValue: obj1[key], newValue: obj2[key] })
				}
			}
		}

		compareObjects(oldConfig, newConfig)
		return changes
	}

	/**
	 * Mask sensitive URLs
	 */
	private maskSensitiveUrl(url: string): string {
		try {
			const urlObj = new URL(url)
			if (urlObj.password) {
				urlObj.password = '***'
			}
			if (urlObj.username) {
				urlObj.username = '***'
			}
			return urlObj.toString()
		} catch {
			return '***MASKED***'
		}
	}
}

/**
 * Default configuration manager instance
 */
let defaultManager: ConfigurationManager | null = null

/**
 * Get or create the default configuration manager
 */
export function getConfigurationManager(
	configPath?: string,
	hotReloadConfig?: HotReloadConfig,
	secureStorageConfig?: SecureStorageConfig
): ConfigurationManager {
	if (!defaultManager) {
		if (!configPath) {
			throw new Error('Configuration path required for first initialization')
		}
		defaultManager = new ConfigurationManager(configPath, hotReloadConfig, secureStorageConfig)
	}
	return defaultManager
}

/**
 * Initialize the default configuration manager
 */
export async function initializeConfig(
	configPath: string,
	hotReloadConfig?: HotReloadConfig,
	secureStorageConfig?: SecureStorageConfig
): Promise<ConfigurationManager> {
	const manager = getConfigurationManager(configPath, hotReloadConfig, secureStorageConfig)
	await manager.initialize()
	return manager
}
