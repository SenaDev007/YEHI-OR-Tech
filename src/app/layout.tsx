import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { SettingsProvider } from "@/components/SettingsProvider";
import { LayoutChrome } from "@/components/LayoutChrome";
import { siteConfig } from "@/data/site";
import "./globals.css";

// Phase 3 : Polices auto-hébergées via next/font
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#080A0F",
  width: "device-width",
  initialScale: 1,
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} : Agence digitale et IA à Parakou, Bénin`,
    description:
      "Sites web, applications, agents IA, automatisation et crédibilité en ligne.",
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

// FIX BUILD CRASH : layout n'est plus async, ne fait pas d'appel DB pendant le build.
// Les settings sont chargés côté client par SettingsProvider (fetch /api/public-settings).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-noir-profond text-blanc-creme font-sans">
        {/* Skip link accessibilité */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-or focus:px-4 focus:py-2 focus:font-sans focus:text-xs focus:text-noir-profond"
        >
          Aller au contenu principal
        </a>
        {/* SettingsProvider : charge DEFAULT_SETTINGS au build, fetch /api/public-settings au runtime */}
        <SettingsProvider>
          <LayoutChrome>{children}</LayoutChrome>
        </SettingsProvider>
      </body>
    </html>
  );
}
