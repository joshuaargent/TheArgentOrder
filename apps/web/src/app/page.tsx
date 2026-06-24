import Link from "next/link";
import { pillars } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Shield, Users, Target, Flame, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <svg className="h-24 w-24 text-primary" viewBox="0 0 36 36" fill="none">
            <rect x="15" y="4" width="6" height="28" rx="1" fill="currentColor"/>
            <rect x="6" y="12" width="24" height="6" rx="1" fill="currentColor"/>
            <path d="M18 28L16 34H20L18 28Z" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          The Argent Order
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Catholic Formation Operating System for Builders
        </p>
        <p className="mx-auto mb-12 max-w-xl text-lg text-muted-foreground/80">
          A brotherhood of men pursuing faith, discipline, and excellence through daily habits, accountability, and building things that matter.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Join The Order <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/mission">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold">
          Five Pillars of Formation
        </h2>
        <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
          Every member is formed in these five areas. Progress in each pillar builds a man who is faithful, disciplined, and useful.
        </p>
        <div className="grid gap-6 md:grid-cols-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="mb-4 text-5xl">{pillar.icon}</div>
              <h3 className="mb-2 font-semibold text-lg">{pillar.name}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Built for Men Who Build
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Flame,
              title: "Formation Tracking",
              description: "Daily habits, streaks, and progress across all five pillars. Know exactly where you stand.",
            },
            {
              icon: Users,
              title: "Brotherhood",
              description: "Pods of 4-6 men who hold each other accountable. Weekly meetings. Real relationships.",
            },
            {
              icon: Target,
              title: "Campaigns",
              description: "Structured 30-day journeys that transform knowledge into action and action into habits.",
            },
            {
              icon: BookOpen,
              title: "Rule of Life",
              description: "Build your personal rule of life. Daily execution system that drives consistent growth.",
            },
            {
              icon: Shield,
              title: "Leadership Pipeline",
              description: "From Initiate to Steward. Clear path for those who prove themselves through action.",
            },
            {
              icon: Target,
              title: "Builder Hall",
              description: "Ship projects. Get accountability. Build things that outlast you. This is where builders are made.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border bg-card p-6"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Build?
        </h2>
        <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
          Join a brotherhood of men committed to faith, discipline, and building things that matter.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2">
            Begin Your Journey <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 36 36" fill="none">
                <rect x="15" y="4" width="6" height="28" rx="1" fill="currentColor"/>
                <rect x="6" y="12" width="24" height="6" rx="1" fill="currentColor"/>
              </svg>
              <span className="font-bold">The Argent Order</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/mission" className="hover:text-foreground">Mission</Link>
              <Link href="/constitution" className="hover:text-foreground">Constitution</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 The Argent Order. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
