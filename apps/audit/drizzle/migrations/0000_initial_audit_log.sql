CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"ttl" varchar(255),
	"principal_id" varchar(255),
	"action" varchar(255) NOT NULL,
	"target_resource_type" varchar(255),
	"target_resource_id" varchar(255),
	"status" varchar(50) NOT NULL,
	"outcome_description" text,
	"details" jsonb
);
-- Consider adding indexes for frequently queried columns:
-- CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON "audit_log" ("timestamp" DESC);
-- CREATE INDEX IF NOT EXISTS idx_audit_log_principal_action ON "audit_log" ("principal_id","action");
-- CREATE INDEX IF NOT EXISTS idx_audit_log_status ON "audit_log" ("status");
