/**
 * Données des villes stratégiques africaines pour l'Africa Intelligence Map.
 */

export type CityPoint = {
  id: string;
  name: string;
  country: string;
  /** ISO 3166-1 numeric (utilisé par world-atlas) */
  countryId: number;
  latitude: number;
  longitude: number;
  active: boolean;
  /** Si cette ville est au Bénin (mise en évidence spéciale) */
  isBenin?: boolean;
};

/**
 * Liste des villes stratégiques.
 * Le Bénin (Cotonou, Parakou) est marqué isBenin=true.
 */
export const cities: CityPoint[] = [
  // Bénin
  { id: "cotonou", name: "Cotonou", country: "Benin", countryId: 204, latitude: 6.3703, longitude: 2.3912, active: true, isBenin: true },
  { id: "parakou", name: "Parakou", country: "Benin", countryId: 204, latitude: 9.3372, longitude: 2.6303, active: true, isBenin: true },
  // Afrique de l'Ouest
  { id: "lagos", name: "Lagos", country: "Nigeria", countryId: 566, latitude: 6.5244, longitude: 3.3792, active: true },
  { id: "accra", name: "Accra", country: "Ghana", countryId: 288, latitude: 5.6037, longitude: -0.1870, active: true },
  { id: "abidjan", name: "Abidjan", country: "Côte d'Ivoire", countryId: 384, latitude: 5.3459, longitude: -4.0083, active: true },
  { id: "dakar", name: "Dakar", country: "Senegal", countryId: 686, latitude: 14.7167, longitude: -17.4677, active: true },
  // Afrique centrale
  { id: "kinshasa", name: "Kinshasa", country: "DR Congo", countryId: 180, latitude: -4.3250, longitude: 15.3222, active: true },
  // Afrique de l'Est
  { id: "nairobi", name: "Nairobi", country: "Kenya", countryId: 404, latitude: -1.2921, longitude: 36.8219, active: true },
  { id: "kigali", name: "Kigali", country: "Rwanda", countryId: 646, latitude: -1.9706, longitude: 30.1044, active: true },
  { id: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", countryId: 231, latitude: 9.0320, longitude: 38.7421, active: true },
  // Afrique australe
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", countryId: 710, latitude: -26.2041, longitude: 28.0473, active: true },
  // Afrique du Nord
  { id: "cairo", name: "Cairo", country: "Egypt", countryId: 818, latitude: 30.0444, longitude: 31.2357, active: true },
  { id: "casablanca", name: "Casablanca", country: "Morocco", countryId: 504, latitude: 33.5731, longitude: -7.5898, active: true },
];

/**
 * Connexions réseau entre villes (lignes animées sur la carte).
 */
export type Connection = {
  from: string;
  to: string;
};

export const connections: Connection[] = [
  { from: "cotonou", to: "lagos" },
  { from: "cotonou", to: "accra" },
  { from: "accra", to: "abidjan" },
  { from: "abidjan", to: "dakar" },
  { from: "cotonou", to: "kinshasa" },
  { from: "kinshasa", to: "kigali" },
  { from: "kigali", to: "nairobi" },
  { from: "nairobi", to: "addis-ababa" },
  { from: "kinshasa", to: "johannesburg" },
  { from: "addis-ababa", to: "cairo" },
  { from: "cairo", to: "casablanca" },
  { from: "casablanca", to: "dakar" },
];

/**
 * Liste des pays africains par leur identifiant ISO numérique (world-atlas).
 */
export const AFRICAN_COUNTRY_IDS = new Set<number>([
  12,   // Algeria
  24,   // Angola
  72,   // Botswana
  108,  // Burundi
  120,  // Cameroon
  140,  // Central African Republic
  148,  // Chad
  174,  // Comoros
  178,  // Congo
  180,  // DR Congo
  204,  // Benin
  226,  // Equatorial Guinea
  231,  // Ethiopia
  232,  // Eritrea
  262,  // Djibouti
  266,  // Gabon
  270,  // Gambia
  288,  // Ghana
  324,  // Guinea
  384,  // Côte d'Ivoire
  404,  // Kenya
  422,  // Lebanon (skip)
  434,  // Libya
  450,  // Madagascar
  454,  // Malawi
  466,  // Mali
  478,  // Mauritania
  480,  // Mauritius
  504,  // Morocco
  508,  // Mozambique
  516,  // Namibia
  562,  // Niger
  566,  // Nigeria
  624,  // Guinea-Bissau
  646,  // Rwanda
  686,  // Senegal
  690,  // Seychelles
  694,  // Sierra Leone
  706,  // Somalia
  710,  // South Africa
  728,  // South Sudan
  729,  // Sudan
  732,  // Western Sahara
  748,  // Eswatini
  768,  // Togo
  788,  // Tunisia
  800,  // Uganda
  818,  // Egypt
  834,  // Tanzania
  854,  // Burkina Faso
  894,  // Zambia
  716,  // Zimbabwe
  654,  // Saint Helena (skip)
  612,  // Pitcairn (skip)
]);

/**
 * Identifiant ISO du Bénin (pour la mise en évidence spéciale au survol).
 */
export const BENIN_COUNTRY_ID = 204;

/**
 * Coordonnées approximatives de la bounding box de l'Afrique
 * pour calibrer la projection D3.
 */
export const AFRICA_BBOX = {
  x0: -25,  // Longitude ouest (cap-vert)
  y0: -38,  // Latitude sud (Afrique du Sud)
  x1: 55,   // Longitude est (Somalie)
  y1: 40,   // Latitude nord (Égypte/Tunisie)
};

/**
 * Stats affichées dans le tooltip Bénin.
 */
export const BENIN_STATS = {
  title: "Bénin",
  subtitle: "YEHI OR Tech · Digital Hub",
  metrics: [
    { label: "Solutions", value: "8+" },
    { label: "Plateformes", value: "04" },
    { label: "Clients actifs", value: "24" },
  ],
  cities: [
    { name: "Parakou", description: "Siège social" },
    { name: "Cotonou", description: "Bureau de liaison" },
  ],
};
