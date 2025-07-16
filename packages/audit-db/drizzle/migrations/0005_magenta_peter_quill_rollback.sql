-- Rollback script for migration 0005_magenta_peter_quill.sql
-- This script reverses all changes made in the forward migration

-- Drop new indexes on audit_log table
DROP INDEX IF EXISTS "audit_log_classification_retention_idx";
DROP INDEX IF EXISTS "audit_log_principal_action_idx";
DROP INDEX IF EXISTS "audit_log_timestamp_status_idx";
DROP INDEX IF EXISTS "audit_log_archived_at_idx";
DROP INDEX IF EXISTS "audit_log_retention_policy_idx";
DROP INDEX IF EXISTS "audit_log_data_classification_idx";
DROP INDEX IF EXISTS "audit_log_correlation_id_idx";

-- Drop new columns from audit_log table
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "archived_at";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "processing_latency";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "retention_policy";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "data_classification";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "correlation_id";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "event_version";
ALTER TABLE "audit_log" DROP COLUMN IF EXISTS "hash_algorithm";

-- Drop new tables (this will also drop their indexes and constraints)
DROP TABLE IF EXISTS "audit_retention_policy";
DROP TABLE IF EXISTS "audit_integrity_log";