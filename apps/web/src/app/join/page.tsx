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
  Crown,
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

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 px-4" aria-labelledby="join-heading">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm mb-8">
            <span className="text-green-400 font-medium">Free. Forever. No monetization.</span>
          </div>

          <h1 id="join-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            A brotherhood for men who{" "}
            <span className="text-primary">build with purpose.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Catholic men. Forged in discipline. Not a community. A forge.
          </p>

          <a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 mb-4"
          >
            <Play className="h-5 w-5" />
            Join the Order
            <ArrowRight className="h-5 w-5" />
          </a>
          
          <p className="text-sm text-muted-foreground">
            Discord + Portal access →
          </p>
        </div>
      </section>

      {/* PILLARS + HOW IT WORKS (COMBINED) */}
      <section className="py-12 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold">
              Five Pillars of Formation
            </h2>
          </div>
          
          <div className="grid grid-cols-5 gap-3 mb-10">
            {pillars.map((pillar, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-5 w-5" style={{ color: pillar.color }} />
                </div>
                <p className="text-xs font-bold">{pillar.name}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">Campaigns</h3>
              <p className="text-xs text-muted-foreground">90-day structured challenges</p>
            </div>
            
            <div className="glass-card p-5 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">Pods</h3>
              <p className="text-xs text-muted-foreground">5 men. Weekly meetings.</p>
            </div>
            
            <div className="glass-card p-5 text-center">
              <Crown className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">Rule of Life</h3>
              <p className="text-xs text-muted-foreground">Your personal GPS</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOUND FAMILIAR + FOR WHO (COMBINED) */}
      <section className="py-12 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Sound familiar?
          </h2>
          
          <div className="space-y-2 mb-6">
            {[
              "You know you should be doing more. You just aren't.",
              "Your friends are comfortable. You want more.",
              "Someday never comes.",
              "Potential without execution is just an excuse.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 glass-card">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <p className="text-sm">{text}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
            <p className="text-sm font-medium">
              The problem isn't motivation. It's <span className="text-primary font-bold">structure</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-4 border-green-500/20">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                This is for men who...
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Want brotherhood, not another chat</li>
                <li>• Are tired of potential</li>
                <li>• Will show up even when they don't feel like it</li>
              </ul>
            </div>

            <div className="glass-card p-4 border-red-500/20">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                This is NOT for men who...
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Want a casual community to kill time</li>
                <li>• Aren't willing to be held accountable</li>
                <li>• Want results without putting in work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="apply" className="py-12 md:py-16 px-4 relative scroll-mt-20">
        <div className="max-w-md mx-auto relative z-10">
          <div className="glass-card p-8 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-primary/20 blur-[80px]" />
            
            <div className="relative">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                Join The Order
              </h2>
              
              <p className="text-muted-foreground mb-6 text-sm">
                Enter your email. Get instant access.
                <br />
                <span className="text-primary font-medium">100% Free.</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-3 rounded-xl border border-border bg-background/50 text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-base font-bold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Join Free <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
              
              <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Instant
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Free forever
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-border/50 bg-card/50 relative z-10">
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
            <Link href="/constitution" className="hover:text-foreground">Constitution</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
