import type { Metadata } from "next";
import { Playfair_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tamendutta.com"),
  title: "Tamen Dutta — Developer × Photographer",
  description:
    "Software developer and photographer based in Bangalore. Two crafts, one obsession: pattern.",
  openGraph: {
    title: "Tamen Dutta — Developer × Photographer",
    description:
      "Software developer and photographer based in Bangalore. Two crafts, one obsession: pattern.",
    url: "https://tamendutta.com",
    siteName: "Tamen Dutta",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
