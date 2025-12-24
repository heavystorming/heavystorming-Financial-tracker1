import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Fingerprint, Mail, Apple, Chrome, Shield, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const authOptions = [
  {
    id: "passkey",
    title: "Continue with Passkey",
    subtitle: "Secure, passwordless access",
    description: "Use your device's biometric authentication",
    icon: Fingerprint,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
    recommended: true,
  },
  {
    id: "apple",
    title: "Continue with Apple",
    subtitle: "Seamless sign-in",
    description: "Sign in with your Apple ID",
    icon: Apple,
    color: "bg-gray-50 text-gray-600 dark:bg-gray-950/20 dark:text-gray-400",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
  {
    id: "google",
    title: "Continue with Google",
    subtitle: "Quick and easy",
    description: "Sign in with your Google account",
    icon: Chrome,
    color: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: "email",
    title: "Continue with Email",
    subtitle: "Magic link or verification code",
    description: "We'll send you a secure link to sign in",
    icon: Mail,
    color: "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
  },
];

export default function AuthChoice() {
  const [, setLocation] = useLocation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);

    // Simulate authentication flow
    setTimeout(() => {
      if (optionId === "passkey") {
        setLocation("/biometric");
      } else if (optionId === "email") {
        setLocation("/email-auth");
      } else {
        // For demo purposes, redirect to onboarding
        localStorage.setItem("authMethod", optionId);
        setLocation("/");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Choose how you'd like to sign in securely
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800 dark:text-green-200">Your data is protected</p>
              <p className="text-green-700 dark:text-green-300">Bank-level encryption • No passwords stored • Phishing-resistant</p>
            </div>
          </div>
        </motion.div>

        {/* Auth Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-3"
        >
          {authOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                } ${option.borderColor} border-2`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{option.title}</h3>
                        {option.recommended && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </div>

                    <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      isSelected ? 'translate-x-1' : ''
                    }`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <button className="text-primary hover:underline">Terms of Service</button>
            {" "}and{" "}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
