const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
// Light-mode OG: sunshine mesh + white lockup (matches hero text-white)
const bg = fs.readFileSync(path.join(root, "public/og-bg.jpg")).toString("base64");
const logo = fs
  .readFileSync(path.join(root, "public/esi_logo.svg"))
  .toString("base64");

const out = [
  "/** Auto-generated OG asset data URLs — safe for Cloudflare Workers (no fs at runtime). */",
  "/** Regenerate: node scripts/embed-og-assets.cjs */",
  `export const OG_BG_DATA_URL = \`data:image/jpeg;base64,${bg}\` as const;`,
  `export const OG_LOGO_DATA_URL = \`data:image/svg+xml;base64,${logo}\` as const;`,
  "",
].join("\n");

const dest = path.join(root, "lib/og-embedded-assets.ts");
fs.writeFileSync(dest, out);
console.log(`Wrote ${dest} (${out.length} chars)`);
