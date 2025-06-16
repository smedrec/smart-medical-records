PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_active_organization` (
	`user_id` text NOT NULL,
	`organization_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `organization_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_active_organization`("user_id", "organization_id") SELECT "user_id", "organization_id" FROM `active_organization`;--> statement-breakpoint
DROP TABLE `active_organization`;--> statement-breakpoint
ALTER TABLE `__new_active_organization` RENAME TO `active_organization`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `active_organization_user_id_idx` ON `active_organization` (`user_id`);