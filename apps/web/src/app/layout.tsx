import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://argentorder.com'),
  title: {
    default: "The Argent Order | Catholic Formation System for Men",
    template: "%s | The Argent Order",
  },
  description: "⚔️ Catholic men forged in discipline. Build. Ship. Lead. Not a community. A forge. Five pillars: Faith, Discipline, Brotherhood, Building, Truth.",
  keywords: [
    "catholic formation",
    "men's brotherhood",
    "faith and discipline",
    "catholic men",
    "spiritual formation",
    "accountability group",
    "Rule of Life",
    "Catholic Builder",
  ],
  authors: [{ name: "The Argent Order" }],
  creator: "The Argent Order",
  publisher: "The Argent Order",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "The Argent Order | Catholic Formation for Builders",
    description: "⚔️ Catholic men forged in discipline. Build. Ship. Lead. Not a community. A forge.",
    siteId: "",
    creatorId: "",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://argentorder.com',
    siteName: "The Argent Order",
    title: "The Argent Order | Catholic Formation for Builders",
    description: "⚔️ Catholic men forged in discipline. Build. Ship. Lead. Not a community. A forge. Five pillars: Faith, Discipline, Brotherhood, Building, Truth.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "⚔️ Catholic men forged in discipline. Build. Ship. Lead.",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" sizes="any" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
