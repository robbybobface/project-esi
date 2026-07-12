"use client";

import { useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type ReactNode } from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Single SVG that morphs between sun (rays) and moon (crescent). */
function ThemeGlyph({ isDark }: { isDark: boolean }): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  // Dark mode → show sun (switch to light); light mode → show moon
  const showSun = isDark;
  const duration = prefersReducedMotion ? 0 : 0.55;
  const maskId = "esi-theme-moon-mask";

  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden
      className="overflow-visible"
    >
      <defs>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          {/* Black punches a hole — slides in to form the crescent */}
          <motion.circle
            cy="10"
            fill="black"
            initial={false}
            animate={{
              cx: showSun ? 28 : 16,
              r: showSun ? 3 : 5.5,
            }}
            transition={{ duration, ease: easeOutExpo }}
          />
        </mask>
      </defs>

      {/* Rays — fan in for sun, collapse for moon */}
      <motion.g
        style={{ originX: "12px", originY: "12px" }}
        initial={false}
        animate={{
          rotate: showSun ? 0 : -40,
          scale: showSun ? 1 : 0.4,
          opacity: showSun ? 1 : 0,
        }}
        transition={{ duration, ease: easeOutExpo }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="12"
            y1="3.25"
            x2="12"
            y2="5.75"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </motion.g>

      {/* Core — masked into a crescent when showing moon */}
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{
          r: showSun ? 4.25 : 5.5,
        }}
        transition={{ duration, ease: easeOutExpo }}
      />
    </svg>
  );
}

export function ThemeSwitch(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const toggleTheme = (): void => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    // Mirror the preference in a cookie so the server renders the right
    // theme on the next request (see app/layout.tsx)
    document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`;
  };

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="h-10 w-10 cursor-not-allowed rounded-full bg-foreground/10 opacity-30"
          aria-label="Toggle theme"
          disabled
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={toggleTheme}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground opacity-30 shadow-lg transition-opacity duration-300 hover:opacity-100 hover:shadow-xl"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        type="button"
        whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
      >
        <ThemeGlyph isDark={isDark} />
      </motion.button>
    </div>
  );
}
