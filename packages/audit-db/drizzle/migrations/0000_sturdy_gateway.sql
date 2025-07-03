CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"ttl" varchar,
	"principal_id" varchar(255),
	"action" varchar(255) NOT NULL,
	"target_resource_type" varchar(255),
	"target_resource_id" varchar(255),
	"status" varchar(50) NOT NULL,
	"outcome_description" text,
	"details" jsonb
);
