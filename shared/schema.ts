import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Income Settings (to store the monthly income)
export const incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(), // Using numeric for currency
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Recurring Expenses
export const recurringExpenses = pgTable("recurring_expenses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  active: boolean("active").default(true),
});

// One-time Expenses
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category").default("General"), // Refinement: Added category
  date: timestamp("date").defaultNow(),
});

// Debts
export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  minPayment: numeric("min_payment").notNull(),
  interestRate: numeric("interest_rate").default("0"), // Refinement: Added interest rate
  active: boolean("active").default(true),
});

// Debt Payments (to track history)
export const debtPayments = pgTable("debt_payments", {
  id: serial("id").primaryKey(),
  debtId: integer("debt_id").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").defaultNow(),
  isExtra: boolean("is_extra").default(false),
});

// Schemas
export const insertIncomeSchema = createInsertSchema(incomes).omit({ id: true, updatedAt: true });
export const insertRecurringSchema = createInsertSchema(recurringExpenses).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, date: true });
export const insertDebtSchema = createInsertSchema(debts).omit({ id: true });
export const insertDebtPaymentSchema = createInsertSchema(debtPayments).omit({ id: true, date: true });

// Types
export type Income = typeof incomes.$inferSelect;
export type RecurringExpense = typeof recurringExpenses.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Debt = typeof debts.$inferSelect;
export type DebtPayment = typeof debtPayments.$inferSelect;

export type InsertIncome = z.infer<typeof insertIncomeSchema>;
export type InsertRecurring = z.infer<typeof insertRecurringSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertDebt = z.infer<typeof insertDebtSchema>;
export type InsertDebtPayment = z.infer<typeof insertDebtPaymentSchema>;
