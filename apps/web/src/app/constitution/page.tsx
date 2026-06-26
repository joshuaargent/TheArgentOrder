import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, BookOpen, Scale, Users, Cross } from "lucide-react";

export const metadata: Metadata = {
  title: "Constitution",
  description: "The founding principles and rules of The Argent Order. Catholic men committed to faith, discipline, brotherhood, building, and truth.",
};

export default function ConstitutionPage() {
  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      {/* Ambient Background - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20 px-4" aria-labelledby="constitution-heading">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
            <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-primary" aria-hidden="true" />
          </div>
          
          <h1 id="constitution-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
            Constitution
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
            The governing document of The Argent Order
          </p>
          
          <p className="text-base md:text-lg text-primary font-medium">
            Execute. Build. Lead.
          </p>

          <p className="text-sm text-muted-foreground/70 mt-1">
            Formation over engagement. Transformation over activity.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mt-4">
            <span>Version 1.0</span>
          </div>
        </div>
      </section>

      {/* Preamble */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="preamble-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="preamble-heading" className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
            Preamble
          </h2>

          <div className="glass-card p-6 md:p-8 space-y-4">
            <p>
              The Argent Order exists to help men become who God created them to be.
            </p>
            <p className="text-muted-foreground">
              We believe modern men are suffering from a crisis of formation.
            </p>
            <p>
              Many men are isolated. Many men are distracted. Many men lack purpose. Many men lack discipline. Many men lack meaningful brotherhood.
            </p>
            <p>
              The Argent Order exists to address these problems through Catholic formation, disciplined action, structured accountability, and authentic brotherhood.
            </p>
          </div>
        </div>
      </section>

      {/* Article I: Authority */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="authority-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Scale className="h-5 w-5 md:h-6 md:w-6 text-primary" aria-hidden="true" />
            <h2 id="authority-heading" className="text-xl md:text-2xl font-bold">Article I: Authority</h2>
          </div>

          <div className="glass-card p-6 md:p-8">
            <p className="mb-4">
              The ultimate authority of The Argent Order is:
            </p>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li className="font-medium">God</li>
              <li className="font-medium">Sacred Scripture</li>
              <li className="font-medium">Sacred Tradition</li>
              <li className="font-medium">The Magisterium of the Catholic Church</li>
            </ol>
            
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="font-medium text-primary">
                The Order is explicitly Catholic.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Not non-denominational. Not generic spirituality. Not secular self-improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article II: Core Values */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="values-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" aria-hidden="true" />
            <h2 id="values-heading" className="text-xl md:text-2xl font-bold">Article II: Core Values</h2>
          </div>

          <div className="space-y-4 md:space-y-6">
            {[
              {
                title: "Faith",
                desc: "Faith is the foundation. Without faith, all other achievements become disordered. Faith must influence: Prayer, Work, Relationships, Leadership, Decision making.",
                color: "#a855f7"
              },
              {
                title: "Discipline",
                desc: "Discipline is obedience to what is right despite what is easy. We value: Consistency, Responsibility, Self-control, Sacrifice. Excuses are rejected. Ownership is encouraged.",
                color: "#ef4444"
              },
              {
                title: "Brotherhood",
                desc: "Brotherhood is essential. Isolation weakens men. Brotherhood strengthens men. Members are expected to encourage one another, challenge one another, and support one another. Brotherhood is not optional.",
                color: "#22c55e"
              },
              {
                title: "Building",
                desc: "Men are called to create. Building includes: Businesses, Software, Skills, Careers, Families, Communities. Consumption alone is insufficient. Members are encouraged to become builders.",
                color: "#eab308"
              },
              {
                title: "Truth",
                desc: "Truth exists independent of feelings. Reality matters. Evidence matters. Logic matters. Truth must be pursued with charity.",
                color: "#06b6d4"
              },
            ].map((value, i) => (
              <article key={i} className="glass-card p-5 md:p-6">
                <h3 className="font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: value.color }}
                    aria-hidden="true"
                  />
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Article III: Member Expectations */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="expectations-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" aria-hidden="true" />
            <h2 id="expectations-heading" className="text-xl md:text-2xl font-bold">Article III: Member Expectations</h2>
          </div>

          <div className="glass-card p-6 md:p-8">
            <p className="mb-4 font-medium">Every member is expected to:</p>
            <ul className="space-y-2 md:space-y-3" role="list">
              {[
                "Pursue holiness",
                "Seek truth",
                "Take responsibility",
                "Show up consistently",
                "Support brothers",
                "Build something meaningful",
                "Live the Catholic faith"
              ].map((expectation, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm md:text-base">{expectation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final Principle */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="final-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="glass-card p-6 md:p-8 text-center">
            <Cross className="h-7 w-7 md:h-8 md:w-8 text-primary mx-auto mb-4" aria-hidden="true" />
            <p id="final-heading" className="text-base md:text-lg font-medium">
              The Argent Order exists to help men become who God created them to be.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="cta-heading">
        <div className="max-w-xl mx-auto text-center relative z-10 px-4">
          <h2 id="cta-heading" className="text-xl md:text-2xl font-bold mb-4">
            Ready to Join?
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Begin your formation journey today.
          </p>
          <Link href="/join">
            <Button className="px-8 h-14 text-lg btn-elegant">
              Enter The Forge
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-border/50 bg-card/50 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6" viewBox="0 0 36 36" fill="none">
              <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
              <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
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
