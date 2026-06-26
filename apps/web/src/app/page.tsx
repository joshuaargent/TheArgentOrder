"use client";

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
  Users,
  Shield,
  Zap,
} from "lucide-react";

const pillars = [
  { id: 'faith', name: 'Faith', color: '#a855f7', outcome: 'A prayer habit that actually sticks' },
  { id: 'discipline', name: 'Discipline', color: '#ef4444', outcome: 'Energy to lead your family, not excuses' },
  { id: 'brotherhood', name: 'Brotherhood', color: '#22c55e', outcome: '5 men who text when you miss a day' },
  { id: 'building', name: 'Building', color: '#eab308', outcome: 'Projects you ship, not just plan' },
  { id: 'truth', name: 'Truth', color: '#06b6d4', outcome: 'Clarity on what matters and what doesn\'t' },
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
  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 top-1/2 left-1/4" style={{ animationDelay: '-10s' }} />
      </div>

      {/* HERO */}
      <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 px-4" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg className="h-20 w-20 animate-float" viewBox="0 0 48 48" fill="none">
                <rect x="21" y="4" width="6" height="40" rx="1" className="fill-primary"/>
                <rect x="8" y="14" width="32" height="6" rx="1" className="fill-primary"/>
                <path d="M24 38L20 48H28L24 38Z" className="fill-primary opacity-30"/>
              </svg>
              <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-50" />
            </div>
          </div>

          {/* HORMOZI HEADLINE: Clear brand identity */}
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
            The Argent Order
          </h1>

          {/* Sub-headline: describes what it is */}
          <p className="text-xl md:text-2xl text-center text-muted-foreground mb-8">
            Catholic men serious about faith, discipline, and purpose.
          </p>

          {/* HORMOZI CTAs: Clear action + secondary as text */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/join">
              <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg w-full sm:w-auto">
                <Zap className="h-5 w-5" />
                Enter The Forge
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Already a member? Sign in →
            </Link>
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Sound familiar, Catholic man?
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

          {/* HORMOZI: Agitation - pivot to solution */}
          <div className="text-center mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-lg font-medium text-red-400">
              The problem isn't your motivation.
            </p>
            <p className="text-lg font-medium mt-1">
              The problem is you're doing it <span className="font-bold">alone</span>.
            </p>
          </div>
        </div>
      </section>

      {/* THE FIVE PILLARS - HORMOZI: Outcomes, not features */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Five Pillars of Formation
          </h2>
          <p className="text-center text-muted-foreground mb-8">What you actually get</p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="glass-card p-5 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <PillarIcon id={pillar.id} className="h-6 w-6" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold text-sm mb-2">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.outcome}</p>
              </div>
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

      {/* WHAT YOU GET - HORMOZI: OUTCOMES, NOT FEATURES */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            In 90 Days, You'll Have:
          </h2>
          <p className="text-center text-muted-foreground mb-8">The structure most men never build</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, color: '#06b6d4', title: 'A Rule of Life', outcome: 'Wake up knowing exactly what to do every day' },
              { icon: Handshake, color: '#22c55e', title: '5 Brothers', outcome: 'Men who text when you miss a day' },
              { icon: Hammer, color: '#eab308', title: 'Completed Projects', outcome: 'Shipped something real, not just ideas' },
              { icon: Cross, color: '#a855f7', title: 'Consistent Prayer', outcome: 'Daily prayer habit you thought impossible' },
              { icon: Dumbbell, color: '#ef4444', title: 'A Body Ready', outcome: 'Energy to lead your family, not excuses' },
              { icon: CheckCircle, color: '#8b5cf6', title: 'Evidence of Growth', outcome: 'Metrics that prove you showed up' },
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
                  <p className="text-sm text-muted-foreground">{item.outcome}</p>
                </div>
              );
            })}
          </div>

          {/* HORMOZI: Founding frame - no fake social proof with 0 members */}
          <div className="text-center mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-muted-foreground">
              <span className="text-primary font-bold">Founding Cohort</span> — Shape the Order from Day 1
            </p>
            <p className="text-sm text-muted-foreground mt-1">100% Free. The only investment: your commitment.</p>
          </div>
        </div>
      </section>

      {/* FOUNDING COHORT - HORMOZI: Zero members = founding frame */}
      <section className="py-16 md:py-20 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            The First 100 Don't Just Join.
          </h2>
          <p className="text-center text-muted-foreground mb-8">They Found.</p>

          <div className="glass-card p-8 md:p-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
              {[
                { icon: Shield, title: "Your name in the charter—forever", desc: "When future men join, they'll see you were there from the beginning. That's permanent." },
                { icon: Users, title: "Direct line to founders", desc: "Private Discord access. Your voice shapes how we build." },
                { icon: CheckCircle, title: "Founding member badge", desc: "Even when we scale to thousands, you keep your founding status." },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-4">
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
        </div>
      </section>

      {/* THE 90-DAY JOURNEY - HORMOZI: Show the structure */}
      <section className="py-16 md:py-20 px-4 bg-card/50 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Your First 90 Days
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { days: "Days 1-7", title: "Orientation", tasks: "Rule of Life. Constitution. First Check-In." },
              { days: "Days 8-30", title: "Foundation", tasks: "Daily Prayer. Scripture. First Campaign." },
              { days: "Days 31-60", title: "Consistency", tasks: "Pod Meetings. Weekly Reviews. Formation." },
              { days: "Days 61-90", title: "Integration", tasks: "Complete Campaign. Build Relationships." },
            ].map((phase, i) => (
              <div key={i} className="glass-card p-5">
                <div className="text-xs text-primary font-medium mb-2">{phase.days}</div>
                <h3 className="font-bold mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.tasks}</p>
              </div>
            ))}
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
              <ul className="space-y-3 text-sm">
                {[
                  "Want brotherhood, not another group chat",
                  "Are tired of potential",
                  "Will show up even when they don't feel like it",
                  "Want to build something that matters",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                This is NOT for men who...
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Want a casual community to kill time",
                  "Aren't willing to be held accountable",
                  "Think faith and discipline don't mix",
                  "Want results without putting in work",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HORMOZI: Soft CTA for qualified leads */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Still reading? You're probably the right fit.{' '}
            <Link href="/join" className="text-primary hover:underline font-medium">
              Enter the forge →
            </Link>
          </p>
        </div>
      </section>

      {/* FINAL CTA - HORMOZI: Single action */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="glass-card p-8 md:p-10 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Begin?
              </h2>
              <p className="text-muted-foreground mb-8">
                Get instant access to Discord + Portal.
                <br />
                <span className="text-primary font-medium">100% Free. No monetization.</span>
              </p>
              <Link href="/join">
                <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
                  <Zap className="h-5 w-5" />
                  Enter The Forge
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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in →
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
