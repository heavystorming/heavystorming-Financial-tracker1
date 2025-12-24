import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useDebts, useAddDebt, useDeleteDebt, usePayDebt } from "@/hooks/use-debts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDebtSchema, insertDebtPaymentSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Trash2, CreditCard, Plus, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function DebtsPage() {
  const { data: debts, isLoading } = useDebts();
  const addDebt = useAddDebt();
  const deleteDebt = useDeleteDebt();
  const payDebt = usePayDebt();
  const [open, setOpen] = useState(false);
  const [payOpen, setPayOpen] = useState<{open: boolean, debtId: number | null}>({open: false, debtId: null});

  const form = useForm<z.input<typeof insertDebtSchema>>({
    resolver: zodResolver(insertDebtSchema),
    defaultValues: {
      name: "",
      totalAmount: "",
      minPayment: "",
      interestRate: "0",
      active: true,
    },
  });

  const payDebtSchema = insertDebtPaymentSchema.omit({ debtId: true });
  const payForm = useForm<z.input<typeof payDebtSchema>>({
    resolver: zodResolver(payDebtSchema),
    defaultValues: {
      amount: "",
      isExtra: false,
    },
  });

  const onSubmit = (data: z.input<typeof insertDebtSchema>) => {
    addDebt.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  const onPaySubmit = (data: z.input<typeof payDebtSchema>) => {
    if (payOpen.debtId) {
      payDebt.mutate({ debtId: payOpen.debtId, ...data }, {
        onSuccess: () => {
          setPayOpen({ open: false, debtId: null });
          payForm.reset();
        },
      });
    }
  };

  const totalDebt = debts?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">Debt Tracker</h2>
            <p className="text-muted-foreground">Visualize and pay down your loans efficiently.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
               <span className="text-xs text-muted-foreground block font-bold uppercase">Total Balance</span>
               <span className="font-bold text-lg text-red-500">${totalDebt.toLocaleString()}</span>
             </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Debt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Liability</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Debt Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Chase Card, Car Loan, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="totalAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Balance ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="5000.00" type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="interestRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>APR (%)</FormLabel>
                            <FormControl>
                              <Input placeholder="19.99" type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="minPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Monthly Payment ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="150.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Add Debt
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={payOpen.open} onOpenChange={(val) => setPayOpen({ open: val, debtId: val ? payOpen.debtId : null })}>
          <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>Make a Payment</DialogTitle>
             </DialogHeader>
             <Form {...payForm}>
                <form onSubmit={payForm.handleSubmit(onPaySubmit)} className="space-y-4">
                   <FormField
                      control={payForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Amount ($)</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Record Payment
                    </Button>
                </form>
             </Form>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : debts?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Debt free!</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2">Add any loans or credit cards here to track your payoff journey.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {debts?.map((item) => {
              const amount = item.totalAmount;
              return (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-50 rounded-lg text-red-600">
                           <CreditCard className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                            <p className="text-sm text-red-500 font-medium">{item.interestRate}% APR</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => deleteDebt.mutate(item.id)}
                        className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mb-6">
                       <p className="text-3xl font-display font-bold text-gray-900 mb-1">${amount.toLocaleString()}</p>
                       <p className="text-sm text-muted-foreground">Remaining Balance</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>Min Payment: ${item.minPayment}</span>
                        <span>Payoff Goal</span>
                      </div>
                      {/* Inverse progress bar conceptually: full bar is debt, empty is paid. Here we just show a static visual or we'd need original amount to show progress. Since we only have current amount, we'll just show a decorative bar for now or assumes 100% is current + paid (if we tracked it). Let's just do a visual element. */}
                      <Progress value={100} className="h-2 bg-red-100" />
                    </div>
                  </div>

                  <Button 
                    onClick={() => setPayOpen({ open: true, debtId: item.id })}
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                  >
                    Record Payment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
