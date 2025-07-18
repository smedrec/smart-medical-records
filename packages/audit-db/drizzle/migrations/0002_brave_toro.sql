CREATE TABLE "archive_storage" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"metadata" jsonb NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"retrieved_count" integer DEFAULT 0 NOT NULL,
	"last_retrieved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "archive_storage_created_at_idx" ON "archive_storage" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "archive_storage_retrieved_count_idx" ON "archive_storage" USING btree ("retrieved_count");--> statement-breakpoint
CREATE INDEX "archive_storage_last_retrieved_at_idx" ON "archive_storage" USING btree ("last_retrieved_at");--> statement-breakpoint
CREATE INDEX "archive_storage_retention_policy_idx" ON "archive_storage" USING btree (("metadata"->>'retentionPolicy'));--> statement-breakpoint
CREATE INDEX "archive_storage_data_classification_idx" ON "archive_storage" USING btree (("metadata"->>'dataClassification'));--> statement-breakpoint
CREATE INDEX "archive_storage_date_range_start_idx" ON "archive_storage" USING btree ((("metadata"->>'dateRange')::jsonb->>'start'));--> statement-breakpoint
CREATE INDEX "archive_storage_date_range_end_idx" ON "archive_storage" USING btree ((("metadata"->>'dateRange')::jsonb->>'end'));