ALTER TABLE "email_provider" ALTER COLUMN "provider" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "provider" SET DEFAULT 'smtp';--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "smtp_host" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "smtp_user" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "smtp_pass" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "api_key" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "from_name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "email_provider" ALTER COLUMN "from_email" SET DATA TYPE varchar(50);