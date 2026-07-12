import { ImageResponse } from "next/og";

// Generated Open Graph card served at /opengraph-image
export const alt =
  "ESI — Epicurean Spirits International. Heritage built. Hospitality driven. Global ready.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same slant as the site header lockup: the logo's right edge runs 59px over
// 230px of height, which is a skew of ~14.4 degrees
const TRAPEZOID_SKEW_DEG = (Math.atan(59 / 230) * 180) / Math.PI;

const LOGO_HEIGHT = 76;
const LOGO_WIDTH = Math.round(LOGO_HEIGHT * (487 / 230));

async function assetDataUrl(assetUrl: URL, mime: string): Promise<string> {
  // Bundler-resolved URL — Workers have no public/ filesystem at runtime
  const res = await fetch(assetUrl);
  if (!res.ok) {
    throw new Error(`Failed to load OG asset: ${assetUrl.pathname}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export default async function OpengraphImage(): Promise<ImageResponse> {
  const [bgSrc, logoSrc] = await Promise.all([
    assetDataUrl(new URL("../public/og-bg.jpg", import.meta.url), "image/jpeg"),
    assetDataUrl(
      new URL("../public/esi_logo.svg", import.meta.url),
      "image/svg+xml",
    ),
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
        fontFamily: "sans-serif",
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

      {/* Soft dark overlay for text contrast at thumbnail sizes */}
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
        {/* Header lockup: logo + trapezoid badge, mirroring the site nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img alt="" src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} />
          <div
            style={{
              display: "flex",
              height: LOGO_HEIGHT,
              backgroundColor: "#000",
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
                fontSize: 17,
                lineHeight: 1.25,
                letterSpacing: 3,
                color: "#fff",
              }}
            >
              <div>EPICUREAN</div>
              <div>SPIRITS</div>
              <div>INTERNATIONAL</div>
            </div>
          </div>
        </div>

        {/* Tagline, matching the hero: all three lines full white */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Heritage built
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Hospitality driven
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Global ready
          </div>
        </div>

        {/* Footer: hero subcopy + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            fontSize: 24,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 0.5,
          }}
        >
          <div style={{ display: "flex", maxWidth: 720, lineHeight: 1.35 }}>
            Since 1860, our families have perfected tequila and rum. Today, ESI
            carries that craft to the world.
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.7)" }}>
            esicorp.global
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
