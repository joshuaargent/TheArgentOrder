import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join The Forge",
  description: "Join The Argent Order. Catholic men who execute, build, and lead. 90 days. 5 accountability partners. Real transformation. 100% free.",
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
