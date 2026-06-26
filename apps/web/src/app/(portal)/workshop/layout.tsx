import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop | The Argent Order",
  description: "Access formation tools and resources. Build habits and practices for Catholic manhood.",
};

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
