import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Database, Mail, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for The Argent Order. We protect your data and are committed to transparency about how we collect and use information.",
};

export default function PrivacyPage() {
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
            <Shield className="h-7 w-7 md:h-8 md:w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm md:text-base">Last updated: June 2026</p>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-5 md:p-6 mb-6 md:mb-8 border-green-500/20">
          <div className="flex items-start gap-3 md:gap-4">
            <Lock className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-bold mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground">
                We collect only what is necessary for your formation. We never sell your data. 
                We protect your information as we protect our brotherhood with honor.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 md:space-y-8">
          {[
            {
              title: "Information We Collect",
              icon: Database,
              content: `We collect information you provide directly:

• Account Information: Name, email address, password, and profile details
• Formation Data: Prayer habits, check-ins, campaign progress, and formation scores
• Brotherhood Activity: Pod membership, interactions with other members, and accountability logs
• Content You Submit: Journal entries, prayer requests, and project updates

We do not collect payment information-transactions are handled by secure third-party processors.`
            },
            {
              title: "How We Use Your Information",
              icon: Eye,
              content: `We use your information to:

• Create and maintain your account within The Argent Order
• Track your formation progress across the five pillars
• Connect you with your accountability pod
• Send you formation reminders and accountability notifications
• Provide access to campaigns, certifications, and formation resources
• Improve our formation systems and member experience

We do not use your information for advertising or sell it to third parties.`
            },
            {
              title: "Data Storage and Security",
              icon: Shield,
              content: `Your data is stored securely using industry-standard practices:

• Supabase: Our primary database provider, offering enterprise-grade security
• Encryption: Data is encrypted in transit and at rest
• Access Control: Only authorized personnel can access member data
• Retention: We retain your data as long as your account is active

While we implement robust security measures, no system is completely secure. 
We commit to transparency about any data incidents that may affect you.`
            },
            {
              title: "Your Rights",
              icon: Lock,
              content: `You have the right to:

• Access your personal data at any time
• Correct inaccurate information
• Request deletion of your account and data
• Export your formation data
• Opt out of non-essential communications

To exercise these rights, contact us at the email below. 
We will respond within 30 days.`
            },
            {
              title: "Cookies and Tracking",
              icon: AlertTriangle,
              content: `We use minimal cookies:

• Essential Cookies: Required for authentication and session management
• Analytics Cookies: Anonymous usage data to improve our platform
• No Third-Party Tracking: We do not allow external tracking on our platform

You can disable cookies in your browser, though some features may not function properly.`
            },
            {
              title: "Children's Privacy",
              icon: AlertTriangle,
              content: `The Argent Order is designed for adult men seeking Catholic formation.

We do not knowingly collect information from individuals under 18 years of age. 
If you believe a minor has provided us with personal information, please contact us immediately.`
            },
            {
              title: "Changes to This Policy",
              icon: Shield,
              content: `We may update this Privacy Policy from time to time.

If we make significant changes, we will:
• Notify you via email or platform notification
• Update the "Last updated" date at the top of this page
• Provide a summary of changes

Your continued use of The Argent Order after changes constitutes acceptance of the updated policy.`
            },
            {
              title: "Contact Us",
              icon: Mail,
              content: `For privacy-related questions or concerns:

Email: theargentorder@gmail.com

We take privacy seriously and welcome your questions and feedback.`
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

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-border/50 bg-card/50 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="privBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#d6d6d6"/>
                    <stop offset="100%" stop-color="#7a7a7a"/>
                  </linearGradient>
                  <linearGradient id="privFuller" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cfcfcf"/>
                    <stop offset="100%" stop-color="#6a6a6a"/>
                  </linearGradient>
                  <linearGradient id="privGuard" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#4a4a4f"/>
                    <stop offset="100%" stop-color="#1a1a1d"/>
                  </linearGradient>
                  <linearGradient id="privGrip" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#2c2c30"/>
                    <stop offset="100%" stop-color="#141417"/>
                  </linearGradient>
                  <radialGradient id="privPommel" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#f5f5f5"/>
                    <stop offset="100%" stop-color="#7a7a7a"/>
                  </radialGradient>
                </defs>
                <path d="M24 2 L27 32 Q24 34 21 32 Z" fill="url(#privBlade)"/>
                <path d="M24 4 L25 30 Q24 31 23 30 Z" fill="url(#privFuller)" opacity="0.55"/>
                <path d="M14 32 Q18 30 22 31 H26 Q30 30 34 32 Q30 34 26 33 H22 Q18 34 14 32 Z" fill="url(#privGuard)"/>
                <rect x="21" y="33" width="6" height="8" rx="1" fill="url(#privGrip)"/>
                <circle cx="24" cy="43" r="3.5" fill="url(#privPommel)"/>
                <circle cx="24" cy="43" r="2" fill="#ffffff"/>
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
      </div>
    </main>
  );
}
