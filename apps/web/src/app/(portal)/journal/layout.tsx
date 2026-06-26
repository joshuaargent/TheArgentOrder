import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | The Argent Order",
  description: "Keep a formation journal. Record insights, prayers, and reflections on your journey with Christ.",
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
