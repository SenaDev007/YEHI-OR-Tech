/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // ⚡ Pré-render agressif — prefetch automatique des pages linkées
  // Quand un Link est visible, Next.js prefetch le JS+data de la page cible
  // → navigation quasi-instantanée
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'image.thum.io' },
      { protocol: 'https', hostname: '**' },
    ],
    minimumCacheTTL: 31536000, // 1 an (Phase 7)
    deviceSizes: [360, 640, 828, 1080, 1440, 1920],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // ⚡ Cache navigateur pour les logos + images publiques
      {
        source: '/(icon|apple-icon|favicon|manifest).(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },
};

const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

module.exports = withBundleAnalyzer(nextConfig);
