"use client";

import { ArrowChip } from "@/components/arrow-chip";
import { ShaderCanvas } from "@/components/shader-canvas";
import { useShaderVariant } from "@/components/shader-variant-context";
import { useReducedMotion } from "@/lib/motion";
import { heroPlaceholderColor } from "@/lib/shader-variants";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

export interface StatusPageProps {
  eyebrow: string;
  headline: string;
  body: string;
  /** Primary CTA label — defaults to “Back home” */
  homeLabel?: string;
  /** When set, shows a secondary “Try again” control (error pages) */
  onReset?: () => void;
  resetLabel?: string;
}

export function StatusPage({
  eyebrow,
  headline,
  body,
  homeLabel = "Back home",
  onReset,
  resetLabel = "Try again",
}: StatusPageProps): ReactNode {
  const { variant } = useShaderVariant();
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden text-white"
      style={{ backgroundColor: heroPlaceholderColor(variant) }}
      aria-labelledby="status-page-heading"
    >
      <div aria-hidden className="absolute inset-0">
        <ShaderCanvas />
      </div>

      {/* Light left→right scrim for type contrast (mirrors Final CTA) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-black/10"
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-end px-10 pb-24 pt-32 max-[850px]:px-6 max-[850px]:pb-16 max-[850px]:pt-28">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 max-[850px]:gap-6">
          <motion.p
            className="font-mono text-xs tracking-[0.2em] uppercase text-white/70"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            id="status-page-heading"
            className="font-display max-w-[14ch] text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-tight"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.85, ease: easeOutExpo, delay: prefersReducedMotion ? 0 : 0.08 }}
          >
            {headline}
          </motion.h1>

          <motion.p
            className="max-w-md text-lg max-[850px]:text-base font-regular tracking-tight leading-snug text-white/75"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: prefersReducedMotion ? 0 : 0.16 }}
          >
            {body}
          </motion.p>

          <motion.div
            className="mt-2 flex flex-wrap items-center gap-4"
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.8, ease: easeOutExpo, delay: prefersReducedMotion ? 0 : 0.24 }}
          >
            {onReset ? (
              <button
                type="button"
                onClick={onReset}
                className="text-sm font-medium tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {resetLabel}
              </button>
            ) : null}

            <Link
              href="/"
              className="group inline-flex items-stretch gap-1 cursor-pointer shrink-0"
            >
              <span className="px-5 py-3 rounded-md bg-white text-neutral-900 text-xs font-medium tracking-widest uppercase border border-neutral-900/[0.08]">
                {homeLabel}
              </span>
              <ArrowChip className="bg-white text-neutral-900" />
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
