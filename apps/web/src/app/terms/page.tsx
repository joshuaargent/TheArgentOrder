import Link from "next/link";
import { Shield, Scale, AlertTriangle, Users, BookOpen, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen mesh-gradient relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="ambient-orb w-[600px] h-[600px] bg-primary/5 -top-48 -left-48" />
        <div className="ambient-orb w-[500px] h-[500px] bg-primary/3 bottom-0 right-0" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Sticky Nav */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8" viewBox="0 0 36 36" fill="none">
                <rect x="15" y="4" width="6" height="28" rx="1" className="fill-primary"/>
                <rect x="6" y="12" width="24" height="6" rx="1" className="fill-primary"/>
              </svg>
              <span className="font-bold text-lg">The Argent Order</span>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: June 2024</p>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-6 mb-8 border-primary/20">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
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
        <div className="space-y-8">
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

These obligations are not optional—they are the foundation of formation.`
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

Formation is a gift—we protect it for those who are serious.`
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
• Spam, self-promotion outside of 🛠️ WORKSHOP, or solicitation`
            },
            {
              title: "Intellectual Property",
              icon: BookOpen,
              content: `The materials provided through The Argent Order—including guides, templates, and formation resources—are for your personal formation.

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
              content: `The Argent Order provides formation resources and community—we do not guarantee specific outcomes.

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

Email: legal@theargentorder.com

We respond to all legitimate inquiries within a reasonable timeframe.`
            }
          ].map((section, i) => (
            <div key={i} className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </h2>
              <div className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Agreement Summary */}
        <div className="mt-8 glass-card p-6 border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            By joining The Argent Order, you acknowledge that you have read, understood, 
            and agree to these Terms of Service. You commit to the formation journey 
            and the obligations it entails.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/mission" className="hover:text-foreground transition-colors">Mission</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Argent Order. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
