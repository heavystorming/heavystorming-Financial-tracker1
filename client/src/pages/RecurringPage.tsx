import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRecurringExpenses, useAddRecurringExpense, useDeleteRecurringExpense } from "@/hooks/use-recurring";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRecurringSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Trash2, Repeat, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function RecurringPage() {
  const { data: recurring, isLoading } = useRecurringExpenses();
  const addExpense = useAddRecurringExpense();
  const deleteExpense = useDeleteRecurringExpense();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertRecurringSchema>>({
    resolver: zodResolver(insertRecurringSchema),
    defaultValues: {
      name: "",
      amount: "",
      active: true,
    },
  });

  const onSubmit = (data: z.infer<typeof insertRecurringSchema>) => {
    addExpense.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const totalRecurring = recurring?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">Recurring Expenses</h2>
            <p className="text-muted-foreground">Fixed monthly bills like rent, subscriptions, insurance.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
              <span className="text-xs text-muted-foreground block font-bold uppercase">Total / Month</span>
              <span className="font-bold text-lg text-primary">${totalRecurring.toLocaleString()}</span>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Recurring Expense</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expense Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Netflix, Rent, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Amount ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" isLoading={addExpense.isPending}>
                      Add Expense
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recurring?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No recurring expenses</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">Add your fixed monthly bills to track your baseline spending.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurring?.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <button 
                    onClick={() => deleteExpense.mutate(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-2xl font-bold font-display text-gray-900 mt-1">
                    ${parseFloat(item.amount).toLocaleString()}
                    <span className="text-xs font-sans font-normal text-muted-foreground ml-1">/mo</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
