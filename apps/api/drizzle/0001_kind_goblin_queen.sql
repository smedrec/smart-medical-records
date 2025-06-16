CREATE TABLE `active_organization` (
	`user_id` text,
	`organization_id` text,
	PRIMARY KEY(`user_id`, `organization_id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `active_organization_user_id_idx` ON `active_organization` (`user_id`);