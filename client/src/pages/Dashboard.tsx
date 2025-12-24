import { Layout } from "@/components/ui/Layout";
import { StatCard } from "@/components/ui/StatCard";
import { useIncome } from "@/hooks/use-income";
import { useRecurringExpenses } from "@/hooks/use-recurring";
import { useExpenses } from "@/hooks/use-expenses";
import { useDebts } from "@/hooks/use-debts";
import { DollarSign, Repeat, Receipt, CreditCard, PieChart as PieIcon, Wallet, TrendingUp, TrendingDown, Plus, Target, Shield, Zap } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: income } = useIncome();
  const { data: recurring } = useRecurringExpenses();
  const { data: expenses } = useExpenses();
  const { data: debts } = useDebts();

  const stats = useMemo(() => {
    const monthlyIncome = income ? income.amount : 0;
    const recurringTotal = recurring?.reduce((acc, curr) => acc + (curr.active ? curr.amount : 0), 0) || 0;
    const oneTimeTotal = expenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const debtTotal = debts?.reduce((acc, curr) => acc + (curr.active ? curr.totalAmount : 0), 0) || 0;
    
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
      data[cat] = (data[cat] || 0) + exp.amount;
    });

    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses, stats.recurringTotal]);

  const spendingPercentage = stats.monthlyIncome > 0
    ? Math.min(Math.round((stats.totalExpenses / stats.monthlyIncome) * 100), 100)
    : 0;

  // Recent transactions (combine expenses and recurring)
  const recentTransactions = useMemo(() => {
    const transactions = [
      ...expenses?.map(exp => ({ ...exp, type: 'expense', date: new Date(exp.date || new Date()) })) || [],
      ...recurring?.filter(r => r.active).map(rec => ({
        id: rec.id,
        name: rec.name,
        amount: rec.amount,
        category: 'Recurring',
        date: new Date(),
        type: 'recurring'
      })) || []
    ];

    return transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [expenses, recurring]);

  // Budget progress (mock data for now - would come from budgets table)
  const budgetProgress = [
    { category: 'Food', spent: 450, budget: 600, color: '#3b82f6' },
    { category: 'Transportation', spent: 120, budget: 200, color: '#8b5cf6' },
    { category: 'Entertainment', spent: 80, budget: 150, color: '#ec4899' },
  ];

  // Mock insights
  const insights = [
    {
      type: 'positive',
      message: 'You\'re saving 15% more than last month!',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      type: 'warning',
      message: 'Food expenses are 25% over budget this week',
      icon: Target,
      color: 'text-orange-600'
    },
    {
      type: 'info',
      message: 'Consider setting up automatic savings transfers',
      icon: Zap,
      color: 'text-blue-600'
    }
  ];

  // Mock spending trend data
  const spendingTrend = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1350 },
    { month: 'Mar', amount: 1100 },
    { month: 'Apr', amount: 1400 },
    { month: 'May', amount: 1250 },
    { month: 'Jun', amount: stats.totalExpenses },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section with Security Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Welcome back!</h2>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-full border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Secure</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Monthly Income"
            value={`$${stats.monthlyIncome.toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            className="border-blue-100 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20"
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
            className={stats.savings < 0 ? "border-red-100 bg-red-50/30 dark:border-red-800 dark:bg-red-950/20" : "border-green-100 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20"}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Spending Trend */}
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Spending Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          backgroundColor: 'hsl(var(--card))'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget Progress */}
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Budget Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetProgress.map((budget) => {
                  const percentage = Math.min((budget.spent / budget.budget) * 100, 100);
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{budget.category}</span>
                        <span className="text-sm text-muted-foreground">
                          ${budget.spent} / ${budget.budget}
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2"
                        style={{
                          backgroundColor: 'hsl(var(--muted))'
                        }}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activity & Insights */}
          <div className="space-y-8">
            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2 text-primary" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'expense' ? 'bg-red-100 dark:bg-red-950/20' : 'bg-blue-100 dark:bg-blue-950/20'
                          }`}>
                            {transaction.type === 'expense' ? (
                              <Receipt className="w-4 h-4 text-red-600" />
                            ) : (
                              <Repeat className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{transaction.name}</p>
                            <p className="text-xs text-muted-foreground">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            -${transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      <insight.icon className={`w-4 h-4 mt-0.5 ${insight.color}`} />
                      <p className="text-sm">{insight.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expense Breakdown (moved to bottom) */}
        <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieIcon className="w-5 h-5 mr-2 text-primary" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        backgroundColor: 'hsl(var(--card))'
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl">
                <div className="text-center">
                  <PieIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No expense data yet</p>
                  <p className="text-sm">Add some expenses to see your breakdown</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50"
        onClick={() => setLocation("/add-transaction")}
      >
        <Plus className="w-6 h-6" />
        <span className="sr-only">Add Transaction</span>
      </Button>
    </Layout>
  );
}
