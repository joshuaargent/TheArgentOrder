import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brotherhood | The Argent Order",
  description: "Connect with your pod and accountability partners in The Argent Order. Build lasting brotherhood through shared formation.",
};

export default function BrotherhoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
