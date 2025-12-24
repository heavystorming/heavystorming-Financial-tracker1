import { useMemo } from "react";
import { Layout } from "@/components/ui/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { useExpenses } from "@/hooks/use-expenses";
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Plus } from "lucide-react";

const mockBudgets = [
  { category: "Food & Dining", budgeted: 600, spent: 450, color: "#3b82f6" },
  { category: "Transportation", budgeted: 200, spent: 120, color: "#8b5cf6" },
  { category: "Entertainment", budgeted: 150, spent: 80, color: "#ec4899" },
  { category: "Shopping", budgeted: 300, spent: 180, color: "#f59e0b" },
  { category: "Bills & Utilities", budgeted: 400, spent: 380, color: "#10b981" },
  { category: "Healthcare", budgeted: 200, spent: 50, color: "#ef4444" },
];

export default function Budgets() {
  const { data: expenses } = useExpenses();

  // Calculate actual spending by category
  const actualSpending = useMemo(() => {
    const spending: Record<string, number> = {};

    expenses?.forEach(expense => {
      const category = expense.category || "Uncategorized";
      spending[category] = (spending[category] || 0) + expense.amount;
    });

    return spending;
  }, [expenses]);

  const budgetsWithActual = mockBudgets.map(budget => ({
    ...budget,
    actualSpent: actualSpending[budget.category] || 0,
    percentage: Math.min(((actualSpending[budget.category] || 0) / budget.budgeted) * 100, 100),
  }));

  const totalBudgeted = budgetsWithActual.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = budgetsWithActual.reduce((sum, budget) => sum + budget.actualSpent, 0);
  const totalPercentage = (totalSpent / totalBudgeted) * 100;

  const getStatusIcon = (percentage: number) => {
    if (percentage < 70) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage < 90) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <TrendingUp className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return "text-green-600";
    if (percentage < 90) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Budgets</h1>
            <p className="text-muted-foreground mt-1">Track your spending against your goals</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Set Budget
          </Button>
        </div>

        {/* Overall Budget Progress */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Budget</h3>
                <p className="text-sm text-muted-foreground">
                  ${totalSpent.toLocaleString()} of ${totalBudgeted.toLocaleString()} spent
                </p>
              </div>
              <Badge variant={totalPercentage > 90 ? "destructive" : totalPercentage > 70 ? "secondary" : "default"}>
                {totalPercentage.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={totalPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {totalPercentage < 80 ? "You're on track!" : "Consider adjusting your spending"}
            </p>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetsWithActual.map((budget) => (
            <Card key={budget.category} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: budget.color }}
                    />
                    {budget.category}
                  </CardTitle>
                  {getStatusIcon(budget.percentage)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className={`font-medium ${getStatusColor(budget.percentage)}`}>
                      ${budget.actualSpent.toLocaleString()}
                    </span>
                  </div>

                  <Progress value={budget.percentage} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${budget.budgeted.toLocaleString()} budgeted
                    </span>
                    <span className="font-medium">
                      {budget.percentage.toFixed(1)}%
                    </span>
                  </div>

                  {budget.percentage > 100 && (
                    <div className="flex items-center text-sm text-red-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Over budget by ${(budget.actualSpent - budget.budgeted).toLocaleString()}
                    </div>
                  )}

                  {budget.percentage < 50 && (
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Well under budget
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Budget Insights */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Budget Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Healthcare budget</p>
                  <p className="text-sm text-muted-foreground">You're only 25% through your healthcare budget this month</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Entertainment spending</p>
                  <p className="text-sm text-muted-foreground">You've spent 53% of your entertainment budget already</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium">Food budget alert</p>
                  <p className="text-sm text-muted-foreground">Consider meal planning to stay within your food budget</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
