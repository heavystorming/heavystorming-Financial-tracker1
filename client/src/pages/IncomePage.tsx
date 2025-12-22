import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useIncome, useUpdateIncome } from "@/hooks/use-income";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncomeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useEffect } from "react";
import { Wallet } from "lucide-react";

export default function IncomePage() {
  const { data: income, isLoading } = useIncome();
  const updateIncome = useUpdateIncome();

  // Schema expects string for numeric field, but input gives string naturally.
  // Zod schema from shared might expect string for numeric columns if inferred directly from drizzle-zod
  // We'll trust the generated schema.
  
  const form = useForm<z.infer<typeof insertIncomeSchema>>({
    resolver: zodResolver(insertIncomeSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    if (income) {
      form.reset({ amount: income.amount });
    }
  }, [income, form]);

  const onSubmit = (data: z.infer<typeof insertIncomeSchema>) => {
    updateIncome.mutate(data);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-50 rounded-xl mr-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display">Monthly Income</h2>
              <p className="text-muted-foreground">Set your expected monthly take-home pay</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="5000.00" 
                        type="number" 
                        step="0.01" 
                        className="text-lg font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                isLoading={updateIncome.isPending}
              >
                {income ? "Update Income" : "Set Income"}
              </Button>
            </form>
          </Form>

          {income && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Current Monthly Income</p>
              <div className="text-4xl font-display font-bold text-slate-800">
                ${parseFloat(income.amount).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
