import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications | The Argent Order",
  description: "Earn certifications as you complete formation milestones in The Argent Order.",
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
