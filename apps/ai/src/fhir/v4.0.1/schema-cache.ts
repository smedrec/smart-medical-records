import { z } from 'zod/v4'

export const ZodNever = z.never()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const schemaCache = new Map<string, z.ZodType<any>>()
const creationState = new Map<string, 'creating' | 'created'>()

// Helper function to create a stable key from dependencies
function createCacheKey(key: string, dependencies?: unknown): string {
	if (dependencies === undefined) {
		return key
	}

	// Create a stable representation of the dependency
	let depString: string

	if (Array.isArray(dependencies)) {
		// Handle arrays by serializing each element
		const arrayElements = dependencies.map((item, index) => {
			if (item === undefined) {
				return `undefined@${index}`
			} else if (item === null) {
				return `null@${index}`
			} else if (item && typeof item === 'object' && 'def' in item) {
				// For Zod types, use their type information
				return `${(item as any).def?.typeName ?? 'unknown'}@${index}`
			} else if (
				typeof item === 'string' ||
				typeof item === 'number' ||
				typeof item === 'boolean'
			) {
				return `${String(item)}@${index}`
			} else {
				return `unknown@${index}`
			}
		})
		depString = `[${arrayElements.join(',')}]`
	} else if (dependencies && typeof dependencies === 'object' && 'def' in dependencies) {
		// For Zod types, use their type information
		depString = (dependencies as any).def?.typeName ?? 'unknown'
	} else if (
		typeof dependencies === 'string' ||
		typeof dependencies === 'number' ||
		typeof dependencies === 'boolean'
	) {
		depString = String(dependencies)
	} else {
		depString = 'unknown'
	}

	return `${key}|${depString}`
}

// Function overloads
export function getCachedSchema<T>(key: string, factory: () => z.ZodType<T>): z.ZodType<T>
export function getCachedSchema<T>(
	key: string,
	dependencies: unknown,
	factory: () => z.ZodType<T>
): z.ZodType<T>
export function getCachedSchema<T>(
	key: string,
	factoryOrDependencies: (() => z.ZodType<T>) | unknown,
	factory?: () => z.ZodType<T>
): z.ZodType<T> {
	let actualFactory: () => z.ZodType<T>
	let dependencies: unknown

	if (typeof factoryOrDependencies === 'function' && factory === undefined) {
		// Called with (key, factory)
		actualFactory = factoryOrDependencies as () => z.ZodType<T>
		dependencies = undefined
	} else {
		// Called with (key, dependencies, factory)
		dependencies = factoryOrDependencies
		actualFactory = factory!
	}

	const cacheKey = createCacheKey(key, dependencies)

	// If schema is already created, return it
	if (schemaCache.has(cacheKey) && creationState.get(cacheKey) === 'created') {
		return schemaCache.get(cacheKey)!
	}

	// If we're already creating this schema (circular reference detected)
	if (creationState.get(cacheKey) === 'creating') {
		// Return a lazy reference that will resolve once creation is complete
		if (!schemaCache.has(cacheKey)) {
			// Create and store the lazy schema for this circular reference
			const lazySchema = z.lazy(() => {
				const actualSchema = schemaCache.get(cacheKey)
				if (!actualSchema || creationState.get(cacheKey) !== 'created') {
					throw new Error(
						`Circular reference detected for schema ${cacheKey} but actual schema not yet created`
					)
				}
				return actualSchema
			})
			schemaCache.set(cacheKey, lazySchema)
		}
		return schemaCache.get(cacheKey)!
	}

	// Mark as creating to detect circular references
	creationState.set(cacheKey, 'creating')

	try {
		// Create the actual schema
		const actualSchema = actualFactory()

		// Store the actual schema
		schemaCache.set(cacheKey, actualSchema)
		creationState.set(cacheKey, 'created')

		return actualSchema
	} catch (error) {
		// Clean up on error
		schemaCache.delete(cacheKey)
		creationState.delete(cacheKey)
		throw error
	}
}

export function clearSchemaCache(): void {
	schemaCache.clear()
	creationState.clear()
}

export function getSchemaCacheStats() {
	return {
		schemaCache: schemaCache.size,
		creationState: creationState.size,
	}
}
