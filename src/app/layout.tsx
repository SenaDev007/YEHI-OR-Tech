import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#080A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.json",
  title: {
    default: `${siteConfig.name} : Agence digitale et IA à Parakou, Bénin`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Sites web, applications, agents IA, automatisation et crédibilité en ligne. Devis clair sous 48h. Agence digitale basée à Parakou.",
  applicationName: siteConfig.name,
  keywords: [
    "agence digitale",
    "Parakou",
    "Bénin",
    "développement web",
    "Academia",
    "SaaS",
    "agent IA",
    "automatisation",
    "Afrique de l'Ouest",
    "YEHI OR Tech",
  ],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  publisher: siteConfig.name,
  // Icônes — assets statiques servis depuis /public
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Apple touch + misc
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} : Agence digitale et IA à Parakou, Bénin`,
    description:
      "Sites web, applications, agents IA, automatisation et crédibilité en ligne. Devis clair sous 48h.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} : Agence digitale et IA à Parakou, Bénin`,
    description:
      "Sites web, applications, agents IA, automatisation et crédibilité en ligne.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
};

/**
 * Charge les polices Google Fonts via <link> dans le head.
 * Avantage : pas de build-time fetch (fonctionne sans internet au build,
 * mais charge les fonts dans le navigateur à runtime).
 */
const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {fontLinks}
        <style>{`
          :root {
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            --font-dm-sans: 'DM Sans', system-ui, -apple-system, sans-serif;
            --font-dm-mono: 'DM Mono', ui-monospace, 'SFMono-Regular', monospace;
          }
        `}</style>
      </head>
      <body className="min-h-screen flex flex-col bg-noir-profond">
        {/* Skip link accessibilité */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-or focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-noir-profond"
        >
          Aller au contenu principal
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
