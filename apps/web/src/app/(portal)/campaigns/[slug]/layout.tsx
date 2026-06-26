import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaign | The Argent Order",
  description: "Join a formation campaign in The Argent Order. Execute together with your brothers.",
};

export default function CampaignDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
