import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Shield, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Splash() {
  const [, setLocation] = useLocation();

  // Auto-redirect after 3 seconds for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/auth");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        {/* Logo and Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Finance<span className="text-primary">Track</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your finances securely
            </p>
          </div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center space-x-4"
        >
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-full border border-green-200 dark:border-green-800">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Bank-level Security</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-800">
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">End-to-End Encrypted</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={() => setLocation("/auth")}
            size="lg"
            className="w-full h-12 text-base font-medium"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
