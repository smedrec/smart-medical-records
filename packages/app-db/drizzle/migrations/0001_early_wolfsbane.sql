ALTER TABLE "note" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "user_id" varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "organization_id" varchar(32) NOT NULL;--> statement-breakpoint
CREATE INDEX "note_user_id_idx" ON "note" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "note_organization_id_idx" ON "note" USING btree ("organization_id");