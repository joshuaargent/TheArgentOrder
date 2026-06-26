import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaigns | The Argent Order",
  description: "Join formation campaigns with your brothers. 90-day intensive programs to build discipline and execute together.",
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
