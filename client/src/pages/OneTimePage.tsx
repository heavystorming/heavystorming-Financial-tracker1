import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useExpenses, useAddExpense, useDeleteExpense, useClearExpenses } from "@/hooks/use-expenses";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { Trash2, Receipt, Plus, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other"];

export default function OneTimePage() {
  const { data: expenses, isLoading } = useExpenses();
  const addExpense = useAddExpense();
  const deleteExpense = useDeleteExpense();
  const clearExpenses = useClearExpenses();
  const [open, setOpen] = useState(false);

  const form = useForm<z.input<typeof insertExpenseSchema>>({
    resolver: zodResolver(insertExpenseSchema),
    defaultValues: {
      name: "",
      amount: "",
      category: "General",
    },
  });

  const onSubmit = (data: z.input<typeof insertExpenseSchema>) => {
    addExpense.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset({ name: "", amount: "", category: "General" });
      },
    });
  };

  const totalExpenses = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">One-time Expenses</h2>
            <p className="text-muted-foreground">Variable spending for groceries, dining out, etc.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm hidden md:block">
              <span className="text-xs text-muted-foreground block font-bold uppercase">This Month</span>
              <span className="font-bold text-lg text-primary">${totalExpenses.toLocaleString()}</span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="hidden md:flex">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all expenses?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all one-time expenses. Use this at the start of a new month.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => clearExpenses.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Groceries, Dinner, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-11 border-2 border-border focus:ring-primary/20">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CATEGORIES.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                                <SelectItem value="General">General</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Expense
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile Stat Card */}
        <div className="md:hidden bg-white p-4 rounded-xl border border-border shadow-sm flex justify-between items-center">
          <div>
            <span className="text-xs text-muted-foreground block font-bold uppercase">This Month</span>
            <span className="font-bold text-xl text-primary">${totalExpenses.toLocaleString()}</span>
          </div>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RotateCcw className="w-4 h-4 mr-1" /> Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                {/* Same content as desktop */}
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all expenses?</AlertDialogTitle>
                  <AlertDialogDescription>This will delete all expenses.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => clearExpenses.mutate()} className="bg-destructive">Clear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : expenses?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No expenses yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">Track your daily spending to see where your money goes.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
             <div className="divide-y divide-gray-100">
               {expenses?.map((item) => (
                 <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {item.category?.substring(0,2).toUpperCase() || "GE"}
                     </div>
                     <div>
                       <h3 className="font-semibold text-gray-900">{item.name}</h3>
                       <p className="text-xs text-muted-foreground">
                         {item.date && format(new Date(item.date), 'MMM d, yyyy')} • {item.category}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <span className="font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                     <button 
                       onClick={() => deleteExpense.mutate(item.id)}
                       className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
