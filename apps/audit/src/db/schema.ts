// Example of how you might import AuditLogEvent if needed for type checking,
// though for schema definition, referencing AuditEventStatus is more direct.
// import type { AuditLogEvent } from '@repo/audit';
// const _typeCheck: AuditLogEvent = {} as typeof auditLog.$inferInsert;
// However, AuditLogEvent has [key: string]: any which makes direct mapping tricky.
// The 'details' jsonb column is intended to capture that.
// The timestamp in AuditLogEvent is a string, while here it's managed by the DB or converted.
// The schema uses defaultNow() for timestamp, but events will come with their own.
// We will use the timestamp from the event when inserting.
// The definition above is for the table structure.
// When inserting, we'll map AuditLogEvent fields to these columns.
// The `timestamp` column will store the string from `AuditLogEvent.timestamp`.
// To ensure this, I will remove .defaultNow() and make sure it's set on insert.

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
// - action: string -> varchar - OK (not null)
// - targetResourceType?: string -> varchar - OK (nullable)
// - targetResourceId?: string -> varchar - OK (nullable)
// - status: AuditEventStatus -> varchar with $type - OK (not null)
// - outcomeDescription?: string -> text - OK (nullable)
// - [key: string]: any -> jsonb 'details' - OK (nullable)
// This looks good.

import { jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import type { AuditEventStatus } from '@repo/audit'

export const auditLog = pgTable('audit_log', {
	id: serial('id').primaryKey(),
	// The timestamp from the AuditLogEvent is an ISO string.
	// Storing it as 'timestamp with time zone' is appropriate.
	// mode: 'string' ensures Drizzle treats it as a string when reading/writing,
	// which is compatible with the ISO string format.
	timestamp: timestamp('timestamp', { withTimezone: true, mode: 'string' }).notNull(),
	ttl: varchar('ttl', { length: 255 }), // Assuming ttl might be a string like "30d" or an interval string
	principalId: varchar('principal_id', { length: 255 }),
	action: varchar('action', { length: 255 }).notNull(),
	targetResourceType: varchar('target_resource_type', { length: 255 }),
	targetResourceId: varchar('target_resource_id', { length: 255 }),
	status: varchar('status', { length: 50 })
		.$type<AuditEventStatus>() // Enforces the type against AuditEventStatus
		.notNull(),
	outcomeDescription: text('outcome_description'),
	// The 'details' column will store any additional properties from the AuditLogEvent
	// that are not explicitly mapped to other columns.
	details: jsonb('details'),
})

// Notes for implementation:
// - When inserting data, the `timestamp` field of the `AuditLogEvent` (which is a string)
//   will be directly inserted into the `timestamp` column of this table.
// - The `[key: string]: any` properties from `AuditLogEvent` (excluding the explicitly mapped ones)
//   should be collected into an object and stored in the `details` jsonb column.
// - Consider adding database indexes on frequently queried columns like `timestamp`,
//   `principal_id`, `action`, or `status` for performance optimization,
//   e.g., CREATE INDEX idx_audit_log_timestamp ON audit_log (timestamp DESC);
//   e.g., CREATE INDEX idx_audit_log_principal_action ON audit_log (principal_id, action);
