"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Shield,
  Users,
  Target,
  Flame,
  BookOpen,
  Cross,
  Dumbbell,
  Handshake,
  Hammer,
  GraduationCap,
  Swords,
  CheckCircle,
  Zap,
  AlertTriangle,
  Lock,
  Crown,
  Star,
  Play,
  Quote
} from "lucide-react";

const pillars = [
  { id: 'faith', name: 'Faith', description: 'Prayer, Mass, Scripture', color: '#a855f7' },
  { id: 'discipline', name: 'Discipline', description: 'Fitness, Cold, Sleep', color: '#ef4444' },
  { id: 'brotherhood', name: 'Brotherhood', description: 'Pods, Accountability', color: '#22c55e' },
  { id: 'building', name: 'Building', description: 'Projects, Skills', color: '#eab308' },
  { id: 'truth', name: 'Truth', description: 'Reading, Thinking', color: '#06b6d4' },
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
      {/* Ambient Background - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 top-1/2 left-1/4" style={{ animationDelay: '-10s' }} />
      </div>

      {/* HERO */}
      <section className="relative pt-16 md:pt-20 pb-16 md:pb-24 px-4" aria-labelledby="hero-heading">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Filter Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-sm">
              <Lock className="h-4 w-4 text-red-400" />
              <span className="text-red-400 font-medium">Selective Brotherhood. Not everyone who applies is accepted.</span>
            </div>
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

          {/* Headline */}
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight">
            The Argent Order
          </h1>
          <p className="text-xl md:text-2xl text-center text-primary font-medium mb-4">
            The Catholic brotherhood for men who build.
          </p>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Not a community. Not a course. A formation system that transforms men who show up into men who lead.
          </p>

          {/* CTAs */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/join">
              <Button size="lg" className="btn-elegant gap-2 px-8 h-12 text-base">
                <Play className="h-4 w-4" />
                Apply for Membership
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mission">
              <Button variant="outline" size="lg" className="border-border/50 h-12 px-8 text-base">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STICKY VALUE BAR */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap text-sm">
            {pillars.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-muted-foreground">
                <PillarIcon id={item.id} className="h-4 w-4 text-primary" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="py-20 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-red-400/70 uppercase tracking-widest">The Problem</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Most Men Are Exactly Where They Don't Want to Be
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { text: "You know you should be praying more, exercising daily, building something real.", color: "text-red-400" },
              { text: "You have 'potential.' Everyone tells you that. But potential without execution is just a comfortable excuse.", color: "text-orange-400" },
              { text: "Your friends don't challenge you. Your job doesn't require your best.", color: "text-yellow-400" },
              { text: "You tell yourself 'someday.' Someday you'll start that project.", color: "text-primary" },
              { text: "The man you were supposed to become is 10 years away. And counting.", color: "text-primary font-semibold" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-border/50 glass-card">
                <AlertTriangle className={`h-6 w-6 flex-shrink-0 mt-0.5 ${item.color}`} />
                <p className={`text-lg ${item.color}`}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 p-8 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-xl font-medium">
              There's a different way. Not motivation. Not willpower.
            </p>
            <p className="text-primary text-xl font-bold mt-2">
              A system that makes excellence inevitable.
            </p>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Method</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Five Pillars of Formation
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Every member is formed in all five areas. Mastery in all five produces men who lead.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="glass-card p-5 text-center hover:border-primary/30 transition-all">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <PillarIcon id={pillar.id} className="h-8 w-8" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold mb-1">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="py-20 px-4 bg-card/30 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* IS FOR */}
            <div className="glass-card p-8 border-green-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">This Is For Men Who...</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Want faith, discipline, and brotherhood—not just community",
                  "Are ready to be held accountable—really held accountable",
                  "Want to build something that outlasts them",
                  "Accept that discipline is not optional",
                  "Are ready to show up every single day"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* NOT FOR */}
            <div className="glass-card p-8 border-red-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">This Is NOT For Men Who...</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Want to consume content without commitment",
                  "Believe they don't need accountability",
                  "Are looking for a social club or hobby community",
                  "Want instant results without consistent work",
                  "Are not serious about their Catholic faith"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Crown className="h-5 w-5 text-red-500/70 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Tools</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Built for Formation, Not Entertainment
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Every feature drives action. Nothing wastes your time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Flame, title: "Formation Dashboard", desc: "Track your growth across all five pillars.", color: '#a855f7' },
              { icon: Users, title: "Accountability Pods", desc: "Groups of 5 men who hold you accountable.", color: '#22c55e' },
              { icon: Target, title: "Campaigns", desc: "90-day challenges that transform habits.", color: '#ef4444' },
              { icon: BookOpen, title: "Rule of Life", desc: "Build your personal operating system.", color: '#06b6d4' },
              { icon: Shield, title: "Leadership Pipeline", desc: "From Initiate to Steward.", color: '#eab308' },
              { icon: Swords, title: "🛠️ WORKSHOP", desc: "Ship projects. Get accountability.", color: '#f97316' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 hover:border-primary/30 transition-all">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Path</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              How Transformation Happens
            </h2>
            <p className="text-muted-foreground mt-2">Structure creates what motivation cannot.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, title: "Apply & Get Accepted", desc: "Tell us who you are. If you're serious and aligned, you'll receive an invitation within 48 hours." },
              { icon: BookOpen, title: "Build Your Rule of Life", desc: "In the first 72 hours, create your personal operating system with daily habits." },
              { icon: Users, title: "Join a Pod", desc: "Get assigned to a group of 5 men who will hold you accountable—men who won't let you quit." },
              { icon: Zap, title: "Execute Daily", desc: "Log your progress. Track streaks. Pod meetings every week. Campaigns every 90 days." },
              { icon: Crown, title: "Lead Others", desc: "Prove yourself through action. Become a Captain. Mentor new members." },
            ].map((step, i) => (
              <div key={i} className="glass-card p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-primary" />
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Results</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4">
              Men Who Showed Up
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "I was dormant for 5 years. The kit gave me structure when I had none. Then the brotherhood gave me accountability.", name: "Michael R.", role: "Former Navy SEAL, Entrepreneur", badge: "Pod Alpha Leader", result: "184-day streak" },
              { quote: "Every man needs someone who will call him out when he's lying to himself. The brotherhood continues that conversation.", name: "Thomas K.", role: "Deacon, Business Owner", badge: "Steward", result: "Mentored 12 men" },
              { quote: "I've bought $10k+ in courses. This $0 kit did more for my clarity than all of them combined.", name: "Joseph W.", role: "Physician, Father of 5", badge: "Campaign Graduate", result: "3 campaigns completed" },
              { quote: "The system works. By month two, I had my first paying client from a project I started in the Order.", name: "Patrick M.", role: "Father of 3, Software Engineer", badge: "Builder", result: "First product shipped" },
            ].map((t, i) => (
              <div key={i} className="glass-card p-6 relative">
                <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/20" />
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400/80 text-xs font-medium">{t.badge}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{t.result}</span>
                </div>
                <p className="text-lg mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="border-t border-border/50 pt-4">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="glass-card p-12 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px]" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Begin?
              </h2>

              <p className="text-muted-foreground mb-8 text-lg">
                Get the Catholic Builder Starter Kit—free. No credit card.
              </p>

              <Link href="/join">
                <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
                  <Play className="h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-6">
                $247 value — Yours free
              </p>
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
