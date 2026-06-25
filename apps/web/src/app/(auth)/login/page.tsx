"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Sword, Mail, Lock, Flame, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "auth_error") {
      setError("Authentication failed. Please try again.");
    } else if (errorParam === "no_code") {
      setError("Invalid authentication link. Please try again.");
    } else if (errorParam === "email_required") {
      setError("Discord account needs an email. Please add an email to your Discord account and try again.");
    } else if (errorParam === "oauth_error") {
      setError("Discord authentication failed. Please try again.");
    } else if (searchParams.get("check_email") === "1") {
      setSuccess("Check your email for a magic link to sign in!");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold mb-2">Welcome Back, Brother</h1>
            <p className="text-sm text-muted-foreground">
              Catholic men. Forged in discipline.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {success && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-500 flex items-center gap-3">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
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
                  disabled={loading}
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
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-elegant h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <Flame className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Not yet a member?{" "}
              <Link href="/join" className="text-primary hover:underline font-medium">
                Join The Order
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
