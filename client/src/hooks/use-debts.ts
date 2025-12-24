import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertDebt, type InsertDebtPayment } from "@shared/routes";
import { z } from "zod";
import { insertDebtSchema, insertDebtPaymentSchema } from "@shared/schema";

export function useDebts() {
  return useQuery({
    queryKey: [api.debts.list.path],
    queryFn: async () => {
      const res = await fetch(api.debts.list.path);
      if (!res.ok) throw new Error("Failed to fetch debts");
      return api.debts.list.responses[200].parse(await res.json());
    },
  });
}

export function useAddDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.input<typeof insertDebtSchema>) => {
      const res = await fetch(api.debts.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create debt");
      return api.debts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.debts.list.path] });
    },
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.debts.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete debt");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.debts.list.path] });
    },
  });
}

export function usePayDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ debtId, ...payment }: { debtId: number } & Omit<z.input<typeof insertDebtPaymentSchema>, 'debtId'>) => {
      const url = buildUrl(api.debts.pay.path, { id: debtId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      if (!res.ok) throw new Error("Failed to make payment");
      return api.debts.pay.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.debts.list.path] });
    },
  });
}
