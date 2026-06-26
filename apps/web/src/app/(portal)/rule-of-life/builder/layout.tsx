import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Rule | The Argent Order",
  description: "Create a custom Rule of Life for The Argent Order formation journey.",
};

export default function RuleBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
