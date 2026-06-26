import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | The Argent Order",
  description: "Earn achievements as you progress through The Argent Order formation journey. Celebrate milestones in faith, discipline, and leadership.",
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
