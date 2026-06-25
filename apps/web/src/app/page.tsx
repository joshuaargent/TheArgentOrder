"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Cross,
  Dumbbell,
  Handshake,
  Hammer,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  Lock,
  Loader2,
  Users,
  Shield,
} from "lucide-react";

const pillars = [
  { id: 'faith', name: 'Faith', color: '#a855f7' },
  { id: 'discipline', name: 'Discipline', color: '#ef4444' },
  { id: 'brotherhood', name: 'Brotherhood', color: '#22c55e' },
  { id: 'building', name: 'Building', color: '#eab308' },
  { id: 'truth', name: 'Truth', color: '#06b6d4' },
];

const PillarIcon = ({ id, className, style }: { id: string; className?: string; style?: React.CSSProperties }) => {
  switch (id) {
    case 'faith': return <Cross className={className} style={style} />;
    case 'discipline': return <Dumbbell className={className} style={style} />;
    case 'brotherhood': return <Handshake className={className} style={style} />;
    case 'building': return <Hammer className={className} style={style} />;
    case 'truth': return <GraduationCap className={className} style={style} />;
    default: return null;
  }
};

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, leadMagnet: 'CATHOLIC_BUILDER_STARTER' }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen mesh-gradient flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-8">Your access links are on the way. Check your inbox.</p>
          <Link href="/mission" className="text-primary hover:underline text-sm">
            Read our Mission →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 top-1/2 left-1/4" style={{ animationDelay: '-10s' }} />
      </div>

      {/* HERO - HORMOZI STYLE: ONE CLEAR OFFER */}
      <section className="relative pt-8 md:pt-12 pb-16 md:pb-24 px-4" aria-labelledby="hero-heading">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          {/* Filter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-sm mb-6">
            <Lock className="h-4 w-4 text-red-400" />
            <span className="text-red-400 font-medium">100% Free. No monetization.</span>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg className="h-24 w-24 animate-float" viewBox="0 0 48 48" fill="none">
                <rect x="21" y="4" width="6" height="40" rx="1" className="fill-primary"/>
                <rect x="8" y="14" width="32" height="6" rx="1" className="fill-primary"/>
                <path d="M24 38L20 48H28L24 38Z" className="fill-primary opacity-30"/>
              </svg>
              <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-50" />
            </div>
          </div>

          {/* HORMOZI: ONE HEADLINE - PICK THE STRONGEST */}
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight">
            Not a community.
            <br />
            <span className="text-primary">A forge.</span>
          </h1>

          {/* HORMOZI: SPECIFIC OUTCOME PROMISE */}
          <p className="text-xl md:text-2xl text-center mb-8 text-muted-foreground">
            In 90 days, you'll have a Rule of Life, 5 accountability partners, and completed projects.
          </p>

          {/* HORMOZI: EMAIL CAPTURE ABOVE THE FOLD */}
          <div className="glass-card p-6 md:p-8 max-w-lg mx-auto mb-8">
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
                className="w-full h-12 text-base font-bold btn-elegant"
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
            <p className="text-xs text-muted-foreground mt-3">Instant access to Discord + Portal</p>
          </div>

          {/* Social proof placeholder */}
          <p className="text-sm text-muted-foreground">
            Join the founding cohort of Catholic men building with purpose
          </p>
        </div>
      </section>

      {/* STICKY VALUE BAR */}
      <div className="sticky top-[65px] z-40 bg-card/95 backdrop-blur-md border-b border-border/50 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap text-sm">
            {pillars.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-muted-foreground">
                <PillarIcon id={item.id} className="h-4 w-4 text-primary" />
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE PROBLEM */}
      <section className="py-16 md:py-20 px-4 relative">
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
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-border/50 glass-card">
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

      {/* THE FIVE PILLARS - User explicitly wanted to keep */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Five Pillars of Formation
          </h2>
          <p className="text-center text-muted-foreground mb-8">Build your life on these foundations</p>

          <div className="grid grid-cols-5 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="glass-card p-5 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <PillarIcon id={pillar.id} className="h-6 w-6" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold text-sm">{pillar.name}</h3>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-5 gap-3 mt-4">
            {[
              'Prayer • Mass • Scripture',
              'Cold • Fitness • Sleep',
              'Pods • Accountability',
              'Projects • Skills',
              'Reading • Thinking',
            ].map((desc, i) => (
              <p key={i} className="text-xs text-muted-foreground text-center">{desc}</p>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - HORMOZI STYLE: SPECIFIC */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            How It Works
          </h2>

          <div className="space-y-4">
            {[
              { title: "Join Discord", desc: "Get immediate access to the brotherhood" },
              { title: "Get Assigned to 5 Men", desc: "A pod who will hold you accountable daily" },
              { title: "Execute 90-Day Campaigns", desc: "Structured challenges with measurable outcomes" },
            ].map((step, i) => (
              <div key={i} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET - HORMOZI: VALUE STACK */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            What You Get
          </h2>
          <p className="text-center text-muted-foreground mb-8">Everything you need to build with purpose</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Cross, color: '#a855f7', title: 'Daily Formation', desc: 'Prayer, scripture, examen. Build your spiritual life.' },
              { icon: Dumbbell, color: '#ef4444', title: 'Discipline Training', desc: 'Cold showers, workouts, sleep tracking. Forge your body.' },
              { icon: Handshake, color: '#22c55e', title: 'Accountability Pod', desc: '5 men who text you when you miss a day.' },
              { icon: Hammer, color: '#eab308', title: '90-Day Campaigns', desc: 'Structured challenges. Ship projects. Build momentum.' },
              { icon: GraduationCap, color: '#06b6d4', title: 'Rule of Life', desc: 'Your personal GPS. Know what to do every day.' },
              { icon: CheckCircle, color: '#8b5cf6', title: 'Achievement System', desc: 'Track your formation. Earn certifications.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="glass-card p-5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-muted-foreground">
              Combined value: <span className="text-primary font-bold text-lg">$2,400/year</span> in coaching, community, and structure
            </p>
            <p className="text-sm text-muted-foreground mt-1">You get it all free. No monetization. Ever.</p>
          </div>
        </div>
      </section>

      {/* FOUNDING COHORT - HORMOZI: HONEST NO-PROOF STRATEGY */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Be Among The First
          </h2>

          <div className="glass-card p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-xl font-bold mb-4">Join the Founding Cohort</h3>
            
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              We're building The Argent Order together. No fake testimonials. 
              Just men committed to the forge—accountability, structure, and formation.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: Shield, title: "Shape the System", desc: "Your feedback shapes how we build" },
                { icon: CheckCircle, title: "Founding Member", desc: "Permanent founding cohort status" },
                { icon: Users, title: "Early Access", desc: "Direct access to founders" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHO */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 border-green-500/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                This is for men who...
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Want brotherhood, not another group chat",
                  "Are tired of potential",
                  "Will show up even when they don't feel like it",
                  "Want to build something that matters",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                This is NOT for men who...
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Want a casual community to kill time",
                  "Aren't willing to be held accountable",
                  "Think faith and discipline don't mix",
                  "Want results without putting in work",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="glass-card p-8 md:p-10 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Begin?
              </h2>
              <p className="text-muted-foreground mb-8">
                Enter your email. Get instant access to Discord + Portal.
                <br />
                <span className="text-primary font-medium">100% Free. No monetization.</span>
              </p>
              <Link href="/join">
                <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
                  <Play className="h-5 w-5" />
                  Join Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
