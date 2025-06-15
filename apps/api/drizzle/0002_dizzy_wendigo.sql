ALTER TABLE "r4"."person" ALTER COLUMN "tenant" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auth"."tenant" ADD COLUMN "organization_id" text;--> statement-breakpoint
ALTER TABLE "auth"."user" ADD COLUMN "person_id" text;