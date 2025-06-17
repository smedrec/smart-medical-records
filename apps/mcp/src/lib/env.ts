import { z } from 'zod'

export const zEnv = z.object({
	VERSION: z.string().default('unknown'),

	BETTER_AUTH_URL: z.string().url(),
	BETTER_AUTH_SECRET: z.string(),

	CERBOS_HTTP_API_URL: z.string().url(),

	ALLOWED_ORIGINS: z.string(),

	SMTP_HOST: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string(),
	SMTP_PASSWORD: z.string(),
	FROM_NAME: z.string(),
	FROM_MAIL: z.string(),

	CLOUDFLARE_API_KEY: z.string().optional(),
	CLOUDFLARE_ZONE_ID: z.string().optional(),

	NAME: z.string(),
	ENVIRONMENT: z.enum(['VITEST', 'development', 'staging', 'production']).default('development'),

	APP_PUBLIC_URL: z.string().url(),
})

export type Env = z.infer<typeof zEnv>
