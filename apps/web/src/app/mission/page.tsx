import { Shield, Cross, Dumbbell, Handshake, Hammer, GraduationCap } from "lucide-react";

export default function MissionPage() {
  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      {/* Ambient Background - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[700px] h-[700px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-1/3 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Hero */}
      <section className="py-16 md:py-20 px-4" aria-labelledby="mission-heading">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" aria-hidden="true" />
          </div>

          <h1 id="mission-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-4">
            Our Mission
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground mb-6 md:mb-8 px-4">
            To forge men of Faith, Discipline, Brotherhood, Building, and Truth 
            through Catholic doctrine, personal responsibility, structured formation, 
            and relentless action.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span>Active Formation System</span>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="crises-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="crises-heading" className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
            The Five Crises Facing Modern Men
          </h2>

          <div className="space-y-4 md:space-y-6 px-4">
            {[
              {
                title: "Spiritual Crisis",
                desc: "Many men lack prayer, sacramental life, and understanding of the faith.",
                icon: Cross,
                color: "#a855f7"
              },
              {
                title: "Discipline Crisis", 
                desc: "Many men are ruled by comfort, distraction, and inconsistency.",
                icon: Dumbbell,
                color: "#ef4444"
              },
              {
                title: "Brotherhood Crisis",
                desc: "Many men lack strong friendships and accountability.",
                icon: Handshake,
                color: "#22c55e"
              },
              {
                title: "Purpose Crisis",
                desc: "Many men drift through life without mission or responsibility.",
                icon: Hammer,
                color: "#eab308"
              },
              {
                title: "Truth Crisis",
                desc: "Many men are influenced by confusion, relativism, and shallow thinking.",
                icon: GraduationCap,
                color: "#06b6d4"
              },
            ].map((crisis, i) => (
              <article key={i} className="glass-card p-5 md:p-6 flex items-start gap-3 md:gap-4">
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${crisis.color}15` }}
                >
                  <crisis.icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: crisis.color }} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-1">{crisis.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base">{crisis.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="pillars-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="pillars-heading" className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
            Our Solution: Five Pillars of Formation
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 px-4">
            {[
              { name: "Faith", icon: Cross, color: "#a855f7", desc: "Prayer, Mass, Scripture" },
              { name: "Discipline", icon: Dumbbell, color: "#ef4444", desc: "Fitness, Cold, Sleep" },
              { name: "Brotherhood", icon: Handshake, color: "#22c55e", desc: "Pods, Accountability" },
              { name: "Building", icon: Hammer, color: "#eab308", desc: "Projects, Skills" },
              { name: "Truth", icon: GraduationCap, color: "#06b6d4", desc: "Reading, Thinking" },
            ].map((pillar, i) => (
              <article key={i} className="glass-card p-4 md:p-5 text-center">
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-6 w-6 md:h-7 md:w-7" style={{ color: pillar.color }} aria-hidden="true" />
                </div>
                <h3 className="font-bold mb-1 text-sm md:text-base">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground hidden md:block">{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-12 md:py-16 px-4 bg-card/30" aria-labelledby="vision-heading">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 id="vision-heading" className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
            Our Vision
          </h2>
          
          <div className="glass-card p-6 md:p-8">
            <p className="text-base md:text-lg mb-4 md:mb-6">
              To become the leading Catholic formation ecosystem for men in the modern world.
            </p>

            <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
              To create a system that consistently helps men:
            </p>

            <ul className="space-y-2 md:space-y-3" role="list">
              {[
                "Deepen their relationship with God",
                "Develop disciplined habits",
                "Build meaningful brotherhood",
                "Create value through work",
                "Pursue truth and wisdom",
                "Lead families and communities",
                "Serve the Church"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm md:text-base">
                  <Cross className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border/50 text-center">
              <p className="text-lg md:text-xl font-bold text-primary">
                The ultimate goal is not engagement.
              </p>
              <p className="text-lg md:text-xl font-bold mt-1">
                The ultimate goal is transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="cta-heading">
        <div className="max-w-xl mx-auto text-center relative z-10 px-4">
          <h2 id="cta-heading" className="text-xl md:text-2xl font-bold mb-4">
            Ready to Begin Your Formation?
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Get the Catholic Builder Starter Kit and start building your Rule of Life today.
          </p>
          <a 
            href="/join" 
            className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all min-h-[48px] text-base md:text-lg"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </main>
  );
}
