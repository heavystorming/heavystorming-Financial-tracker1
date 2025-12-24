CREATE TABLE "debt_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"debt_id" integer NOT NULL,
	"amount" real NOT NULL,
	"date" text DEFAULT '2025-12-24T04:15:52.989Z',
	"is_extra" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "debts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"total_amount" real NOT NULL,
	"min_payment" real NOT NULL,
	"interest_rate" real DEFAULT 0,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"category" text DEFAULT 'General',
	"date" text DEFAULT '2025-12-24T04:15:52.989Z'
);
--> statement-breakpoint
CREATE TABLE "incomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'USD',
	"updated_at" text DEFAULT '2025-12-24T04:15:52.989Z'
);
--> statement-breakpoint
CREATE TABLE "recurring_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" real NOT NULL,
	"active" boolean DEFAULT true
);