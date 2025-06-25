ALTER TABLE "audit_log" ALTER COLUMN "timestamp" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "audit_log" ALTER COLUMN "ttl" SET DATA TYPE varchar(255);