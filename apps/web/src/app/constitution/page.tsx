import { Shield, BookOpen, Scale, Users, Cross } from "lucide-react";

export default function ConstitutionPage() {
  return (
    <main className="min-h-screen mesh-gradient relative">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Constitution
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            The governing document of The Argent Order
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm">
            Version 1.0
          </div>
        </div>
      </section>

      {/* Preamble */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Preamble
          </h2>

          <div className="glass-card p-8 space-y-4">
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
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Article I: Authority</h2>
          </div>

          <div className="glass-card p-8">
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
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Article II: Core Values</h2>
          </div>

          <div className="space-y-6">
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
              <div key={i} className="glass-card p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: value.color }}
                  />
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article III: Member Expectations */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Article III: Member Expectations</h2>
          </div>

          <div className="glass-card p-8">
            <p className="mb-4 font-medium">Every member is expected to:</p>
            <ul className="space-y-3">
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
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{expectation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final Principle */}
      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="glass-card p-8 text-center">
            <Cross className="h-8 w-8 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">
              The Argent Order exists to help men become who God created them to be.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Join?
          </h2>
          <p className="text-muted-foreground mb-8">
            Begin your formation journey today.
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
