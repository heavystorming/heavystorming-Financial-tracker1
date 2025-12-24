import { z } from 'zod';
import { 
  insertIncomeSchema, 
  insertRecurringSchema, 
  insertExpenseSchema, 
  insertDebtSchema, 
  insertDebtPaymentSchema,
  incomes, 
  recurringExpenses, 
  expenses, 
  debts, 
  debtPayments,
  type InsertIncome,
  type InsertRecurring,
  type InsertExpense,
  type InsertDebt,
  type InsertDebtPayment
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Income
  income: {
    get: {
      method: 'GET' as const,
      path: '/api/income',
      responses: {
        200: z.custom<typeof incomes.$inferSelect>(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/income',
      input: insertIncomeSchema,
      responses: {
        200: z.custom<typeof incomes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },

  // Recurring Expenses
  recurring: {
    list: {
      method: 'GET' as const,
      path: '/api/recurring',
      responses: {
        200: z.array(z.custom<typeof recurringExpenses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/recurring',
      input: insertRecurringSchema,
      responses: {
        201: z.custom<typeof recurringExpenses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/recurring/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },

  // One-time Expenses
  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses',
      input: insertExpenseSchema,
      responses: {
        201: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/expenses/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    clear: {
      method: 'DELETE' as const,
      path: '/api/expenses', // Clear all
      responses: {
        204: z.void(),
      },
    },
  },

  // Debts
  debts: {
    list: {
      method: 'GET' as const,
      path: '/api/debts',
      responses: {
        200: z.array(z.custom<typeof debts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/debts',
      input: insertDebtSchema,
      responses: {
        201: z.custom<typeof debts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/debts/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    pay: {
      method: 'POST' as const,
      path: '/api/debts/:id/pay',
      input: insertDebtPaymentSchema.omit({ debtId: true }),
      responses: {
        200: z.custom<typeof debts.$inferSelect>(), // Returns updated debt
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Export types
export type { InsertIncome, InsertRecurring, InsertExpense, InsertDebt, InsertDebtPayment };
