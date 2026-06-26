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
  Shield,
  ThumbsUp,
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
        
        <div className="text-center max-w-xl mx-auto px-4 relative z-10">
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
          
          <div className="glass-card p-6 space-y-4 text-left max-w-md mx-auto">
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
              Read our Mission →
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

      {/* HERO - HORMOZI: Strong headline, one outcome */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 px-4" aria-labelledby="join-heading">
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          
          {/* HORMOZI: Founding frame */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm mb-8">
            <span className="text-primary font-medium">
              Founding Cohort — Be Part of the Foundation
            </span>
          </div>

          <h1 id="join-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Not a community.
            <br />
            <span className="text-primary">A forge.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-lg mx-auto">
            Not a community where you talk about change. A forge where you become the man you were meant to be.
          </p>
          
          <p className="text-lg text-primary font-medium mb-6">
            In 90 days: A Rule of Life. 5 Accountability Partners. Projects Shipped.
          </p>

          {/* HORMOZI: Scroll to form */}
          <a
            href="#apply"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 mb-4"
          >
            <Zap className="h-6 w-6" />
            Enter The Forge
            <ArrowRight className="h-6 w-6" />
          </a>

          <div className="mt-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Already a member? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET - Quick wins before form */}
      <section className="py-12 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-xl font-bold mb-6 text-center">What happens when you join:</h2>
          
          <div className="space-y-4">
            {[
              { icon: Users, title: "Instant Discord Access", desc: "Join the brotherhood immediately" },
              { icon: Shield, title: "Get Assigned to 5 Men", desc: "A pod who holds you accountable daily" },
              { icon: Zap, title: "Start Your First Campaign", desc: "Structured 90-day challenges" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - The conversion point */}
      <section id="apply" className="py-16 md:py-24 px-4 relative scroll-mt-20">
        <div className="max-w-md mx-auto relative z-10">
          <div className="glass-card p-8 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-primary/20 blur-[80px]" />
            
            <div className="relative">
              <h2 className="text-2xl font-bold mb-3">
                Enter The Forge
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Get instant access to Discord + Portal.
                <br />
                <span className="text-primary font-medium">100% Free. The only investment: your commitment.</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-4 rounded-xl border border-border bg-background/50 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-bold btn-elegant"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Entering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enter The Forge <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDING COHORT - Bottom, soft persuasion */}
      <section className="py-12 px-4 bg-card/50 relative">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            
            <h2 className="text-lg font-bold mb-2">Founding Cohort Benefits</h2>
            
            <p className="text-muted-foreground text-sm mb-4">
              The first 100 don't just join. They found.
            </p>

            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center">
                <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-bold text-sm">Name in charter</p>
                <p className="text-xs text-muted-foreground">Forever</p>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-bold text-sm">Direct to founders</p>
                <p className="text-xs text-muted-foreground">Private access</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-bold text-sm">Permanent badge</p>
                <p className="text-xs text-muted-foreground">Always</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-4 border-t border-border/50 bg-card/50 relative z-10">
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
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
