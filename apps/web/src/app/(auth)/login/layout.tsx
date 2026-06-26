import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | The Argent Order",
  description: "Sign in to your The Argent Order account. Access your formation dashboard and connect with your brothers.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
