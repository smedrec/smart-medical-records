DROP INDEX "audit_log_principal_action_idx";--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");