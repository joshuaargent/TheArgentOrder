import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, Cross, Dumbbell, Handshake, Hammer, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Mission",
  description: "Catholic men forged in discipline. The Argent Order exists to help men build faith, discipline, brotherhood, projects, and truth. Execute. Build. Lead.",
};

export default function MissionPage() {
  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero - HORMOZI: Short, punchy */}
      <section className="py-16 md:py-20 px-4" aria-labelledby="mission-heading">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" aria-hidden="true" />
          </div>

          <h1 id="mission-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
            Our Mission
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-4 px-4">
            To forge men of <span className="text-primary font-medium">Faith</span>, <span className="text-primary font-medium">Discipline</span>, <span className="text-primary font-medium">Brotherhood</span>, <span className="text-primary font-medium">Building</span>, and <span className="text-primary font-medium">Truth</span> through Catholic doctrine, structured formation, and relentless action.
          </p>

          <p className="text-primary font-bold text-xl mb-8">
            Execute. Build. Lead.
          </p>

          <Link href="/join">
            <Button className="px-8 h-14 text-lg btn-elegant">
              Enter The Forge
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem - HORMOZI: Lead with relatable pain */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="crises-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="crises-heading" className="text-xl md:text-2xl font-bold mb-6 text-center">
            Modern Men Are Suffering
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Spiritual Drift", desc: "Prayer falls by the wayside. Mass becomes optional.", icon: Cross, color: "#a855f7" },
              { title: "Comfort Over Growth", desc: "Chasing ease instead of excellence.", icon: Dumbbell, color: "#ef4444" },
              { title: "Isolation", desc: "Strong friendships are rare. Accountability is nonexistent.", icon: Handshake, color: "#22c55e" },
              { title: "No Craft", desc: "Skills atrophy. Projects stall. Potential squanders.", icon: Hammer, color: "#eab308" },
              { title: "Confusion", desc: "Relativism creeps in. Truth feels subjective.", icon: GraduationCap, color: "#06b6d4" },
            ].map((crisis, i) => (
              <article key={i} className="glass-card p-5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${crisis.color}15` }}
                >
                  <crisis.icon className="h-5 w-5" style={{ color: crisis.color }} aria-hidden="true" />
                </div>
                <h3 className="font-bold mb-1">{crisis.title}</h3>
                <p className="text-sm text-muted-foreground">{crisis.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution - HORMOZI: Show transformation */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="pillars-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="pillars-heading" className="text-xl md:text-2xl font-bold mb-6 text-center">
            Five Pillars of Formation
          </h2>
          <p className="text-center text-muted-foreground mb-8">What you actually get</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Faith", icon: Cross, color: "#a855f7", outcome: "A prayer habit that sticks" },
              { name: "Discipline", icon: Dumbbell, color: "#ef4444", outcome: "Energy to lead your family" },
              { name: "Brotherhood", icon: Handshake, color: "#22c55e", outcome: "5 men who hold you accountable" },
              { name: "Building", icon: Hammer, color: "#eab308", outcome: "Projects you actually ship" },
              { name: "Truth", icon: GraduationCap, color: "#06b6d4", outcome: "Clarity on what matters" },
            ].map((pillar, i) => (
              <article key={i} className="glass-card p-4 text-center">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.outcome}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - HORMOZI: Clear next step */}
      <section className="py-16 md:py-20 px-4" aria-labelledby="cta-heading">
        <div className="max-w-xl mx-auto text-center relative z-10 px-4">
          <div className="glass-card p-8">
            <h2 id="cta-heading" className="text-xl md:text-2xl font-bold mb-4">
              Ready to Begin?
            </h2>
            <p className="text-muted-foreground mb-6">
              Five pillars. 90-day campaigns. Real accountability.
            </p>
            <Link href="/join">
              <Button className="px-8 h-14 text-lg btn-elegant">
                Enter The Forge
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              <Link href="/constitution" className="hover:text-foreground">
                Read our Constitution
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-border/50 bg-card/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="missCrossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#d4d4d4"/>
                  <stop offset="50%" stop-color="#a1a1aa"/>
                  <stop offset="100%" stop-color="#71717a"/>
                </linearGradient>
              </defs>
              <rect x="15" y="3" width="6" height="30" rx="1" fill="url(#missCrossGrad)"/>
              <rect x="5" y="11" width="26" height="6" rx="1" fill="url(#missCrossGrad)"/>
            </svg>
            <span className="font-bold text-sm">The Argent Order</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/mission" className="hover:text-foreground">Mission</Link>
            <Link href="/constitution" className="hover:text-foreground">Constitution</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} The Argent Order</p>
        </div>
      </footer>
    </main>
  );
}
