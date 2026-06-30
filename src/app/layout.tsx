import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovAtom Labs — Hyperautomated Research Lab",
  description: "NovAtom Labs deploys autonomous discovery loops that hypothesise, simulate, validate, and learn — continuously, across scientific domains.",
  icons: {
    icon: "/assets/favicon.svg",
    shortcut: "/assets/png/favicon-32.png",
    apple: "/assets/png/apple-touch-icon-180.png",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${manrope.variable} ${instrumentSerif.variable} font-sans antialiased bg-paper text-ink selection:bg-nova-blue selection:text-white`}
      >
        <Navbar />
        <main className="min-h-screen pt-24 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
