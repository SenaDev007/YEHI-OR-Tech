/**
 * Types et constantes partagés entre le backend et le frontend.
 */

export type Role =
  | "ADMIN"
  | "RESPONSABLE"
  | "CAISSIER"
  | "PRODUCTION"
  | "SUPPORT_ACADEMIA"
  | "LECTURE_SEULE";

export const ROLES: Role[] = [
  "ADMIN",
  "RESPONSABLE",
  "CAISSIER",
  "PRODUCTION",
  "SUPPORT_ACADEMIA",
  "LECTURE_SEULE",
];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  RESPONSABLE: "Responsable",
  CAISSIER: "Caissier",
  PRODUCTION: "Production",
  SUPPORT_ACADEMIA: "Support Academia",
  LECTURE_SEULE: "Lecture seule",
};
