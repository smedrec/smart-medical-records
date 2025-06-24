PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_smart_fhir_client` (
	`organization_id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`scope` text NOT NULL,
	`iss` text NOT NULL,
	`redirect_uri` text,
	`launch_token` text,
	`fhir_base_url` text NOT NULL,
	`code` text,
	`state` text,
	`expected_state` text,
	`pkce_code_verifier` text NOT NULL,
	`provider` text DEFAULT 'development' NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_smart_fhir_client`("organization_id", "client_id", "scope", "iss", "redirect_uri", "launch_token", "fhir_base_url", "code", "state", "expected_state", "pkce_code_verifier", "provider") SELECT "organization_id", "client_id", "scope", "iss", "redirect_uri", "launch_token", "fhir_base_url", "code", "state", "expected_state", "pkce_code_verifier", "provider" FROM `smart_fhir_client`;--> statement-breakpoint
DROP TABLE `smart_fhir_client`;--> statement-breakpoint
ALTER TABLE `__new_smart_fhir_client` RENAME TO `smart_fhir_client`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `client_id_idx` ON `smart_fhir_client` (`client_id`);