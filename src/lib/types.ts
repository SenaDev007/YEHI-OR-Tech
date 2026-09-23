/**
 * Types et constantes YEHI OR Manager.
 * Les "enums" sont stockées en String dans SQLite et validées ici.
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

export type CustomerType =
  | "PARTICULIER"
  | "ECOLE"
  | "ENTREPRISE"
  | "ASSOCIATION";

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  PARTICULIER: "Particulier",
  ECOLE: "École",
  ENTREPRISE: "Entreprise",
  ASSOCIATION: "Association",
};

export type ProfitCenter =
  | "BOUTIQUE"
  | "DESIGN"
  | "TEXTILE"
  | "ACADEMIA"
  | "DEV";

export const PROFIT_CENTERS: ProfitCenter[] = [
  "BOUTIQUE",
  "DESIGN",
  "TEXTILE",
  "ACADEMIA",
  "DEV",
];

export const PROFIT_CENTER_LABELS: Record<ProfitCenter, string> = {
  BOUTIQUE: "Boutique",
  DESIGN: "Design",
  TEXTILE: "Textile",
  ACADEMIA: "Academia",
  DEV: "Développement",
};

export type PaymentMethod =
  | "ESPECES"
  | "MOBILE_MONEY"
  | "VIREMENT"
  | "AUTRE";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  ESPECES: "Espèces",
  MOBILE_MONEY: "Mobile Money",
  VIREMENT: "Virement",
  AUTRE: "Autre",
};

export type SaleStatus =
  | "PAYEE"
  | "PARTIELLE"
  | "EN_ATTENTE"
  | "ANNULEE";

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  PAYEE: "Payée",
  PARTIELLE: "Partielle",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulée",
};

export type CashSessionStatus =
  | "OUVERTE"
  | "CLOTUREE"
  | "ECART_NON_RESOLU";

export const CASH_SESSION_STATUS_LABELS: Record<CashSessionStatus, string> = {
  OUVERTE: "Ouverte",
  CLOTUREE: "Clôturée",
  ECART_NON_RESOLU: "Écart non résolu",
};

export type OrderStatus =
  | "NOUVELLE"
  | "EN_PRODUCTION"
  | "PRETE"
  | "LIVREE"
  | "ANNULEE";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NOUVELLE: "Nouvelle",
  EN_PRODUCTION: "En production",
  PRETE: "Prête",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

export type AcademiaSubscriptionStatus =
  | "ACTIF"
  | "ESSAI"
  | "SUSPENDU"
  | "RESILIE"
  | "IMPAYE";

export const ACADEMIA_STATUS_LABELS: Record<AcademiaSubscriptionStatus, string> = {
  ACTIF: "Actif",
  ESSAI: "Essai",
  SUSPENDU: "Suspendu",
  RESILIE: "Résilié",
  IMPAYE: "Impayé",
};

export type StockMovementType =
  | "ENTREE"
  | "SORTIE"
  | "CORRECTION"
  | "INVENTAIRE";

export const STOCK_MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  ENTREE: "Entrée",
  SORTIE: "Sortie",
  CORRECTION: "Correction",
  INVENTAIRE: "Inventaire",
};

/**
 * Permissions par rôle.
 * Une permission est une chaîne courte (ex: "sales.create").
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: [
    "*",
  ],
  RESPONSABLE: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "sales.edit",
    "expenses.view",
    "expenses.create",
    "cash.view",
    "cash.open",
    "cash.close",
    "stock.view",
    "treasury.view",
    "academia.view",
    "reports.view",
    "orders.view",
    "orders.edit",
  ],
  CAISSIER: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "cash.view",
    "cash.open",
    "cash.close",
  ],
  PRODUCTION: [
    "dashboard.view",
    "orders.view",
    "orders.edit",
    "stock.view",
  ],
  SUPPORT_ACADEMIA: [
    "dashboard.view",
    "academia.view",
    "academia.edit",
  ],
  LECTURE_SEULE: [
    "dashboard.view",
    "sales.view",
    "expenses.view",
    "cash.view",
    "stock.view",
    "treasury.view",
    "academia.view",
    "reports.view",
  ],
};

export function hasPermission(role: Role, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

/**
 * Enveloppes de trésorerie par défaut (selon le document d'architecture section 3.2).
 */
export const DEFAULT_ENVELOPES = [
  { name: "Caisse opérationnelle", description: "Fonds de roulement quotidien", isOperational: true },
  { name: "Charges fixes", description: "Loyer, abonnements de base" },
  { name: "Électricité et Internet", description: "Charges techniques" },
  { name: "Taxes et obligations", description: "Réserve fiscale et taxes" },
  { name: "Maintenance et renouvellement", description: "Entretien, petites réparations, remplacement matériel" },
  { name: "Fonds Academia", description: "Réserve allouée au développement Academia" },
  { name: "Investissement", description: "Projets de croissance" },
  { name: "Rémunération du dirigeant", description: "Salaire dirigeant" },
  { name: "Bénéfices conservés", description: "Réserve de capital" },
];

/**
 * Catégories de dépenses prédéfinies.
 */
export const EXPENSE_CATEGORIES = [
  "Loyer",
  "Électricité",
  "Internet",
  "Téléphone",
  "Fournitures bureau",
  "Papier",
  "Encre / Toner",
  "Maintenance matériel",
  "Marketing",
  "Transport",
  "Repas / Réception",
  "Impôts et taxes",
  "Salaires",
  "Achats stock",
  "Autre",
] as const;

/**
 * Catégories de stock.
 */
export const STOCK_CATEGORIES = [
  "Papier",
  "Toner",
  "Encre",
  "Fourniture",
  "Textile",
  "Divers",
] as const;
