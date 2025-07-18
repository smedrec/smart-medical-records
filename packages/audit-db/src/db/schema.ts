// Re-evaluating timestamp: The AuditLogEvent provides a string timestamp.
// It's better to store this as pg `timestamp with time zone`.
// Drizzle's `timestamp` with `mode: 'string'` should handle ISO string conversion.
// Removing `.defaultNow()` as the event already has a timestamp.
// The `ttl` field in `AuditLogEvent` is optional and its format isn't specified (e.g., "30d", seconds).
// Storing it as `varchar` for now is flexible.
// The `[key: string]: any` part of `AuditLogEvent` will be mapped to the `details` jsonb field.
// It's important that the insertion logic correctly maps these.
// The `status` column uses .$type<AuditEventStatus>() for type safety with Drizzle.
// Lengths for varchars are set to 255 as a general default, can be adjusted.
// `principalId` is often a UUID or similar identifier.
// `organizationId` is often a UUID or similar identifier.
// `action` could be like 'user.login', 'document.update'.
// `targetResourceType` e.g., 'Patient', 'Order'.
// `targetResourceId` specific ID of the resource.
// `outcomeDescription` free text for what happened.
// `details` for any other structured or unstructured data.
// `id` is a simple serial primary key for the log entry itself.
// `timestamp` from the event is crucial for audit trail accuracy.
// `ttl` is optional, its interpretation/enforcement would be application logic, not DB.
// `status` must be one of the defined AuditEventStatus types.
// `action` is mandatory.
// `principalId` is optional.
// `organizationId` is optional.
// `targetResourceType` and `targetResourceId` are optional.
// `outcomeDescription` is optional.
// `details` is optional.
// The schema reflects these nullability constraints.
// `timestamp` and `action` and `status` are notNull. Others are nullable.
// The `timestamp` in the schema will store the `timestamp` string from the `AuditLogEvent`.
// The `mode: 'string'` for timestamp should correctly handle ISO strings.
// Let's ensure the timestamp field in the schema matches what we expect from AuditLogEvent.
// The event.timestamp is `new Date().toISOString()`.
// This is compatible with `timestamp with time zone`.
// The `defaultNow()` was removed to prioritize the event's timestamp.
// Final check on schema fields vs AuditLogEvent:
// - timestamp: string -> timestamp (string mode) - OK
// - ttl?: string -> varchar - OK (nullable)
// - principalId?: string -> varchar - OK (nullable)
// - organizationId?: string -> varchar - OK (nullable)
// - action: string -> varchar - OK (not null)
// - targetResourceType?: string -> varchar - OK (nullable)
// - targetResourceId?: string -> varchar - OK (nullable)
// - status: AuditEventStatus -> varchar with $type - OK (not null)
// - outcomeDescription?: string -> text - OK (nullable)
// - [key: string]: any -> jsonb 'details' - OK (nullable)
// This looks good.

import { sql } from 'drizzle-orm'
import {
	index,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core'

import type { AuditEventStatus } from '@repo/audit'

/**
 * Data classification levels for audit events
 */
export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI'

export const auditLog = pgTable(
	'audit_log',
	{
		id: serial('id').primaryKey(),
		// The timestamp from the AuditLogEvent is an ISO string.
		// Storing it as 'timestamp with time zone' is appropriate.
		// mode: 'string' ensures Drizzle treats it as a string when reading/writing,
		// which is compatible with the ISO string format.
		timestamp: timestamp('timestamp', { withTimezone: true, mode: 'string' }).notNull(),
		ttl: varchar('ttl', { length: 255 }), // Assuming ttl might be a string like "30d" or an interval string
		principalId: varchar('principal_id', { length: 255 }),
		organizationId: varchar('organization_id', { length: 255 }),
		action: varchar('action', { length: 255 }).notNull(),
		targetResourceType: varchar('target_resource_type', { length: 255 }),
		targetResourceId: varchar('target_resource_id', { length: 255 }),
		status: varchar('status', { length: 50 })
			.$type<AuditEventStatus>() // Enforces the type against AuditEventStatus
			.notNull(),
		outcomeDescription: text('outcome_description'),

		// Cryptographic hash for immutability (Requirement 7.4)
		hash: varchar('hash', { length: 64 }), // SHA-256 hash

		// Enhanced compliance fields (Requirements 1.1, 4.3, 7.1, 7.2)
		hashAlgorithm: varchar('hash_algorithm', { length: 50 }).default('SHA-256'),
		eventVersion: varchar('event_version', { length: 20 }).default('1.0'),
		correlationId: varchar('correlation_id', { length: 255 }),
		dataClassification: varchar('data_classification', { length: 20 })
			.$type<DataClassification>()
			.default('INTERNAL'),
		retentionPolicy: varchar('retention_policy', { length: 50 }).default('standard'),
		processingLatency: integer('processing_latency'), // in milliseconds
		archivedAt: timestamp('archived_at', { withTimezone: true, mode: 'string' }),

		// The 'details' column will store any additional properties from the AuditLogEvent
		// that are not explicitly mapped to other columns.
		details: jsonb('details'),
	},
	(table) => {
		return [
			// Core audit indexes
			index('audit_log_timestamp_idx').on(table.timestamp),
			index('audit_log_principal_id_idx').on(table.principalId),
			index('audit_log_organization_id_idx').on(table.organizationId),
			index('audit_log_action_idx').on(table.action),
			index('audit_log_status_idx').on(table.status),
			index('audit_log_hash_idx').on(table.hash),
			index('audit_log_target_resource_type_idx').on(table.targetResourceType),
			index('audit_log_target_resource_id_idx').on(table.targetResourceId),

			// New compliance indexes for optimized queries (Requirements 7.1, 7.2)
			index('audit_log_correlation_id_idx').on(table.correlationId),
			index('audit_log_data_classification_idx').on(table.dataClassification),
			index('audit_log_retention_policy_idx').on(table.retentionPolicy),
			index('audit_log_archived_at_idx').on(table.archivedAt),

			// Composite indexes for common compliance queries
			index('audit_log_timestamp_status_idx').on(table.timestamp, table.status),
			index('audit_log_principal_action_idx').on(table.principalId, table.action),
			index('audit_log_classification_retention_idx').on(
				table.dataClassification,
				table.retentionPolicy
			),
			index('audit_log_resource_type_id_idx').on(table.targetResourceType, table.targetResourceId),
		]
	}
)

/**
 * Audit integrity log table for tracking verification attempts and results
 * Requirement 1.1: Cryptographic integrity verification tracking
 */
export const auditIntegrityLog = pgTable(
	'audit_integrity_log',
	{
		id: serial('id').primaryKey(),
		auditLogId: integer('audit_log_id')
			.references(() => auditLog.id)
			.notNull(),
		verificationTimestamp: timestamp('verification_timestamp', {
			withTimezone: true,
			mode: 'string',
		})
			.notNull()
			.defaultNow(),
		verificationStatus: varchar('verification_status', { length: 20 }).notNull(), // 'success', 'failure', 'tampered'
		verificationDetails: jsonb('verification_details'), // Additional context about verification
		verifiedBy: varchar('verified_by', { length: 255 }), // System or user that performed verification
		hashVerified: varchar('hash_verified', { length: 64 }), // The hash that was verified
		expectedHash: varchar('expected_hash', { length: 64 }), // The expected hash value
	},
	(table) => {
		return [
			index('audit_integrity_log_audit_log_id_idx').on(table.auditLogId),
			index('audit_integrity_log_verification_timestamp_idx').on(table.verificationTimestamp),
			index('audit_integrity_log_verification_status_idx').on(table.verificationStatus),
			index('audit_integrity_log_verified_by_idx').on(table.verifiedBy),
		]
	}
)

/**
 * Audit retention policy table for managing data lifecycle
 * Requirements 4.3, 7.1: Data retention management and compliance
 */
export const auditRetentionPolicy = pgTable(
	'audit_retention_policy',
	{
		id: serial('id').primaryKey(),
		policyName: varchar('policy_name', { length: 100 }).unique().notNull(),
		retentionDays: integer('retention_days').notNull(), // How long to keep active data
		archiveAfterDays: integer('archive_after_days'), // When to archive (optional)
		deleteAfterDays: integer('delete_after_days'), // When to permanently delete (optional)
		dataClassification: varchar('data_classification', { length: 20 })
			.$type<DataClassification>()
			.notNull(), // Which data classification this policy applies to
		description: text('description'), // Human-readable description of the policy
		isActive: varchar('is_active', { length: 10 }).default('true'), // Whether policy is currently active
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.defaultNow(),
		createdBy: varchar('created_by', { length: 255 }), // Who created this policy
	},
	(table) => {
		return [
			index('audit_retention_policy_policy_name_idx').on(table.policyName),
			index('audit_retention_policy_data_classification_idx').on(table.dataClassification),
			index('audit_retention_policy_is_active_idx').on(table.isActive),
			index('audit_retention_policy_created_at_idx').on(table.createdAt),
		]
	}
)

/**
 * Error log table for structured error logging and analysis
 * Requirement 11: Comprehensive error handling and logging
 */
export const errorLog = pgTable(
	'error_log',
	{
		id: varchar('id', { length: 36 }).primaryKey(), // UUID
		category: varchar('category', { length: 50 }).notNull(),
		severity: varchar('severity', { length: 20 }).notNull(),
		code: varchar('code', { length: 20 }).notNull(),
		message: text('message').notNull(),
		component: varchar('component', { length: 100 }).notNull(),
		operation: varchar('operation', { length: 100 }).notNull(),
		correlationId: varchar('correlation_id', { length: 255 }).notNull(),
		userId: varchar('user_id', { length: 255 }),
		sessionId: varchar('session_id', { length: 255 }),
		requestId: varchar('request_id', { length: 255 }),
		retryable: varchar('retryable', { length: 10 }).notNull(), // 'true' or 'false'
		aggregationKey: varchar('aggregation_key', { length: 255 }).notNull(),
		context: jsonb('context'), // Environment, metadata, stack trace
		troubleshooting: jsonb('troubleshooting'), // Possible causes and suggested actions
		timestamp: timestamp('timestamp', { withTimezone: true, mode: 'string' }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.defaultNow(),
	},
	(table) => {
		return [
			index('error_log_timestamp_idx').on(table.timestamp),
			index('error_log_category_idx').on(table.category),
			index('error_log_severity_idx').on(table.severity),
			index('error_log_component_idx').on(table.component),
			index('error_log_correlation_id_idx').on(table.correlationId),
			index('error_log_aggregation_key_idx').on(table.aggregationKey),
			index('error_log_user_id_idx').on(table.userId),
			index('error_log_created_at_idx').on(table.createdAt),
			// Composite indexes for common queries
			index('error_log_category_severity_idx').on(table.category, table.severity),
			index('error_log_component_timestamp_idx').on(table.component, table.timestamp),
		]
	}
)

/**
 * Error aggregation table for tracking error patterns and trends
 * Requirement 11: Error aggregation and analysis for system health monitoring
 */
export const errorAggregation = pgTable(
	'error_aggregation',
	{
		aggregationKey: varchar('aggregation_key', { length: 255 }).primaryKey(),
		category: varchar('category', { length: 50 }).notNull(),
		severity: varchar('severity', { length: 20 }).notNull(),
		count: integer('count').notNull().default(0),
		errorRate: varchar('error_rate', { length: 20 }).notNull().default('0'), // Stored as string for precision
		trend: varchar('trend', { length: 20 }).notNull().default('STABLE'),
		firstOccurrence: timestamp('first_occurrence', {
			withTimezone: true,
			mode: 'string',
		}).notNull(),
		lastOccurrence: timestamp('last_occurrence', { withTimezone: true, mode: 'string' }).notNull(),
		affectedComponents: jsonb('affected_components').notNull().default('[]'), // Array of component names
		affectedUsers: jsonb('affected_users').notNull().default('[]'), // Array of user IDs
		samples: jsonb('samples').notNull().default('[]'), // Sample error instances
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.defaultNow(),
	},
	(table) => {
		return [
			index('error_aggregation_category_idx').on(table.category),
			index('error_aggregation_severity_idx').on(table.severity),
			index('error_aggregation_count_idx').on(table.count),
			index('error_aggregation_trend_idx').on(table.trend),
			index('error_aggregation_first_occurrence_idx').on(table.firstOccurrence),
			index('error_aggregation_last_occurrence_idx').on(table.lastOccurrence),
			index('error_aggregation_updated_at_idx').on(table.updatedAt),
			// Composite indexes for analysis queries
			index('error_aggregation_category_count_idx').on(table.category, table.count),
			index('error_aggregation_severity_count_idx').on(table.severity, table.count),
		]
	}
)

/**
 * Archive storage table for compressed audit data
 * Requirements 4.4, 7.3: Archive data compression and storage optimization
 */
export const archiveStorage = pgTable(
	'archive_storage',
	{
		id: varchar('id', { length: 255 }).primaryKey(), // Archive ID
		metadata: jsonb('metadata').notNull(), // Archive metadata including compression info
		data: text('data').notNull(), // Compressed archive data (base64 encoded)
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.defaultNow(),
		retrievedCount: integer('retrieved_count').notNull().default(0),
		lastRetrievedAt: timestamp('last_retrieved_at', { withTimezone: true, mode: 'string' }),
	},
	(table) => {
		return [
			index('archive_storage_created_at_idx').on(table.createdAt),
			index('archive_storage_retrieved_count_idx').on(table.retrievedCount),
			index('archive_storage_last_retrieved_at_idx').on(table.lastRetrievedAt),
			// JSONB indexes for metadata queries
			index('archive_storage_retention_policy_idx').on(
				sql`(${table.metadata}->>'retentionPolicy')`
			),
			index('archive_storage_data_classification_idx').on(
				sql`(${table.metadata}->>'dataClassification')`
			),
			index('archive_storage_date_range_start_idx').on(
				sql`((${table.metadata}->>'dateRange')::jsonb->>'start')`
			),
			index('archive_storage_date_range_end_idx').on(
				sql`((${table.metadata}->>'dateRange')::jsonb->>'end')`
			),
		]
	}
)

// Notes for implementation:
// - When inserting data, the `timestamp` field of the `AuditLogEvent` (which is a string)
//   will be directly inserted into the `timestamp` column of this table.
// - The `[key: string]: any` properties from `AuditLogEvent` (excluding the explicitly mapped ones)
//   should be collected into an object and stored in the `details` jsonb column.
// - The audit_integrity_log table tracks all verification attempts for audit events
// - The audit_retention_policy table defines lifecycle management rules for different data classifications
// - The error_log table stores structured error information for analysis and troubleshooting
// - The error_aggregation table tracks error patterns and trends for system health monitoring
// - The archive_storage table stores compressed audit data for long-term retention
// - Consider adding database indexes on frequently queried columns for performance optimization
