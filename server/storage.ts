import { db } from "./db";
import {
  incomes, recurringExpenses, expenses, debts, debtPayments,
  type Income, type InsertIncome,
  type RecurringExpense, type InsertRecurring,
  type Expense, type InsertExpense,
  type Debt, type InsertDebt,
  type DebtPayment, type InsertDebtPayment
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Income
  getIncome(): Promise<Income | undefined>;
  setIncome(income: InsertIncome): Promise<Income>;

  // Recurring
  getRecurringExpenses(): Promise<RecurringExpense[]>;
  createRecurringExpense(expense: InsertRecurring): Promise<RecurringExpense>;
  deleteRecurringExpense(id: number): Promise<void>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  deleteExpense(id: number): Promise<void>;
  clearExpenses(): Promise<void>;

  // Debts
  getDebts(): Promise<Debt[]>;
  createDebt(debt: InsertDebt): Promise<Debt>;
  deleteDebt(id: number): Promise<void>;
  recordDebtPayment(payment: InsertDebtPayment): Promise<DebtPayment>;
  updateDebtBalance(id: number, newAmount: string): Promise<Debt>;
  getDebt(id: number): Promise<Debt | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Income
  async getIncome(): Promise<Income | undefined> {
    const [income] = await db.select().from(incomes).orderBy(desc(incomes.updatedAt)).limit(1);
    return income;
  }

  async setIncome(income: InsertIncome): Promise<Income> {
    const [newIncome] = await db.insert(incomes).values(income).returning();
    return newIncome;
  }

  // Recurring
  async getRecurringExpenses(): Promise<RecurringExpense[]> {
    return await db.select().from(recurringExpenses);
  }

  async createRecurringExpense(expense: InsertRecurring): Promise<RecurringExpense> {
    const [newExpense] = await db.insert(recurringExpenses).values(expense).returning();
    return newExpense;
  }

  async deleteRecurringExpense(id: number): Promise<void> {
    await db.delete(recurringExpenses).where(eq(recurringExpenses.id, id));
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(desc(expenses.date));
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async deleteExpense(id: number): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async clearExpenses(): Promise<void> {
    await db.delete(expenses);
  }

  // Debts
  async getDebts(): Promise<Debt[]> {
    return await db.select().from(debts);
  }

  async getDebt(id: number): Promise<Debt | undefined> {
    const [debt] = await db.select().from(debts).where(eq(debts.id, id));
    return debt;
  }

  async createDebt(debt: InsertDebt): Promise<Debt> {
    const [newDebt] = await db.insert(debts).values(debt).returning();
    return newDebt;
  }

  async deleteDebt(id: number): Promise<void> {
    await db.delete(debts).where(eq(debts.id, id));
  }

  async recordDebtPayment(payment: InsertDebtPayment): Promise<DebtPayment> {
    const [newPayment] = await db.insert(debtPayments).values(payment).returning();
    return newPayment;
  }

  async updateDebtBalance(id: number, newAmount: string): Promise<Debt> {
    const [updatedDebt] = await db.update(debts)
      .set({ totalAmount: newAmount })
      .where(eq(debts.id, id))
      .returning();
    return updatedDebt;
  }
}

export const storage = new DatabaseStorage();
