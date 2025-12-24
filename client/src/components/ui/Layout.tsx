import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, Repeat, Receipt, CreditCard, Target } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./Button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const tabs = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Budgets", icon: Target, href: "/budgets" },
    { name: "Income", icon: Wallet, href: "/income" },
    { name: "Recurring", icon: Repeat, href: "/recurring" },
    { name: "One-time", icon: Receipt, href: "/one-time" },
    { name: "Debts", icon: CreditCard, href: "/debts" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 py-8 pb-24 md:pb-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Finance<span className="text-primary">Track</span>
            </h1>
            <p className="text-muted-foreground mt-1">Manage your wealth intelligently</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("authenticated");
                localStorage.removeItem("onboardingComplete");
                window.location.href = "/";
              }}
              className="text-sm"
            >
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 bg-white p-1 rounded-2xl border border-border/50 shadow-sm mb-8 sticky top-4 z-50 backdrop-blur-md bg-white/80">
          {tabs.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.name} href={tab.href} className={clsx(
                "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}>
                <tab.icon className={clsx("w-4 h-4 mr-2", isActive ? "stroke-[2.5px]" : "")} />
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <main>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 md:hidden pb-safe">
        <div className="flex justify-around items-center p-2">
          {tabs.map((tab) => {
            const isActive = location === tab.href;
            return (
              <Link key={tab.name} href={tab.href} className={clsx(
                "flex flex-col items-center p-2 rounded-lg transition-colors w-full",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <tab.icon className={clsx("w-6 h-6 mb-1", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
