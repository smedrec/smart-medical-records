CREATE TABLE `case_study` (
	`id` text PRIMARY KEY NOT NULL,
	`patient` text NOT NULL,
	`title` text NOT NULL,
	`care_team` text NOT NULL,
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
CREATE INDEX `case_study_patient_idx` ON `case_study` (`patient`);--> statement-breakpoint
CREATE INDEX `case_study_created_by_idx` ON `case_study` (`created_by`);--> statement-breakpoint
CREATE TABLE `case_study_conclusion` (
	`id` text PRIMARY KEY NOT NULL,
	`case_study` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`private_description` text,
	`concluded_at` integer,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_study_conclusion_case_study_idx` ON `case_study_conclusion` (`case_study`);--> statement-breakpoint
CREATE INDEX `case_study_conclusion_created_by_idx` ON `case_study_conclusion` (`created_by`);--> statement-breakpoint
CREATE INDEX `case_study_conclusion_created_at_idx` ON `case_study_conclusion` (`created_at`);--> statement-breakpoint
CREATE TABLE `case_study_conclusion_file` (
	`case_study_conclusion` text NOT NULL,
	`file` text NOT NULL,
	`primary_file` integer DEFAULT false,
	`index` integer,
	`created_by` text NOT NULL,
	`created_at` integer,
	PRIMARY KEY(`case_study_conclusion`, `file`),
	FOREIGN KEY (`case_study_conclusion`) REFERENCES `case_study_conclusion`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file`) REFERENCES `file`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `case_study_conclusion_file_case_study_conclusion_idx` ON `case_study_conclusion_file` (`case_study_conclusion`);--> statement-breakpoint
CREATE INDEX `case_study_conclusion_file_file_idx` ON `case_study_conclusion_file` (`file`);--> statement-breakpoint
CREATE TABLE `case_study_relation` (
	`case_study` text NOT NULL,
	`related_case_study` text NOT NULL,
	`description` text,
	`created_at` integer,
	`updated_at` integer,
	PRIMARY KEY(`case_study`, `related_case_study`),
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `case_study_therapist` (
	`case_study` text NOT NULL,
	`therapist` text NOT NULL,
	`primary_therapist` integer DEFAULT false,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	PRIMARY KEY(`case_study`, `therapist`),
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`therapist`) REFERENCES `therapist`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `case_study_therapist_case_study_idx` ON `case_study_therapist` (`case_study`);--> statement-breakpoint
CREATE INDEX `case_study_therapist_idx` ON `case_study_therapist` (`therapist`);--> statement-breakpoint
CREATE INDEX `case_study_therapist_primary_idx` ON `case_study_therapist` (`primary_therapist`);--> statement-breakpoint
CREATE TABLE `case_study_treatment` (
	`id` text PRIMARY KEY NOT NULL,
	`case_study` text NOT NULL,
	`external` integer DEFAULT false,
	`started_at` integer,
	`ended_at` integer,
	`title` text NOT NULL,
	`description` text,
	`private_description` text,
	`score` integer,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `case_study_treatment_case_study_idx` ON `case_study_treatment` (`case_study`);--> statement-breakpoint
CREATE INDEX `case_study_treatment_created_by_idx` ON `case_study_treatment` (`created_by`);--> statement-breakpoint
CREATE INDEX `case_study_treatment_created_at_idx` ON `case_study_treatment` (`created_at`);--> statement-breakpoint
CREATE INDEX `case_study_treatment_started_at_idx` ON `case_study_treatment` (`started_at`);--> statement-breakpoint
CREATE INDEX `case_study_treatment_ended_at_idx` ON `case_study_treatment` (`ended_at`);--> statement-breakpoint
CREATE TABLE `case_study_treatment_file` (
	`case_study` text NOT NULL,
	`file` text NOT NULL,
	`primary_file` integer DEFAULT false,
	`index` integer,
	`created_by` text NOT NULL,
	`created_at` integer,
	PRIMARY KEY(`case_study`, `file`),
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`file`) REFERENCES `file`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `case_study_treatment_file_case_study_idx` ON `case_study_treatment_file` (`case_study`);--> statement-breakpoint
CREATE INDEX `case_study_treatment_file_file_idx` ON `case_study_treatment_file` (`file`);--> statement-breakpoint
CREATE TABLE `file` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`hash` text NOT NULL,
	`protected` integer DEFAULT true,
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `file_name_idx` ON `file` (`name`);--> statement-breakpoint
CREATE INDEX `file_created_by_idx` ON `file` (`created_by`);--> statement-breakpoint
CREATE INDEX `file_created_at_idx` ON `file` (`created_at`);--> statement-breakpoint
CREATE TABLE `form` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`enabled` integer DEFAULT true,
	`protected` integer DEFAULT false,
	`type` text DEFAULT 'organization',
	`organization` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`organization`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `form_name_idx` ON `form` (`name`);--> statement-breakpoint
CREATE INDEX `form_description_idx` ON `form` (`description`);--> statement-breakpoint
CREATE INDEX `form_enabled_idx` ON `form` (`enabled`);--> statement-breakpoint
CREATE INDEX `form_created_by_idx` ON `form` (`created_by`);--> statement-breakpoint
CREATE INDEX `form_created_at_idx` ON `form` (`created_at`);--> statement-breakpoint
CREATE TABLE `form_question` (
	`id` text PRIMARY KEY NOT NULL,
	`form` text NOT NULL,
	`index` integer,
	`required` integer DEFAULT false,
	`type` text NOT NULL,
	`options` blob,
	`name` text NOT NULL,
	`description` text,
	`created_by` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`form`) REFERENCES `form`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `form_question_form_idx` ON `form_question` (`form`);--> statement-breakpoint
CREATE INDEX `form_question_index_idx` ON `form_question` (`index`);--> statement-breakpoint
CREATE INDEX `form_question_created_at_idx` ON `form_question` (`created_at`);--> statement-breakpoint
CREATE TABLE `form_response` (
	`id` text PRIMARY KEY NOT NULL,
	`form` text NOT NULL,
	`case_study` text NOT NULL,
	`value` blob,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`form`) REFERENCES `form`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `form_response_form_idx` ON `form_response` (`form`);--> statement-breakpoint
CREATE INDEX `form_response_case_study_idx` ON `form_response` (`case_study`);--> statement-breakpoint
CREATE INDEX `form_response_created_by_idx` ON `form_response` (`created_by`);--> statement-breakpoint
CREATE INDEX `form_response_created_at_idx` ON `form_response` (`created_at`);--> statement-breakpoint
CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`case_study` text NOT NULL,
	`title` text NOT NULL,
	`value` blob,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`case_study`) REFERENCES `case_study`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `note_title_idx` ON `note` (`title`);--> statement-breakpoint
CREATE INDEX `note_case_study_idx` ON `note` (`case_study`);--> statement-breakpoint
CREATE INDEX `note_created_by_idx` ON `note` (`created_by`);--> statement-breakpoint
CREATE INDEX `note_created_at_idx` ON `note` (`created_at`);