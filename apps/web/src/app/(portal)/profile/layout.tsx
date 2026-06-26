import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | The Argent Order",
  description: "Manage your The Argent Order profile. Update your information and formation goals.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
