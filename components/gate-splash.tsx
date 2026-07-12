"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { ArrowChip } from "@/components/arrow-chip";
import { FluidCursor } from "@/components/fluid-cursor";
import { unlock, type UnlockState } from "@/app/gate/actions";
import { markFromGate, FROM_GATE_KEY } from "@/lib/from-gate";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

export function GateSplash(): ReactNode {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(
    unlock,
    {},
  );
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!state.ok) return;

    setExiting(true);
    markFromGate();

    // Soft refresh keeps the document (and centered logo) in place — a hard
    // assign("/") remounted everything and made the progress bar "pop" in.
    // Cookie is already set; refresh re-runs middleware and swaps gate → home.
    // Fallback hard nav if the soft refresh hasn't taken over in time.
    const soft = window.setTimeout(() => {
      router.refresh();
    }, 750);
    const hard = window.setTimeout(() => {
      // Still on the gate after soft refresh — force through
      if (
        sessionStorage.getItem(FROM_GATE_KEY) === "1" ||
        document.querySelector("[data-gate-splash]")
      ) {
        window.location.assign("/");
      }
    }, 2500);

    return () => {
      window.clearTimeout(soft);
      window.clearTimeout(hard);
    };
  }, [state.ok, router]);

  return (
    <div
      data-gate-splash
      className="fixed inset-0 overflow-hidden bg-background text-foreground"
    >
      {/* Layer A: CSS background gradient (critical CSS picks light/dark asset
          so the wrong theme never flashes on refresh) */}
      <div
        aria-hidden
        className="gate-gradient-fallback pointer-events-none absolute inset-0 origin-top scale-125"
      />
      {/* Soft fade into page background at the bottom — light only.
          Dark keeps the SVG unobstructed (fade was washing it gray). */}
      <div
        aria-hidden
        className="theme-light-only pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-background to-transparent"
      />

      {/* Layer B: fluid wisps — multiply on light, screen glow on dark */}
      <FluidCursor className="absolute inset-0" />

      {/* Exit wash: fades the painted background to plain background color,
          leaving only the centered logo for the preloader handoff */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="pointer-events-none absolute inset-0 bg-background"
      />

      {/* Centered stack: logo + blurb/form. On unlock the form collapses so
          the logo settles into the same centered lockup the Preloader uses. */}
      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="flex flex-col items-center gap-5"
        >
          {/* Light: trace on the password form; swap to alt.svg on unlock so
              the exit handoff matches the preloader lockup */}
          <Image
            src="/esi_logo_alt_trace.svg"
            alt="ESI — Epicurean Spirits International"
            width={106}
            height={50}
            priority
            className={["theme-light-only", exiting ? "hidden" : ""].join(" ")}
          />
          <Image
            src="/esi_logo_alt.svg"
            alt=""
            aria-hidden
            width={106}
            height={50}
            priority
            className={["theme-light-only", exiting ? "" : "hidden"].join(" ")}
          />
          <Image
            src="/esi_logo.svg"
            alt=""
            aria-hidden
            width={106}
            height={50}
            priority
            className="theme-dark-only"
          />
          <span
            className={[
              "whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em]",
              // White over the gradient; match preloader tone once the exit
              // wash covers the screen with bg-background
              exiting ? "text-foreground/60" : "text-white",
            ].join(" ")}
          >
            Epicurean Spirits International
          </span>
        </motion.div>

        {/* Blurb + password form, fades/collapses on unlock */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={
            exiting
              ? {
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  filter: "blur(6px)",
                }
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: exiting ? 0.45 : 0.7,
            ease: easeOutExpo,
            delay: exiting ? 0 : 0.2,
          }}
          className="mt-8 flex w-full flex-col items-center gap-8 overflow-hidden text-center"
        >
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white max-[850px]:text-xl">
              Something exceptional is coming.
            </h1>
            <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-white/60">
              A global experiences and hospitality brand, built on generations
              of heritage. Enter the password for early access.
            </p>
          </div>

          <form
            action={formAction}
            className="flex w-full max-w-sm flex-col items-center gap-3"
          >
            <div className="flex w-full items-stretch gap-1">
              <input
                type="password"
                name="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Password"
                aria-label="Site password"
                disabled={pending || exiting}
                className="h-12 flex-1 rounded-md border border-foreground/[0.12] bg-background/60 px-4 font-mono text-sm tracking-widest text-foreground backdrop-blur-md outline-none transition-colors placeholder:text-foreground/40 focus:border-foreground/35 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={pending || exiting}
                aria-label="Enter site"
                className="group inline-flex cursor-pointer items-stretch disabled:cursor-default disabled:opacity-50"
              >
                <ArrowChip className="bg-foreground text-background" />
              </button>
            </div>

            <p
              role="status"
              className={[
                "min-h-[1.25rem] font-mono text-[11px] uppercase tracking-widest",
                state.error ? "text-red-500/90" : "text-transparent",
              ].join(" ")}
            >
              {state.error ?? "."}
            </p>
          </form>
        </motion.div>

        {/* Invisible spacer matching the Preloader progress row so the logo
            lands in the same spot after the form collapses on unlock */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            height: exiting ? 1 : 0,
            marginTop: exiting ? 32 : 0,
            opacity: 0,
          }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
          className="w-44 shrink-0"
        />
      </div>
    </div>
  );
}
