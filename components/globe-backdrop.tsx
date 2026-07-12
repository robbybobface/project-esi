"use client";

import createGlobe from "cobe";
import { useTheme } from "next-themes";
import { useShaderVariant } from "@/components/shader-variant-context";
import { useEffect, useRef, type ReactNode } from "react";

// Radians per frame for the ambient rotation
const SPIN = 0.0025;

// Cap on the WebGL buffer edge — the sphere is a soft backdrop, so it
// doesn't need a full-resolution buffer at large display sizes
const BUFFER_CAP = 1440;

// A light scatter of world-city coordinates for the accent dots
const MARKER_LOCATIONS: [number, number][] = [
  [40.7, -74], [19.4, -99.1], [17.5, -88.2], [-23.5, -46.6], [51.5, -0.1],
  [41.9, 12.5], [30, 31.2], [-26.2, 28], [25.2, 55.3], [19.1, 72.9],
  [1.35, 103.8], [35.7, 139.7], [-33.9, 151.2], [34, -118.2],
];

// Spinning globe tinted from the active shader palette. Drag horizontally
// (mouse or touch) to spin it; rendered only while on screen and static for
// reduced-motion users.
export function GlobeBackdrop({ className }: { className?: string }): ReactNode {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const { variant } = useShaderVariant();
  const isDark = resolvedTheme === "dark";

  // Drag state shared with the render loop
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);
  const rTarget = useRef(0);
  const rCurrent = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Light mode: white sphere with grey land dots and a glowing rim in the
    // palette's warm accent. Dark mode: palette-blue dots with a deep rim.
    const soften = (c: readonly number[], t: number): [number, number, number] =>
      [c[0]! + (1 - c[0]!) * t, c[1]! + (1 - c[1]!) * t, c[2]! + (1 - c[2]!) * t];
    const dim = (c: readonly number[], t: number): [number, number, number] =>
      [c[0]! * t, c[1]! * t, c[2]! * t];

    const mix = (a: readonly number[], b: readonly number[]): [number, number, number] =>
      [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2, (a[2]! + b[2]!) / 2];

    // Light mode: white sphere with grey land dots and a glowing rim in the
    // palette's warm accent. Dark mode: palette-blue dots with a deep rim.
    const base: [number, number, number] = isDark
      ? [variant.wave[2][0], variant.wave[2][1], variant.wave[2][2]]
      : [1, 1, 1];
    const accent = variant.wave[3];
    const glow: [number, number, number] = isDark
      ? dim(variant.wave[1], 0.45)
      : soften(variant.wave[3], 0.4);

    // Small accent dots over a few world cities (cobe markers take
    // per-marker colors; the land layer itself is single-color).
    // Light mode: blue + green; dark mode: yellow + green.
    const green = mix(variant.wave[2], variant.wave[3]);
    const markerColors: [number, number, number][] = isDark
      ? [
          green,
          [variant.wave[3][0], variant.wave[3][1], variant.wave[3][2]],
          [variant.wave[4][0], variant.wave[4][1], variant.wave[4][2]],
        ]
      : [
          green,
          [variant.wave[1][0], variant.wave[1][1], variant.wave[1][2]],
          [variant.wave[2][0], variant.wave[2][1], variant.wave[2][2]],
        ];
    const markers = MARKER_LOCATIONS.map((location, i) => ({
      location,
      size: 0.025 + (i % 3) * 0.01,
      color: markerColors[i % markerColors.length]!,
    }));

    let width = wrap.offsetWidth;
    const bufferSize = () => Math.min(width * 2, BUFFER_CAP);
    let phi = 0;
    let frame = 0;
    let frameCount = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;

    const tick = () => {
      if (!globe) return;
      frame = requestAnimationFrame(tick);
      frameCount++;

      const dragging = pointerInteracting.current !== null;
      // Ambient idle rotation renders at half rate (30fps) — imperceptible
      // for a slow backdrop spin; drags render every frame for responsiveness
      if (!dragging && frameCount % 2 === 1) return;

      if (!reduceMotion && !dragging) phi += SPIN * 2;
      rCurrent.current += (rTarget.current - rCurrent.current) * (dragging ? 0.1 : 0.2);
      globe.update({
        phi: phi + rCurrent.current,
        width: bufferSize(),
        height: bufferSize(),
      });
    };

    const create = () => {
      if (globe) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: 1,
        width: bufferSize(),
        height: bufferSize(),
        phi: 0,
        theta: 0.25,
        dark: isDark ? 1 : 0,
        diffuse: 2.0,
        mapSamples: 20000,
        mapBrightness: isDark ? 1.4 : 0.5,
        baseColor: base,
        markerColor: [accent[0], accent[1], accent[2]],
        glowColor: glow,
        markers,
      });
      frame = requestAnimationFrame(tick);
    };

    const destroy = () => {
      cancelAnimationFrame(frame);
      globe?.destroy();
      globe = null;
    };

    const onResize = () => {
      width = wrap.offsetWidth;
    };
    window.addEventListener("resize", onResize);

    // Only spend GPU time while the section is on screen
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) create();
        else destroy();
      },
      { threshold: 0 },
    );
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      destroy();
    };
  }, [isDark, variant]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    pointerInteracting.current = e.clientX - pointerMovement.current;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    if (pointerInteracting.current === null) return;
    const delta = e.clientX - pointerInteracting.current;
    pointerMovement.current = delta;
    rTarget.current = delta / 200;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    pointerInteracting.current = null;
    e.currentTarget.style.cursor = "grab";
  };

  return (
    <div ref={wrapRef} aria-hidden className={className}>
      <canvas
        ref={canvasRef}
        // pan-y keeps vertical page scrolling alive on touch; horizontal
        // swipes spin the globe
        className="h-full w-full cursor-grab touch-pan-y"
        style={{ aspectRatio: "1 / 1" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
}
