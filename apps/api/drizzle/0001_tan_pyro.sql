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
CREATE TABLE `organization_history` (
	`id` text,
	`name` text NOT NULL,
	`slug` text,
	`logo` text,
	`created_at` integer NOT NULL,
	`metadata` text,
	`version` integer,
	`ts` integer,
	`status` text,
	`resource` blob,
	PRIMARY KEY(`id`, `version`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_history_slug_unique` ON `organization_history` (`slug`);--> statement-breakpoint
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
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_patient_history` (
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
INSERT INTO `__new_patient_history`("id", "version", "ts", "status", "resource", "user", "organization", "created_by", "updated_by") SELECT "id", "version", "ts", "status", "resource", "user", "organization", "created_by", "updated_by" FROM `patient_history`;--> statement-breakpoint
DROP TABLE `patient_history`;--> statement-breakpoint
ALTER TABLE `__new_patient_history` RENAME TO `patient_history`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `patient_history_user_idx` ON `patient_history` (`user`);--> statement-breakpoint
CREATE INDEX `patient_history_organization_idx` ON `patient_history` (`organization`);--> statement-breakpoint
CREATE INDEX `patient_history_created_by_idx` ON `patient_history` (`created_by`);--> statement-breakpoint
CREATE TABLE `__new_practitioner_history` (
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
INSERT INTO `__new_practitioner_history`("id", "version", "ts", "status", "resource", "user", "organization", "created_by", "updated_by") SELECT "id", "version", "ts", "status", "resource", "user", "organization", "created_by", "updated_by" FROM `practitioner_history`;--> statement-breakpoint
DROP TABLE `practitioner_history`;--> statement-breakpoint
ALTER TABLE `__new_practitioner_history` RENAME TO `practitioner_history`;--> statement-breakpoint
CREATE INDEX `practitioner_history_user_idx` ON `practitioner_history` (`user`);--> statement-breakpoint
CREATE INDEX `practitioner_history_organization_idx` ON `practitioner_history` (`organization`);--> statement-breakpoint
CREATE INDEX `practitioner_history_created_by_idx` ON `practitioner_history` (`created_by`);--> statement-breakpoint
ALTER TABLE `organization` ADD `version` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `organization` ADD `ts` integer;--> statement-breakpoint
ALTER TABLE `organization` ADD `status` text DEFAULT 'create';--> statement-breakpoint
ALTER TABLE `organization` ADD `resource` blob;