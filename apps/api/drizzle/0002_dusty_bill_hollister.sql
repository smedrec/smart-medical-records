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