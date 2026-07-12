"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useIntro } from "@/components/intro-provider";
import { useShaderVariant } from "@/components/shader-variant-context";
import { consumeFromGate } from "@/lib/from-gate";
import { waveAccentGradient } from "@/lib/shader-variants";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Minimum on-screen time so fast loads still feel intentional
const MIN_COVER_MS = 900;
const FROM_GATE_COVER_MS = 600;
// Caps so a hung Typekit / stalled subresource can never trap the user
const FONTS_BUDGET_MS = 2000;
const ASSETS_BUDGET_MS = 4000;
const HARD_FAILSAFE_MS = 5500;
const DISMISS_PAD_MS = 280;

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

function withTimeout(
  promise: Promise<unknown>,
  ms: number,
): Promise<"ok" | "timeout"> {
  return Promise.race([
    promise.then(() => "ok" as const),
    new Promise<"timeout">((resolve) => {
      window.setTimeout(() => resolve("timeout"), ms);
    }),
  ]);
}

function whenDocumentLoaded(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

export function Preloader(): ReactNode {
  const { variant } = useShaderVariant();
  const { completeIntro, resetIntro } = useIntro();
  // 0–1 driven by real checkpoints (load / fonts), not a fake ease
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  // Read once on mount — sessionStorage latch is Strict Mode safe
  const [fromGate] = useState(() => consumeFromGate());

  const finishedRef = useRef(false);

  // Effect Event — always sees latest completeIntro without writing a ref in render
  const finish = useEffectEvent(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    completeIntro();
    setVisible(false);
  });

  const bump = (value: number): void => {
    setProgress((prev) => Math.max(prev, value));
  };

  useLayoutEffect(() => {
    // Soft gate→home refresh keeps the provider mounted — re-arm the wait
    resetIntro();
  }, [resetIntro]);

  // Lock page scroll while the cover is up so a restored scrollY (or stray
  // touch) can't leave the user mid-hero once the overlay dismisses
  useLayoutEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [visible]);

  useEffect(() => {
    let cancelled = false;
    const cover = fromGate ? FROM_GATE_COVER_MS : MIN_COVER_MS;

    const safeBump = (value: number): void => {
      if (!cancelled) bump(value);
    };

    const dismiss = (): void => {
      if (cancelled) return;
      safeBump(1);
      // Re-pin to top right before reveal — Safari often restores scroll
      // asynchronously around load / paint
      if (!window.location.hash) window.scrollTo(0, 0);
      window.setTimeout(() => finish(), DISMISS_PAD_MS);
    };

    // Absolute ceiling — always leave, even if every wait hangs
    const failsafe = window.setTimeout(dismiss, HARD_FAILSAFE_MS);

    const run = async (): Promise<void> => {
      safeBump(0.12);

      const minimum = new Promise<void>((resolve) => {
        window.setTimeout(resolve, cover);
      });

      // Race asset waits against a budget so slow nets extend the bar,
      // but a single hung promise can't block forever
      const assets = (async () => {
        await whenDocumentLoaded();
        if (cancelled) return;
        safeBump(0.55);

        await withTimeout(
          document.fonts?.ready ?? Promise.resolve(),
          FONTS_BUDGET_MS,
        );
        if (cancelled) return;
        safeBump(0.88);
      })();

      await Promise.all([
        minimum,
        withTimeout(assets, ASSETS_BUDGET_MS),
      ]);

      if (cancelled) return;
      dismiss();
    };

    void run();

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, [fromGate]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background"
        >
          <motion.div
            initial={
              fromGate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: fromGate ? 0 : 0.5,
              ease: easeOutExpo,
            }}
            className="flex flex-col items-center gap-5"
          >
            <Image
              src="/esi_logo_alt.svg"
              alt=""
              width={106}
              height={50}
              priority
              className="theme-light-only"
            />
            <Image
              src="/esi_logo.svg"
              alt=""
              width={106}
              height={50}
              priority
              className="theme-dark-only"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
              Epicurean Spirits International
            </span>
          </motion.div>

          <div className="h-px w-44 overflow-hidden rounded-full bg-foreground/15">
            <motion.div
              className="h-full w-full origin-left will-change-transform"
              style={{ backgroundImage: waveAccentGradient(variant) }}
              initial={false}
              animate={{ scaleX: Math.max(progress, 0.04) }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
