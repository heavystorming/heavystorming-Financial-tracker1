import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Clock, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AuthStep = "email" | "verify" | "success";

export default function EmailAuth() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate sending verification code
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1500);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate verification
    setTimeout(() => {
      const success = verificationCode === "123456"; // Demo code
      setIsLoading(false);

      if (success) {
        setStep("success");
        setTimeout(() => {
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("authMethod", "email");
          setLocation("/");
        }, 2000);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }, 1500);
  };

  const handleBack = () => {
    if (step === "verify") {
      setStep("email");
      setError("");
    } else {
      setLocation("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="text-center pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CardTitle className="text-xl font-display font-bold mb-2">
                    Sign in with Email
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    We'll send you a secure verification code
                  </p>
                </motion.div>
              )}

              {step === "verify" && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CardTitle className="text-xl font-display font-bold mb-2">
                    Check your email
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    We sent a 6-digit code to <strong>{email}</strong>
                  </p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CardTitle className="text-xl font-display font-bold mb-2 text-green-600">
                    Verification Successful
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Welcome back to FinanceTrack
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div
                  key="email-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-base"
                    />
                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSendCode}
                    className="w-full h-12"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </motion.div>
              )}

              {step === "verify" && (
                <motion.div
                  key="verify-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="text-center text-2xl font-mono tracking-widest"
                      maxLength={6}
                    />
                    {error && (
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in 10 minutes</span>
                  </div>

                  <Button
                    onClick={handleVerifyCode}
                    className="w-full h-12"
                    size="lg"
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>

                  <Button
                    onClick={handleSendCode}
                    variant="ghost"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Resend Code
                  </Button>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to your dashboard...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security Notice */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your email is encrypted and never stored in plain text
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
