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
  Swords,
  CheckCircle,
  Star,
  Zap
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen mesh-gradient">
      {/* Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 top-1/2 -right-32" style={{ animationDelay: '-5s' }} />
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/4 bottom-0 left-1/3" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-4 pt-32 pb-24 text-center">
        <div className="hero-glow" />
        
        {/* Logo - Premium Silver Cross */}
        <div className="mb-10 flex justify-center animate-float">
          <div className="relative">
            <svg className="h-24 w-24" viewBox="0 0 48 48" fill="none">
              <rect x="21" y="4" width="6" height="40" rx="1" className="fill-primary"/>
              <rect x="8" y="14" width="32" height="6" rx="1" className="fill-primary"/>
              <path d="M24 38L20 48H28L24 38Z" className="fill-primary opacity-30"/>
              <rect x="21" y="4" width="6" height="40" rx="1" className="fill-white/10"/>
              <rect x="8" y="14" width="32" height="6" rx="1" className="fill-white/10"/>
            </svg>
            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-50" />
          </div>
        </div>
        
        <h1 className="mb-6 text-display text-foreground">
          The Argent Order
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-xl md:text-2xl text-muted-foreground font-medium">
          Catholic Formation Operating System for Builders
        </p>
        <p className="mx-auto mb-12 max-w-xl text-lg text-muted-foreground/80">
          A brotherhood of men pursuing faith, discipline, and excellence through daily habits, accountability, and building things that matter.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup">
            <Button size="lg" className="btn-elegant gap-2 px-8 h-12 text-base">
              Join The Order <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/mission">
            <Button variant="outline" size="lg" className="border-border/50 text-foreground hover:bg-accent/50 h-12 px-8 text-base">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { value: '5', label: 'Pillars of Formation' },
            { value: '100%', label: 'Action-Oriented' },
            { value: '30+', label: 'Days to Habit' },
          ].map((stat, i) => (
            <div key={i} className="text-center stagger-item">
              <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Five Pillars of Formation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every member is formed in these five areas. Progress in each pillar builds a man who is faithful, disciplined, and useful.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-5">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className="group glass-card p-6 text-center cursor-pointer stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 glow-${pillar.id}`}
                style={{ backgroundColor: `${pillar.color}15` }}
              >
                {pillar.id === 'faith' && <Cross className="h-8 w-8" style={{ color: pillar.color }} />}
                {pillar.id === 'discipline' && <Dumbbell className="h-8 w-8" style={{ color: pillar.color }} />}
                {pillar.id === 'brotherhood' && <Handshake className="h-8 w-8" style={{ color: pillar.color }} />}
                {pillar.id === 'building' && <Hammer className="h-8 w-8" style={{ color: pillar.color }} />}
                {pillar.id === 'truth' && <GraduationCap className="h-8 w-8" style={{ color: pillar.color }} />}
              </div>
              <h3 className="mb-2 font-bold text-lg text-foreground">{pillar.name}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Men Who Build
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature is designed to drive action, not consumption.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Flame,
              title: "Formation Tracking",
              description: "Daily habits, streaks, and progress across all five pillars. Know exactly where you stand.",
              color: '#a855f7'
            },
            {
              icon: Users,
              title: "Brotherhood",
              description: "Pods of 4-6 men who hold each other accountable. Weekly meetings. Real relationships.",
              color: '#22c55e'
            },
            {
              icon: Target,
              title: "Campaigns",
              description: "Structured 30-day journeys that transform knowledge into action and action into habits.",
              color: '#ef4444'
            },
            {
              icon: BookOpen,
              title: "Rule of Life",
              description: "Build your personal rule of life. Daily execution system that drives consistent growth.",
              color: '#06b6d4'
            },
            {
              icon: Shield,
              title: "Leadership Pipeline",
              description: "From Initiate to Steward. Clear path for those who prove themselves through action.",
              color: '#eab308'
            },
            {
              icon: Swords,
              title: "Builder Hall",
              description: "Ship projects. Get accountability. Build things that outlast you. This is where builders are made.",
              color: '#f97316'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group glass-card p-6 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h3 className="mb-2 font-bold text-lg text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-4xl px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Getting started takes minutes. Transformation takes commitment.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden md:block" />
          
          <div className="space-y-12 md:space-y-16">
            {[
              { step: 1, title: "Join the Order", desc: "Create your account and join a brotherhood of men committed to growth.", icon: Star },
              { step: 2, title: "Build Your Rule", desc: "Craft your personal rule of life with daily habits across all five pillars.", icon: CheckCircle },
              { step: 3, title: "Execute Daily", desc: "Log your progress every day. Track streaks. Watch your formation grow.", icon: Zap },
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 stagger-item" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl glass flex items-center justify-center ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <div className={`flex-1 text-center ${i % 2 === 1 ? 'md:text-left md:order-1' : 'md:text-right'}`}>
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-24">
        <div className="relative glass-card p-12 md:p-16 text-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-3xl" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
              Join a brotherhood of men committed to faith, discipline, and building things that matter.
            </p>
            <Link href="/signup">
              <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
                Begin Your Journey <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8" viewBox="0 0 36 36" fill="none">
                <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
                <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
                <path d="M18 28L16 34H20L18 28Z" className="fill-primary opacity-40"/>
              </svg>
              <span className="font-bold text-foreground">The Argent Order</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
              <Link href="/constitution" className="hover:text-foreground transition-colors">Constitution</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} The Argent Order
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
