import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { services, getServiceBySlug } from "@/data/services";
import { whatsappLink, cn } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Code2,
  GraduationCap,
  Palette,
  Printer,
  FileText,
  Bot,
  Compass,
};

const availabilityStyles = {
  immediate: "bg-success/15 text-success border-success/30",
  "sur-devis": "bg-or/15 text-or border-or/30",
  produit: "bg-bleu-electrique/15 text-bleu-electrique border-bleu-electrique/30",
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service introuvable" };
  return {
    title: service.title,
    description: service.tagline,
    alternates: { canonical: `https://yehiortech.com/services/${service.slug}` },
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? Code2;
  const serviceIndex = services.findIndex((s) => s.slug === service.slug);
  const nextService = services[(serviceIndex + 1) % services.length];

  return (
    <>
      <PageHero
        tag={`Service ${service.number}`}
        title={service.title}
        subtitle={service.tagline}
      />

      <section className="py-20">
        <div className="container-x">
          {/* Badge disponibilité */}
          <div className="mb-8 flex items-center gap-3">
            <span
              className={cn(
                "badge-clip border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider",
                availabilityStyles[service.availability]
              )}
            >
              {service.availabilityLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Colonne gauche : problème + description + prestation */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Problème traité */}
              <div className="border-l-2 border-or/40 bg-bleu-nuit/20 p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-or">
                  Problème traité
                </span>
                <p className="mt-2 text-base text-gris-light text-pretty">{service.problem}</p>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-medium text-blanc-creme">
                  Ce qu'on fait
                </h2>
                <p className="mt-3 text-base text-blanc-creme text-pretty">
                  {service.fullDescription}
                </p>
              </div>

              {/* Prestations */}
              <div>
                <h2 className="font-display text-2xl font-medium text-blanc-creme">
                  Prestations incluses
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-gris-light">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-or" aria-hidden />
                      <span className="text-pretty">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limite commerciale */}
              {service.commercialLimit && (
                <div className="border border-warning/30 bg-warning/5 p-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-warning">
                    Limite commerciale
                  </span>
                  <p className="mt-2 text-sm text-gris-light text-pretty">
                    {service.commercialLimit}
                  </p>
                </div>
              )}

              {/* FAQ */}
              {service.faq.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-medium text-blanc-creme">
                    Questions fréquentes
                  </h2>
                  <dl className="mt-4 flex flex-col gap-4">
                    {service.faq.map((item) => (
                      <div key={item.question} className="border border-gris-dark/30 bg-noir-2 p-5">
                        <dt className="font-display text-lg font-medium text-blanc-creme text-pretty">
                          {item.question}
                        </dt>
                        <dd className="mt-2 text-sm text-gris-light text-pretty">
                          {item.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Colonne droite : public + champs + CTA */}
            <aside className="flex flex-col gap-6">
              {/* Icône */}
              <div className="flex h-20 w-20 items-center justify-center border border-or/30 bg-bleu-nuit/50">
                <Icon className="h-10 w-10 text-or" aria-hidden />
              </div>

              {/* Public concerné */}
              <div className="border border-gris-dark/30 bg-noir-2 p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
                  Public concerné
                </span>
                <ul className="mt-3 flex flex-col gap-2">
                  {service.targetAudience.map((aud) => (
                    <li key={aud} className="text-sm text-blanc-creme text-pretty">
                      → {aud}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Champs de qualification */}
              <div className="border border-gris-dark/30 bg-noir-2 p-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gris">
                  Ce qu'on te demandera
                </span>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {service.formFields.map((f) => (
                    <li
                      key={f}
                      className="border border-gris-dark/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gris"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="btn-primary justify-center"
                >
                  {service.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <a
                  href={whatsappLink(undefined, service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp justify-center"
                >
                  💬 WhatsApp
                </a>
              </div>
            </aside>
          </div>

          {/* Lien vers service suivant */}
          <div className="mt-16 flex flex-col items-center gap-4 border-t border-gris-dark/30 pt-8 sm:flex-row sm:justify-between">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gris hover:text-or"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
              Tous les services
            </Link>
            <Link
              href={`/services/${nextService.slug}`}
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-or link-underline"
            >
              Service suivant : {nextService.title}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
