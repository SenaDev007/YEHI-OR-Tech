import type { Metadata } from "next";
import { DM_Mono, Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SmoothScroll from "@/components/layout/SmoothScroll";

const display = Space_Grotesk({ variable: "--font-display-face", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const sans = Manrope({ variable: "--font-sans-face", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const mono = DM_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "500"] });
const GA_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const metadata: Metadata = {
  title: { default: "YEHI OR Tech | Solutions digitales au Bénin", template: "%s | YEHI OR Tech" },
  description: "YEHI OR Tech conçoit des sites, applications et automatisations IA pour les entreprises qui veulent gagner en crédibilité et en efficacité.",
  keywords: ["agence digitale", "développement web", "Bénin", "intelligence artificielle", "automatisation", "Parakou"],
  authors: [{ name: "YEHI OR Tech" }],
  metadataBase: new URL("https://yehiortech.com"),
  openGraph: {
    title: "YEHI OR Tech | Construire. Automatiser. Rayonner.",
    description: "Des idées lumineuses, des solutions qui avancent.",
    url: "https://yehiortech.com",
    siteName: "YEHI OR Tech",
    locale: "fr_BJ",
    type: "website",
    images: [{ url: "/images/brand/logo-transparent.png", width: 900, height: 900, alt: "YEHI OR Tech" }],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <head>
        {GA_ID && <><Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script></>}
      </head>
      <body><SmoothScroll>{children}<WhatsAppButton /></SmoothScroll></body>
    </html>
  );
}
