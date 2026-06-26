import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | The Argent Order",
  description: "Manage members, view analytics, and oversee The Argent Order community.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
