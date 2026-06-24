import Link from "next/link";
import { pillars } from "@/lib/constants";
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
  Swords
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-silver-500/5 blur-3xl" />
        </div>
        
        {/* Logo - Silver Cross */}
        <div className="mb-8 flex justify-center">
          <svg className="h-20 w-20" viewBox="0 0 48 48" fill="none">
            <rect x="21" y="4" width="6" height="40" rx="1" fill="#6b7280"/>
            <rect x="8" y="14" width="32" height="6" rx="1" fill="#6b7280"/>
            <rect x="21" y="4" width="6" height="40" rx="1" fill="url(#silver-gradient)" fillOpacity="0.5"/>
            <rect x="8" y="14" width="32" height="6" rx="1" fill="url(#silver-gradient)" fillOpacity="0.5"/>
            <defs>
              <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f9fafb"/>
                <stop offset="50%" stopColor="#d1d5db"/>
                <stop offset="100%" stopColor="#6b7280"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl text-foreground">
          The Argent Order
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-xl text-muted-foreground">
          Catholic Formation Operating System for Builders
        </p>
        <p className="mx-auto mb-12 max-w-xl text-lg text-muted-foreground/80">
          A brotherhood of men pursuing faith, discipline, and excellence through daily habits, accountability, and building things that matter.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="gap-2 bg-silver-700 hover:bg-silver-800 text-white border-silver-700">
              Join The Order <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/mission">
            <Button variant="outline" size="lg" className="border-silver-400 text-foreground hover:bg-silver-100">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
          Five Pillars of Formation
        </h2>
        <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
          Every member is formed in these five areas. Progress in each pillar builds a man who is faithful, disciplined, and useful.
        </p>
        <div className="grid gap-6 md:grid-cols-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="group rounded-lg border border-silver-200 bg-card p-6 text-center transition-all hover:border-silver-400 hover:shadow-md dark:border-silver-700 dark:hover:border-silver-600"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-silver-100 dark:bg-silver-800">
                {pillar.id === 'faith' && <Cross className="h-6 w-6 text-[#7c3aed]" />}
                {pillar.id === 'discipline' && <Dumbbell className="h-6 w-6 text-[#ea580c]" />}
                {pillar.id === 'brotherhood' && <Handshake className="h-6 w-6 text-[#059669]" />}
                {pillar.id === 'building' && <Hammer className="h-6 w-6 text-[#ca8a04]" />}
                {pillar.id === 'truth' && <GraduationCap className="h-6 w-6 text-[#0891b2]" />}
              </div>
              <h3 className="mb-2 font-semibold text-lg text-foreground">{pillar.name}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
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
              icon: Swords,
              title: "Builder Hall",
              description: "Ship projects. Get accountability. Build things that outlast you. This is where builders are made.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-silver-200 bg-card p-6 dark:border-silver-700"
            >
              <feature.icon className="mb-4 h-8 w-8 text-silver-500" />
              <h3 className="mb-2 font-semibold text-lg text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground">
          Ready to Build?
        </h2>
        <p className="mb-8 text-muted-foreground max-w-xl mx-auto">
          Join a brotherhood of men committed to faith, discipline, and building things that matter.
        </p>
        <Link href="/signup">
          <Button size="lg" className="gap-2 bg-silver-700 hover:bg-silver-800 text-white border-silver-700">
            Begin Your Journey <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-silver-200 bg-card dark:border-silver-800">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" viewBox="0 0 48 48" fill="none">
                <rect x="21" y="4" width="6" height="40" rx="1" fill="#6b7280"/>
                <rect x="8" y="14" width="32" height="6" rx="1" fill="#6b7280"/>
              </svg>
              <span className="font-bold text-foreground">The Argent Order</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
              <Link href="/constitution" className="hover:text-foreground transition-colors">Constitution</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} The Argent Order. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
