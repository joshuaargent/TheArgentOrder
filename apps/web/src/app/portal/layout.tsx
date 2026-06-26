import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Portal | The Argent Order",
  description: "Connect with Discord to access The Argent Order formation portal. Track your progress in faith, discipline, brotherhood, building, and truth.",
};

export default function PortalPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
