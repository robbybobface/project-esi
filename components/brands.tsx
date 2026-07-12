"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { RollingArrow } from "@/components/arrow-chip";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

type WordmarkStyle = "serif" | "mono" | "sans" | "sansBold" | "sansLight" | "italic";

interface Brand {
  id: string;
  name: string;
  // Short label shown under the brand name in the featured panel
  tagline: string;
  blurb: string;
  href: string;
  type: WordmarkStyle;
  // Optional logo asset — when present, replaces the typed wordmark in tiles
  logoSrc?: string;
  // Variant for dark mode (the tile background inverts with the theme)
  logoDarkSrc?: string;
  logoAlt?: string;
  // Optional product photo — shown in the featured panel instead of the logo
  productSrc?: string;
  productAlt?: string;
  // No live site yet — show Coming Soon instead of Visit website
  comingSoon?: boolean;
}

const BRANDS: Brand[] = [
  {
    id: "gran-dinastia",
    name: "Gran Dinastía",
    tagline: "Est. 1938 — Los Altos de Jalisco, Mexico",
    blurb:
      "Born in 1938, Gran Dinastía formally cemented the Camarena family's distillery legacy in Los Altos de Jalisco — the foundation on which every brand in the portfolio stands.",
    href: "https://grandinastia.com/",
    type: "italic",
    logoSrc: "/gran_dinastia.svg",
    logoAlt: "Gran Dinastía",
    productSrc: "/gran-dinastia-products.jpg",
    productAlt: "Gran Dinastía tequila portfolio — bottle lineup",
  },
  {
    id: "la-gran-senora",
    name: "La Gran Señora",
    tagline: "Luxury heritage tequila",
    blurb:
      "A luxury heritage tequila rooted in more than 250 years of Camarena agave cultivation — relaunching with a global brand strategy: premium tequila today, premium rum next, hospitality as the foundation.",
    href: "https://www.lagransenora.com/",
    type: "serif",
    logoSrc: "/lgs.svg",
    logoDarkSrc: "/lgs_dark.svg",
    logoAlt: "La Gran Señora",
    productSrc: "/lgs_bottles.png",
    productAlt: "La Gran Señora tequila bottles — Blanco, Añejo, and Reposado",
  },
  {
    id: "cuello-rum",
    name: "Cuello Rum",
    tagline: "75 years of Belizean rum-making",
    blurb:
      "Seventy-five years of rum-making heritage in Belize, started by patriarch Ignacio Cuello in the 1950s and carried forward by three generations of the Cuello family.",
    href: "https://www.cuellosdistilleryltd.bz/",
    type: "sansBold",
    // Renamed from cuello_rum.png to bust immutable browser cache of the old opaque asset
    logoSrc: "/cuello-rum.png",
    logoAlt: "Cuello's Rum — Rums of Belize",
    productSrc: "/cuello_rum_products.jpg",
    productAlt: "Cuello's Distillery product lineup — rums and spirits of Belize",
  },
  {
    id: "moon-lit-cove",
    name: "Moon LIT Cove",
    tagline: "A truly premium Mexican rum",
    blurb:
      "A truly premium Mexican rum created by Waldir Cuello, built and distilled in partnership with ESI and the Camarena Familia in Mexico.",
    href: "#",
    type: "sans",
    logoSrc: "/moon_lit_cove_logo.png",
    logoAlt: "Moon LIT Cove",
    productSrc: "/moonlit_cove_bottle.png",
    productAlt: "Moonlit Cove bottle on a tropical shore — distilled by Cuello's Mexico Ltd.",
    comingSoon: true,
  },
];
const WORDMARK_STYLES: Record<WordmarkStyle, string> = {
  serif: "font-serif font-medium tracking-tight",
  mono: "font-mono tracking-tight lowercase",
  sans: "font-sans font-medium tracking-tight",
  sansBold: "font-sans font-semibold tracking-tight uppercase",
  sansLight: "font-sans font-light tracking-tight lowercase",
  italic: "font-serif italic font-medium tracking-tight lowercase",
};

function CornerBrackets({ active }: { active: boolean }): ReactNode {
  const base = [
    "absolute h-[10px] w-[10px] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
    active
      ? "border-accent-foreground"
      : "border-accent-foreground/30 group-hover:border-accent-foreground",
  ].join(" ");
  // Brackets sit flush on the tile edges and expand outward when active/hovered
  return (
    <>
      <span
        className={`${base} left-0 top-0 border-l border-t ${active ? "-left-1.5 -top-1.5" : "group-hover:-left-1.5 group-hover:-top-1.5"}`}
        aria-hidden
      />
      <span
        className={`${base} right-0 top-0 border-r border-t ${active ? "-right-1.5 -top-1.5" : "group-hover:-right-1.5 group-hover:-top-1.5"}`}
        aria-hidden
      />
      <span
        className={`${base} bottom-0 left-0 border-b border-l ${active ? "-bottom-1.5 -left-1.5" : "group-hover:-bottom-1.5 group-hover:-left-1.5"}`}
        aria-hidden
      />
      <span
        className={`${base} bottom-0 right-0 border-b border-r ${active ? "-bottom-1.5 -right-1.5" : "group-hover:-bottom-1.5 group-hover:-right-1.5"}`}
        aria-hidden
      />
    </>
  );
}

function BrandLogo({
  brand,
  size,
}: {
  brand: Brand;
  // Featured panel vs. grid tile sizing
  size: "featured" | "tile";
}): ReactNode {
  // Featured panel prefers product photography when available
  if (size === "featured" && brand.productSrc) {
    return (
      <Image
        src={brand.productSrc}
        alt={brand.productAlt ?? `${brand.name} products`}
        fill
        sizes="(max-width: 1100px) 100vw, 40vw"
        // Cover the panel edge-to-edge — contain left letterboxing in this tall frame
        className="object-cover object-center"
      />
    );
  }

  if (!brand.logoSrc) {
    return (
      <span
        className={[
          size === "featured"
            ? "text-center text-[clamp(1.75rem,3.2vw,2.75rem)] leading-none text-background"
            : "relative select-none px-3 text-center text-[clamp(1rem,1.5vw,1.4rem)] leading-tight",
          WORDMARK_STYLES[brand.type],
        ].join(" ")}
      >
        {brand.name}
      </span>
    );
  }

  // Cuello's seal is circular — give it a bit more height than the wordmarks
  const isSeal = brand.id === "cuello-rum";

  if (size === "featured") {
    return (
      <span
        className={[
          "relative block w-full",
          isSeal
            ? "h-[min(320px,56vw)] max-w-[320px]"
            : "h-[min(240px,42vw)] max-w-[520px]",
        ].join(" ")}
      >
        <ThemedLogoImage
          brand={brand}
          sizes={isSeal ? "320px" : "520px"}
          unoptimized={isSeal}
        />
      </span>
    );
  }

  return (
    <span
      className={[
        "relative block w-[95%]",
        isSeal ? "h-36 max-[850px]:h-28" : "h-32 max-[850px]:h-24",
      ].join(" ")}
    >
      <ThemedLogoImage
        brand={brand}
        sizes="320px"
        unoptimized={isSeal}
        decorative
      />
    </span>
  );
}

// Renders the brand logo; when a dark-mode variant exists, both are mounted
// and CSS shows the one matching the current theme (the surfaces these sit
// on — bg-accent tiles and the bg-foreground panel — invert with the theme)
function ThemedLogoImage({
  brand,
  sizes,
  unoptimized = false,
  decorative,
}: {
  brand: Brand;
  sizes: string;
  unoptimized?: boolean;
  decorative?: boolean;
}): ReactNode {
  const altProps = decorative
    ? { alt: "", "aria-hidden": true as const }
    : { alt: brand.logoAlt ?? brand.name };

  if (!brand.logoDarkSrc) {
    return (
      <Image
        src={brand.logoSrc!}
        {...altProps}
        fill
        sizes={sizes}
        // Bypass the image optimizer so PNG alpha isn't flattened / cached as opaque
        unoptimized={unoptimized}
        className="object-contain"
      />
    );
  }

  return (
    <>
      <Image
        src={brand.logoSrc!}
        {...altProps}
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        className="object-contain dark:hidden"
      />
      <Image
        src={brand.logoDarkSrc}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        className="hidden object-contain dark:block"
      />
    </>
  );
}
// Featured-panel copy shared by the invisible height sizer and the live panel
function BrandCopy({
  brand,
  interactive = false,
}: {
  brand: Brand;
  interactive?: boolean;
}): ReactNode {
  return (
    <>
      <h3 className="font-subhead text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-tight">
        {brand.name}
      </h3>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/45">
        {brand.tagline}
      </p>
      <p className="mt-6 max-w-[42ch] max-[1100px]:max-w-none text-balance text-xl font-light leading-snug text-foreground/65">
        {brand.blurb}
      </p>
      {brand.comingSoon ? (
        <span className="text-foreground/55 mt-auto inline-flex items-center gap-3 self-start pt-12 font-mono text-xs tracking-[0.2em] uppercase">
          Coming soon
        </span>
      ) : interactive ? (
        <a
          href={brand.href}
          {...(brand.href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          aria-label={`Visit the ${brand.name} website`}
          className="group text-foreground/80 hover:text-foreground mt-auto inline-flex items-center gap-3 self-start pt-12 font-mono text-xs tracking-[0.2em] uppercase transition-colors duration-200"
        >
          Visit website
          <span
            aria-hidden
            className="bg-accent text-accent-foreground inline-flex h-6 w-6 items-center justify-center rounded-md"
          >
            <RollingArrow iconSize={12} strokeWidth={2.2} />
          </span>
        </a>
      ) : (
        // Non-interactive stand-in so the sizer matches CTA height
        <span className="mt-auto inline-flex items-center gap-3 self-start pt-12 font-mono text-xs tracking-[0.2em] uppercase">
          Visit website
          <span
            aria-hidden
            className="inline-flex h-6 w-6 items-center justify-center rounded-md"
          />
        </span>
      )}
    </>
  );
}

export function Brands(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeBrandId, setActiveBrandId] = useState<string>(BRANDS[0]!.id);

  const activeBrand =
    BRANDS.find((brand) => brand.id === activeBrandId) ?? BRANDS[0]!;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-accent text-accent-foreground rounded-[50px]"
      aria-labelledby="brands-heading"
    >
      <div className="max-w-[1680px] mx-auto px-10 max-[850px]:px-6 py-24 max-[850px]:py-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <h2
            id="brands-heading"
            className="inline-flex items-center rounded-md border border-accent-foreground/[0.08] px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-accent-foreground/70"
          >
            Our brands
          </h2>
        </motion.div>

        <div className="mt-6 h-px w-full bg-accent-foreground/15" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 }}
          className="mt-16 max-[850px]:mt-10 grid grid-cols-12 gap-6 max-[850px]:gap-6 rounded-2xl bg-background p-3 max-[850px]:p-3 text-foreground"
        >
          {/* Grid stack: invisible copies size the panel to the tallest brand
              so switching copy doesn't jump the layout (esp. on mobile). */}
          <div className="col-span-7 max-[1100px]:col-span-12 grid p-7 max-[850px]:p-4 min-h-[380px] max-[1100px]:min-h-0">
            {BRANDS.map((brand) => (
              <div
                key={`size-${brand.id}`}
                aria-hidden
                className="invisible col-start-1 row-start-1 flex flex-col"
              >
                <BrandCopy brand={brand} />
              </div>
            ))}
            <div className="col-start-1 row-start-1 flex h-full min-h-0 flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBrand.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="flex min-h-full flex-1 flex-col"
                >
                  <BrandCopy brand={activeBrand} interactive />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div
            className={[
              "col-span-5 max-[1100px]:col-span-12 relative self-stretch rounded-xl bg-foreground min-h-[300px] max-[1100px]:min-h-0 max-[1100px]:aspect-[16/10]",
              // Product photos fill the panel edge-to-edge; logos keep inset padding
              activeBrand.productSrc
                ? "overflow-hidden"
                : "flex items-center justify-center p-6",
            ].join(" ")}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: easeOutExpo }}
                className={
                  activeBrand.productSrc
                    ? "absolute inset-0"
                    : "flex w-full items-center justify-center"
                }
              >
                <BrandLogo brand={activeBrand} size="featured" />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-16 max-[850px]:mt-10 grid grid-cols-4 gap-x-12 gap-y-10 max-[1100px]:gap-x-8 max-[850px]:grid-cols-2 max-[850px]:gap-x-6">
          {BRANDS.map((brand, i) => {
            const active = brand.id === activeBrandId;
            return (
              <motion.button
                key={brand.id}
                type="button"
                onClick={() => setActiveBrandId(brand.id)}
                aria-pressed={active}
                aria-label={brand.name}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.6,
                  ease: easeOutExpo,
                  delay: 0.32 + i * 0.04,
                }}
                className={[
                  "group relative flex aspect-[5/3] cursor-pointer items-center justify-center",
                  active
                    ? "text-accent-foreground"
                    : "text-accent-foreground/85 group-hover:text-accent-foreground",
                ].join(" ")}
              >
                <CornerBrackets active={active} />
                <span
                  aria-hidden
                  className={[
                    "pointer-events-none absolute inset-0 origin-bottom bg-accent-foreground/[0.08] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                    active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
                  ].join(" ")}
                />
                <BrandLogo brand={brand} size="tile" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
