import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Examen | The Argent Order",
  description: "Practice the Ignatian Daily Examen. A daily habit of reflection and awareness for Catholic men.",
};

export default function ExamenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
