import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | The Argent Order",
  description: "Manage your account settings, notifications, and preferences.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
