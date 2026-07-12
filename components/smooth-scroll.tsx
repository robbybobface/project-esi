"use client";

import { features } from "@/lib/config";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

// Positive = scroll past the section top into the content. Sections use
// large py-* padding, so a negative "nav clearance" offset undershoots and
// leaves you staring at empty padding / the previous section.
const ANCHOR_OFFSET_DESKTOP = 48;
// Mobile header + section padding is tighter — desktop offset overshoots
const ANCHOR_OFFSET_MOBILE = 24;

function anchorOffset(): number {
  if (typeof window === "undefined") return ANCHOR_OFFSET_DESKTOP;
  return window.matchMedia("(max-width: 850px)").matches
    ? ANCHOR_OFFSET_MOBILE
    : ANCHOR_OFFSET_DESKTOP;
}

function resetScrollToTop(lenis?: Lenis): void {
  // Skip hash deep-links — those should land on their section
  if (window.location.hash) return;
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });
}

export function SmoothScroll({ children }: { children: ReactNode }): ReactNode {
  useEffect(() => {
    // Mobile Safari especially restores the previous scrollY on refresh,
    // which lands mid-hero (~200–300px). Pin to top unless a hash is present.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    resetScrollToTop();

    if (!features.smoothScroll) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    resetScrollToTop(lenis);

    const MAX_DT = 50;
    let synthTime = 0;
    let lastReal = performance.now();

    function raf(time: number): void {
      const dt = time - lastReal;
      lastReal = time;

      synthTime += Math.max(0, Math.min(dt, MAX_DT));
      lenis.raf(synthTime);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    function handleAnchorClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const element = document.querySelector(href);
      if (!element || !(element instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(element, { offset: anchorOffset() });
    }

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
