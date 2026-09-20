import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yehiortech.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/services',
    '/packs',
    '/portfolio',
    '/blog',
    '/presence-digitale',
    '/contact',
    '/devis',
    '/careers',
    '/legal',
    '/privacy',
    ...['academia-helm', 'foncier-facile', 'afribayit', 'groupe-serma', 'keter-marketing'].map((slug) => `/portfolio/${slug}`),
    ...['conception-graphique', 'creation-sites-web', 'applications-web-mobile', 'agents-ia', 'automatisation-metier', 'marketing-digital', 'credibilite-en-ligne', 'conseil-accompagnement', 'identite-visuelle', 'sites-ecommerce', 'seo-referencement', 'maintenance-gestion-site'].map((slug) => `/services/${slug}`),
    ...['presence-digitale-professionnelle', 'automatiser-experience-client', 'site-qui-convertit'].map((slug) => `/blog/${slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
