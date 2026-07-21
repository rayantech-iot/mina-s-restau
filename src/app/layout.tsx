import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "A Cas'a Mina — Poulets rôtis à la broche & plats faits maison",
    template: "%s | A Cas'a Mina",
  },
  description:
    "Restaurant à emporter en Corse, entre Porto-Vecchio et Pinarello. Poulets rôtis à la broche, plats faits maison, cuisine traditionnelle corse. Route de Cirendino, Sainte-Lucie de Porto-Vecchio.",
  keywords: [
    "restaurant corse",
    "poulet broche",
    "plats maison",
    "emporter",
    "Porto-Vecchio",
    "Pinarello",
    "Sainte-Lucie",
    "cuisine corse",
  ],
  openGraph: {
    title: "A Cas'a Mina — Poulets rôtis à la broche",
    description:
      "Restaurant à emporter. Poulets rôtis à la broche, plats faits maison, cuisine traditionnelle corse.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-creme text-texte">
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
