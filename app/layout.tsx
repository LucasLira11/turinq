import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import Backdrop from "@/components/layout/Backdrop";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/layout/PageTransition";
import SmoothScroll from "@/components/layout/SmoothScroll";
import StageLoader from "@/components/three/StageLoader";
import { routeFor } from "@/content/routes";
import { siteUrl } from "@/content/site";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const home = routeFor("/")!;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: home.title, template: "%s · Turinq" },
  description: home.description,
  openGraph: { type: "website", locale: "pt_BR", siteName: "Turinq" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-tone="light"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans text-ink tone-dark:text-white">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Backdrop />
        <StageLoader />
        <SmoothScroll />
        <Header />
        <main id="conteudo" className="relative z-10">
          {children}
        </main>
        <Footer />
        <PageTransition />
      </body>
    </html>
  );
}
