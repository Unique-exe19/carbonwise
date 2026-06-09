"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-glass p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-lg shadow-emerald-500/20">
            <Leaf className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-gradient">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Sign in to track your carbon footprint
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                  "bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-600",
                  "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                  "transition-all duration-200 outline-none",
                )}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-zinc-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  "w-full pl-10 pr-12 py-2.5 rounded-xl text-sm",
                  "bg-white/[0.03] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-600",
                  "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                  "transition-all duration-200 outline-none",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label="Sign in to your account"
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold",
              "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
              "hover:brightness-110 shadow-lg shadow-emerald-500/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 cursor-pointer",
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Demo account */}
        <button
          aria-label="Sign in with demo account"
          onClick={async () => {
            setLoading(true);
            setError("");
            try {
              let result = await signIn("credentials", {
                email: "demo@carbonwise.app",
                password: "demo1234",
                redirect: false,
              });

              if (result?.error) {
                // Self-healing: Register the demo user silently if login fails
                const regRes = await fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: "Demo User",
                    email: "demo@carbonwise.app",
                    password: "demo1234",
                  }),
                });

                if (regRes.ok || regRes.status === 409) {
                  // Retry signing in after successful registration
                  result = await signIn("credentials", {
                    email: "demo@carbonwise.app",
                    password: "demo1234",
                    redirect: false,
                  });
                }
              }

              if (result?.error) {
                setError("Failed to initialize demo session. Please try again.");
              } else {
                router.push("/dashboard");
                router.refresh();
              }
            } catch {
              setError("An unexpected error occurred. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium",
            "bg-white/[0.05] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.06]",
            "transition-all duration-200 cursor-pointer",
          )}
        >
          <Leaf className="w-4 h-4 text-emerald-400" /> Try Demo Account
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-400 hover:text-emerald-300 hover:underline font-medium"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
