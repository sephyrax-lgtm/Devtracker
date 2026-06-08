import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DevTracker — Gère ta carrière freelance",
  description: "Suis ton temps, calcule tes revenus et pilote tes projets freelance depuis une seule interface.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr" className={inter.variable}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
