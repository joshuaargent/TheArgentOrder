import Link from "next/link";
import { Shield, Scale, AlertTriangle, Users, BookOpen, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen mesh-gradient relative" role="main">
      {/* Ambient Background - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-0 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Scale className="h-7 w-7 md:h-8 md:w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-sm md:text-base">Last updated: June 2026</p>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-5 md:p-6 mb-6 md:mb-8 border-primary/20">
          <div className="flex items-start gap-3 md:gap-4">
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-bold mb-2">Agreement to These Terms</h3>
              <p className="text-sm text-muted-foreground">
                By joining The Argent Order, you agree to these Terms of Service.
                These terms exist to protect the integrity of our formation system and the brotherhood.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 md:space-y-8">
          {[
            {
              title: "The Nature of The Argent Order",
              icon: Shield,
              content: `The Argent Order is a Catholic formation community designed to help men grow in faith, discipline, brotherhood, building, and truth.

By joining, you acknowledge that:
• This is a Catholic organization with explicit Catholic identity
• Formation requires commitment and active participation
• Brotherhood means mutual accountability and support
• We operate according to Catholic moral teaching`
            },
            {
              title: "Membership Eligibility",
              icon: Users,
              content: `To become a member of The Argent Order, you must:

• Be a man seeking Catholic formation and growth
• Be at least 18 years of age
• Agree to these Terms of Service
• Accept the Catholic identity of the Order
• Commit to active participation in formation activities

We reserve the right to accept or deny membership at our discretion.`
            },
            {
              title: "Member Obligations",
              icon: BookOpen,
              content: `As a member, you agree to:

• Pursue formation with sincerity and effort
• Treat all brothers with respect and charity
• Maintain confidentiality about other members' personal information
• Participate in pod meetings and accountability structures
• Follow the Rule of Life you create
• Contribute positively to the brotherhood

These obligations are not optional-they are the foundation of formation.`
            },
            {
              title: "Formation Standards",
              icon: Gavel,
              content: `The Argent Order maintains high standards for formation:

• We expect genuine effort, not perfection
• We require honesty about struggles and failures
• We demand integrity in all dealings with brothers
• We prohibit any form of harassment or abuse
• We reserve the right to remove members who undermine formation

Formation is a gift-we protect it for those who are serious.`
            },
            {
              title: "Content and Conduct",
              icon: Shield,
              content: `We expect all members to:

• Share content that builds up the brotherhood
• Speak truthfully and charitably
• Respect the Catholic identity of the community
• Avoid divisive political or controversial topics unrelated to formation
• Protect the privacy of other members

We prohibit:
• Harassment, bullying, or intimidation
• Sharing members' personal information without consent
• Content that contradicts Catholic teaching
• Spam, self-promotion outside of Workshop, or solicitation`
            },
            {
              title: "Intellectual Property",
              icon: BookOpen,
              content: `The materials provided through The Argent Order-including guides, templates, and formation resources-are for your personal formation.

You may:
• Use materials for your own formation
• Share insights with your pod members
• Reference concepts in your own work

You may not:
• Resell or redistribute our materials
• Claim our content as your own
• Use our branding without permission`
            },
            {
              title: "Account Termination",
              icon: AlertTriangle,
              content: `We may terminate your membership if you:

• Violate these Terms of Service
• Engage in conduct harmful to the brotherhood
• Fail to participate in formation activities for an extended period
• Share content that damages the reputation of the Order
• Harass or abuse other members

We will make reasonable efforts to address issues before termination. However, some violations may result in immediate removal.

You may also terminate your membership at any time by contacting us.`
            },
            {
              title: "Limitation of Liability",
              icon: Gavel,
              content: `The Argent Order provides formation resources and community-we do not guarantee specific outcomes.

We are not liable for:
• Your formation results or progress
• Decisions made based on formation resources
• Outcomes from interactions with other members
• Technical issues beyond our control

We provide formation as a service. Your growth depends on your effort and commitment.`
            },
            {
              title: "Changes to These Terms",
              icon: Scale,
              content: `We may update these Terms of Service at any time.

Changes will be communicated via:
• Email notification to all members
• Notice on our website
• Announcement in the Discord community

Continued membership after changes constitutes acceptance of the updated terms.`
            },
            {
              title: "Contact Information",
              icon: Shield,
              content: `For questions about these Terms of Service:

Email: theargentorder@gmail.com

We respond to all legitimate inquiries within a reasonable timeframe.`
            }
          ].map((section, i) => (
            <article key={i} className="glass-card p-5 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                <section.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                {section.title}
              </h2>
              <div className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </article>
          ))}
        </div>

        {/* Agreement Summary */}
        <div className="mt-6 md:mt-8 glass-card p-5 md:p-6 border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            By joining The Argent Order, you acknowledge that you have read, understood,
            and agree to these Terms of Service. You commit to the formation journey
            and the obligations it entails.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 text-center" role="contentinfo">
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground mb-4" aria-label="Footer navigation">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
            <Link href="/join" className="hover:text-foreground transition-colors">Join</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Argent Order
          </p>
        </footer>
      </div>
    </main>
  );
}
