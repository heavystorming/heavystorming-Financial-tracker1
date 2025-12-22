import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Income
  app.get(api.income.get.path, async (req, res) => {
    const income = await storage.getIncome();
    res.json(income || { amount: "0" });
  });

  app.post(api.income.update.path, async (req, res) => {
    try {
      const input = api.income.update.input.parse(req.body);
      const income = await storage.setIncome(input);
      res.json(income);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Recurring
  app.get(api.recurring.list.path, async (req, res) => {
    const list = await storage.getRecurringExpenses();
    res.json(list);
  });

  app.post(api.recurring.create.path, async (req, res) => {
    try {
      const input = api.recurring.create.input.parse(req.body);
      const expense = await storage.createRecurringExpense(input);
      res.status(201).json(expense);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.recurring.delete.path, async (req, res) => {
    await storage.deleteRecurringExpense(Number(req.params.id));
    res.status(204).end();
  });

  // Expenses
  app.get(api.expenses.list.path, async (req, res) => {
    const list = await storage.getExpenses();
    res.json(list);
  });

  app.post(api.expenses.create.path, async (req, res) => {
    try {
      const input = api.expenses.create.input.parse(req.body);
      const expense = await storage.createExpense(input);
      res.status(201).json(expense);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.expenses.delete.path, async (req, res) => {
    await storage.deleteExpense(Number(req.params.id));
    res.status(204).end();
  });

  app.delete(api.expenses.clear.path, async (req, res) => {
    await storage.clearExpenses();
    res.status(204).end();
  });

  // Debts
  app.get(api.debts.list.path, async (req, res) => {
    const list = await storage.getDebts();
    res.json(list);
  });

  app.post(api.debts.create.path, async (req, res) => {
    try {
      const input = api.debts.create.input.parse(req.body);
      const debt = await storage.createDebt(input);
      res.status(201).json(debt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.debts.delete.path, async (req, res) => {
    await storage.deleteDebt(Number(req.params.id));
    res.status(204).end();
  });

  app.post(api.debts.pay.path, async (req, res) => {
    try {
      const debtId = Number(req.params.id);
      const input = api.debts.pay.input.parse(req.body);
      
      const debt = await storage.getDebt(debtId);
      if (!debt) {
        return res.status(404).json({ message: "Debt not found" });
      }

      // Record payment
      await storage.recordDebtPayment({ ...input, debtId });

      // Update total amount
      const currentTotal = Number(debt.totalAmount);
      const paymentAmount = Number(input.amount);
      const newTotal = Math.max(0, currentTotal - paymentAmount).toFixed(2);
      
      const updatedDebt = await storage.updateDebtBalance(debtId, newTotal);
      res.json(updatedDebt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed data
  const existingIncome = await storage.getIncome();
  if (!existingIncome) {
    await storage.setIncome({ amount: "5000.00" });
    await storage.createRecurringExpense({ name: "Rent", amount: "1200.00" });
    await storage.createRecurringExpense({ name: "Utilities", amount: "150.00" });
    await storage.createRecurringExpense({ name: "Netflix", amount: "15.99" });
    await storage.createExpense({ name: "Groceries", amount: "85.50", category: "Food" });
    await storage.createExpense({ name: "Gas", amount: "45.00", category: "Transport" });
    await storage.createExpense({ name: "Movie Night", amount: "30.00", category: "Entertainment" });
    await storage.createDebt({ name: "Credit Card", totalAmount: "2500.00", minPayment: "100.00", interestRate: "19.99" });
  }

  return httpServer;
}
