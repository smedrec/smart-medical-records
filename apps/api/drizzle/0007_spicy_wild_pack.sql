ALTER TABLE `smart_fhir_client` ADD `created_by` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `smart_fhir_client` ADD `updated_by` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `smart_fhir_client` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `smart_fhir_client` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `smart_fhir_client` DROP COLUMN `code`;--> statement-breakpoint
ALTER TABLE `smart_fhir_client` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `smart_fhir_client` DROP COLUMN `expected_state`;--> statement-breakpoint
ALTER TABLE `smart_fhir_client` DROP COLUMN `pkce_code_verifier`;