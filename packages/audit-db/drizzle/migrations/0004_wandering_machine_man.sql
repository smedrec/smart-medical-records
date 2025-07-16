ALTER TABLE "audit_log" ADD COLUMN "practitioner_id" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "license_number" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "jurisdiction" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "old_status" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "new_status" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "old_role" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "new_role" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "verification_provider" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "api_response" jsonb;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "ocr_confidence" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "reviewed_by" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "session_id" varchar(255);--> statement-breakpoint
ALTER TABLE "audit_log" ADD COLUMN "hash" varchar(64);--> statement-breakpoint
CREATE INDEX "audit_log_practitioner_id_idx" ON "audit_log" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "audit_log_license_number_idx" ON "audit_log" USING btree ("license_number");--> statement-breakpoint
CREATE INDEX "audit_log_status_idx" ON "audit_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_log_hash_idx" ON "audit_log" USING btree ("hash");