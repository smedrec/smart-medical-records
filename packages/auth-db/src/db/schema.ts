import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	lang: text('lang').default('en'),
	personId: text('person_id'),
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by'),
	activeOrganizationId: text('active_organization_id'),
	activeOrganizationRole: text('active_organization_role'),
	smartClientAccessToken: text('smart_client_access_token'),
})

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
})

export const organization = pgTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique(),
	logo: text('logo'),
	createdAt: timestamp('created_at').notNull(),
	metadata: text('metadata'),
})

export const member = pgTable('member', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default('member').notNull(),
	teamId: text('team_id'),
	createdAt: timestamp('created_at').notNull(),
})

export const invitation = pgTable('invitation', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	teamId: text('team_id'),
	status: text('status').default('pending').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	inviterId: text('inviter_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const team = pgTable('team', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at'),
})

export const apikey = pgTable('apikey', {
	id: text('id').primaryKey(),
	name: text('name'),
	start: text('start'),
	prefix: text('prefix'),
	key: text('key').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	refillInterval: integer('refill_interval'),
	refillAmount: integer('refill_amount'),
	lastRefillAt: timestamp('last_refill_at'),
	enabled: boolean('enabled').default(true),
	rateLimitEnabled: boolean('rate_limit_enabled').default(true),
	rateLimitTimeWindow: integer('rate_limit_time_window').default(86400000),
	rateLimitMax: integer('rate_limit_max').default(10),
	requestCount: integer('request_count'),
	remaining: integer('remaining'),
	lastRequest: timestamp('last_request'),
	expiresAt: timestamp('expires_at'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	permissions: text('permissions'),
	metadata: text('metadata'),
})

export const oauthApplication = pgTable('oauth_application', {
	id: text('id').primaryKey(),
	name: text('name'),
	icon: text('icon'),
	metadata: text('metadata'),
	clientId: text('client_id').unique(),
	clientSecret: text('client_secret'),
	redirectURLs: text('redirect_u_r_ls'),
	type: text('type'),
	disabled: boolean('disabled'),
	userId: text('user_id'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
})

export const oauthAccessToken = pgTable('oauth_access_token', {
	id: text('id').primaryKey(),
	accessToken: text('access_token').unique(),
	refreshToken: text('refresh_token').unique(),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
})

export const oauthConsent = pgTable('oauth_consent', {
	id: text('id').primaryKey(),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at'),
	consentGiven: boolean('consent_given'),
})

export const activeOrganization = pgTable(
	'active_organization',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		role: text('role').notNull(),
	},
	(table) => {
		return [
			primaryKey({ columns: [table.userId, table.organizationId] }),
			uniqueIndex('active_organization_user_id_idx').on(table.userId),
		]
	}
)

export const smartFhirClient = pgTable(
	'smart_fhir_client',
	{
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		clientId: text('client_id').notNull(),
		scope: text('scope').notNull(),
		iss: text('iss').notNull(),
		redirectUri: text('redirect_uri'),
		launchToken: text('launch_token'),
		fhirBaseUrl: text('fhir_base_url').notNull(),
		/**code: text('code'), // Authorization code from callback
		state: text('state'), // State from callback
		expectedState: text('expected_state'), // State originally generated and stored by caller
		pkceCodeVerifier: text('pkce_code_verifier').notNull(), // PKCE code verifier stored by caller*/
		provider: text('provider').default('demo').notNull(), // demo azure aws gcp
		environment: text('environment').default('development').notNull(), // development production
		createdBy: text('created_by')
			.notNull()
			.references(() => user.id),
		updatedBy: text('updated_by').references(() => user.id),
		createdAt: timestamp('created_at')
			.notNull()
			.$defaultFn(() => /* @__PURE__ */ new Date()),
		updatedAt: timestamp('updated_at'), // last updated time
	},
	(table) => {
		return [
			primaryKey({ columns: [table.organizationId] }),
			uniqueIndex('client_id_idx').on(table.clientId),
		]
	}
)

type MailProvider = 'smtp' | 'resend' | 'sendgrid'

export const emailProvider = pgTable(
	'email_provider',
	{
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization.id, { onDelete: 'cascade' }),
		provider: varchar('provider', { length: 50 })
			.$type<MailProvider>() // Enforces the type against MailProvider
			.notNull()
			.default('smtp'), // e.g., 'smtp', 'resend', 'sendgrid'
		host: varchar('smtp_host', { length: 100 }),
		port: integer('smtp_port').default(465),
		secure: boolean('smtp_secure').default(true),
		user: varchar('smtp_user', { length: 50 }),
		password: varchar('smtp_pass', { length: 50 }),
		apiKey: varchar('api_key', { length: 255 }),
		fromName: varchar('from_name', { length: 50 }),
		fromEmail: varchar('from_email', { length: 50 }),
	},
	(table) => {
		return [primaryKey({ columns: [table.organizationId] })]
	}
)
