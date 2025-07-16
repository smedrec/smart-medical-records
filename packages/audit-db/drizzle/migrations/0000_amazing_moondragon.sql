CREATE TABLE "audit_integrity_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_log_id" integer NOT NULL,
	"verification_timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"verification_status" varchar(20) NOT NULL,
	"verification_details" jsonb,
	"verified_by" varchar(255),
	"hash_verified" varchar(64),
	"expected_hash" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"ttl" varchar(255),
	"principal_id" varchar(255),
	"organization_id" varchar(255),
	"action" varchar(255) NOT NULL,
	"target_resource_type" varchar(255),
	"target_resource_id" varchar(255),
	"status" varchar(50) NOT NULL,
	"outcome_description" text,
	"hash" varchar(64),
	"hash_algorithm" varchar(50) DEFAULT 'SHA-256',
	"event_version" varchar(20) DEFAULT '1.0',
	"correlation_id" varchar(255),
	"data_classification" varchar(20) DEFAULT 'INTERNAL',
	"retention_policy" varchar(50) DEFAULT 'standard',
	"processing_latency" integer,
	"archived_at" timestamp with time zone,
	"details" jsonb
);
--> statement-breakpoint
CREATE TABLE "audit_retention_policy" (
	"id" serial PRIMARY KEY NOT NULL,
	"policy_name" varchar(100) NOT NULL,
	"retention_days" integer NOT NULL,
	"archive_after_days" integer,
	"delete_after_days" integer,
	"data_classification" varchar(20) NOT NULL,
	"description" text,
	"is_active" varchar(10) DEFAULT 'true',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255),
	CONSTRAINT "audit_retention_policy_policy_name_unique" UNIQUE("policy_name")
);
--> statement-breakpoint
ALTER TABLE "audit_integrity_log" ADD CONSTRAINT "audit_integrity_log_audit_log_id_audit_log_id_fk" FOREIGN KEY ("audit_log_id") REFERENCES "public"."audit_log"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_integrity_log_audit_log_id_idx" ON "audit_integrity_log" USING btree ("audit_log_id");--> statement-breakpoint
CREATE INDEX "audit_integrity_log_verification_timestamp_idx" ON "audit_integrity_log" USING btree ("verification_timestamp");--> statement-breakpoint
CREATE INDEX "audit_integrity_log_verification_status_idx" ON "audit_integrity_log" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "audit_integrity_log_verified_by_idx" ON "audit_integrity_log" USING btree ("verified_by");--> statement-breakpoint
CREATE INDEX "audit_log_timestamp_idx" ON "audit_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "audit_log_principal_id_idx" ON "audit_log" USING btree ("principal_id");--> statement-breakpoint
CREATE INDEX "audit_log_organization_id_idx" ON "audit_log" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_status_idx" ON "audit_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_log_hash_idx" ON "audit_log" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "audit_log_target_resource_type_idx" ON "audit_log" USING btree ("target_resource_type");--> statement-breakpoint
CREATE INDEX "audit_log_target_resource_id_idx" ON "audit_log" USING btree ("target_resource_id");--> statement-breakpoint
CREATE INDEX "audit_log_correlation_id_idx" ON "audit_log" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "audit_log_data_classification_idx" ON "audit_log" USING btree ("data_classification");--> statement-breakpoint
CREATE INDEX "audit_log_retention_policy_idx" ON "audit_log" USING btree ("retention_policy");--> statement-breakpoint
CREATE INDEX "audit_log_archived_at_idx" ON "audit_log" USING btree ("archived_at");--> statement-breakpoint
CREATE INDEX "audit_log_timestamp_status_idx" ON "audit_log" USING btree ("timestamp","status");--> statement-breakpoint
CREATE INDEX "audit_log_principal_action_idx" ON "audit_log" USING btree ("principal_id","action");--> statement-breakpoint
CREATE INDEX "audit_log_classification_retention_idx" ON "audit_log" USING btree ("data_classification","retention_policy");--> statement-breakpoint
CREATE INDEX "audit_log_resource_type_id_idx" ON "audit_log" USING btree ("target_resource_type","target_resource_id");--> statement-breakpoint
CREATE INDEX "audit_retention_policy_policy_name_idx" ON "audit_retention_policy" USING btree ("policy_name");--> statement-breakpoint
CREATE INDEX "audit_retention_policy_data_classification_idx" ON "audit_retention_policy" USING btree ("data_classification");--> statement-breakpoint
CREATE INDEX "audit_retention_policy_is_active_idx" ON "audit_retention_policy" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "audit_retention_policy_created_at_idx" ON "audit_retention_policy" USING btree ("created_at");