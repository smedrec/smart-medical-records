CREATE TYPE "public"."document_verification_status" AS ENUM('pending', 'verified', 'failed', 'manual_review');--> statement-breakpoint
CREATE TYPE "public"."ocr_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'practitioner', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."verification_attempt_type" AS ENUM('api', 'ocr', 'manual');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'failed', 'manual_review', 'expired');--> statement-breakpoint
CREATE TABLE "license_certificate" (
	"id" text PRIMARY KEY NOT NULL,
	"practitioner_id" text NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_path" varchar(500) NOT NULL,
	"uploaded_at" timestamp NOT NULL,
	"ocr_status" "ocr_status" DEFAULT 'pending' NOT NULL,
	"ocr_result" jsonb,
	"verification_status" "document_verification_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practitioner" (
	"id" text PRIMARY KEY NOT NULL,
	"license_number" varchar(100) NOT NULL,
	"jurisdiction" varchar(100) NOT NULL,
	"license_type" varchar(100) NOT NULL,
	"license_expiry_date" date,
	"verification_status" "verification_status" DEFAULT 'pending' NOT NULL,
	"verified_at" timestamp,
	"verified_by" text,
	"specialties" text[],
	"credentials" text[],
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"practitioner_id" text NOT NULL,
	"attempt_type" "verification_attempt_type" NOT NULL,
	"status" "verification_status" NOT NULL,
	"api_provider" varchar(100),
	"api_response" jsonb,
	"ocr_confidence" numeric(5, 4),
	"reviewed_by" text,
	"notes" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "license_certificate" ADD CONSTRAINT "license_certificate_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner" ADD CONSTRAINT "practitioner_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioner" ADD CONSTRAINT "practitioner_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempt" ADD CONSTRAINT "verification_attempt_practitioner_id_practitioner_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempt" ADD CONSTRAINT "verification_attempt_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "practitioner_license_jurisdiction_idx" ON "practitioner" USING btree ("license_number","jurisdiction");