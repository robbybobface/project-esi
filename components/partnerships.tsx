"use client";

import { motion, useInView } from "motion/react";
import { Globe, Leaf, Waves, type LucideIcon } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { DragCarousel } from "./drag-carousel";
import { RevealHeadline } from "./reveal-headline";
import { CARD_TONES } from "@/lib/card-tones";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

interface Pillar {

  tag: string;
  title: string;
  body: string;
  icon: LucideIcon;
}

const PILLARS: Pillar[] = [
  {
    tag: "01 — tequila",
    title: "The Camarena Familia",
    body: "Third-generation Master Distiller Carlos Camarena and a family with over 250 years cultivating agave in Los Altos de Jalisco — considered royalty in Mexico and the tequila industry.",
    icon: Leaf,
  },
  {
    tag: "02 — rum",
    title: "The Cuello Family",
    body: "Seventy-five years of rum-making heritage in Belize. Waldir Cuello has partnered with ESI and the Camarena Familia to distill Moon LIT Cove, a truly premium Mexican rum.",
    icon: Waves,
  },
  {
    tag: "03 — hospitality",
    title: "ESI",
    body: "The exclusive global brand and distribution provider, carrying the portfolio into hospitality and lifestyle environments around the world.",
    icon: Globe,
  },
];

export function Partnerships(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="partnerships"
      className="relative w-full bg-background text-foreground"
      aria-labelledby="partnerships-heading"
    >
      <div className="max-w-[1680px] mx-auto px-10 max-[850px]:px-6 py-32 max-[850px]:py-24">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
          <div className="col-span-3 max-[1100px]:col-span-12 max-[850px]:col-span-1 pt-2">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}

              className="inline-flex items-center rounded-md border border-foreground/[0.08] px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground/70"
            >
              The partnership
            </motion.span>
          </div>

          <div className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              id="partnerships-heading"
              delay={0.05}
              className="text-balance text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-tight"
            >
              A global partnership built on generations of craft.
            </RevealHeadline>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="mt-6 max-w-[60ch] text-balance text-xl max-[850px]:text-lg font-light leading-snug text-foreground/60"
            >
              The exclusive global product and distillery provider joins the
              exclusive global brand and distribution provider — creating a
              global partnership across tequila, rum, and hospitality.
            </motion.p>
          </div>
        </div>

        {/* Grid on desktop; below 1100px a draggable carousel where the next
            card peeks in from the right */}
        <div className="mt-20 max-[850px]:mt-12">
          <div className="grid grid-cols-3 gap-5 max-[1100px]:hidden">
            {PILLARS.map((pillar, i) =>
              renderPillarCard(pillar, i, inView, "relative flex"),
            )}
          </div>
          <div className="hidden max-[1100px]:block">
            <DragCarousel>
              {PILLARS.map((pillar, i) =>
                renderPillarCard(
                  pillar,
                  i,
                  inView,
                  "relative flex w-[58vw] max-w-[30rem] shrink-0 max-[850px]:w-[calc(100%-2.75rem)]",
                ),
              )}
            </DragCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderPillarCard(
  pillar: Pillar,
  i: number,
  inView: boolean,
  className: string,
): ReactNode {
  const tone = CARD_TONES[i % CARD_TONES.length]!;
  return (
    <motion.article
      key={pillar.tag}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        ease: easeOutExpo,
        delay: 0.25 + i * 0.08,
      }}
      className={className}
    >
      <div
        className={[
          "group relative flex flex-1 flex-col justify-between",
          "rounded-2xl p-8 max-[850px]:p-6",
          "min-h-[360px] max-[850px]:min-h-[280px]",
          "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          tone.card,
        ].join(" ")}
      >
        <PillarIcon Icon={pillar.icon} iconClassName={tone.chip} />

        <div>
          <p
            className={[
              "font-mono text-xs uppercase tracking-[0.2em]",
              tone.label,
            ].join(" ")}
          >
            {pillar.tag}
          </p>
          <h3 className="font-subhead mt-3 text-2xl max-[850px]:text-xl font-medium leading-tight tracking-tight">
            {pillar.title}
          </h3>
          <p className={["mt-3 text-sm leading-relaxed", tone.body].join(" ")}>
            {pillar.body}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function PillarIcon({
  Icon,
  iconClassName,
}: {
  Icon: LucideIcon;
  iconClassName: string;
}): ReactNode {
  return (
    <div
      className={[
        "flex h-10 w-10 items-center justify-center rounded-md",
        "transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
        "group-hover:rotate-[-6deg] group-hover:scale-[1.05]",
        iconClassName,
      ].join(" ")}
      aria-hidden
    >
      <Icon className="h-5 w-5" strokeWidth={1.6} />
    </div>
  );
}
