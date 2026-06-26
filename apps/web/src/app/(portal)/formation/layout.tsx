import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formation | The Argent Order",
  description: "Your formation journey at The Argent Order. Build habits, track progress, and grow in virtue.",
};

export default function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
