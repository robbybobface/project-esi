"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowChip } from "@/components/arrow-chip";
import { useIntro } from "@/components/intro-provider";
import { ShaderCanvas } from "@/components/shader-canvas";
import { Nav } from "@/components/nav";
import { useShaderVariant } from "@/components/shader-variant-context";
import { heroPlaceholderColor } from "@/lib/shader-variants";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

const START_W = 110;
const START_H = 60;
const FINAL_RADIUS = 24;
const FRAME_INSET = 10;

const SCROLL_RANGE = 80;

export function Hero(): ReactNode {
  const { variant } = useShaderVariant();
  const { ready: introReady } = useIntro();

  // Failsafe if the preloader never signals — never leave the tiny center pill
  const [failsafeReady, setFailsafeReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setFailsafeReady(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  // The entrance waits for the preloader, so the expansion appears to grow
  // out from where the progress bar completed
  const started = introReady || failsafeReady;

  const progress = useMotionValue(0);

  const { scrollY } = useScroll();
  const rawExit = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], {
    clamp: true,
  });

  const exit = useSpring(rawExit, {
    stiffness: 120,
    damping: 22,
    mass: 0.4,
  });

  const padding = useTransform(exit, [0, 1], [FRAME_INSET, 0]);

  const width = useTransform(
    progress,
    (p) => `calc(${START_W}px + (100% - ${START_W}px) * ${p})`
  );
  const height = useTransform(
    progress,
    (p) => `calc(${START_H}px + (100% - ${START_H}px) * ${p})`
  );

  const borderRadius = useTransform([progress, exit], (latest) => {
    const [p, e] = latest as [number, number];

    const viewportH =
      typeof window !== "undefined" ? window.innerHeight - 20 : 800;
    const h = START_H + (viewportH - START_H) * p;
    const pillRadius = h / 2;

    const PILL_HOLD = 0.4;
    const t = Math.max(0, (p - PILL_HOLD) / (1 - PILL_HOLD));
    const eased = t * t * (3 - 2 * t);

    const entranceRadius = pillRadius * (1 - eased) + FINAL_RADIUS * eased;

    return entranceRadius * (1 - e);
  });

  useEffect(() => {
    if (!started) return;
    const controls = animate(progress, 1, {
      duration: 1.8,
      ease: easeOutExpo,
    });
    return () => controls.stop();
  }, [progress, started]);

  return (
    <>
      <Nav delay={1.1} active={started} />

      <motion.section className="relative h-screen w-full" style={{ padding }}>
        <div className="relative flex h-full w-full items-center justify-center">
          <motion.div
            className="relative overflow-hidden"
            style={{
              width,
              height,
              borderRadius,
              // Matches the shader palette so the pre-WebGL frame isn't a color mismatch
              backgroundColor: heroPlaceholderColor(variant),
            }}
          >
            <div aria-hidden="true" className="absolute inset-0 h-full w-full">
              <ShaderCanvas />
            </div>

            <motion.div
              className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1680px] flex-col justify-between p-10 pt-40 text-white max-[850px]:p-6 max-[850px]:pt-44"
              initial="hidden"
              animate={started ? "visible" : "hidden"}
              transition={{ staggerChildren: 0.12, delayChildren: 1.4 }}
            >
              <motion.h1
                className="font-display flex max-w-[18ch] flex-col text-[clamp(2.75rem,7.75vw,7.75rem)] leading-[0.95] font-medium tracking-tight max-[850px]:gap-1"
                // Articulat CF Heavy is a separate Typekit family served at weight 900
                style={{
                  fontFamily:
                    '"articulat-heavy-cf", var(--font-display-family)',
                  fontWeight: 900,
                }}
                variants={{
                  hidden: {},
                  visible: {},
                }}
                transition={{ staggerChildren: 0.12 }}
              >
                {["Heritage built", "Hospitality driven", "Global ready"].map(
                  (line) => (
                    <span
                      key={line}
                      // Room for descenders inside the reveal mask; the negative
                      // margin keeps the tight leading intact
                      className="-mb-[0.22em] block overflow-hidden pb-[0.22em]"
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
                  )
                )}
              </motion.h1>

              <div className="flex items-end justify-between gap-8 max-[850px]:flex-col max-[850px]:items-start">
                <motion.p
                  className="max-w-xl text-2xl leading-snug font-medium tracking-tight text-white/90 max-[850px]:text-lg"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                >
                  Since 1860, our families have perfected tequila and rum.
                  Today, ESI carries that craft to the world through
                  unforgettable hospitality.
                </motion.p>

                <motion.a
                  href="#vision"
                  aria-label="Learn more about ESI"
                  className="group pointer-events-auto inline-flex cursor-pointer items-stretch gap-1"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="rounded-md border border-neutral-900/[0.08] bg-white px-5 py-3 text-xs font-medium tracking-widest text-neutral-900 uppercase">
                    Learn More
                  </span>
                  <ArrowChip className="bg-accent text-accent-foreground" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
