"use client";

import { motion, useInView } from "motion/react";
import {
  Bus,
  ConciergeBell,
  Crown,
  Megaphone,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowChip } from "./arrow-chip";
import { RevealHeadline } from "./reveal-headline";
import { useShaderVariant } from "@/components/shader-variant-context";
import { waveAccentGradient, waveStopsCss } from "@/lib/shader-variants";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

interface Tile {

  index: string;
  title: string;
  body: string;
  icon: LucideIcon;

  tone: string;

  iconClass: string;

  indexClass: string;

  bodyClass: string;
}

const TILES: Tile[] = [
  {
    index: "01.",
    title: "Core Brand",
    body: "La Gran Señora Tequila — luxury heritage tequila as the foundation of the entire ecosystem.",
    icon: Crown,
    tone: "bg-accent text-accent-foreground",
    iconClass: "text-accent-foreground/85",
    indexClass: "text-accent-foreground/55",
    bodyClass: "text-accent-foreground/75",
  },
  {
    index: "02.",
    title: "Brand Amplification",
    body: "A global spokesperson and celebrity brand ambassador driving worldwide visibility and cultural influence.",
    icon: Megaphone,
    tone: "bg-foreground/[0.08] text-foreground",
    iconClass: "text-foreground/70",
    indexClass: "text-foreground/45",
    bodyClass: "text-foreground/65",
  },
  {
    index: "03.",
    title: "AI Innovation Layer",
    body: "The AI La Gran Señora Ambassador — digital storytelling, customer engagement, and brand education.",
    icon: Sparkles,
    tone: "bg-foreground/[0.04] text-foreground",
    iconClass: "text-foreground/70",
    indexClass: "text-foreground/45",
    bodyClass: "text-foreground/60",
  },
  {
    index: "04.",
    title: "Experiential Activation",
    body: "The La Gran Señora Bus Program — events, hospitality partnerships, and global brand activations.",
    icon: Bus,
    tone: "bg-foreground/[0.04] text-foreground",
    iconClass: "text-foreground/70",
    indexClass: "text-foreground/45",
    bodyClass: "text-foreground/60",
  },
  {
    index: "05.",
    title: "Digital Community",
    body: "A Web3 engagement platform offering exclusive access, content, and brand experiences.",
    icon: Users,
    tone: "bg-foreground/[0.08] text-foreground",
    iconClass: "text-foreground/70",
    indexClass: "text-foreground/45",
    bodyClass: "text-foreground/65",
  },
  {
    index: "06.",
    title: "Hospitality Technology",
    body: "The AI Global Manager — guest interaction, service support, and a global licensing opportunity.",
    icon: ConciergeBell,
    tone: "bg-accent text-accent-foreground",
    iconClass: "text-accent-foreground/85",
    indexClass: "text-accent-foreground/55",
    bodyClass: "text-accent-foreground/75",
  },
];

export function Ecosystem(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Accent gradient + stops sampled from the active shader palette
  const { variant } = useShaderVariant();
  const waveStops = waveStopsCss(variant);
  const accentGradient = waveAccentGradient(variant);

  return (
    <section
      ref={sectionRef}
      id="ecosystem"

      className="relative w-full bg-background text-foreground py-32 max-[850px]:py-24"
      aria-labelledby="ecosystem-heading"
    >
      <div className="max-w-[1680px] mx-auto px-10 max-[850px]:px-6">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
          <div className="col-span-3 max-[1100px]:col-span-12 max-[850px]:col-span-1 pt-2">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="inline-flex items-center rounded-md border border-foreground/[0.08] px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground/70"
            >
              The ecosystem
            </motion.span>
          </div>

          <div className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              id="ecosystem-heading"
              delay={0.05}
              className="text-balance text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.06] tracking-tight"
              segments={[
                { text: "One luxury" },
                {
                  text: "tequila.",
                  className: "text-shimmer",
                  style: { backgroundImage: accentGradient },
                  // Underline + glint in the palette's two warmest stops
                  flourish: { colors: [waveStops[3]!, waveStops[4]!] },
                },
                {
                  text: "An entire world built around it.",
                  // Palette-tinted quiet tone: the shader's second stop mixed
                  // with the foreground, so it adapts to light/dark themes
                  style: {
                    color: `color-mix(in oklab, ${waveStops[1]} 42%, var(--foreground) 58%)`,
                  },
                },
              ]}
            />

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="mt-8 max-w-[60ch] text-balance text-lg leading-relaxed text-foreground/65 max-[850px]:text-xl"
            >
              La Gran Señora is more than a premium tequila — it&rsquo;s the
              center of a connected luxury ecosystem. Six pillars spanning
              AI, experiential activations, digital community, and
              hospitality technology carry one brand across food, nightlife,
              and lifestyle environments worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.28 }}
              className="mt-10"
            >
              <Link
                href="#heritage"
                className="group inline-flex items-stretch gap-1"
              >
                <span className="px-5 py-3 rounded-md bg-foreground text-background text-xs font-medium tracking-widest uppercase">
                  Explore Our Heritage
                </span>
                <ArrowChip className="bg-foreground text-background" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div
        className={[
          "mt-24 max-[850px]:mt-16",
          "grid grid-cols-3 max-[1100px]:grid-cols-1",

        ].join(" ")}
      >
        {TILES.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.article
              key={tile.index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.8,
                ease: easeOutExpo,

                delay: 0.45 + i * 0.08,
              }}

              className="relative flex"
            >
              <div
                className={[
                  "relative flex flex-1 flex-col justify-between",

                  "min-h-[380px] max-[850px]:min-h-[260px]",
                  "p-12 max-[850px]:p-8",

                  "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  tile.tone,
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <Icon
                    className={tile.iconClass}
                    size={64}

                    strokeWidth={0.75}
                    aria-hidden
                  />
                  <span
                    className={[
                      "font-mono text-xs uppercase tracking-[0.2em]",
                      tile.indexClass,
                    ].join(" ")}
                  >
                    {tile.index}
                  </span>
                </div>

                <div>
                  <h3 className="font-subhead text-2xl max-[850px]:text-xl font-medium leading-tight tracking-tight">
                    {tile.title}
                  </h3>
                  <p
                    className={["mt-3 text-lg leading-relaxed max-[850px]:text-xl", tile.bodyClass].join(" ")}
                  >
                    {tile.body}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
