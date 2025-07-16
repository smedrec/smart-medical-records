DROP INDEX "audit_log_practitioner_id_idx";--> statement-breakpoint
DROP INDEX "audit_log_license_number_idx";--> statement-breakpoint
CREATE INDEX "audit_log_target_resource_type_idx" ON "audit_log" USING btree ("target_resource_type");--> statement-breakpoint
CREATE INDEX "audit_log_target_resource_id_idx" ON "audit_log" USING btree ("target_resource_id");--> statement-breakpoint
CREATE INDEX "audit_log_resource_type_id_idx" ON "audit_log" USING btree ("target_resource_type","target_resource_id");--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "practitioner_id";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "license_number";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "jurisdiction";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "old_status";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "new_status";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "old_role";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "new_role";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "verification_provider";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "api_response";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "ocr_confidence";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "reviewed_by";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "reason";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "ip_address";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "user_agent";--> statement-breakpoint
ALTER TABLE "audit_log" DROP COLUMN "session_id";