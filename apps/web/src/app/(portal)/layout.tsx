import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Portal | The Argent Order",
  description: "Your personal formation dashboard. Track your progress in faith, discipline, brotherhood, building, and truth.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen mesh-gradient flex flex-col relative">
      {/* Ambient Orbs for Portal Pages - Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="ambient-orb w-[400px] h-[400px] bg-primary/3 -top-20 -right-20" />
        <div className="ambient-orb w-[300px] h-[300px] bg-primary/2 bottom-40 -left-20" style={{ animationDelay: '-8s' }} />
      </div>
      <Navbar />
      <main id="main-content" className="flex-1 container-premium pt-8 pb-24 md:pt-12 md:pb-28 lg:pt-16 lg:pb-32 relative z-10" role="main">{children}</main>
      <Footer />
    </div>
  );
}
