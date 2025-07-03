ALTER TABLE "smart_fhir_client" DROP CONSTRAINT "smart_fhir_client_organization_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "smart_fhir_client" DROP CONSTRAINT "smart_fhir_client_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "smart_fhir_client" DROP CONSTRAINT "smart_fhir_client_updated_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "smart_fhir_client" DROP CONSTRAINT "smart_fhir_client_organization_id_pk";--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ADD PRIMARY KEY ("organization_id");--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "organization_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "scope" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "iss" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "iss" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "redirect_uri" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "fhir_base_url" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "fhir_base_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "provider" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "provider" SET DEFAULT 'demo';--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "environment" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "environment" SET DEFAULT 'development';--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "created_by" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ALTER COLUMN "updated_by" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ADD COLUMN "client_secret" text;--> statement-breakpoint
ALTER TABLE "smart_fhir_client" ADD COLUMN "private_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "smart_fhir_client" DROP COLUMN "launch_token";