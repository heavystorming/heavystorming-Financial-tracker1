CREATE TABLE `debt_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debt_id` integer NOT NULL,
	`amount` real NOT NULL,
	`date` blob,
	`is_extra` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `debts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`total_amount` real NOT NULL,
	`min_payment` real NOT NULL,
	`interest_rate` real DEFAULT 0,
	`active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`category` text DEFAULT 'General',
	`date` blob
);
--> statement-breakpoint
CREATE TABLE `incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`updated_at` blob
);
--> statement-breakpoint
CREATE TABLE `recurring_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`active` integer DEFAULT true
);
