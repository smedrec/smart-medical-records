CREATE TABLE "error_aggregation" (
	"aggregation_key" varchar(255) PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"error_rate" varchar(20) DEFAULT '0' NOT NULL,
	"trend" varchar(20) DEFAULT 'STABLE' NOT NULL,
	"first_occurrence" timestamp with time zone NOT NULL,
	"last_occurrence" timestamp with time zone NOT NULL,
	"affected_components" jsonb DEFAULT '[]' NOT NULL,
	"affected_users" jsonb DEFAULT '[]' NOT NULL,
	"samples" jsonb DEFAULT '[]' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "error_log" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"code" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"component" varchar(100) NOT NULL,
	"operation" varchar(100) NOT NULL,
	"correlation_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"request_id" varchar(255),
	"retryable" varchar(10) NOT NULL,
	"aggregation_key" varchar(255) NOT NULL,
	"context" jsonb,
	"troubleshooting" jsonb,
	"timestamp" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "error_aggregation_category_idx" ON "error_aggregation" USING btree ("category");--> statement-breakpoint
CREATE INDEX "error_aggregation_severity_idx" ON "error_aggregation" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "error_aggregation_count_idx" ON "error_aggregation" USING btree ("count");--> statement-breakpoint
CREATE INDEX "error_aggregation_trend_idx" ON "error_aggregation" USING btree ("trend");--> statement-breakpoint
CREATE INDEX "error_aggregation_first_occurrence_idx" ON "error_aggregation" USING btree ("first_occurrence");--> statement-breakpoint
CREATE INDEX "error_aggregation_last_occurrence_idx" ON "error_aggregation" USING btree ("last_occurrence");--> statement-breakpoint
CREATE INDEX "error_aggregation_updated_at_idx" ON "error_aggregation" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "error_aggregation_category_count_idx" ON "error_aggregation" USING btree ("category","count");--> statement-breakpoint
CREATE INDEX "error_aggregation_severity_count_idx" ON "error_aggregation" USING btree ("severity","count");--> statement-breakpoint
CREATE INDEX "error_log_timestamp_idx" ON "error_log" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "error_log_category_idx" ON "error_log" USING btree ("category");--> statement-breakpoint
CREATE INDEX "error_log_severity_idx" ON "error_log" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "error_log_component_idx" ON "error_log" USING btree ("component");--> statement-breakpoint
CREATE INDEX "error_log_correlation_id_idx" ON "error_log" USING btree ("correlation_id");--> statement-breakpoint
CREATE INDEX "error_log_aggregation_key_idx" ON "error_log" USING btree ("aggregation_key");--> statement-breakpoint
CREATE INDEX "error_log_user_id_idx" ON "error_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "error_log_created_at_idx" ON "error_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "error_log_category_severity_idx" ON "error_log" USING btree ("category","severity");--> statement-breakpoint
CREATE INDEX "error_log_component_timestamp_idx" ON "error_log" USING btree ("component","timestamp");