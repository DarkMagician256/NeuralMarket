import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NeuralMesh from "@/components/ui/NeuralMesh";

export const metadata: Metadata = {
  title: "Neural Market | Prediction Layer",
  description: "Institutional Grade Prediction Markets on Solana",
};

import SolanaProvider from "@/components/providers/SolanaProvider";

import { Toaster } from 'sonner';

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
      </body>
    </html>
  );
}
