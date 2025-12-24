import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAddExpense } from "@/hooks/use-expenses";
import { Receipt, CreditCard, Zap, Car, Home, Utensils, Gamepad2, ShoppingBag, Heart, BookOpen, Plane, Coffee, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "food", name: "Food & Dining", icon: Utensils, color: "bg-orange-100 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400" },
  { id: "transportation", name: "Transportation", icon: Car, color: "bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "bg-purple-100 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400" },
  { id: "entertainment", name: "Entertainment", icon: Gamepad2, color: "bg-pink-100 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400" },
  { id: "bills", name: "Bills & Utilities", icon: Home, color: "bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400" },
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400" },
  { id: "education", name: "Education", icon: BookOpen, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400" },
  { id: "travel", name: "Travel", icon: Plane, color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400" },
  { id: "coffee", name: "Coffee & Snacks", icon: Coffee, color: "bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400" },
  { id: "technology", name: "Technology", icon: Smartphone, color: "bg-slate-100 text-slate-600 dark:bg-slate-950/20 dark:text-slate-400" },
];

const paymentMethods = [
  { id: "cash", name: "Cash", icon: Receipt },
  { id: "credit", name: "Credit Card", icon: CreditCard },
  { id: "debit", name: "Debit Card", icon: CreditCard },
  { id: "digital", name: "Digital Wallet", icon: Smartphone },
];

export default function AddTransaction() {
  const [, setLocation] = useLocation();
  const addExpense = useAddExpense();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    paymentMethod: "",
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

  // Auto-categorization logic
  const suggestCategory = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('coffee') || lowerName.includes('starbucks') || lowerName.includes('cafe')) {
      return 'coffee';
    }
    if (lowerName.includes('uber') || lowerName.includes('lyft') || lowerName.includes('taxi') || lowerName.includes('gas')) {
      return 'transportation';
    }
    if (lowerName.includes('amazon') || lowerName.includes('walmart') || lowerName.includes('target')) {
      return 'shopping';
    }
    if (lowerName.includes('netflix') || lowerName.includes('spotify') || lowerName.includes('movie')) {
      return 'entertainment';
    }
    if (lowerName.includes('electric') || lowerName.includes('water') || lowerName.includes('internet')) {
      return 'bills';
    }

    return null;
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    const suggestion = suggestCategory(name);
    setSuggestedCategory(suggestion);
    if (suggestion && !formData.category) {
      setFormData(prev => ({ ...prev, category: suggestion }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.amount || !formData.category) {
      return;
    }

    addExpense.mutate({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
    });

    setLocation("/");
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Add Transaction</h1>
          <p className="text-muted-foreground">Record your expense with smart categorization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Details Card */}
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-primary" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Transaction Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Starbucks Coffee"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="text-base"
                />
                {suggestedCategory && !formData.category && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-sm text-primary"
                  >
                    <Zap className="w-4 h-4" />
                    <span>AI suggests: {categories.find(c => c.id === suggestedCategory)?.name}</span>
                  </motion.div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-8 text-base"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = formData.category === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${category.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-medium">{category.name}</div>
                    </button>
                  );
                })}
              </div>

              {selectedCategory && (
                <div className="mt-4 flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <selectedCategory.icon className="w-3 h-3" />
                    <span>{selectedCategory.name}</span>
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{method.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.name || !formData.amount || !formData.category}
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
