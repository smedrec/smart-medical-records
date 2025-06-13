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
CREATE INDEX `structuredefinition_history_created_by_idx` ON `structuredefinition_history` (`created_by`);