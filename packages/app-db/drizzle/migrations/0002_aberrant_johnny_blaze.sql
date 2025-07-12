CREATE TABLE "newsletter" (
	"email" varchar(100) NOT NULL,
	"list" varchar(32) NOT NULL,
	"status" varchar(12) DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "newsletter_email_list_pk" PRIMARY KEY("email","list")
);
--> statement-breakpoint
CREATE INDEX "newsletter_email_idx" ON "newsletter" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_list_idx" ON "newsletter" USING btree ("list");--> statement-breakpoint
CREATE INDEX "newsletter_status_idx" ON "newsletter" USING btree ("status");