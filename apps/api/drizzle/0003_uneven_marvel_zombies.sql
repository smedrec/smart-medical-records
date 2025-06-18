ALTER TABLE `active_organization` ADD `role` text NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `active_organization_role` text;