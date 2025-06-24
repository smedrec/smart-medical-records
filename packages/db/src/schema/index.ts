import { integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: integer('banned', { mode: 'boolean' }),
	banReason: text('ban_reason'),
	banExpires: integer('ban_expires', { mode: 'timestamp' }),
	lang: text('lang').default('en'),
	personId: text('person_id'),
})

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by'),
	activeOrganizationId: text('active_organization_id'),
	activeOrganizationRole: text('active_organization_role'),
})

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
})

export const organization = sqliteTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique(),
	logo: text('logo'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	metadata: text('metadata'),
})

export const member = sqliteTable('member', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default('member').notNull(),
	teamId: text('team_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const invitation = sqliteTable('invitation', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	teamId: text('team_id'),
	status: text('status').default('pending').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	inviterId: text('inviter_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const team = sqliteTable('team', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const apikey = sqliteTable('apikey', {
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
	lastRefillAt: integer('last_refill_at', { mode: 'timestamp' }),
	enabled: integer('enabled', { mode: 'boolean' }).default(true),
	rateLimitEnabled: integer('rate_limit_enabled', { mode: 'boolean' }).default(true),
	rateLimitTimeWindow: integer('rate_limit_time_window').default(86400000),
	rateLimitMax: integer('rate_limit_max').default(10),
	requestCount: integer('request_count'),
	remaining: integer('remaining'),
	lastRequest: integer('last_request', { mode: 'timestamp' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	permissions: text('permissions'),
	metadata: text('metadata'),
})

export const oauthApplication = sqliteTable('oauth_application', {
	id: text('id').primaryKey(),
	name: text('name'),
	icon: text('icon'),
	metadata: text('metadata'),
	clientId: text('client_id').unique(),
	clientSecret: text('client_secret'),
	redirectURLs: text('redirect_u_r_ls'),
	type: text('type'),
	disabled: integer('disabled', { mode: 'boolean' }),
	userId: text('user_id'),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const oauthAccessToken = sqliteTable('oauth_access_token', {
	id: text('id').primaryKey(),
	accessToken: text('access_token').unique(),
	refreshToken: text('refresh_token').unique(),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const oauthConsent = sqliteTable('oauth_consent', {
	id: text('id').primaryKey(),
	clientId: text('client_id'),
	userId: text('user_id'),
	scopes: text('scopes'),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' }),
	consentGiven: integer('consent_given', { mode: 'boolean' }),
})

export const activeOrganization = sqliteTable(
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

export const smartFhirClient = sqliteTable(
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
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => /* @__PURE__ */ new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' }), // last updated time
	},
	(table) => {
		return [
			primaryKey({ columns: [table.organizationId] }),
			uniqueIndex('client_id_idx').on(table.clientId),
		]
	}
)
