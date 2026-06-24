import { Shield, Cross, Dumbbell, Handshake, Hammer, GraduationCap } from "lucide-react";

export default function MissionPage() {
  return (
    <main className="min-h-screen mesh-gradient relative">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Mission
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-8">
            To forge men of Faith, Discipline, Brotherhood, Building, and Truth 
            through Catholic doctrine, personal responsibility, structured formation, 
            and relentless action.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Active Formation System
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold mb-8 text-center">
            The Five Crises Facing Modern Men
          </h2>

          <div className="space-y-6">
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
              <div key={i} className="glass-card p-6 flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${crisis.color}15` }}
                >
                  <crisis.icon className="h-6 w-6" style={{ color: crisis.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{crisis.title}</h3>
                  <p className="text-muted-foreground">{crisis.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Our Solution: Five Pillars of Formation
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Faith", icon: Cross, color: "#a855f7", desc: "Prayer, Mass, Scripture" },
              { name: "Discipline", icon: Dumbbell, color: "#ef4444", desc: "Fitness, Cold, Sleep" },
              { name: "Brotherhood", icon: Handshake, color: "#22c55e", desc: "Pods, Accountability" },
              { name: "Building", icon: Hammer, color: "#eab308", desc: "Projects, Skills" },
              { name: "Truth", icon: GraduationCap, color: "#06b6d4", desc: "Reading, Thinking" },
            ].map((pillar, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-7 w-7" style={{ color: pillar.color }} />
                </div>
                <h3 className="font-bold mb-1">{pillar.name}</h3>
                <p className="text-xs text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Our Vision
          </h2>
          
          <div className="glass-card p-8">
            <p className="text-lg mb-6">
              To become the leading Catholic formation ecosystem for men in the modern world.
            </p>
            
            <p className="text-muted-foreground mb-6">
              To create a system that consistently helps men:
            </p>
            
            <ul className="space-y-3">
              {[
                "Deepen their relationship with God",
                "Develop disciplined habits",
                "Build meaningful brotherhood",
                "Create value through work",
                "Pursue truth and wisdom",
                "Lead families and communities",
                "Serve the Church"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Cross className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-xl font-bold text-primary">
                The ultimate goal is not engagement.
              </p>
              <p className="text-xl font-bold">
                The ultimate goal is transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Begin Your Formation?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get the Catholic Builder Starter Kit and start building your Rule of Life today.
          </p>
          <a 
            href="/join" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </main>
  );
}
