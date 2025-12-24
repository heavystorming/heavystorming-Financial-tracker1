import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/Dashboard";
import Budgets from "@/pages/Budgets";
import IncomePage from "@/pages/IncomePage";
import RecurringPage from "@/pages/RecurringPage";
import OneTimePage from "@/pages/OneTimePage";
import DebtsPage from "@/pages/DebtsPage";
import Onboarding from "@/pages/Onboarding";
import AddTransaction from "@/pages/AddTransaction";
import Splash from "@/pages/Splash";
import AuthChoice from "@/pages/AuthChoice";
import BiometricPrompt from "@/pages/BiometricPrompt";
import EmailAuth from "@/pages/EmailAuth";

function Router() {
  const [authState, setAuthState] = useState<"splash" | "auth" | "authenticated" | "onboarding">("splash");

  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    const onboardingComplete = localStorage.getItem("onboardingComplete");

    if (!authenticated) {
      // Show splash for 3 seconds, then auth choice
      const timer = setTimeout(() => {
        setAuthState("auth");
      }, 3000);
      return () => clearTimeout(timer);
    } else if (!onboardingComplete) {
      setAuthState("onboarding");
    } else {
      setAuthState("authenticated");
    }
  }, []);

  if (authState === "splash") {
    return <Splash />;
  }

  if (authState === "onboarding") {
    return <Onboarding />;
  }

  if (authState === "auth") {
    return (
      <Switch>
        <Route path="/auth" component={AuthChoice} />
        <Route path="/biometric" component={BiometricPrompt} />
        <Route path="/email-auth" component={EmailAuth} />
        <Route path="/" component={() => {
          setAuthState("authenticated");
          return null;
        }} />
        <Route component={AuthChoice} />
      </Switch>
    );
  }

  // Authenticated user
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/budgets" component={Budgets} />
      <Route path="/add-transaction" component={AddTransaction} />
      <Route path="/income" component={IncomePage} />
      <Route path="/recurring" component={RecurringPage} />
      <Route path="/one-time" component={OneTimePage} />
      <Route path="/debts" component={DebtsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
