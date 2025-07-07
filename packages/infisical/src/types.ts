/**
 * Defines the options required for initializing the Infisical client,
 * including authentication credentials and the target Infisical instance.
 *
 * @remarks
 * While `environment` and `projectId` are listed here, they are primarily configured
 * using `Infisical.WithConfig()` or overridden in specific method calls (`getSecret`, `allSecrets`).
 * The `Infisical.init()` method itself does not directly use `environment` and `projectId`
 * from this options object for its core authentication logic, but they are included
 * for completeness if a user wishes to pass a single configuration object around.
 * The SDK's `InfisicalSDK` constructor also takes an optional `settings` object which
 * could include these, but this package abstracts that for specific operations.
 */
interface InfisicalClientOptions {
	/** The URL of your Infisical instance (e.g., "https://app.infisical.com"). */
	siteUrl: string
	/** The Client ID for Universal Auth. */
	clientId: string
	/** The Client Secret for Universal Auth. */
	clientSecret: string
}

/**
 * Defines the project-specific options for fetching secrets.
 */
interface ProjectOptions {
	/**
	 * The default secret environment to operate on (e.g., "dev", "prod").
	 */
	environment: 'dev' | 'prod' | string // Allow string for flexibility, SDK might support more
	/**
	 * The default Infisical Project ID.
	 */
	projectId: string
}

export type { InfisicalClientOptions, ProjectOptions }
