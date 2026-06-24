"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Loader2, Sword, Mail, Lock, CheckCircle, Shield } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="ambient-orb w-[500px] h-[500px] bg-primary/5 -top-40 -left-40" />
          <div className="ambient-orb w-[400px] h-[400px] bg-green-500/3 bottom-0 right-0" style={{ animationDelay: '-5s' }} />
        </div>
        <div className="w-full max-w-md px-4 relative z-10">
          <div className="glass-card p-8 md:p-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-float">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">You're In</h1>
            <p className="text-muted-foreground mb-6">
              Check your email at <strong className="text-foreground">{email}</strong>.
              Click the link to activate your account.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-6">
              After activation, you'll receive onboarding instructions to begin your formation journey.
            </p>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center relative">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/5 -top-40 -left-40" />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/3 bottom-0 right-0" style={{ animationDelay: '-7s' }} />
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-float">
              <Sword className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-sm text-muted-foreground">
              Join the brotherhood and begin your formation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                After signup, you'll receive onboarding instructions to begin your 72-hour formation activation.
              </p>
            </div>

            <Button type="submit" className="w-full btn-elegant h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
