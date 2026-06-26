"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  ArrowRight, 
  CheckCircle, 
  Users,
  Zap,
  Loader2,
  ThumbsUp,
  Hammer,
  Cross,
} from "lucide-react";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          leadMagnet: 'CATHOLIC_BUILDER_STARTER'
        }),
      });
      
      const data = await response.json();
      
      if (data.success || data.warning) {
        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen mesh-gradient flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="ambient-orb w-[800px] h-[800px] bg-green-500/5 -top-48 -left-48" />
          <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 bottom-0 right-0" />
        </div>
        
        <div className="w-full max-w-md mx-auto px-6 text-center relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-6">
            <ThumbsUp className="h-4 w-4" />
            Welcome to The Order
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Check your email.
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Your access links are on the way.
          </p>
          
          <div className="glass-card p-6 space-y-4 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Join Discord</h3>
                <p className="text-sm text-muted-foreground">Click the link to join the brotherhood</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Access Portal</h3>
                <p className="text-sm text-muted-foreground">Your account is ready</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/mission" className="text-primary hover:underline text-sm">
              Read our Mission
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      {/* HORMOZI: Centered, minimal, CTA above fold */}
      <section className="min-h-screen flex items-center justify-center px-6" aria-labelledby="join-heading">
        <div className="w-full max-w-lg mx-auto relative z-10 text-center">
          
          {/* Founding Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm mb-8">
            <span className="text-primary font-medium">
              ⚡ Founding Cohort Open
            </span>
          </div>

          {/* HORMOZI: Punchy headline */}
          <h1 id="join-heading" className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
            Not a community.
            <br />
            <span className="text-primary">A forge.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Catholic men who execute. Ship. Lead.
          </p>
          
          <p className="text-lg text-primary font-medium mb-10">
            90 days. 5 accountability partners. Real transformation.
          </p>

          {/* HORMOZI: Primary CTA */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-6 py-5 rounded-2xl border border-border bg-background/80 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-sm"
            />
            <Button 
              type="submit" 
              disabled={loading} 
              size="lg"
              className="w-full h-16 text-xl font-bold btn-elegant gap-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Entering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Enter The Forge <ArrowRight className="h-6 w-6" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mb-10">
            <span className="text-primary font-medium">100% Free</span> &nbsp;&nbsp; No credit card &nbsp;&nbsp; Catholic men only
          </p>

          {/* What you get */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="glass-card p-5">
              <Cross className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="font-bold text-sm">Rule of Life</p>
            </div>
            <div className="glass-card p-5">
              <Users className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="font-bold text-sm">5 Brothers</p>
            </div>
            <div className="glass-card p-5">
              <Hammer className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="font-bold text-sm">Ship Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-border/50 bg-card/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
              <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
            </svg>
            <span className="font-bold text-sm">The Argent Order</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/mission" className="hover:text-foreground">Mission</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
