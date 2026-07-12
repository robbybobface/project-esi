"use client";

import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { DragCarousel } from "./drag-carousel";
import { RevealHeadline } from "./reveal-headline";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

interface Legacy {

  name: string;

  // Era chip shown where the template previously displayed a price
  era: string;

  body: string;

  // Timeline milestones rendered as the card's list
  milestones: string[];
}

const LEGACIES: Legacy[] = [
  {
    name: "The Camarena Legacy",
    era: "Since the 1770s",
    body: "La Gran Señora honors a lineage rooted in tradition, shaped by patience, and made with uncompromising standards — built not as a moment in time, but as a legacy meant to scale globally.",
    milestones: [
      "1770s–1800s — The Camarena family establishes early roots in agave cultivation in Jalisco",
      "1938 — The family distillery legacy is formally cemented: Gran Dinastía is born",
      "Today — La Gran Señora relaunches with a global brand strategy: premium tequila today, premium rum next, hospitality as the foundation",
      "Future — Positioned for international growth as a modern luxury spirits house",
    ],
  },
  {
    name: "The Cuello Family",
    era: "Since the 1950s",
    body: "The Cuello family's rum business has roots that go back 75 years in Belize, where patriarch Ignacio Cuello began making strong rum and slowly perfecting his signature style.",
    milestones: [
      "1950s — Ignacio Cuello begins making rum, refining his recipe and methods",
      "Late 1960s — Full-scale operation under the leadership of Froylan Atilano Cuello",
      "2009 — The next generation takes over, expanding distribution and visibility",
      "Today — Waldir Cuello partners with ESI and the Camarena Familia to distill Moon LIT Cove, a premium Mexican rum",
    ],
  },
];

export function Heritage(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="relative w-full bg-background text-foreground"
      aria-labelledby="heritage-heading"
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
              Heritage
            </motion.span>
          </div>

          <div className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              id="heritage-heading"
              delay={0.05}
              className="text-balance text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-tight"
            >
              Guardians of tradition. A dynasty carved in agave.
            </RevealHeadline>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="mt-6 max-w-[60ch] text-balance text-xl font-light leading-snug text-foreground/60"
            >
              For over 250 years, the Camarena family has cultivated agave
              and protected the craft of tequila making in Los Altos de
              Jalisco — a region defined by its iron-rich red soil and ideal
              growing conditions.
            </motion.p>
          </div>
        </div>

        {/* Grid on desktop; below 1100px a draggable carousel where the next
            card peeks in from the right */}
        <div className="mt-20 max-[850px]:mt-12">
          <div className="grid grid-cols-2 gap-5 max-[1100px]:hidden">
            {LEGACIES.map((legacy, i) =>
              renderLegacyCard(legacy, i, inView, "relative flex"),
            )}
          </div>
          <div className="hidden max-[1100px]:block">
            <DragCarousel>
              {LEGACIES.map((legacy, i) =>
                renderLegacyCard(
                  legacy,
                  i,
                  inView,
                  "relative flex w-[72vw] max-w-[46rem] shrink-0 max-[850px]:w-[calc(100%-2.75rem)]",
                ),
              )}
            </DragCarousel>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderLegacyCard(
  legacy: Legacy,
  i: number,
  inView: boolean,
  className: string,
): ReactNode {
  return (
    <motion.article
      key={legacy.name}
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
          "group relative flex flex-1 flex-col",
          "rounded-2xl p-10 max-[850px]:p-7",

          "bg-foreground/[0.04] hover:bg-foreground/[0.06]",

          "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ].join(" ")}
      >
        <div>
          <h3 className="font-subhead text-3xl max-[850px]:text-2xl leading-tight tracking-tight">
            {legacy.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl max-[850px]:text-2xl font-medium tracking-tight text-foreground/80">
              {legacy.era}
            </span>
          </div>

          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-foreground/60 max-[850px]:text-xl">
            {legacy.body}
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {legacy.milestones.map((milestone) => (
            <li
              key={milestone}
              className="flex items-start gap-3 text-lg text-foreground/85"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60"
                strokeWidth={1.6}
                aria-hidden
              />
              <span className="leading-snug">{milestone}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
