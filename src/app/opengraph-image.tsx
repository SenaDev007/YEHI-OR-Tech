import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/**
 * Image Open Graph générée dynamiquement (Next.js 14 App Router).
 * Sert l'URL /opengraph-image.png automatiquement.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #080A0F 0%, #071A2F 50%, #080A0F 100%)",
          padding: "80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Halo or radial */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245, 183, 0, 0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top : eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "20px",
            color: "#F5B700",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: "40px", height: "2px", background: "#F5B700", display: "flex" }} />
          <div style={{ display: "flex" }}>{siteConfig.tagline}</div>
        </div>

        {/* Middle : titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "72px",
            color: "#F8F5EE",
            fontWeight: 500,
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          <div style={{ display: "flex" }}>Des idées lumineuses.</div>
          <div style={{ display: "flex", color: "#F5B700", fontStyle: "italic" }}>
            Des solutions encore plus brillantes.
          </div>
        </div>

        {/* Bottom : signature */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
              fontWeight: 500,
            }}
          >
            <span style={{ color: "#F8F5EE", display: "flex" }}>YEHI OR </span>
            <span style={{ color: "#F5B700", display: "flex" }}>TECH</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              color: "#8A8F9E",
              fontFamily: "monospace",
            }}
          >
            {siteConfig.city}, {siteConfig.country}
          </div>
        </div>
      </div>
    ),
    size
  );
}
