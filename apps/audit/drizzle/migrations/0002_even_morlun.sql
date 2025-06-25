ALTER TABLE "audit_log" ADD COLUMN "organization_id" varchar(255);--> statement-breakpoint
CREATE INDEX "audit_log_timestamp_idx" ON "audit_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "audit_log_principal_id_idx" ON "audit_log" USING btree ("principal_id");--> statement-breakpoint
CREATE INDEX "audit_log_organization_id_idx" ON "audit_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_log_principal_action_idx" ON "audit_log" USING btree ("action");