"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle, Cross, Dumbbell, Handshake, Hammer, GraduationCap, Shield } from "lucide-react";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const pillars = [
    { 
      name: "Faith", 
      icon: Cross, 
      desc: "Daily prayer, weekly Mass, Scripture meditation. Building a foundation of spiritual discipline.",
      color: "#a855f7"
    },
    { 
      name: "Discipline", 
      icon: Dumbbell, 
      desc: "Physical fitness, habits, execution. The foundation of all achievement.",
      color: "#ef4444"
    },
    { 
      name: "Brotherhood", 
      icon: Handshake, 
      desc: "Men who push each other higher. Accountability that actually works.",
      color: "#22c55e"
    },
    { 
      name: "Building", 
      icon: Hammer, 
      desc: "Projects, skills, creation. Leaving something of value behind.",
      color: "#eab308"
    },
    { 
      name: "Truth", 
      icon: GraduationCap, 
      desc: "Catholic intellectual tradition. Apologetics. Deep thinking. Wisdom.",
      color: "#06b6d4"
    },
  ];

  const steps = [
    { step: "01", title: "Join the Brotherhood", desc: "Sign up and join our private Discord community. This is where the brotherhood lives." },
    { step: "02", title: "Build Your Rule of Life", desc: "Work with a mentor to establish your foundations: prayer, exercise, sleep, reading, and more." },
    { step: "03", title: "Join a Campaign", desc: "90-day structured challenges with specific goals. Build consistency. Build community." },
    { step: "04", title: "Track Your Formation", desc: "See your growth across all five pillars. Get regular feedback from your pod." },
    { step: "05", title: "Lead Others", desc: "Become a captain. Mentor new members. Multiply the impact." },
  ];

  if (submitted) {
    return (
      <main className="min-h-screen mesh-gradient flex items-center justify-center relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
          <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-0 right-0" style={{ animationDelay: '-5s' }} />
        </div>
        
        <div className="text-center max-w-lg mx-auto px-4 relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-8 animate-float">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">You're In</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Check your email for next steps. We'll guide you through joining The Argent Order.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            In the meantime, join our Discord to get a taste of the brotherhood.
          </p>
          <a href="https://discord.gg/theargentorder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
            Join Discord <ArrowRight className="h-4 w-4" />
          </a>
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-24 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
          
          <h1 className="text-display mb-6">The Argent Order</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
            A brotherhood of Catholic men committed to faith, discipline, building, truth, and each other.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-5 py-4 rounded-xl border border-border bg-card/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm transition-all"
              />
              <Button type="submit" disabled={loading} className="btn-elegant px-8">
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No spam. Just formation. Unsubscribe anytime.</p>
          </form>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-32 px-4 relative">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">The Problem</h2>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Most men are <span className="text-foreground font-semibold">spiritually dormant</span>.
              Physically soft. Intellectually passive. Socially isolated. Professionally drifting.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              The world offers comfort. The world offers distraction. The world offers excuses.
            </p>
            <p className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed">
              But no one is calling men to greatness.
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              No one is holding them accountable. No one is walking beside them.
              No one is pushing them to become the men they were created to be.
            </p>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="py-32 px-4 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Solution</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Five pillars of formation. A brotherhood that holds you accountable. A system that tracks your growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {pillars.map((pillar, index) => (
              <div key={pillar.name} className="glass-card p-6 text-center cursor-pointer stagger-item group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: `${pillar.color}15` }}>
                  <pillar.icon className="h-7 w-7" style={{ color: pillar.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2">{pillar.name}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 bg-card/30 relative">
        <div className="max-w-3xl mx-auto relative z-10 mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="space-y-8 md:space-y-12">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl glass flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-primary mb-2 uppercase tracking-wider">Step {item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="glass-card p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Become the Man You Were Called to Be?</h2>
              <p className="text-muted-foreground mb-10 text-lg">Join men who are serious about faith, discipline, and brotherhood.</p>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 px-5 py-4 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm transition-all"
                  />
                  <Button type="submit" disabled={loading} className="btn-elegant px-8">{loading ? "Joining..." : "Join Now"}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
