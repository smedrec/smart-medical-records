PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_case_study` (
	`id` text PRIMARY KEY NOT NULL,
	`patient` text NOT NULL,
	`title` text NOT NULL,
	`care_team` text,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`patient`) REFERENCES `patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`care_team`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_case_study`("id", "patient", "title", "care_team", "created_by", "updated_by", "created_at", "updated_at") SELECT "id", "patient", "title", "care_team", "created_by", "updated_by", "created_at", "updated_at" FROM `case_study`;--> statement-breakpoint
DROP TABLE `case_study`;--> statement-breakpoint
ALTER TABLE `__new_case_study` RENAME TO `case_study`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `case_study_patient_idx` ON `case_study` (`patient`);--> statement-breakpoint
CREATE INDEX `case_study_created_by_idx` ON `case_study` (`created_by`);