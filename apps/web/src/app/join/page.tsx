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
  Shield,
  AlertTriangle,
  Users,
  Zap,
  Star,
  Lock,
  ChevronDown,
  Mail
} from "lucide-react";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessDetails, setShowSuccessDetails] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  const handleGetStarted = () => {
    const element = document.getElementById('get-started');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const pillars = [
    { 
      name: "Faith", 
      icon: Cross, 
      desc: "Daily prayer, Mass, Scripture. Building the foundation that everything else rests on.",
      color: "#a855f7",
      stat: "Daily Prayer"
    },
    { 
      name: "Discipline", 
      icon: Dumbbell, 
      desc: "Physical fitness, cold exposure, strict sleep. Your body is your instrument.",
      color: "#ef4444",
      stat: "90-Day Campaigns"
    },
    { 
      name: "Brotherhood", 
      icon: Handshake, 
      desc: "Pods of men who hold you accountable. Real relationships. Real consequences.",
      color: "#22c55e",
      stat: "Weekly Meetings"
    },
    { 
      name: "Building", 
      icon: Hammer, 
      desc: "Projects, skills, creation. Leave something of permanent value behind.",
      color: "#eab308",
      stat: "Ship Weekly"
    },
    { 
      name: "Truth", 
      icon: GraduationCap, 
      desc: "Catholic intellectual tradition. Apologetics. Deep thinking. No comfort zones.",
      color: "#06b6d4",
      stat: "Daily Reading"
    },
  ];

  const transformations = [
    {
      title: "From Dreaming to Doing",
      quote: "I had 47 unfinished projects. After 90 days in a campaign, I shipped my first product. The system forces action.",
      name: "Marcus T.",
      role: "Former: 'Someday Maybe' | Now: Builder",
      badge: "90-Day Graduate"
    },
    {
      title: "From Isolated to Accountable",
      quote: "I was the guy who said 'I don't need anyone.' My pod called me out. Now I check in with them before anyone else.",
      name: "James R.",
      role: "Single | Pod Alpha | 180 Days",
      badge: "Pod Leader"
    },
    {
      title: "From Scattered to Focused",
      quote: "Multitasking was my identity. The Rule of Life gave me boundaries I didn't know I needed. My output tripled.",
      name: "David M.",
      role: "Father of 4 | Entrepreneur | 1 Year",
      badge: "Consistency King"
    }
  ];

  const objections = [
    {
      question: "I'm not Catholic. Is this for me?",
      answer: "The Order is Catholic in foundation. But men of any faith who respect Catholic tradition are welcome. What matters is alignment with the pillars."
    },
    {
      question: "I don't have time for another commitment.",
      answer: "You don't have time NOT to do this. 30 minutes daily. That's the minimum. The men here are busier than you—they've just prioritized better."
    },
    {
      question: "What if I fail?",
      answer: "You will fail. The question is whether you have a system to learn from failure. We do. Failure in the Order means growth, not expulsion."
    },
    {
      question: "I'm not sure I'm 'that kind' of man.",
      answer: "None of us were. That's why we built this. If you want to become him, you belong here. If you're already perfect, you don't."
    }
  ];

  const requirements = [
    "You believe men need brotherhood to be great",
    "You're willing to be held accountable—really held accountable",
    "You want to build something that outlasts you",
    "You accept that discipline is not optional",
    "You're ready to show up every single day"
  ];

  const whatYouGet = [
    {
      icon: Star,
      title: "Rule of Life System",
      desc: "Your personal operating system. Built in the first 48 hours."
    },
    {
      icon: Users,
      title: "Pod of 5 Men",
      desc: "Assigned, not chosen. Accountability you can't escape."
    },
    {
      icon: Zap,
      title: "90-Day Campaign",
      desc: "Structured transformation with daily actions and weekly check-ins."
    },
    {
      icon: Shield,
      title: "Formation Dashboard",
      desc: "Track your growth across all five pillars. See what's working."
    }
  ];

  if (submitted) {
    return (
      <main className="min-h-screen mesh-gradient flex items-center justify-center relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
          <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-0 right-0" style={{ animationDelay: '-5s' }} />
        </div>
        
        <div className="text-center max-w-xl mx-auto px-4 relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-float">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">You're In</h1>
          <p className="text-muted-foreground text-lg mb-4">
            Check your email. You'll receive next steps to continue.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            If this is for you, we'll guide you through the process.
          </p>
          
          <div className="glass-card p-6 text-left text-sm animate-slide-up">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              What Happens Next
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">1</span>
                </div>
                <p><strong>Check your email</strong> for formation resources and guidance</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">2</span>
                </div>
                <p><strong>Email sequence</strong> with truth exposure and identity shift content</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">3</span>
                </div>
                <p><strong>Invitation</strong> to join our brotherhood and complete 72-hour activation</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mesh-gradient relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 top-1/2 left-1/4" style={{ animationDelay: '-10s' }} />
      </div>

      {/* HERO SECTION - Hook & Identity */}
      <section className="min-h-screen flex items-center justify-center px-4 py-24 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Filter Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8">
            <Lock className="h-4 w-4" />
            <span>Selective Brotherhood. Not everyone who applies is accepted.</span>
          </div>
          
          <div className="mb-10 flex justify-center animate-float">
            <div className="relative">
              <svg className="h-24 w-24" viewBox="0 0 48 48" fill="none">
                <rect x="21" y="4" width="6" height="40" rx="1" className="fill-primary"/>
                <rect x="8" y="14" width="32" height="6" rx="1" className="fill-primary"/>
                <path d="M24 38L20 48H28L24 38Z" className="fill-primary opacity-30"/>
              </svg>
              <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-50" />
            </div>
          </div>
          
          {/* Core Identity Statement */}
          <h1 className="text-display mb-6">The Argent Order</h1>
          
          {/* Positioning Statement - Specific */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto font-medium">
            The Catholic brotherhood for men who build.
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-xl mx-auto">
            Not a community. Not a course. Not a podcast. A formation system that transforms men who show up into men who lead.
          </p>

          <Button onClick={handleGetStarted} size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
            See If You're Ready <ArrowRight className="h-5 w-5" />
          </Button>
          
          <p className="text-sm text-muted-foreground/60 mt-6">
            No commitment required to apply. Acceptance is selective.
          </p>
        </div>
      </section>

      {/* PROBLEM STATEMENT - Confrontation */}
      <section className="py-24 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Problem</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Most Men Are Exactly Where They Don't Want to Be</h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
              <AlertTriangle className="h-6 w-6 text-red-500/70 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  You <span className="text-foreground font-semibold">know</span> you should be doing more. Prayer. Exercise. Building. Reading. Leading.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
              <AlertTriangle className="h-6 w-6 text-yellow-500/70 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  But <span className="text-foreground font-semibold">no one is holding you accountable</span>. Your friends don't challenge you. Your family doesn't push you. Your job doesn't require your best.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
              <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg md:text-xl text-foreground font-semibold leading-relaxed">
                  And in 10 years, you'll either be the man you were meant to be—or you'll have excuses.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-xl text-muted-foreground">
              The Argent Order exists for men who refuse to accept the first option.
            </p>
          </div>
        </div>
      </section>

      {/* THE SOLUTION - Five Pillars */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The System</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Five Pillars of Transformation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every member is formed in these five areas. Mastery in all five produces men who lead.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            {pillars.map((pillar, index) => (
              <div key={pillar.name} className="glass-card p-5 text-center cursor-pointer stagger-item group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${pillar.color}15` }}>
                  <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} />
                </div>
                <h3 className="text-base font-bold mb-2">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{pillar.desc}</p>
                <div className="text-xs font-medium text-muted-foreground/70" style={{ color: pillar.color }}>
                  {pillar.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Transformations */}
      <section className="py-24 px-4 bg-card/30 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Transformations</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Men Who Showed Up</h2>
            <p className="text-muted-foreground mt-2">Real results from men who committed</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {transformations.map((t, i) => (
              <div key={i} className="glass-card p-6 stagger-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500/80 text-xs font-medium">
                    {t.badge}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3">{t.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 italic">"{t.quote}"</p>
                <div className="border-t border-border/50 pt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET - Value Stack */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Membership</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">What You Get When You're In</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {whatYouGet.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-border/50 glass-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTION HANDLING */}
      <section className="py-24 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Honest Answers</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">Questions You Might Have</h2>
          </div>
          
          <div className="space-y-4">
            {objections.map((obj, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-primary">Q:</span> {obj.question}
                </h3>
                <p className="text-muted-foreground pl-6">
                  <span className="text-primary font-medium">A:</span> {obj.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS - Filter */}
      <section className="py-24 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Are You Ready?</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">This Is For Men Who...</h2>
          </div>
          
          <div className="space-y-4 mb-12">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border/30">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground/70 mb-6">
              If this sounds like you—and you're ready to be held accountable—apply below.
            </p>
            <p className="text-sm text-muted-foreground/50">
              This is not for tourists. Apply only if you mean it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA - Email Capture (Funnel Step per Documentation) */}
      <section id="get-started" className="py-24 px-4 relative">
        <div className="max-w-lg mx-auto relative z-10">
          <div className="glass-card p-8 md:p-10 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Get Started</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your email to receive next steps. We'll guide you through the process.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For next steps"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <Button type="submit" disabled={loading} className="btn-elegant w-full h-12 mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Get Next Steps <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground/60 mt-6">
                No spam. Just formation guidance. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RISK REVERSAL / FOOTER */}
      <footer className="py-8 px-4 border-t border-border/50 bg-card/30 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
              <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
            </svg>
            <span className="font-bold">The Argent Order</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
            <Link href="/constitution" className="hover:text-foreground transition-colors">Constitution</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
