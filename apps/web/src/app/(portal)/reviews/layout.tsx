import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | The Argent Order",
  description: "Leave reviews for your brothers. Encourage and challenge each other in formation.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
