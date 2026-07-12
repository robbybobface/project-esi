import { OG_BG_DATA_URL, OG_LOGO_DATA_URL } from "@/lib/og-embedded-assets";
import { ImageResponse } from "next/og";

// Generated Open Graph card served at /opengraph-image (light-mode hero lockup)
export const alt =
  "ESI — Epicurean Spirits International. Heritage built. Hospitality driven. Global ready.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same slant as the site header lockup: the logo's right edge runs 59px over
// 230px of height, which is a skew of ~14.4 degrees
const TRAPEZOID_SKEW_DEG = (Math.atan(59 / 230) * 180) / Math.PI;

const LOGO_HEIGHT = 76;
const LOGO_WIDTH = Math.round(LOGO_HEIGHT * (487 / 230));

async function loadGeist(weight: 300 | 700): Promise<ArrayBuffer> {
  // Geist is the site fallback stack; Adobe Articulat/Soleil aren't fetchable here.
  const url = `https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@5.2.5/latin-${weight}-normal.woff`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load Geist ${weight}: ${res.status}`);
  }
  return res.arrayBuffer();
}

export default async function OpengraphImage(): Promise<ImageResponse> {
  // Data URLs are embedded at build time — no fs/fetch for assets (Workers safe)
  const bgSrc = OG_BG_DATA_URL;
  const logoSrc = OG_LOGO_DATA_URL;

  const [displayFont, bodyFont] = await Promise.all([
    loadGeist(700),
    loadGeist(300),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "Geist Sans, sans-serif",
      }}
    >
      <img
        alt=""
        src={bgSrc}
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
        }}
      />

      {/* Soft dark overlay — hero uses white type on the light mesh */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          backgroundColor: "rgba(10,10,10,0.22)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: size.width,
          height: size.height,
          padding: 72,
        }}
      >
        {/* Header lockup: white logo + black trapezoid badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img alt="" src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} />
          <div
            style={{
              display: "flex",
              height: LOGO_HEIGHT,
              backgroundColor: "#000000",
              transform: `skewX(-${TRAPEZOID_SKEW_DEG}deg)`,
              padding: "0 30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transform: `skewX(${TRAPEZOID_SKEW_DEG}deg)`,
                fontFamily: "Geist Sans, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                lineHeight: 1.2,
                letterSpacing: 2.8,
                color: "#ffffff",
                textTransform: "uppercase" as const,
              }}
            >
              <div>Epicurean</div>
              <div>Spirits</div>
              <div>International</div>
            </div>
          </div>
        </div>

        {/* Hero display lines — always white over the light shader */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Geist Sans, sans-serif",
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              color: "#ffffff",
            }}
          >
            Heritage built
          </div>
          <div
            style={{
              fontFamily: "Geist Sans, sans-serif",
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              color: "#ffffff",
            }}
          >
            Hospitality driven
          </div>
          <div
            style={{
              fontFamily: "Geist Sans, sans-serif",
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              color: "#ffffff",
            }}
          >
            Global ready
          </div>
        </div>

        {/* Body + domain — matches hero white/90 treatment */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            fontFamily: "Geist Sans, sans-serif",
            fontWeight: 300,
            fontSize: 24,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: -0.2,
          }}
        >
          <div style={{ display: "flex", maxWidth: 720, lineHeight: 1.35 }}>
            Since 1860, our families have perfected tequila and rum. Today, ESI
            carries that craft to the world.
          </div>
          <div
            style={{
              display: "flex",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 0.5,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            esicorp.global
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist Sans",
          data: displayFont,
          weight: 700,
          style: "normal",
        },
        {
          name: "Geist Sans",
          data: bodyFont,
          weight: 300,
          style: "normal",
        },
      ],
    },
  );
}
