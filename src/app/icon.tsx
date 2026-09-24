import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon généré dynamiquement — symbole compact (croissant + étoile).
 */
export default function Favicon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #071A2F 0%, #0B3D91 50%, #1464F4 100%)",
            border: "1.5px solid #F5B700",
            display: "flex",
          }}
        />
      </div>
    ),
    size
  );
}
