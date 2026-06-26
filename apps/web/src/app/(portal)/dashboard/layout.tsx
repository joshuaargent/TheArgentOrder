import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | The Argent Order",
  description: "Your formation dashboard. Track progress across all five pillars: Faith, Discipline, Brotherhood, Building, Truth.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
