"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ArrowChip } from "@/components/arrow-chip";
import { ShaderCanvas } from "@/components/shader-canvas";
import { useShaderVariant } from "@/components/shader-variant-context";
import { heroPlaceholderColor } from "@/lib/shader-variants";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

const HEADLINE_LINES = ["Heritage is our foundation.", "Execution is our advantage."] as const;

export function FinalCta(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const { variant } = useShaderVariant();

  return (
    <section
      ref={sectionRef}
      id="get-started"
      className="relative w-full bg-background text-foreground"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-[1680px] mx-auto px-10 max-[850px]:px-6 pb-32 max-[850px]:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 1, ease: easeOutExpo }}
          className="relative overflow-hidden rounded-3xl min-h-[520px] max-[850px]:min-h-[420px]"
          // Matches the shader palette so the pre-WebGL frame isn't a color mismatch
          style={{ backgroundColor: heroPlaceholderColor(variant) }}
        >
          <div aria-hidden className="absolute inset-0">
            <ShaderCanvas />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10"
          />

          <div className="relative h-full flex flex-col justify-between p-14 max-[850px]:p-8 min-h-[inherit] text-white">
            <motion.h2
              id="final-cta-heading"
              className="font-display max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-tight"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
            >
              {HEADLINE_LINES.map((line) => (
                <span
                  key={line}
                  // Room for descenders inside the reveal mask; the negative
                  // margin keeps the tight leading intact
                  className="block overflow-hidden pb-[0.22em] -mb-[0.22em]"
                >
                  <motion.span
                    className="block will-change-transform"
                    variants={{
                      // 140% (not 110%) so the hidden line fully clears the
                      // mask, which extends 0.22em below for descender room
                      hidden: { y: "140%" },
                      visible: { y: "0%" },
                    }}
                    transition={{ duration: 1, ease: easeOutExpo }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <div className="flex items-end justify-between gap-8 max-[850px]:flex-col max-[850px]:items-start mt-10">
              <motion.p
                className="max-w-xl text-3xl max-[850px]:text-base font-regular tracking-tighter leading-snug text-white/75"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.6 }}
              >
                Distributors, hospitality groups, and strategic partners —
                let&rsquo;s build the next chapter of this legacy together.
              </motion.p>

              <motion.a
                href="#contact"
                className="group inline-flex items-stretch gap-1 cursor-pointer shrink-0"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="px-5 py-3 rounded-md bg-white text-neutral-900 text-xs font-medium tracking-widest uppercase border border-neutral-900/[0.08]">
                  Contact Us
                </span>
                <ArrowChip className="bg-white text-neutral-900" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
