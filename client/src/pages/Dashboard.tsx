import { Layout } from "@/components/ui/Layout";
import { StatCard } from "@/components/ui/StatCard";
import { useIncome } from "@/hooks/use-income";
import { useRecurringExpenses } from "@/hooks/use-recurring";
import { useExpenses } from "@/hooks/use-expenses";
import { useDebts } from "@/hooks/use-debts";
import { DollarSign, Repeat, Receipt, CreditCard, PieChart as PieIcon } from "lucide-react";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export default function Dashboard() {
  const { data: income } = useIncome();
  const { data: recurring } = useRecurringExpenses();
  const { data: expenses } = useExpenses();
  const { data: debts } = useDebts();

  const stats = useMemo(() => {
    const monthlyIncome = income ? parseFloat(income.amount) : 0;
    const recurringTotal = recurring?.reduce((acc, curr) => acc + (curr.active ? parseFloat(curr.amount) : 0), 0) || 0;
    const oneTimeTotal = expenses?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0;
    const debtTotal = debts?.reduce((acc, curr) => acc + (curr.active ? parseFloat(curr.totalAmount) : 0), 0) || 0;
    
    const totalExpenses = recurringTotal + oneTimeTotal;
    const savings = monthlyIncome - totalExpenses;

    return { monthlyIncome, recurringTotal, oneTimeTotal, debtTotal, totalExpenses, savings };
  }, [income, recurring, expenses, debts]);

  const pieData = useMemo(() => {
    const data: Record<string, number> = {};
    
    // Add recurring as a category
    if (stats.recurringTotal > 0) {
      data["Recurring Bills"] = stats.recurringTotal;
    }

    // Group one-time by category
    expenses?.forEach(exp => {
      const cat = exp.category || "Uncategorized";
      data[cat] = (data[cat] || 0) + parseFloat(exp.amount);
    });

    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses, stats.recurringTotal]);

  const spendingPercentage = stats.monthlyIncome > 0 
    ? Math.min(Math.round((stats.totalExpenses / stats.monthlyIncome) * 100), 100)
    : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Monthly Income"
            value={`$${stats.monthlyIncome.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            className="border-blue-100 bg-blue-50/30"
          />
          <StatCard
            title="Total Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon={<Receipt className="w-5 h-5" />}
            trend={stats.savings > 0 ? "Saving" : "Overspending"}
            trendUp={stats.savings > 0}
          />
          <StatCard
            title="Total Debt"
            value={`$${stats.debtTotal.toLocaleString()}`}
            icon={<CreditCard className="w-5 h-5" />}
          />
          <StatCard
            title="Projected Savings"
            value={`$${stats.savings.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            className={stats.savings < 0 ? "border-red-100 bg-red-50/30" : "border-green-100 bg-green-50/30"}
          />
        </div>

        {/* Charts & Graphs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Spending Progress */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-bold font-display mb-6 flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg mr-3">
                <PieIcon className="w-5 h-5 text-primary" />
              </div>
              Budget Usage
            </h3>
            
            <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground">
              <span>${stats.totalExpenses.toLocaleString()} spent</span>
              <span>${stats.monthlyIncome.toLocaleString()} budget</span>
            </div>
            
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${spendingPercentage > 100 ? 'bg-destructive' : 'bg-primary'}`}
                style={{ width: `${spendingPercentage}%` }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              You have spent <strong>{spendingPercentage}%</strong> of your monthly income.
              {spendingPercentage < 80 ? " You're on track!" : " Watch your spending."}
            </p>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm min-h-[350px]">
             <h3 className="text-lg font-bold font-display mb-6">Expense Breakdown</h3>
             {pieData.length > 0 ? (
               <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={pieData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       formatter={(value: number) => `$${value.toLocaleString()}`}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                     />
                     <Legend verticalAlign="bottom" height={36} iconType="circle" />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-[250px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl">
                 No expense data yet
               </div>
             )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
