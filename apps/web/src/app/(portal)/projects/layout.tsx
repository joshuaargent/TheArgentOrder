import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | The Argent Order",
  description: "Build projects that outlast you. Track milestones and ship alongside your brothers.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
