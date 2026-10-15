import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreCo Cafe | Mumbai's Ultimate Anime Cafe — Kandivali East",
  description:
    "Eat. Play. Read. Repeat. Specialty coffee, artisan ice cream, curated manga library, and weekly game nights in Thakur Complex, Kandivali East, Mumbai.",
  keywords: [
    "FreCo Cafe",
    "Anime Cafe Mumbai",
    "Kandivali East Cafe",
    "Thakur Complex",
    "Manga Cafe Mumbai",
    "Board Game Cafe",
    "Specialty Coffee",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-charcoal-950 text-cream-100 antialiased selection:bg-crimson-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
