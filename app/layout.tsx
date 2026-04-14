import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Turinq | Software de Alta Performance",
  description:
    "Produzimos sites, sistemas robustos e aplicativos de forma moderna, rápida e profissional. Mais de 20 anos de inovação.",
  keywords: ["software", "desenvolvimento web", "aplicativos mobile", "sistemas", "turinq"],
  openGraph: {
    title: "Turinq | Software de Alta Performance",
    description: "Mais de 20 anos transformando ideias em soluções digitais de excelência.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={syne.variable}>
      <body className={`${syne.className} antialiased bg-[#080B12] text-white`}>
        {children}
      </body>
    </html>
  );
}