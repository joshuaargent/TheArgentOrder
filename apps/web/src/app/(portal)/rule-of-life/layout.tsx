import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rule of Life | The Argent Order",
  description: "Build your personal Rule of Life. A framework for daily habits and practices.",
};

export default function RuleOfLifeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
