"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  ArrowRight, 
  CheckCircle, 
  Cross, 
  Dumbbell, 
  Handshake, 
  Hammer, 
  GraduationCap, 
  AlertTriangle,
  Users,
  Zap,
  Loader2,
  Target,
  Play,
  ThumbsUp,
  Crown
} from "lucide-react";

const pillars = [
  { name: "Faith", icon: Cross, color: "#a855f7", desc: "Prayer, Mass, Scripture" },
  { name: "Discipline", icon: Dumbbell, color: "#ef4444", desc: "Fitness, Cold, Sleep" },
  { name: "Brotherhood", icon: Handshake, color: "#22c55e", desc: "Pods, Accountability" },
  { name: "Building", icon: Hammer, color: "#eab308", desc: "Projects, Skills" },
  { name: "Truth", icon: GraduationCap, color: "#06b6d4", desc: "Reading, Thinking" },
];

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
          <div className="w-28 h-28 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-6">
            <ThumbsUp className="h-4 w-4" />
            Welcome to The Order
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Check your email.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your access links are on the way.
          </p>
          
          <div className="glass-card p-8 space-y-6 text-left">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Join Discord</h3>
                <p className="text-muted-foreground">Click the link in your email to join the brotherhood</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Access Portal</h3>
                <p className="text-muted-foreground">Your account is ready. Start your formation.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/mission" className="text-primary hover:underline">
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

      {/* HERO */}
      <section className="relative pt-20 md:pt-28 pb-16 px-4" aria-labelledby="join-heading">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm mb-8">
            <span className="text-green-400 font-medium">Free. Forever. No monetization.</span>
          </div>

          <h1 id="join-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            A brotherhood for men who{" "}
            <span className="text-primary">build with purpose.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            The Argent Order is a formation system for Catholic men. 
            Five pillars. Structured progression. Real accountability.
          </p>

          <a
            href="#apply"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 mb-4"
          >
            <Play className="h-6 w-6" />
            Join The Order
            <ArrowRight className="h-6 w-6" />
          </a>
          
          <p className="text-muted-foreground">
            Discord + Portal access →
          </p>
        </div>
      </section>

      {/* WHAT IS THIS */}
      <section className="py-16 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Five Pillars of Formation
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pillars.map((pillar, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-7 w-7" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold mb-1">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Campaigns</h3>
              <p className="text-sm text-muted-foreground">
                90-day structured challenges. Set goals. Track progress. Ship results.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Pods</h3>
              <p className="text-sm text-muted-foreground">
                Groups of 5 men. Assigned, not chosen. Weekly meetings. Real accountability.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Rule of Life</h3>
              <p className="text-sm text-muted-foreground">
                Build your personal framework. 12 categories. The GPS for your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-16 px-4 bg-card/50 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Sound familiar?
          </h2>
          
          <div className="space-y-4">
            {[
              "You know you should be doing more. You just aren't.",
              "Your friends are comfortable. You want more.",
              "You tell yourself 'someday' but someday never comes.",
              "Potential without execution is just an excuse.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 glass-card">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-3 flex-shrink-0" />
                <p className="text-lg">{text}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-lg font-medium">
              The problem isn't motivation. It's <span className="text-primary font-bold">structure</span>.
            </p>
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="py-16 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            This is for men who...
          </h2>
          
          <div className="space-y-3">
            {[
              "Want brotherhood, not just another group chat",
              "Are tired of potential and ready to execute",
              "Will show up even when they don't feel like it",
              "Want to build something that matters",
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOT FOR */}
      <section className="py-16 px-4 bg-card/50 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            This is NOT for men who...
          </h2>
          
          <div className="space-y-3">
            {[
              "Want a casual community to kill time",
              "Aren't willing to be held accountable",
              "Think faith and discipline don't go together",
              "Want instant results without putting in work",
            ].map((req, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-lg">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="apply" className="py-24 px-4 relative scroll-mt-20">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="glass-card p-10 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px]" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join The Argent Order
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Enter your email. Get access to Discord + Portal.
                <br />
                <span className="text-primary font-medium">100% Free. No monetization.</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-6 py-4 rounded-xl border border-border bg-background/50 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-bold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Join The Order <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
              
              <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-border/50 bg-card/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
              <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
            </svg>
            <span className="font-bold text-lg">The Argent Order</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
            <Link href="/constitution" className="hover:text-foreground transition-colors">Constitution</Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
