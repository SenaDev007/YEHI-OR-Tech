import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ui/ContactForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { getSettings } from "@/lib/settings";
import { whatsappLink } from "@/lib/utils";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Décris ton projet, reçois une réponse sous 48h. Email, WhatsApp et formulaire disponibles.",
  alternates: { canonical: "https://yehiortech.com/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const defaultService = searchParams.service;
  const settings = await getSettings();

  return (
    <>
      <PageHero
        tag="Contact"
        title="Parlons de ton projet"
        subtitle="Décris ton besoin. Tu reçois une réponse sous 48h, avec une proposition claire."
        id="contact"
      />

      <section id="contact" className="py-20 scroll-mt-32">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12">
            {/* Colonne gauche : informations de contact — depuis la DB */}
            <aside className="flex flex-col gap-4">
              <ContactInfoBlock
                icon={<MapPin className="h-5 w-5 text-or" />}
                label="Localisation"
                value={settings.address}
              />
              <ContactInfoBlock
                icon={<Mail className="h-5 w-5 text-or" />}
                label="Email"
                value={
                  <a href={`mailto:${settings.contactEmail}`} className="link-underline">
                    {settings.contactEmail}
                  </a>
                }
              />
              <ContactInfoBlock
                icon={<Phone className="h-5 w-5 text-or" />}
                label="WhatsApp"
                value={
                  <a
                    href={whatsappLink(undefined, undefined, settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    {settings.phoneNumber}
                  </a>
                }
              />
              <ContactInfoBlock
                icon={<Clock className="h-5 w-5 text-or" />}
                label="Disponibilité"
                value={settings.hours}
              />

              {/* Bouton WhatsApp direct */}
              <a
                href={whatsappLink(undefined, undefined, settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-4 justify-center"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </aside>

            {/* Colonne droite : formulaire */}
            <div className="border border-gris-dark/30 bg-noir-2 p-6 md:p-8">
              <Suspense fallback={<div className="text-gris text-sm">Chargement du formulaire…</div>}>
                <ContactForm defaultService={defaultService} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactInfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 border border-gris-dark/30 bg-noir-2 p-5 transition-colors duration-300 hover:border-or/30">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-or/20 bg-bleu-nuit/50">
        {icon}
      </div>
      <div>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gris">{label}</span>
        <p className="mt-1 text-sm text-blanc-creme text-pretty">{value}</p>
      </div>
    </div>
  );
}
