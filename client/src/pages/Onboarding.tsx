import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, TrendingUp, Target, Fingerprint, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to FinanceTrack",
    subtitle: "Your trusted companion for financial wellness",
    description: "Take control of your money with intelligent tracking, budgeting, and insights that help you build wealth confidently.",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: 2,
    title: "Secure & Private",
    subtitle: "Bank-level security you can trust",
    description: "Your financial data is protected with end-to-end encryption, biometric authentication, and secure cloud storage.",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    id: 3,
    title: "Smart Insights",
    subtitle: "AI-powered financial guidance",
    description: "Get personalized insights, spending patterns, and recommendations to optimize your financial health.",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    id: 4,
    title: "Biometric Security",
    subtitle: "Quick and secure access",
    description: "Use Face ID, Touch ID, or PIN to access your financial data securely and conveniently.",
    icon: Fingerprint,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete and redirect to dashboard
      localStorage.setItem("onboardingComplete", "true");
      setLocation("/");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingComplete", "true");
    setLocation("/");
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl ${currentStepData.bgColor} flex items-center justify-center mx-auto mb-6`}>
                  <currentStepData.icon className={`w-10 h-10 ${currentStepData.color}`} />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                  {currentStepData.title}
                </h1>

                {/* Subtitle */}
                <h2 className="text-lg font-medium text-primary mb-4">
                  {currentStepData.subtitle}
                </h2>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {currentStepData.description}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Get Started
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>

                  {currentStep < onboardingSteps.length - 1 && (
                    <Button
                      variant="ghost"
                      onClick={handleSkip}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      Skip for now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
