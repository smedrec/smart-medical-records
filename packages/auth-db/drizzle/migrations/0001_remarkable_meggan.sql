CREATE TABLE "email_provider" (
	"organization_id" text NOT NULL,
	"provider_type" text DEFAULT 'nodemailer' NOT NULL,
	"smtp_host" text,
	"smtp_port" integer DEFAULT 465,
	"smtp_secure" boolean DEFAULT true,
	"smtp_user" text,
	"smtp_pass" text,
	"api_key" text,
	CONSTRAINT "email_provider_organization_id_pk" PRIMARY KEY("organization_id")
);
--> statement-breakpoint
ALTER TABLE "email_provider" ADD CONSTRAINT "email_provider_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;