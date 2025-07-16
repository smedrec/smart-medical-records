-- Rollback script for migration 0006_unknown_siren.sql
-- This script reverses the removal of practitioner-specific fields

-- Re-add practitioner-specific columns
ALTER TABLE "audit_log" ADD COLUMN "practitioner_id" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "license_number" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "jurisdiction" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "old_status" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "new_status" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "old_role" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "new_role" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "verification_provider" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "api_response" jsonb;
ALTER TABLE "audit_log" ADD COLUMN "ocr_confidence" numeric(5, 4);
ALTER TABLE "audit_log" ADD COLUMN "reviewed_by" varchar(255);
ALTER TABLE "audit_log" ADD COLUMN "reason" text;
ALTER TABLE "audit_log" ADD COLUMN "ip_address" varchar(45);
ALTER TABLE "audit_log" ADD COLUMN "user_agent" text;
ALTER TABLE "audit_log" ADD COLUMN "session_id" varchar(255);

-- Drop new indexes
DROP INDEX IF EXISTS "audit_log_resource_type_id_idx";
DROP INDEX IF EXISTS "audit_log_target_resource_id_idx";
DROP INDEX IF EXISTS "audit_log_target_resource_type_idx";

-- Re-create practitioner-specific indexes
CREATE INDEX "audit_log_practitioner_id_idx" ON "audit_log" USING btree ("practitioner_id");
CREATE INDEX "audit_log_license_number_idx" ON "audit_log" USING btree ("license_number");