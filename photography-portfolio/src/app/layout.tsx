import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const clash = localFont({
  src: [
    { path: "../fonts/clash-display-500.woff2", weight: "500" },
    { path: "../fonts/clash-display-600.woff2", weight: "600" },
  ],
  variable: "--font-clash",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../fonts/satoshi-400.woff2", weight: "400" },
    { path: "../fonts/satoshi-500.woff2", weight: "500" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  title: "Tamen Dutta | Landscape Photography",
  description:
    "Landscape photography by Tamen Dutta: mountains, coasts, and night skies, photographed slowly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${clash.variable} ${satoshi.variable} ${jbMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
