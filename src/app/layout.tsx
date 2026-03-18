import type { Metadata } from "next";
import { Outfit, IBM_Plex_Sans, IBM_Plex_Mono, Geist } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SearchFênix | Dados Empresariais",
  description: "Consulte dados de CNPJ, CPF, empresas e contatos de forma rápida e confiável",
};

type LayoutProps = {
  children: React.ReactNode;
  params?: Promise<Record<string, string>>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  await (params ?? Promise.resolve({}));
  return (
    <html
      lang="pt-BR"
      className={cn("h-full", "antialiased", outfit.variable, ibmPlexSans.variable, ibmPlexMono.variable, "font-sans", geist.variable)}
    >
      <body className="fenix-theme min-h-full flex flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
