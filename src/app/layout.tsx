import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SmoothScroll from "@/components/layout/SmoothScroll";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const GA_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

export const metadata: Metadata = {
  title: {
    default: "YEHI OR Tech | Agence Digitale & IA au Bénin",
    template: "%s | YEHI OR Tech"
  },
  description: "YEHI OR Tech aide les entreprises à créer une présence digitale professionnelle, automatiser leurs processus et transformer leurs idées en solutions numériques concrètes.",
  keywords: ["développement web", "agence digitale", "Bénin", "intelligence artificielle", "automatisation", "marketing digital", "Parakou"],
  authors: [{ name: "Dawes S. Akpowi Tohou" }],
  openGraph: {
    title: "YEHI OR Tech | Agence Digitale & IA",
    description: "Donnez de la lumière à votre présence digitale.",
    url: "https://yehiortech.com",
    siteName: "YEHI OR Tech",
    locale: "fr_BJ",
    type: "website",
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
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-noir-profond text-blanc">
        <SmoothScroll>
          {children}
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}

