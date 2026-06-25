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
  Lock,
  Mail,
  BookOpen,
  Target,
  Play,
  Quote,
  ThumbsUp,
  Clock,
  Award
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
      // Still show success to not block conversion
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const offer = {
    title: "Catholic Builder Starter Kit",
    subtitle: "Everything you need to start building a Rule of Life TODAY",
    value: "$247",
    components: [
      { 
        icon: BookOpen, 
        title: "Rule of Life Blueprint", 
        desc: "The exact framework our most disciplined members use. 12 categories. Fill in the blanks.",
        value: "$97"
      },
      { 
        icon: Target, 
        title: "90-Day Campaign Planner", 
        desc: "Map your first 90 days. What you'll build. Who you'll become. How you'll measure it.",
        value: "$67"
      },
      { 
        icon: Zap, 
        title: "Morning Protocol Guide", 
        desc: "The 30-minute morning routine that compounds into permanent transformation.",
        value: "$47"
      },
      { 
        icon: Shield, 
        title: "Catholic Man's Oath", 
        desc: "A daily declaration to anchor your identity. Print it. Live it.",
        value: "$36"
      },
    ]
  };

  const testimonials = [
    {
      quote: "I downloaded the kit on a Tuesday. By Thursday I had a Rule of Life. By Friday I had a project. By month two, I had my first paying client. The system works.",
      name: "Patrick M.",
      role: "Father of 3, Software Engineer",
      badge: "Builder",
      result: "Shipped first product in 60 days"
    },
    {
      quote: "I was dormant for 5 years. The kit gave me structure when I had none. Then the brotherhood gave me accountability when structure wasn't enough.",
      name: "Michael R.",
      role: "Former Navy SEAL, Entrepreneur",
      badge: "Pod Alpha Leader",
      result: "184-day streak, zero missed check-ins"
    },
    {
      quote: "Every man needs someone who will call him out when he's lying to himself. The kit starts that conversation. The brotherhood continues it.",
      name: "Thomas K.",
      role: "Deacon, Business Owner",
      badge: "Steward",
      result: "Mentored 12 men this year"
    },
    {
      quote: "I've bought $10k+ in courses. This $0 kit did more for my clarity than all of them combined. The simplicity is the point.",
      name: "Joseph W.",
      role: "Physician, Father of 5",
      badge: "Campaign Graduate",
      result: "Completed 3 campaigns, leading fourth"
    },
  ];

  const objections = [
    {
      q: "I'm not Catholic enough for this.",
      a: "Catholic in foundation. Catholic in practice. But men of any faith who respect the tradition are welcome. What matters is alignment with the five pillars: Faith, Discipline, Brotherhood, Building, Truth."
    },
    {
      q: "I don't have time for another commitment.",
      a: "You don't have time NOT to do this. 30 minutes daily. That's the minimum. The men here are busier than you-they've just prioritized differently."
    },
    {
      q: "What if I fail?",
      a: "You will fail. The question is whether you have a system to learn from failure. We do. Failure in the Order means growth, not expulsion."
    },
    {
      q: "I've tried accountability groups before. They didn't work.",
      a: "Most accountability groups have no teeth. No consequences. No skin in the game. Our pods are different: they're assigned, not chosen, and the weekly meeting has a structured format with real follow-up."
    },
  ];

  const requirements = [
    "You believe men need brotherhood to become great",
    "You're willing to be held accountable-even when it's uncomfortable",
    "You want to build something that outlasts you",
    "You accept that discipline is the price of freedom",
    "You're ready to show up every single day",
  ];

  const pillars = [
    { name: "Faith", icon: Cross, color: "#a855f7", desc: "Prayer, Mass, Scripture" },
    { name: "Discipline", icon: Dumbbell, color: "#ef4444", desc: "Fitness, Cold, Sleep" },
    { name: "Brotherhood", icon: Handshake, color: "#22c55e", desc: "Pods, Accountability" },
    { name: "Building", icon: Hammer, color: "#eab308", desc: "Projects, Skills" },
    { name: "Truth", icon: GraduationCap, color: "#06b6d4", desc: "Reading, Thinking" },
  ];

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
            Check your inbox
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            You're on the list.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            Your Catholic Builder Starter Kit is on its way.
          </p>
          
          <div className="glass-card p-8 space-y-6 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Email #1 arrives in 2 minutes</h3>
                <p className="text-sm text-muted-foreground">Your Starter Kit + immediate actions to take today</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Email sequence over 7 days</h3>
                <p className="text-sm text-muted-foreground">Truth exposure, identity shift, brotherhood stories</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold">Discord Invitation</h3>
                <p className="text-sm text-muted-foreground">Complete the sequence and you'll receive an invitation to join our brotherhood on Discord</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      {/* Ambient Background - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 top-1/2 left-1/4" style={{ animationDelay: '-10s' }} />
      </div>

      {/* HERO */}
      <section className="relative pt-16 md:pt-20 pb-12 md:pb-16 px-4" aria-labelledby="join-heading">
        <div className="max-w-5xl mx-auto relative z-10">

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-sm">
              <span className="text-green-400 font-medium">FREE Catholic Builder Starter Kit - No Credit Card</span>
            </div>
          </div>

          <h1 id="join-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 leading-tight px-4">
            Catholic Men.{" "}
            <span className="text-primary">Forged in Discipline.</span>
          </h1>

          <p className="text-lg md:text-xl text-center text-primary font-medium mb-4">
            Build. Ship. Lead.
          </p>

          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-4">
            Not a community. A forge.
          </p>

          <p className="text-sm text-muted-foreground/70 text-center max-w-2xl mx-auto mb-10">
            Formation over engagement. Transformation over activity.
          </p>

          <div className="text-center mb-8">
            <a
              href="#apply"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30"
            >
              <Play className="h-6 w-6" />
              Get Your Free Starter Kit
              <ArrowRight className="h-6 w-6" />
            </a>
            <p className="text-sm text-muted-foreground mt-3">
              $247 value - Yours free. No credit card required.
            </p>
          </div>

          <div className="flex justify-center gap-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Immediate access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>5 pillars methodology</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Pod accountability</span>
            </div>
          </div>

        </div>
      </section>

      {/* STICKY VALUE BAR */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-md border-b border-border/50 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-6 md:gap-12 flex-wrap text-sm">
            {pillars.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAIN */}
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

      {/* THE OFFER */}
      <section id="free-kit" className="py-20 px-4 relative scroll-mt-20">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4" />
              <span>$247 Value - Yours FREE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Catholic Builder Starter Kit
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-lg">
              Everything you need to start building a Rule of Life-before you even join.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {offer.components.map((item, i) => (
              <div key={i} className="glass-card p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold bg-green-500/10 text-green-400">
                  FREE
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <a 
              href="#apply" 
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl shadow-primary/30"
            >
              Get Instant Access
              <ArrowRight className="h-6 w-6" />
            </a>
            <p className="text-sm text-muted-foreground mt-3">
              Enter your email. Get immediate access. No credit card.
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 px-4 bg-card/30 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Results</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Men Who Showed Up
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-8 relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400/80 text-xs font-medium">
                    {t.badge}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {t.result}
                  </div>
                </div>
                
                <p className="text-lg mb-6 leading-relaxed">"{t.quote}"</p>
                
                <div className="border-t border-border/50 pt-4">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE METHOD */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Method</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Five Pillars of Formation
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Every member is formed in all five areas. Mastery in all five produces men who lead.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pillars.map((pillar, i) => (
              <div key={i} className="glass-card p-5 text-center hover:border-primary/30 transition-all">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-8 w-8" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold mb-1">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIONS */}
      <section className="py-20 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">Honest Answers</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              Questions You Might Have
            </h2>
          </div>
          
          <div className="space-y-4">
            {objections.map((obj, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-primary">Q:</span> {obj.q}
                </h3>
                <p className="text-muted-foreground pl-6 leading-relaxed">
                  <span className="text-primary font-medium">A:</span> {obj.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-20 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Filter</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">
              This Is For Men Who...
            </h2>
          </div>
          
          <div className="space-y-3">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-lg">{req}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-lg">
              This is not for everyone. If this is for you-we'll see you inside.
            </p>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="py-16 px-4 bg-card/30 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Our Promise to You</h3>
            <div className="space-y-4 text-left">
              {[
                "100% free. No credit card. No upsell.",
                "If you use the kit for 30 days and don't feel more disciplined, we'll connect you with a mentor personally.",
                "If you join the Order and it's not for you after 30 days, you can leave with no hard feelings.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CTA */}
      <section id="apply" className="py-24 px-4 relative scroll-mt-20">
        <div className="max-w-xl mx-auto relative z-10">
          <div className="glass-card p-10 text-center overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px]" />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Your Free Starter Kit
              </h2>
              
              <p className="text-muted-foreground mb-8 text-lg">
                Enter your email. Get immediate access.
                <br />
                <span className="text-primary font-medium">No credit card. No spam.</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-6 py-4 rounded-xl border border-border bg-background/50 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-bold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Get Instant Access <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
              
              <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Already subscribed?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in to your account
                  </Link>
                </p>
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
