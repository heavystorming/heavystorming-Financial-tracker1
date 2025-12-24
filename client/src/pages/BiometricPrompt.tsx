import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Fingerprint, ScanFace, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BiometricType = "fingerprint" | "face";

export default function BiometricPrompt() {
  const [, setLocation] = useLocation();
  const [biometricType, setBiometricType] = useState<BiometricType>("fingerprint");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">("idle");

  // Detect device capabilities (mock for demo)
  useEffect(() => {
    // In real app, check for Touch ID, Face ID, etc.
    const hasFaceID = navigator.userAgent.includes("iPhone") || Math.random() > 0.5;
    setBiometricType(hasFaceID ? "face" : "fingerprint");
  }, []);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    setAuthStatus("idle");

    // Simulate biometric authentication
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      setAuthStatus(success ? "success" : "error");
      setIsAuthenticating(false);

      if (success) {
        setTimeout(() => {
          localStorage.setItem("authenticated", "true");
          setLocation("/");
        }, 1500);
      }
    }, 2000);
  };

  const handleFallback = () => {
    setLocation("/auth");
  };

  const BiometricIcon = biometricType === "face" ? ScanFace : Fingerprint;
  const biometricText = biometricType === "face" ? "Face ID" : "Touch ID";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardContent className="p-8 text-center space-y-6">
            {/* Security Badge */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-full border border-green-200 dark:border-green-800">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Secure Authentication</span>
              </div>
            </div>

            {/* Biometric Animation */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {authStatus === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                  >
                    <motion.div
                      animate={isAuthenticating ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: isAuthenticating ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <BiometricIcon className={`w-12 h-12 text-primary ${isAuthenticating ? 'animate-pulse' : ''}`} />
                    </motion.div>
                  </motion.div>
                )}

                {authStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                )}

                {authStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-red-100 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto"
                  >
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {authStatus === "idle" && !isAuthenticating && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-xl font-display font-bold text-foreground mb-2">
                      Unlock with {biometricText}
                    </h2>
                    <p className="text-muted-foreground">
                      Place your {biometricType === "face" ? "face" : "finger"} on the sensor
                    </p>
                  </motion.div>
                )}

                {isAuthenticating && (
                  <motion.div
                    key="authenticating"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-xl font-display font-bold text-foreground mb-2">
                      Authenticating...
                    </h2>
                    <p className="text-muted-foreground">
                      Please wait while we verify your identity
                    </p>
                  </motion.div>
                )}

                {authStatus === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-xl font-display font-bold text-green-600 mb-2">
                      Authentication Successful
                    </h2>
                    <p className="text-muted-foreground">
                      Welcome back to FinanceTrack
                    </p>
                  </motion.div>
                )}

                {authStatus === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h2 className="text-xl font-display font-bold text-red-600 mb-2">
                      Authentication Failed
                    </h2>
                    <p className="text-muted-foreground">
                      Please try again or use another method
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {authStatus === "idle" && !isAuthenticating && (
                <Button
                  onClick={handleAuthenticate}
                  className="w-full h-12"
                  size="lg"
                >
                  Authenticate with {biometricText}
                </Button>
              )}

              {authStatus === "error" && (
                <div className="space-y-3">
                  <Button
                    onClick={handleAuthenticate}
                    className="w-full h-12"
                    size="lg"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleFallback}
                    variant="outline"
                    className="w-full"
                  >
                    Use Different Method
                  </Button>
                </div>
              )}

              {authStatus !== "success" && authStatus !== "error" && (
                <Button
                  onClick={handleFallback}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Use different sign-in method
                </Button>
              )}
            </div>

            {/* Security Note */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Your biometric data never leaves your device and is not stored by us.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
