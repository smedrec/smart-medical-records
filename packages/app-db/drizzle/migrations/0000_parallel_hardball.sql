CREATE TABLE "note" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"title" varchar(100),
	"markdown" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE INDEX "note_title_idx" ON "note" USING btree ("title");