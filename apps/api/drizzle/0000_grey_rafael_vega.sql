CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `apikey` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`start` text,
	`prefix` text,
	`key` text NOT NULL,
	`user_id` text NOT NULL,
	`refill_interval` integer,
	`refill_amount` integer,
	`last_refill_at` integer,
	`enabled` integer DEFAULT true,
	`rate_limit_enabled` integer DEFAULT true,
	`rate_limit_time_window` integer DEFAULT 86400000,
	`rate_limit_max` integer DEFAULT 10,
	`request_count` integer,
	`remaining` integer,
	`last_request` integer,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`permissions` text,
	`metadata` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text,
	`team_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`expires_at` integer NOT NULL,
	`inviter_id` text NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`team_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text,
	`logo` text,
	`created_at` integer NOT NULL,
	`metadata` text,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`impersonated_by` text,
	`active_organization_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`organization_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`lang` text DEFAULT 'en',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`role` text,
	`banned` integer,
	`ban_reason` text,
	`ban_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `careteam` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `careteam_organization_idx` ON `careteam` (`organization`);--> statement-breakpoint
CREATE INDEX `careteam_created_by_idx` ON `careteam` (`created_by`);--> statement-breakpoint
CREATE TABLE `careteam_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `careteam_history_organization_idx` ON `careteam_history` (`organization`);--> statement-breakpoint
CREATE INDEX `careteam_history_created_by_idx` ON `careteam_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `codesystem` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `codesystem_organization_idx` ON `codesystem` (`organization`);--> statement-breakpoint
CREATE INDEX `codesystem_created_by_idx` ON `codesystem` (`created_by`);--> statement-breakpoint
CREATE TABLE `codesystem_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `codesystem_history_organization_idx` ON `codesystem_history` (`organization`);--> statement-breakpoint
CREATE INDEX `codesystem_history_created_by_idx` ON `codesystem_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `implementationguide` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `implementationguide_organization_idx` ON `implementationguide` (`organization`);--> statement-breakpoint
CREATE INDEX `implementationguide_created_by_idx` ON `implementationguide` (`created_by`);--> statement-breakpoint
CREATE TABLE `implementationguide_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `implementationguide_history_organization_idx` ON `implementationguide_history` (`organization`);--> statement-breakpoint
CREATE INDEX `implementationguide_history_created_by_idx` ON `implementationguide_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `list` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `list_organization_idx` ON `list` (`organization`);--> statement-breakpoint
CREATE INDEX `list_created_by_idx` ON `list` (`created_by`);--> statement-breakpoint
CREATE TABLE `list_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `list_history_organization_idx` ON `list_history` (`organization`);--> statement-breakpoint
CREATE INDEX `list_history_created_by_idx` ON `list_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `location` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `location_organization_idx` ON `location` (`organization`);--> statement-breakpoint
CREATE INDEX `location_created_by_idx` ON `location` (`created_by`);--> statement-breakpoint
CREATE TABLE `location_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `location_history_organization_idx` ON `location_history` (`organization`);--> statement-breakpoint
CREATE INDEX `location_history_created_by_idx` ON `location_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `namingsystem` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `namingsystem_organization_idx` ON `namingsystem` (`organization`);--> statement-breakpoint
CREATE INDEX `namingsystem_created_by_idx` ON `namingsystem` (`created_by`);--> statement-breakpoint
CREATE TABLE `namingsystem_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `namingsystem_history_organization_idx` ON `namingsystem_history` (`organization`);--> statement-breakpoint
CREATE INDEX `namingsystem_history_created_by_idx` ON `namingsystem_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `organization_history` (
	`id` text,
	`name` text,
	`slug` text,
	`logo` text,
	`created_at` integer,
	`metadata` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	PRIMARY KEY(`id`, `version`)
);
--> statement-breakpoint
CREATE TABLE `patient` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`user` text,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `patient_user_idx` ON `patient` (`user`);--> statement-breakpoint
CREATE INDEX `patient_organization_idx` ON `patient` (`organization`);--> statement-breakpoint
CREATE INDEX `patient_created_by_idx` ON `patient` (`created_by`);--> statement-breakpoint
CREATE TABLE `patient_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`user` text,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `patient_history_user_idx` ON `patient_history` (`user`);--> statement-breakpoint
CREATE INDEX `patient_history_organization_idx` ON `patient_history` (`organization`);--> statement-breakpoint
CREATE INDEX `patient_history_created_by_idx` ON `patient_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `person` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`user` text,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `person_user_idx` ON `person` (`user`);--> statement-breakpoint
CREATE INDEX `person_organization_idx` ON `person` (`organization`);--> statement-breakpoint
CREATE INDEX `person_created_by_idx` ON `person` (`created_by`);--> statement-breakpoint
CREATE TABLE `person_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`user` text,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `person_history_user_idx` ON `person_history` (`user`);--> statement-breakpoint
CREATE INDEX `person_history_organization_idx` ON `person_history` (`organization`);--> statement-breakpoint
CREATE INDEX `person_history_created_by_idx` ON `person_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `practitioner` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`user` text NOT NULL,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `practitioner_user_idx` ON `practitioner` (`user`);--> statement-breakpoint
CREATE INDEX `practitioner_organization_idx` ON `practitioner` (`organization`);--> statement-breakpoint
CREATE INDEX `practitioner_created_by_idx` ON `practitioner` (`created_by`);--> statement-breakpoint
CREATE TABLE `practitioner_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`user` text NOT NULL,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `practitioner_history_user_idx` ON `practitioner_history` (`user`);--> statement-breakpoint
CREATE INDEX `practitioner_history_organization_idx` ON `practitioner_history` (`organization`);--> statement-breakpoint
CREATE INDEX `practitioner_history_created_by_idx` ON `practitioner_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `relatedperson` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`user` text,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `relatedperson_user_idx` ON `relatedperson` (`user`);--> statement-breakpoint
CREATE INDEX `relatedperson_organization_idx` ON `relatedperson` (`organization`);--> statement-breakpoint
CREATE INDEX `relatedperson_created_by_idx` ON `relatedperson` (`created_by`);--> statement-breakpoint
CREATE TABLE `relatedperson_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`user` text,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `relatedperson_history_user_idx` ON `relatedperson_history` (`user`);--> statement-breakpoint
CREATE INDEX `relatedperson_history_organization_idx` ON `relatedperson_history` (`organization`);--> statement-breakpoint
CREATE INDEX `relatedperson_history_created_by_idx` ON `relatedperson_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `structuredefinition` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `structuredefinition_organization_idx` ON `structuredefinition` (`organization`);--> statement-breakpoint
CREATE INDEX `structuredefinition_created_by_idx` ON `structuredefinition` (`created_by`);--> statement-breakpoint
CREATE TABLE `structuredefinition_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `structuredefinition_history_organization_idx` ON `structuredefinition_history` (`organization`);--> statement-breakpoint
CREATE INDEX `structuredefinition_history_created_by_idx` ON `structuredefinition_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `valueset` (
	`id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0,
	`ts` integer,
	`status` text DEFAULT 'create',
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `valueset_organization_idx` ON `valueset` (`organization`);--> statement-breakpoint
CREATE INDEX `valueset_created_by_idx` ON `valueset` (`created_by`);--> statement-breakpoint
CREATE TABLE `valueset_history` (
	`id` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	`organization` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	PRIMARY KEY(`id`, `version`),
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `valueset_history_organization_idx` ON `valueset_history` (`organization`);--> statement-breakpoint
CREATE INDEX `valueset_history_created_by_idx` ON `valueset_history` (`created_by`);