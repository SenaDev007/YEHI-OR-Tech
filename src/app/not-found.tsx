import Link from "next/link";

/**
 * Page 404 — ton copywriting : "Cette page n'existe pas, ou plus.
 * Le formulaire de contact, lui, fonctionne très bien."
 */
export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-noir-profond pt-[calc(var(--navbar-height)+2rem)]">
      <div className="pointer-events-none absolute inset-0 halo-or opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />

      <div className="container-x relative text-center">
        <span className="section-tag justify-center">Erreur 404</span>
        <h1 className="mt-6 font-display text-display-1 font-medium text-blanc-creme">
          Cette page n'existe pas, ou plus.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gris-light text-pretty">
          Le formulaire de contact, lui, fonctionne très bien.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-primary">
            Retour à l'accueil
          </Link>
          <Link href="/contact" className="btn-outline">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
