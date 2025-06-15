CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "r4";
--> statement-breakpoint
CREATE TYPE "r4"."resource_status" AS ENUM('create', 'updated', 'deleted', 'recreated');--> statement-breakpoint
CREATE TYPE "r4"."visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."apikey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true,
	"rate_limit_enabled" boolean DEFAULT true,
	"rate_limit_time_window" integer DEFAULT 86400000,
	"rate_limit_max" integer DEFAULT 10,
	"request_count" integer,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "auth"."invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"team_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"team_id" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth"."tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"organization_id" text,
	CONSTRAINT "tenant_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"lang" text DEFAULT 'en',
	"person_id" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "r4"."careteam" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."careteam_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "careteam_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."codesystem" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"visibility" "r4"."visibility" DEFAULT 'public',
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."codesystem_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "codesystem_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."implementationguide" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"visibility" "r4"."visibility" DEFAULT 'public',
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."implementationguide_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "implementationguide_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."list" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"visibility" "r4"."visibility" DEFAULT 'public',
	"resource" jsonb,
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."list_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "list_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."location" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."location_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "location_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."namingsystem" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"visibility" "r4"."visibility" DEFAULT 'public',
	"resource" jsonb,
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."namingsystem_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "namingsystem_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."organization" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."organization_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "organization_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."patient" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"user" text,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."patient_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"user" text,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "patient_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."person" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"user" text,
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."person_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"user" text,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "person_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."practitioner" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"user" text NOT NULL,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."practitioner_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"user" text,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "practitioner_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."relatedperson" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"user" text,
	"tenant" text NOT NULL,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."relatedperson_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"user" text,
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "relatedperson_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."structuredefinition" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"visibility" "r4"."visibility" DEFAULT 'public',
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."structuredefinition_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "structuredefinition_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
CREATE TABLE "r4"."valueset" (
	"id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 0,
	"ts" timestamp,
	"status" "r4"."resource_status" DEFAULT 'create',
	"resource" jsonb,
	"visibility" "r4"."visibility" DEFAULT 'public',
	"tenant" text,
	"created_by" text NOT NULL,
	"updated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "r4"."valueset_history" (
	"id" text,
	"version" integer,
	"ts" timestamp,
	"status" "r4"."resource_status",
	"resource" jsonb,
	"visibility" "r4"."visibility",
	"tenant" text,
	"created_by" text,
	"updated_by" text,
	CONSTRAINT "valueset_history_id_version_pk" PRIMARY KEY("id","version")
);
--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."apikey" ADD CONSTRAINT "apikey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_organization_id_tenant_id_fk" FOREIGN KEY ("organization_id") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_organization_id_tenant_id_fk" FOREIGN KEY ("organization_id") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."team" ADD CONSTRAINT "team_organization_id_tenant_id_fk" FOREIGN KEY ("organization_id") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam" ADD CONSTRAINT "careteam_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam" ADD CONSTRAINT "careteam_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam" ADD CONSTRAINT "careteam_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam_history" ADD CONSTRAINT "careteam_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam_history" ADD CONSTRAINT "careteam_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."careteam_history" ADD CONSTRAINT "careteam_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem" ADD CONSTRAINT "codesystem_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem" ADD CONSTRAINT "codesystem_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem" ADD CONSTRAINT "codesystem_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem_history" ADD CONSTRAINT "codesystem_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem_history" ADD CONSTRAINT "codesystem_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."codesystem_history" ADD CONSTRAINT "codesystem_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide" ADD CONSTRAINT "implementationguide_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide" ADD CONSTRAINT "implementationguide_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide" ADD CONSTRAINT "implementationguide_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide_history" ADD CONSTRAINT "implementationguide_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide_history" ADD CONSTRAINT "implementationguide_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."implementationguide_history" ADD CONSTRAINT "implementationguide_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list" ADD CONSTRAINT "list_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list" ADD CONSTRAINT "list_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list" ADD CONSTRAINT "list_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list_history" ADD CONSTRAINT "list_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list_history" ADD CONSTRAINT "list_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."list_history" ADD CONSTRAINT "list_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location" ADD CONSTRAINT "location_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location" ADD CONSTRAINT "location_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location" ADD CONSTRAINT "location_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location_history" ADD CONSTRAINT "location_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location_history" ADD CONSTRAINT "location_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."location_history" ADD CONSTRAINT "location_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem" ADD CONSTRAINT "namingsystem_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem" ADD CONSTRAINT "namingsystem_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem" ADD CONSTRAINT "namingsystem_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem_history" ADD CONSTRAINT "namingsystem_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem_history" ADD CONSTRAINT "namingsystem_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."namingsystem_history" ADD CONSTRAINT "namingsystem_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization" ADD CONSTRAINT "organization_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization" ADD CONSTRAINT "organization_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization" ADD CONSTRAINT "organization_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization_history" ADD CONSTRAINT "organization_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization_history" ADD CONSTRAINT "organization_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."organization_history" ADD CONSTRAINT "organization_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient" ADD CONSTRAINT "patient_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient" ADD CONSTRAINT "patient_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient" ADD CONSTRAINT "patient_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient" ADD CONSTRAINT "patient_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient_history" ADD CONSTRAINT "patient_history_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient_history" ADD CONSTRAINT "patient_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient_history" ADD CONSTRAINT "patient_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."patient_history" ADD CONSTRAINT "patient_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person" ADD CONSTRAINT "person_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person" ADD CONSTRAINT "person_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person" ADD CONSTRAINT "person_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person" ADD CONSTRAINT "person_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person_history" ADD CONSTRAINT "person_history_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person_history" ADD CONSTRAINT "person_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person_history" ADD CONSTRAINT "person_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."person_history" ADD CONSTRAINT "person_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner" ADD CONSTRAINT "practitioner_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner" ADD CONSTRAINT "practitioner_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner" ADD CONSTRAINT "practitioner_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner" ADD CONSTRAINT "practitioner_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner_history" ADD CONSTRAINT "practitioner_history_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner_history" ADD CONSTRAINT "practitioner_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner_history" ADD CONSTRAINT "practitioner_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."practitioner_history" ADD CONSTRAINT "practitioner_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson" ADD CONSTRAINT "relatedperson_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson" ADD CONSTRAINT "relatedperson_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson" ADD CONSTRAINT "relatedperson_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson" ADD CONSTRAINT "relatedperson_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson_history" ADD CONSTRAINT "relatedperson_history_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson_history" ADD CONSTRAINT "relatedperson_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson_history" ADD CONSTRAINT "relatedperson_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."relatedperson_history" ADD CONSTRAINT "relatedperson_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition" ADD CONSTRAINT "structuredefinition_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition" ADD CONSTRAINT "structuredefinition_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition" ADD CONSTRAINT "structuredefinition_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition_history" ADD CONSTRAINT "structuredefinition_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition_history" ADD CONSTRAINT "structuredefinition_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."structuredefinition_history" ADD CONSTRAINT "structuredefinition_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset" ADD CONSTRAINT "valueset_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset" ADD CONSTRAINT "valueset_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset" ADD CONSTRAINT "valueset_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset_history" ADD CONSTRAINT "valueset_history_tenant_tenant_id_fk" FOREIGN KEY ("tenant") REFERENCES "auth"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset_history" ADD CONSTRAINT "valueset_history_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r4"."valueset_history" ADD CONSTRAINT "valueset_history_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "careteam_tenant_idx" ON "r4"."careteam" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "careteam_created_by_idx" ON "r4"."careteam" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "careteam_history_tenant_idx" ON "r4"."careteam_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "careteam_history_created_by_idx" ON "r4"."careteam_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "codesystem_tenant_idx" ON "r4"."codesystem" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "codesystem_created_by_idx" ON "r4"."codesystem" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "codesystem_history_tenant_idx" ON "r4"."codesystem_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "codesystem_history_created_by_idx" ON "r4"."codesystem_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "implementationguide_tenant_idx" ON "r4"."implementationguide" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "implementationguide_created_by_idx" ON "r4"."implementationguide" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "implementationguide_history_tenant_idx" ON "r4"."implementationguide_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "implementationguide_history_created_by_idx" ON "r4"."implementationguide_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "list_tenant_idx" ON "r4"."list" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "list_created_by_idx" ON "r4"."list" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "list_history_tenant_idx" ON "r4"."list_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "list_history_created_by_idx" ON "r4"."list_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "location_tenant_idx" ON "r4"."location" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "location_created_by_idx" ON "r4"."location" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "location_history_tenant_idx" ON "r4"."location_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "location_history_created_by_idx" ON "r4"."location_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "namingsystem_tenant_idx" ON "r4"."namingsystem" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "namingsystem_created_by_idx" ON "r4"."namingsystem" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "namingsystem_history_tenant_idx" ON "r4"."namingsystem_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "namingsystem_history_created_by_idx" ON "r4"."namingsystem_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "organization_tenant_idx" ON "r4"."organization" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "organization_created_by_idx" ON "r4"."organization" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "organization_history_tenant_idx" ON "r4"."organization_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "organization_history_created_by_idx" ON "r4"."organization_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "patient_user_idx" ON "r4"."patient" USING btree ("user");--> statement-breakpoint
CREATE INDEX "patient_tenant_idx" ON "r4"."patient" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "patient_created_by_idx" ON "r4"."patient" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "patient_history_user_idx" ON "r4"."patient_history" USING btree ("user");--> statement-breakpoint
CREATE INDEX "patient_history_tenant_idx" ON "r4"."patient_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "patient_history_created_by_idx" ON "r4"."patient_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "person_user_idx" ON "r4"."person" USING btree ("user");--> statement-breakpoint
CREATE INDEX "person_tenant_idx" ON "r4"."person" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "person_created_by_idx" ON "r4"."person" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "person_history_user_idx" ON "r4"."person_history" USING btree ("user");--> statement-breakpoint
CREATE INDEX "person_history_tenant_idx" ON "r4"."person_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "person_history_created_by_idx" ON "r4"."person_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "practitioner_user_idx" ON "r4"."practitioner" USING btree ("user");--> statement-breakpoint
CREATE INDEX "practitioner_tenant_idx" ON "r4"."practitioner" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "practitioner_created_by_idx" ON "r4"."practitioner" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "practitioner_history_user_idx" ON "r4"."practitioner_history" USING btree ("user");--> statement-breakpoint
CREATE INDEX "practitioner_history_tenant_idx" ON "r4"."practitioner_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "practitioner_history_created_by_idx" ON "r4"."practitioner_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "relatedperson_user_idx" ON "r4"."relatedperson" USING btree ("user");--> statement-breakpoint
CREATE INDEX "relatedperson_tenant_idx" ON "r4"."relatedperson" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "relatedperson_created_by_idx" ON "r4"."relatedperson" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "relatedperson_history_user_idx" ON "r4"."relatedperson_history" USING btree ("user");--> statement-breakpoint
CREATE INDEX "relatedperson_history_tenant_idx" ON "r4"."relatedperson_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "relatedperson_history_created_by_idx" ON "r4"."relatedperson_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "structuredefinition_tenant_idx" ON "r4"."structuredefinition" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "structuredefinition_created_by_idx" ON "r4"."structuredefinition" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "structuredefinition_history_tenant_idx" ON "r4"."structuredefinition_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "structuredefinition_history_created_by_idx" ON "r4"."structuredefinition_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "valueset_tenant_idx" ON "r4"."valueset" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "valueset_created_by_idx" ON "r4"."valueset" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "valueset_history_tenant_idx" ON "r4"."valueset_history" USING btree ("tenant");--> statement-breakpoint
CREATE INDEX "valueset_history_created_by_idx" ON "r4"."valueset_history" USING btree ("created_by");