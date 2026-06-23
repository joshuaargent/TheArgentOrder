import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          The Argent Order
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Catholic Formation Operating System for Builders
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enter Portal
          </Link>
          <Link
            href="/mission"
            className="rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:bg-accent"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Five Pillars of Formation
        </h2>
        <div className="grid gap-8 md:grid-cols-5">
          {[
            { name: "Faith", icon: "✝️", desc: "Prayer, Mass, Scripture" },
            { name: "Discipline", icon: "⚔️", desc: "Habits, Execution, Fitness" },
            { name: "Brotherhood", icon: "🤝", desc: "Community, Mentorship, Pods" },
            { name: "Building", icon: "🏗️", desc: "Projects, Creation, Launch" },
            { name: "Truth", icon: "📖", desc: "Learning, Apologetics, Wisdom" },
          ].map((pillar) => (
            <div
              key={pillar.name}
              className="rounded-lg border bg-card p-6 text-center"
            >
              <div className="mb-4 text-4xl">{pillar.icon}</div>
              <h3 className="mb-2 font-semibold">{pillar.name}</h3>
              <p className="text-sm text-muted-foreground">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
