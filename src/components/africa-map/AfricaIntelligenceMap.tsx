"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3-geo";
import * as topojson from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import {
  cities as cityData,
  connections as connectionData,
  AFRICAN_COUNTRY_IDS,
  BENIN_COUNTRY_ID,
  BENIN_STATS,
  type CityPoint,
} from "./map-data";

/**
 * Africa Intelligence Map — composant premium D3 + TopoJSON
 *
 * Spécification respectée :
 * - Projection Natural Earth
 * - Pays africains filtrés (53 pays)
 * - Styles subtils (navy + bleu tech)
 * - SVG filter glow subtil
 * - Points lumineux pulsés sur villes stratégiques
 * - Connexions animées entre villes
 * - Hover Bénin → glow + ligne + tooltip + mini-carte Bénin
 * - Responsive (largeur 100%, hauteur adaptative)
 * - Accessible : role="img", aria-label, focus clavier
 * - prefers-reduced-motion respecté
 */

type AfricaIntelligenceMapProps = {
  /** Hauteur du SVG (desktop) */
  height?: number;
  /** Hauteur mobile (plus courte) */
  mobileHeight?: number;
  /** Thème — pour futur réutilisable */
  theme?: "yehi-or";
  /** Active les interactions hover (default true) */
  enableHover?: boolean;
  /** Active les détails Bénin (default true) */
  enableBeninDetails?: boolean;
  /** Active les villes (default true) */
  showCities?: boolean;
  /** Active les connexions (default true) */
  showConnections?: boolean;
  /** Variant "hero" : couleurs plus vives pour fond sombre / arrière-plan diffus */
  variant?: "default" | "hero";
  className?: string;
};

export function AfricaIntelligenceMap({
  height = 600,
  mobileHeight = 360,
  theme = "yehi-or",
  enableHover = true,
  enableBeninDetails = true,
  showCities = true,
  showConnections = true,
  variant = "default",
  className,
}: AfricaIntelligenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [topoData, setTopoData] = useState<FeatureCollection | null>(null);
  const [beninFeature, setBeninFeature] = useState<Feature<Geometry> | null>(null);
  const [isHoveringBenin, setIsHoveringBenin] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [focusedCountryId, setFocusedCountryId] = useState<number | null>(null);

  // Responsive : observer la largeur du conteneur
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        setIsMobile(entry.contentRect.width < 640);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = () => setIsReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Charger le TopoJSON world-atlas une seule fois
  useEffect(() => {
    let mounted = true;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((topo: Topology) => {
        if (!mounted) return;
        // Le fichier contient un objet "countries"
        const collection = topojson.feature(topo, topo.objects.countries as never) as unknown as FeatureCollection;
        // Filtrer aux pays africains
        const africanFeatures = collection.features.filter((f) => {
          const id = parseInt(f.id as string, 10);
          return AFRICAN_COUNTRY_IDS.has(id);
        });
        const filtered: FeatureCollection = {
          type: "FeatureCollection",
          features: africanFeatures,
        };
        setTopoData(filtered);

        // Trouver le Bénin
        const benin = africanFeatures.find((f) => parseInt(f.id as string, 10) === BENIN_COUNTRY_ID);
        if (benin) setBeninFeature(benin as Feature<Geometry>);
      })
      .catch((err) => console.warn("[AfricaMap] TopoJSON fetch failed:", err));
    return () => {
      mounted = false;
    };
  }, []);

  // Projection D3 (Natural Earth) calibrée sur l'Afrique
  const projection = useMemo(() => {
    const h = isMobile ? mobileHeight : height;
    const proj = d3
      .geoNaturalEarth1()
      .fitExtent(
        [
          [20, 20],
          [width - 20, h - 20],
        ],
        { type: "Sphere" } as never
      );
    return proj;
  }, [width, height, mobileHeight, isMobile]);

  const pathGenerator = useMemo(() => d3.geoPath(projection), [projection]);

  // Coordonnées projetées des villes
  const projectedCities = useMemo(() => {
    return cityData.map((c) => {
      const [x, y] = projection([c.longitude, c.latitude]) ?? [0, 0];
      return { ...c, x, y };
    });
  }, [projection]);

  // Chemins SVG pour les connexions (lignes géodésiques)
  const connectionPaths = useMemo(() => {
    if (!showConnections) return [];
    return connectionData.map((conn) => {
      const from = projectedCities.find((c) => c.id === conn.from);
      const to = projectedCities.find((c) => c.id === conn.to);
      if (!from || !to) return null;
      // Ligne droite entre les deux points projetés
      return {
        id: `${conn.from}-${conn.to}`,
        path: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
        from,
        to,
      };
    }).filter(Boolean) as Array<{
      id: string;
      path: string;
      from: (typeof projectedCities)[0];
      to: (typeof projectedCities)[0];
    }>;
  }, [projectedCities, showConnections]);

  // Projection pour la mini-carte du Bénin (zoom sur le Bénin)
  const beninProjection = useMemo(() => {
    if (!beninFeature) return null;
    return d3
      .geoMercator()
      .fitExtent(
        [
          [10, 10],
          [180, 140],
        ],
        beninFeature
      );
  }, [beninFeature]);

  const beninPathGenerator = useMemo(() => {
    if (!beninProjection) return null;
    return d3.geoPath(beninProjection);
  }, [beninProjection]);

  // Villes du Bénin projetées pour la mini-carte
  const beninCitiesProjected = useMemo(() => {
    if (!beninProjection) return [];
    return cityData
      .filter((c) => c.isBenin)
      .map((c) => {
        const [x, y] = beninProjection([c.longitude, c.latitude]) ?? [0, 0];
        return { ...c, x, y };
      });
  }, [beninProjection]);

  // Handlers
  function handleBeninHover(e: React.MouseEvent<SVGPathElement>) {
    if (!enableHover || !enableBeninDetails) return;
    setIsHoveringBenin(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }

  function handleBeninMove(e: React.MouseEvent<SVGPathElement>) {
    if (!isHoveringBenin) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }

  function handleBeninLeave() {
    setIsHoveringBenin(false);
    setFocusedCountryId(null);
  }

  function handleBeninFocus() {
    if (!enableHover) return;
    setIsHoveringBenin(true);
    setFocusedCountryId(BENIN_COUNTRY_ID);
  }

  const svgHeight = isMobile ? mobileHeight : height;

  // Couleurs selon le variant
  const colors = variant === "hero"
    ? {
        countryFill: "rgba(20, 100, 244, 0.22)",     // bleu-tech visible
        countryStroke: "rgba(80, 180, 255, 0.55)",   // bordure bien visible
        countryHoverFill: "rgba(20, 100, 244, 0.40)",
        beninFill: "rgba(245, 183, 0, 0.40)",         // or visible pour le Bénin
        beninStroke: "rgba(255, 209, 102, 0.95)",     // or clair bordure bien visible
        beninStrokeWidth: 1.6,
      }
    : {
        countryFill: "rgba(0, 48, 135, 0.28)",
        countryStroke: "rgba(0, 112, 224, 0.35)",
        countryHoverFill: "rgba(0, 112, 224, 0.40)",
        beninFill: "rgba(0, 112, 224, 0.45)",
        beninStroke: "rgba(80, 180, 255, 0.85)",
        beninStrokeWidth: 1.2,
      };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className || ""}`}
      role="img"
      aria-label="Carte interactive de l'Afrique montrant l'activité régionale de YEHI OR Tech"
    >
      {/* SVG principal */}
      <svg
        width={width}
        height={svgHeight}
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="block"
        style={{ background: "transparent" }}
      >
        {/* Filtre glow subtil */}
        <defs>
          <filter id="africa-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="africa-strong-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="city-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4DB8FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0070E0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0070E0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="benin-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#F5B700" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FFD166" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F5B700" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pays africains */}
        {topoData && (
          <g>
            {topoData.features.map((feature) => {
              const id = parseInt(feature.id as string, 10);
              const isBenin = id === BENIN_COUNTRY_ID;
              const isFocused = focusedCountryId === id;
              const d = pathGenerator(feature as never);
              if (!d) return null;
              return (
                <path
                  key={String(feature.id)}
                  d={d}
                  fill={isBenin ? colors.beninFill : isFocused ? colors.countryHoverFill : colors.countryFill}
                  stroke={isBenin ? colors.beninStroke : colors.countryStroke}
                  strokeWidth={isBenin ? colors.beninStrokeWidth : 0.6}
                  style={{
                    transition: "fill 250ms ease, stroke 250ms ease",
                    cursor: isBenin && enableHover ? "pointer" : "default",
                  }}
                  onMouseEnter={isBenin ? handleBeninHover : undefined}
                  onMouseMove={isBenin ? handleBeninMove : undefined}
                  onMouseLeave={isBenin ? handleBeninLeave : undefined}
                  onFocus={isBenin ? handleBeninFocus : undefined}
                  onBlur={isBenin ? handleBeninLeave : undefined}
                  tabIndex={isBenin && enableHover ? 0 : -1}
                />
              );
            })}
          </g>
        )}

        {/* Halo glow autour du Bénin quand survolé */}
        {isHoveringBenin && beninFeature && (
          <path
            d={pathGenerator(beninFeature as never) ?? ""}
            fill="url(#benin-glow)"
            filter="url(#africa-strong-glow)"
            style={{ pointerEvents: "none" }}
          />
        )}

        {/* Connexions entre villes */}
        {showConnections && connectionPaths.length > 0 && (
          <g style={{ pointerEvents: "none" }}>
            {connectionPaths.map((conn) => (
              <g key={conn.id}>
                <path
                  d={conn.path}
                  stroke="rgba(0, 112, 224, 0.25)"
                  strokeWidth={0.8}
                  fill="none"
                />
                {/* Flux lumineux animé le long de la ligne */}
                {!isReducedMotion && (
                  <circle r={1.5} fill="#4DB8FF">
                    <animateMotion
                      dur={`${4 + Math.random() * 3}s`}
                      repeatCount="indefinite"
                      path={conn.path}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur={`${4 + Math.random() * 3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            ))}
          </g>
        )}

        {/* Points lumineux des villes */}
        {showCities && projectedCities.length > 0 && (
          <g style={{ pointerEvents: "none" }}>
            {projectedCities.map((city) => (
              <g key={city.id}>
                {/* Halo */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={city.isBenin ? 10 : 6}
                  fill="url(#city-glow)"
                />
                {/* Point central */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={city.isBenin ? 3 : 2}
                  fill={city.isBenin ? "#F5B700" : "#FFFFFF"}
                  stroke={city.isBenin ? "#FFD166" : "#4DB8FF"}
                  strokeWidth={0.5}
                />
                {/* Pulse animé (sauf reduced motion) */}
                {!isReducedMotion && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={city.isBenin ? 3 : 2}
                    fill="none"
                    stroke={city.isBenin ? "#F5B700" : "#4DB8FF"}
                    strokeWidth={1}
                    opacity={0.7}
                  >
                    <animate
                      attributeName="r"
                      values={`${city.isBenin ? 3 : 2};${city.isBenin ? 14 : 10};${city.isBenin ? 3 : 2}`}
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.7;0;0.7"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* Tooltip Bénin — panneau détaillé */}
      <AnimatePresence>
        {isHoveringBenin && enableBeninDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 16, (containerRef.current?.clientWidth ?? 0) - 280),
              top: Math.max(tooltipPos.y - 100, 8),
              width: 260,
            }}
          >
            <div className="rounded-2xl border border-or/40 bg-noir-profond/95 backdrop-blur-xl p-4 shadow-gold-glow">
              {/* En-tête */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-serif text-lg font-bold text-blanc-creme">{BENIN_STATS.title}</p>
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-or">
                    {BENIN_STATS.subtitle}
                  </p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-success">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-success opacity-75 animate-ping" />
                </span>
              </div>

              {/* Mini-carte du Bénin */}
              {beninFeature && beninPathGenerator && (
                <div className="mb-3 rounded-lg overflow-hidden bg-bleu-nuit/50 border border-or/20">
                  <svg viewBox="0 0 200 160" className="w-full" style={{ height: 100 }}>
                    {/* Pays Bénin */}
                    <path
                      d={beninPathGenerator(beninFeature as never) ?? ""}
                      fill="rgba(0, 112, 224, 0.40)"
                      stroke="rgba(80, 180, 255, 0.75)"
                      strokeWidth={0.8}
                    />
                    {/* Villes du Bénin */}
                    {beninCitiesProjected.map((city) => (
                      <g key={city.id}>
                        <circle cx={city.x} cy={city.y} r={6} fill="url(#city-glow)" />
                        <circle cx={city.x} cy={city.y} r={2.5} fill="#F5B700" stroke="#FFD166" strokeWidth={0.5} />
                        <text
                          x={city.x + 6}
                          y={city.y + 3}
                          fontSize="9"
                          fill="#FFFFFF"
                          fontFamily="sans-serif"
                          fontWeight="700"
                        >
                          {city.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}

              {/* Métriques */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {BENIN_STATS.metrics.map((m) => (
                  <div key={m.label} className="rounded-lg bg-noir-3 p-2 text-center">
                    <p className="font-serif text-base font-bold text-or">{m.value}</p>
                    <p className="text-[8px] font-sans font-bold uppercase tracking-wider text-gris">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Villes du Bénin */}
              <ul className="space-y-1 text-xs text-gris-light">
                {BENIN_STATS.cities.map((c) => (
                  <li key={c.name} className="flex items-center justify-between">
                    <span className="text-blanc-creme font-bold">{c.name}</span>
                    <span className="text-gris">{c.description}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-gris-dark/30 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-success">
                  Active Region
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {!topoData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-or font-sans text-xs uppercase tracking-widest">
            Chargement carte Afrique…
          </div>
        </div>
      )}
    </div>
  );
}
