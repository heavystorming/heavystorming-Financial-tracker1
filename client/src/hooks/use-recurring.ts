import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertRecurring } from "@shared/routes";
import { z } from "zod";
import { insertRecurringSchema } from "@shared/schema";

export function useRecurringExpenses() {
  return useQuery({
    queryKey: [api.recurring.list.path],
    queryFn: async () => {
      const res = await fetch(api.recurring.list.path);
      if (!res.ok) throw new Error("Failed to fetch recurring expenses");
      return api.recurring.list.responses[200].parse(await res.json());
    },
  });
}

export function useAddRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.input<typeof insertRecurringSchema>) => {
      // Ensure amount is sent as a string
      const payload = { ...data, amount: String(data.amount) };
      const res = await fetch(api.recurring.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create recurring expense");
      return api.recurring.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recurring.list.path] });
    },
  });
}

export function useDeleteRecurringExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.recurring.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete recurring expense");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recurring.list.path] });
    },
  });
}
