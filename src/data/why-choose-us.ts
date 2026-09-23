/**
 * 4 arguments "Pourquoi nous choisir" — page d'accueil section 7.6.
 */

export type WhyChooseUs = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export const whyChooseUs: WhyChooseUs[] = [
  {
    number: "01",
    title: "Pensé pour ici, pas copié d'ailleurs",
    description:
      "Mobile Money, contraintes réseau, usages locaux. Nos solutions partent des réalités du terrain béninois, pas d'un template importé.",
    icon: "MapPin",
  },
  {
    number: "02",
    title: "L'IA n'est pas une option payante en plus",
    description:
      "Chaque solution que l'on construit intègre l'intelligence artificielle par défaut, sans surcoût caché ni module additionnel à négocier plus tard.",
    icon: "Bot",
  },
  {
    number: "03",
    title: "Un interlocuteur, huit métiers",
    description:
      "Du logo au SaaS, de l'email professionnel à l'agent IA. Tu ne gères pas quatre prestataires qui ne se parlent pas entre eux.",
    icon: "Users",
  },
  {
    number: "04",
    title: "Tu sais où en est ton projet, sans avoir à demander",
    description:
      "Délais clairs annoncés dès le devis, points de suivi réguliers, zéro silence radio pendant trois semaines.",
    icon: "Eye",
  },
];
