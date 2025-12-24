import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Income Settings (to store the monthly income)
export const incomes = sqliteTable("incomes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: real("amount").notNull(), // Using real for currency
  currency: text("currency").default("USD"),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

// Recurring Expenses
export const recurringExpenses = sqliteTable("recurring_expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  active: integer("active", { mode: "boolean" }).default(true),
});

// One-time Expenses
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  category: text("category").default("General"), // Refinement: Added category
  date: text("date").default(new Date().toISOString()),
});

// Debts
export const debts = sqliteTable("debts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  totalAmount: real("total_amount").notNull(),
  minPayment: real("min_payment").notNull(),
  interestRate: real("interest_rate").default(0), // Refinement: Added interest rate
  active: integer("active", { mode: "boolean" }).default(true),
});

// Debt Payments (to track history)
export const debtPayments = sqliteTable("debt_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  debtId: integer("debt_id").notNull(),
  amount: real("amount").notNull(),
  date: text("date").default(new Date().toISOString()),
  isExtra: integer("is_extra", { mode: "boolean" }).default(false),
});

// Schemas
export const insertIncomeSchema = createInsertSchema(incomes).omit({ id: true, updatedAt: true }).extend({
  amount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val)))
});
export const insertRecurringSchema = createInsertSchema(recurringExpenses).omit({ id: true }).extend({
  amount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val)))
});
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, date: true }).extend({
  amount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val)))
});
export const insertDebtSchema = createInsertSchema(debts).omit({ id: true }).extend({
  totalAmount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  minPayment: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  interestRate: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val)))
});
export const insertDebtPaymentSchema = createInsertSchema(debtPayments).omit({ id: true, date: true }).extend({
  amount: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val)))
});

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
