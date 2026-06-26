import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | The Argent Order",
  description: "Stay updated with notifications from your pod and campaigns.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
