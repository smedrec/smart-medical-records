import { z } from 'zod'

export const zEnv = z.object({
	VERSION: z.string().default('unknown'),

	DATABASE_URL: z.string(),
	AUTH_DB_URL: z.string(),
	APP_DB_URL: z.string(),

	BETTER_AUTH_URL: z.string().url(),
	BETTER_AUTH_SECRET: z.string(),

	ALLOWED_ORIGINS: z.string(),

	SMTP_HOST: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string(),
	SMTP_PASSWORD: z.string(),
	FROM_NAME: z.string(),
	FROM_MAIL: z.string(),

	CLOUDFLARE_API_KEY: z.string().optional(),
	CLOUDFLARE_ZONE_ID: z.string().optional(),

	REDIS_URL: z.string(),
	BETTER_AUTH_REDIS_URL: z.string(),

	NAME: z.string(),
	ENVIRONMENT: z.enum(['VITEST', 'development', 'staging', 'production']).default('development'),

	APP_PUBLIC_URL: z.string().url(),

	INFISICAL_URL: z.string().url(),
	KMS_KEY_ID: z.string(),
	INFISICAL_ACCESS_TOKEN: z.string(),
	INFISICAL_CLIENT_ID: z.string(),
	INFISICAL_CLIENT_SECRET: z.string(),
	INFISICAL_ENVIRONMENT: z.enum(['dev', 'stg', 'prod']).default('dev'),
	INFISICAL_PROJECT_ID: z.string(),
})

export type Env = z.infer<typeof zEnv>
