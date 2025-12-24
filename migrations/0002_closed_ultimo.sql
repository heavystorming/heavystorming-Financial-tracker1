PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_debt_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`debt_id` integer NOT NULL,
	`amount` real NOT NULL,
	`date` text DEFAULT '2025-12-24T04:15:52.989Z',
	`is_extra` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_debt_payments`("id", "debt_id", "amount", "date", "is_extra") SELECT "id", "debt_id", "amount", "date", "is_extra" FROM `debt_payments`;--> statement-breakpoint
DROP TABLE `debt_payments`;--> statement-breakpoint
ALTER TABLE `__new_debt_payments` RENAME TO `debt_payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`category` text DEFAULT 'General',
	`date` text DEFAULT '2025-12-24T04:15:52.989Z'
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "name", "amount", "category", "date") SELECT "id", "name", "amount", "category", "date" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
CREATE TABLE `__new_incomes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`updated_at` text DEFAULT '2025-12-24T04:15:52.989Z'
);
--> statement-breakpoint
INSERT INTO `__new_incomes`("id", "amount", "updated_at") SELECT "id", "amount", "updated_at" FROM `incomes`;--> statement-breakpoint
DROP TABLE `incomes`;--> statement-breakpoint
ALTER TABLE `__new_incomes` RENAME TO `incomes`;