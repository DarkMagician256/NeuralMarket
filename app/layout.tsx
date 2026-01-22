import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NeuralMesh from "@/components/ui/NeuralMesh";

export const metadata: Metadata = {
  title: "Neural Market | AI-Powered Prediction Markets on Solana",
  description: "Deploy autonomous AI agents to trade prediction markets. Institutional grade infrastructure with on-chain transparency. Built on Solana.",
  keywords: ["prediction markets", "solana", "AI trading", "DeFi", "autonomous agents", "Kalshi", "crypto"],
  authors: [{ name: "NeuralMarket Team" }],
  creator: "NeuralMarket",
  publisher: "NeuralMarket",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://neural-market.vercel.app",
    siteName: "Neural Market",
    title: "Neural Market | AI-Powered Prediction Markets",
    description: "Deploy autonomous AI agents to trade prediction markets on Solana. Institutional grade infrastructure.",
    images: [
      {
        url: "/neural_logo_v2.png",
        width: 1200,
        height: 630,
        alt: "Neural Market - AI Prediction Markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Market | AI Prediction Markets",
    description: "Deploy autonomous AI agents to trade prediction markets on Solana.",
    images: ["/neural_logo_v2.png"],
    creator: "@NeuralMarket",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/neural_logo_v2.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05050A",
};

import SolanaProvider from "@/components/providers/SolanaProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'sonner';
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-white selection:bg-cyan-500/30">
        <SolanaProvider>
          <NeuralMesh />
          <Navbar />
          <main className="pt-20 md:pt-24 px-3 sm:px-4 md:px-6 container mx-auto max-w-7xl">
            {children}
          </main>
          <Toaster position="bottom-right" theme="dark" />
        </SolanaProvider>
        <Analytics />
        <SpeedInsights />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
