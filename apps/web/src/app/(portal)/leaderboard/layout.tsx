import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | The Argent Order",
  description: "See how brothers are progressing in their formation. Motivate each other through shared accountability.",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
