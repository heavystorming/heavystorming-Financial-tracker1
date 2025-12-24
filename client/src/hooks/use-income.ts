import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertIncome } from "@shared/routes";
import { z } from "zod";
import { insertIncomeSchema } from "@shared/schema";

export function useIncome() {
  return useQuery({
    queryKey: [api.income.get.path],
    queryFn: async () => {
      const res = await fetch(api.income.get.path);
      if (res.status === 404) return null; // Handle optional income
      if (!res.ok) throw new Error("Failed to fetch income");
      // Note: Backend might return array or single object depending on implementation detail of 'get',
      // but api.income.get.responses[200] is defined as $inferSelect (single object)
      const data = await res.json();
      return api.income.get.responses[200].parse(data);
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.input<typeof insertIncomeSchema>) => {
      // Ensure amount is sent as a string
      const payload = { ...data, amount: String(data.amount) };
      const res = await fetch(api.income.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update income");
      return api.income.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.income.get.path] });
    },
  });
}
