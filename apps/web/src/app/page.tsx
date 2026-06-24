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
  Zap,
  AlertTriangle,
  Lock,
  Crown
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

      {/* Hero Section - Hook & Identity */}
      <section className="relative mx-auto max-w-5xl px-4 pt-32 pb-24 text-center">
        <div className="hero-glow" />
        
        {/* Filter Notice */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-muted-foreground mb-8">
          <Lock className="h-4 w-4" />
          <span>Selective Brotherhood. Not everyone who applies is accepted.</span>
        </div>
        
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
        
        {/* Core Identity Statement */}
        <h1 className="mb-6 text-display text-foreground">
          The Argent Order
        </h1>
        
        {/* Specific Positioning */}
        <p className="mx-auto mb-6 max-w-2xl text-xl md:text-2xl text-muted-foreground font-medium">
          The Catholic brotherhood for men who build.
        </p>
        
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground/80">
          Not a community. Not a course. A formation system that transforms men who show up into men who lead.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/join">
            <Button size="lg" className="btn-elegant gap-2 px-8 h-12 text-base">
              Apply for Membership <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/join#how-it-works">
            <Button variant="outline" size="lg" className="border-border/50 text-foreground hover:bg-accent/50 h-12 px-8 text-base">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Statement - Confrontation */}
      <section className="mx-auto max-w-4xl px-4 py-24 bg-card/30">
        <div className="text-center mb-12">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">Most Men Are Exactly Where They Don't Want to Be</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
            <AlertTriangle className="h-6 w-6 text-red-500/70 flex-shrink-0 mt-1" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              You <span className="text-foreground font-semibold">know</span> you should be doing more. Prayer. Exercise. Building. Reading. Leading.
            </p>
          </div>
          
          <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
            <AlertTriangle className="h-6 w-6 text-yellow-500/70 flex-shrink-0 mt-1" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              But <span className="text-foreground font-semibold">no one is holding you accountable</span>. Your friends don't challenge you. Your job doesn't require your best.
            </p>
          </div>
          
          <div className="flex items-start gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
            <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              And in 10 years, you'll either be the man you were meant to be—or you'll have excuses.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The System</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            Five Pillars of Transformation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every member is formed in these five areas. Mastery in all five produces men who lead.
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

      {/* Who This Is For / Not For */}
      <section className="mx-auto max-w-5xl px-4 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* This IS for */}
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
          
          {/* This is NOT for */}
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
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-24 bg-card/30">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Tools</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            Built for Formation, Not Entertainment
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature drives action. Nothing wastes your time.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Flame,
              title: "Formation Dashboard",
              description: "Track your growth across all five pillars. See what's working. See what's not.",
              color: '#a855f7'
            },
            {
              icon: Users,
              title: "Accountability Pods",
              description: "Groups of 4-6 men who hold you accountable. Weekly meetings. Real consequences.",
              color: '#22c55e'
            },
            {
              icon: Target,
              title: "Campaigns",
              description: "90-day structured challenges that transform knowledge into habits.",
              color: '#ef4444'
            },
            {
              icon: BookOpen,
              title: "Rule of Life",
              description: "Build your personal operating system. Execute daily. Build permanently.",
              color: '#06b6d4'
            },
            {
              icon: Shield,
              title: "Leadership Pipeline",
              description: "From Initiate to Steward. Earn leadership through proven action.",
              color: '#eab308'
            },
            {
              icon: Swords,
              title: "Builder Hall",
              description: "Ship projects. Get accountability. Build things that outlast you.",
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
      <section id="how-it-works" className="mx-auto max-w-4xl px-4 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-primary/70 uppercase tracking-widest">The Path</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4">
            How Transformation Happens
          </h2>
          <p className="text-muted-foreground">
            Structure creates what motivation cannot.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent hidden md:block" />
          
          <div className="space-y-12 md:space-y-16">
            {[
              { step: 1, title: "Apply & Get Accepted", desc: "Tell us who you are. If you're serious and aligned, you'll receive an invitation within 48 hours.", icon: Shield },
              { step: 2, title: "Build Your Rule of Life", desc: "In the first 72 hours, create your personal operating system with daily habits across all five pillars.", icon: BookOpen },
              { step: 3, title: "Join a Pod", desc: "Get assigned to a group of 5 men who will hold you accountable—men who won't let you quit.", icon: Users },
              { step: 4, title: "Execute Daily", desc: "Log your progress. Track streaks. Pod meetings every week. Campaigns every 90 days.", icon: Zap },
              { step: 5, title: "Lead Others", desc: "Prove yourself through action. Become a Captain. Mentor new members. Multiply impact.", icon: Crown },
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
              Ready to Become the Man You Were Called to Be?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-lg">
              This is not for tourists. Apply only if you mean it.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-10">
              If you're serious about faith, discipline, brotherhood, and building something that matters—apply below.
            </p>
            <Link href="/join">
              <Button size="lg" className="btn-elegant gap-2 px-10 h-14 text-lg">
                Apply for Membership <ArrowRight className="h-5 w-5" />
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
