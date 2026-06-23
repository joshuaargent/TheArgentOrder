"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
    // For now, just simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4">You&apos;re In</h1>
          <p className="text-muted-foreground mb-6">
            Check your email for next steps. We&apos;ll guide you through the process of joining The Argent Order.
          </p>
          <p className="text-sm text-muted-foreground">
            In the meantime, join our Discord to get a taste of the brotherhood.
          </p>
          <div className="mt-8">
            <a 
              href="https://discord.gg/theargentorder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Discord →
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Identity Statement */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Argent Order
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A brotherhood of Catholic men committed to faith, discipline, building, truth, and each other.
          </p>

          {/* Email Capture */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam. Just formation. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Problem
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Most men are <span className="text-foreground font-semibold">spiritually dormant</span>.
              Physically soft. Intellectually passive. Socially isolated. Professionally drifting.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The world offers comfort. The world offers distraction. The world offers excuses.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              But <span className="text-foreground font-semibold">no one is calling men to greatness</span>.
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No one is holding them accountable. No one is walking beside them.
              No one is pushing them to become the men they were created to be.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Framework - Five Pillars */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            The Solution
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Five pillars of formation. A brotherhood that holds you accountable.
            A system that tracks your growth.
          </p>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { 
                name: "Faith", 
                icon: "✝️", 
                desc: "Daily prayer, weekly Mass, Scripture meditation. Building a foundation of spiritual discipline.",
                color: "text-blue-500"
              },
              { 
                name: "Discipline", 
                icon: "⚔️", 
                desc: "Physical fitness, habits, execution. The foundation of all achievement.",
                color: "text-orange-500"
              },
              { 
                name: "Brotherhood", 
                icon: "🤝", 
                desc: "Men who push each other higher. Accountability that actually works.",
                color: "text-green-500"
              },
              { 
                name: "Building", 
                icon: "🏗️", 
                desc: "Projects, skills, creation. Leaving something of value behind.",
                color: "text-purple-500"
              },
              { 
                name: "Truth", 
                icon: "📖", 
                desc: "Catholic intellectual tradition. Apologetics. Deep thinking. Wisdom.",
                color: "text-yellow-500"
              },
            ].map((pillar) => (
              <div 
                key={pillar.name}
                className="rounded-lg border bg-card p-6 text-center hover:border-primary/50 transition-colors"
              >
                <div className={`text-5xl mb-4 ${pillar.color}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{pillar.name}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How It Works
          </h2>
          
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Join the Brotherhood",
                desc: "Sign up and join our private Discord community. This is where the brotherhood lives."
              },
              {
                step: "02",
                title: "Build Your Rule of Life",
                desc: "Work with a mentor to establish your foundations: prayer, exercise, sleep, reading, and more."
              },
              {
                step: "03",
                title: "Join a Campaign",
                desc: "90-day structured challenges with specific goals. Build consistency. Build community."
              },
              {
                step: "04",
                title: "Track Your Formation",
                desc: "See your growth across all five pillars. Get regular feedback from your pod."
              },
              {
                step: "05",
                title: "Lead Others",
                desc: "Become a captain. Mentor new members. Multiply the impact."
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 text-4xl font-bold text-primary/30">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Become the Man You Were Called to Be?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join men who are serious about faith, discipline, and brotherhood.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Join Now"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 The Argent Order. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
