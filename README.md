# Shader Template

A premium Next.js 16+ landing page template built around a signature WebGL palette shader. Pairs hero-scale fluid noise with a cursor-reactive wave variant, a user-switchable palette system, and a polished SaaS narrative — designed for product teams that want a brand-ready scaffold with an unmistakable look on day one.

## Features

- ✅ **Next.js 16+** with App Router
- ✅ **TypeScript** (strict mode, `noUncheckedIndexedAccess`)
- ✅ **Tailwind CSS v4** with token-driven theming
- ✅ **Dark Mode** via next-themes (class-based)
- ✅ **Motion** via motion/react with `MotionConfig reducedMotion="user"`
- ✅ **WebGL Palette Shader** — five named variants, cursor-reactive, theme-aware
- ✅ **Wave Shader** — secondary cursor-reactive variant for value-prop and CTA accents
- ✅ **Variant Context** — user-switchable palette propagated across hero, value-prop, and final CTA
- ✅ **JSON-LD Structured Data** — Organization, WebSite, SoftwareApplication, FAQPage
- ✅ **SEO Ready** — metadata, Open Graph, Twitter cards, sitemap, robots
- ✅ **Accessibility** — skip links, focus rings, ARIA labels, prefers-reduced-motion guards
- ✅ **Edge Compatible** — no Node-only APIs

## Sections Included

- **Nav** — Sticky top bar with ESI logo lockup, Contact CTA, mobile menu, theme switch, palette switch
- **Hero** — Full-bleed palette shader with cursor-reactive flow and word-mask headline reveal
- **Vision** (`vision.tsx`) — Scroll-pinned 3-step brand philosophy backed by a synced wave shader
- **Ecosystem** (`ecosystem.tsx`) — Six-tile La Gran Señora ecosystem band with mono indices
- **Partnerships** (`partnerships.tsx`) — Three-up cards: Camarena, Cuello, ESI
- **Brands** (`brands.tsx`) — Interactive brand selector with featured panel and logo tiles
- **Heritage** (`heritage.tsx`) — Two family legacy cards with milestone lists
- **Team** (`team.tsx`) — Auto-scrolling, looping team carousel
- **FAQ** — Accessible accordion (currently not rendered on the page)
- **Final CTA** — Rounded card with embedded shader, hero-style headline, Contact CTA
- **Footer** — Reveal-from-below sticky footer (desktop) with gradient statement and link columns
- **Theme Switch** — Sun/Moon toggle, hydration-safe
- **Palette Switch** — Cycle through named shader variants

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
├── app/
│   ├── globals.css                  # Design tokens & base styles
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Home page (full landing composition)
│   ├── robots.ts                    # Dynamic robots.txt
│   ├── sitemap.ts                   # Dynamic sitemap
│   ├── icon.svg                     # Favicon
│   └── apple-icon.svg               # Apple touch icon
├── components/
│   ├── arrow-chip.tsx               # ArrowChip + RollingArrow CTA primitives
│   ├── faq.tsx                      # FAQ accordion (whole-row activation)
│   ├── final-cta.tsx                # Final CTA card with embedded shader
│   ├── footer.tsx                   # Reveal-from-below sticky footer
│   ├── hero.tsx                     # Hero with palette shader + word-mask reveal
│   ├── nav.tsx                      # Sticky nav with theme + palette switches
│   ├── partners.tsx                 # Trust strip
│   ├── pillars.tsx                  # 3-up benefit grid
│   ├── pricing.tsx                  # Pro / Enterprise pricing
│   ├── product.tsx                  # Full-bleed 3-tile product band
│   ├── providers.tsx                # Theme + MotionConfig + variant providers
│   ├── reveal-headline.tsx          # Word-mask animated headline
│   ├── shader-canvas.tsx            # Hero palette shader (raw WebGL)
│   ├── shader-variant-context.tsx   # User-switchable variant context
│   ├── shader-variant-toggle.tsx    # Variant cycle button
│   ├── skip-to-content.tsx          # Skip link for a11y
│   ├── smooth-scroll.tsx            # Optional smooth-scroll wrapper
│   ├── structured-data.tsx          # JSON-LD payload (Org/Site/App/FAQ)
│   ├── theme-switch.tsx             # Floating theme toggle
│   ├── value-prop.tsx               # Scroll-pinned 3-step narrative
│   └── wave-shader.tsx              # Wave shader (raw WebGL)
├── lib/
│   ├── config.ts                    # Default shader variant + feature flags
│   ├── faq-data.ts                  # Shared FAQ items (UI + JSON-LD)
│   ├── metadata.ts                  # SEO metadata utilities
│   ├── motion.tsx                   # Motion components & hooks
│   └── shader-variants.ts           # Named palette table
└── public/
    └── site.webmanifest             # PWA manifest
```

## Customization

### 1. Update Site Configuration

Edit `lib/metadata.ts` to update:
- Site name, description, and URL
- Social media handles
- Keywords and authors

The default `siteConfig.url` is `https://example.com` — replace it with your production URL before deploying so JSON-LD, OpenGraph, and the sitemap emit correct absolute URLs.

### 2. Update Brand & FAQ Copy

- The ESI logo lockup lives in `components/nav.tsx` and `components/footer.tsx` (SVGs in `public/`).
- FAQ items live in `lib/faq-data.ts` (the FAQ section is currently not rendered on the page).
- Heritage timeline copy lives in `components/heritage.tsx`; brand data (logos, blurbs, links) in `components/brands.tsx`.

### 3. Replace Icons

Replace the following files with your brand assets:
- `app/icon.svg` — Favicon (32x32)
- `app/apple-icon.svg` — Apple touch icon (180x180)
- `public/og-image.png` — Open Graph image (1200x630)

### 4. Tune the Shaders

#### Palette Shader (`components/shader-canvas.tsx`)

The hero, final CTA card, and ambient backdrops share a single palette shader instance and a single variant context. Add or edit named palettes in `lib/shader-variants.ts`:

```typescript
export const SHADER_VARIANTS = {
  warm: {
    label: "Warm",
    base: [0.05, 0.05, 0.08],
    warm: [0.95, 0.55, 0.20],
    mid:  [0.85, 0.30, 0.45],
    cool: [0.20, 0.40, 0.85],
    cursor: 1.0,
    rgScale: 1.0,
    brightness: 1.0,
  },
  // ...
} as const;
```

Set the default in `lib/config.ts`:

```typescript
export const DEFAULT_SHADER_VARIANT = "warm";
```

The palette switch in the nav cycles through the entries in `SHADER_VARIANTS` — additions appear automatically.

#### Wave Shader (`components/wave-shader.tsx`)

Cursor-reactive secondary shader used by the value-prop section. It reads the same active variant from context so palette switches stay coherent. Tunables (top of file) include `dpr`, intensity, and cursor falloff.

Both shaders:
- Cap device pixel ratio at `min(devicePixelRatio, 1.5)`.
- Size to their host container via `ResizeObserver`.
- Pause via `IntersectionObserver` when offscreen and on `visibilitychange`.
- Render a single static frame and stop when `prefers-reduced-motion: reduce` is set.

### 5. Add Routes

```tsx
// app/about/page.tsx
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "About the company.",
  path: "/about",
});

export default function AboutPage() {
  return <main id="main-content">...</main>;
}
```

## Design System

### Colors

- `--background` / `--foreground` — Page background and text
- `--muted` / `--muted-foreground` — Subtle surfaces and secondary text
- `--border` — Hairline rails and dividers (1px @ 8% alpha)
- `--ring` — Focus rings

### Typography

- **Sans:** Geist Sans
- **Mono:** Geist Mono — used for eyebrow tags and indices

### Layout Conventions

- Max content width: `max-w-[1680px]`
- Section padding: `px-6 min-[851px]:px-10`
- Mobile breakpoints: `max-[850px]` (compact) and `max-[1100px]` (medium)
- Eyebrow tags: bordered pill `border-foreground/[0.08]`, mono uppercase tracking-widest
- Card hovers: bg-tint only (no translate-y), 500ms ease-out-quart
- Easings: `easeOutExpo = [0.33, 1, 0.68, 1]`, `easeOutQuart = [0.22, 1, 0.36, 1]`

## Accessibility

The template includes:
- Skip-to-content link
- Visible focus rings on all interactive elements
- ARIA labels on toggles, switches, and the FAQ accordion
- `MotionConfig reducedMotion="user"` — all motion/react animations honor the OS preference automatically
- Both shaders render a single static frame (no rAF loop) when reduced motion is requested
- Proper heading hierarchy (single `<h1>` in hero, scoped `<h2>` per section)
- WCAG 2.1 AA contrast compliance in both themes

## Performance

- WebGL context cleanup on unmount via `WEBGL_lose_context` (no leaked GL resources)
- Single mount-once shader effect; uniforms updated via refs
- Shaders pause when offscreen (`IntersectionObserver`) and on tab hide (`visibilitychange`)
- Sized to host container — fewer fragments to shade than full-window canvases
- DPR capped at 1.5 to keep shading cost bounded on retina displays
- `next.config.ts` ships with `compress`, `poweredByHeader: false`, `productionBrowserSourceMaps: false`, `experimental.optimizePackageImports` for `lucide-react` + `motion`, security headers, and 1y immutable cache for static assets
- Edge-compatible runtime

## License

This template is licensed for use in commercial projects. You may not resell or redistribute the template itself.
