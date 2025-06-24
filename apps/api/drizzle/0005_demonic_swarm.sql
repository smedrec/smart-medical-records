CREATE TABLE `smart_fhir_client` (
	`organization_id` text NOT NULL,
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
	PRIMARY KEY(`organization_id`, `client_id`),
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `client_id_idx` ON `smart_fhir_client` (`client_id`);