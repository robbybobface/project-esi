"use client";

import { motion, useInView, type Transition } from "motion/react";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";

// Underline + glint decoration for an accent word (wipe variant only)
export interface WordFlourishConfig {
  // Gradient colors for the underline stroke (and glint fill)
  colors: [string, string];
  // "swash": hand-drawn wave (default). "arc": smooth bowed underline.
  shape?: "swash" | "arc";
  // Show the twinkling star at the word's shoulder (default true)
  glint?: boolean;
}

// A run of words sharing one style (font/color) within the headline
export interface HeadlineSegment {
  text: string;
  className?: string;
  // Inline style wins over the .font-display weight/family defaults
  style?: CSSProperties;
  flourish?: WordFlourishConfig;
}

interface RevealHeadlineProps {
  // Plain-string headline (single style)...
  children?: string;
  // ...or mixed-style segments; takes precedence over children
  segments?: HeadlineSegment[];

  // "wipe": block cover slides off each word (default)
  // "blur": words rise and sharpen from a soft-focus blur
  variant?: "wipe" | "blur";

  as?: "h1" | "h2" | "h3" | "p";

  className?: string;

  id?: string;

  stagger?: number;

  delay?: number;

  amount?: number;

  mutedFrom?: number;
}

interface WordItem {
  token: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  flourish?: WordFlourishConfig | undefined;
}

export function RevealHeadline({
  children,
  segments,
  variant = "wipe",
  as: Tag = "h2",
  className,
  id,
  stagger = 0.07,
  delay = 0,
  amount = 0.5,
  mutedFrom,
}: RevealHeadlineProps): ReactNode {
  const ref = useRef<HTMLHeadingElement>(null);

  const inView = useInView(ref, { once: true, amount });

  // Flatten either input shape into one word list with per-word styling
  const words: WordItem[] = segments
    ? segments.flatMap((segment) =>
        segment.text
          .split(/\s+/)
          .filter(Boolean)
          .map((token) => ({
            token,
            className: segment.className,
            style: segment.style,
            flourish: segment.flourish,
          })),
      )
    : (children ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((token, i) => ({
          token,
          className:
            mutedFrom !== undefined && i >= mutedFrom
              ? "text-foreground/35"
              : undefined,
        }));

  const blockTransition: Transition = {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  };

  if (variant === "blur") {
    // Soft-focus reveal: each word rises slightly while sharpening from a
    // blur — a softer, more atmospheric read than the block wipe
    return (
      <Tag ref={ref} id={id} className={["font-display", className].filter(Boolean).join(" ")}>
        {words.map((word, i) => (
          <span key={`g-${i}`}>
            <motion.span
              className="inline-block will-change-transform"
              initial={{ opacity: 0, y: "0.35em", filter: "blur(12px)" }}
              animate={
                inView
                  ? { opacity: 1, y: "0em", filter: "blur(0px)" }
                  : { opacity: 0, y: "0.35em", filter: "blur(12px)" }
              }
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + i * stagger,
              }}
            >
              {/* Word styling lives on a plain span so custom CSS never
                  collides with the animated transform/filter */}
              <span className={word.className} style={word.style}>
                {word.token}
              </span>
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} id={id} className={["font-display", className].filter(Boolean).join(" ")}>
      {words.map((word, i) => (
        <span key={`g-${i}`}>
          <span
            // Extra bottom padding keeps descenders (g, y, p) inside the
            // overflow box, and side padding keeps rounded terminals and
            // italic overhangs from clipping; negative margins cancel both
            // so layout and line-height are unaffected
            className="relative inline-block overflow-hidden align-baseline pb-[0.3em] -mb-[0.3em] px-[0.14em] -mx-[0.14em]"
          >
            <span
              className={["relative", word.className ?? ""].join(" ")}
              style={word.style}
            >
              {word.token}
            </span>

            {word.flourish ? (
              <WordFlourish
                config={word.flourish}
                inView={inView}
                delay={delay + i * stagger + 0.55}
              />
            ) : null}

            <motion.span
              aria-hidden
              initial={{ y: "0%" }}
              animate={inView ? { y: "110%" } : { y: "0%" }}
              transition={{ ...blockTransition, delay: delay + i * stagger }}
              className="absolute inset-x-0 -top-[0.05em] -bottom-[0.2em] bg-foreground will-change-transform"
            />
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

interface WordFlourishProps {
  config: WordFlourishConfig;
  inView: boolean;
  // Seconds until the underline starts drawing (after the word's own reveal)
  delay: number;
}

const FLOURISH_PATHS: Record<NonNullable<WordFlourishConfig["shape"]>, string> = {
  // Hand-drawn wave
  swash: "M3 7 Q 28 2.5 52 5.5 T 97 4.5",
  // Smooth bowed arc
  arc: "M3 3.5 Q 50 9.5 97 3.5",
};

// Underline that draws itself in, plus an optional glint that twinkles
// occasionally at the word's shoulder
function WordFlourish({ config, inView, delay }: WordFlourishProps): ReactNode {
  const gradientId = useId();
  const { colors, shape = "swash", glint = true } = config;

  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute inset-x-[0.05em] bottom-[0.03em] h-[0.14em] w-auto"
        style={{ width: "calc(100% - 0.1em)" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <motion.path
          d={FLOURISH_PATHS[shape]}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={2.6}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </svg>

      {glint ? (
        <motion.svg
          aria-hidden
          viewBox="0 0 10 10"
          className="absolute right-[-0.02em] top-[0.02em] h-[0.22em] w-[0.22em]"
          initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
          animate={
            inView
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.4],
                  rotate: [-20, 15, -20],
                }
              : { opacity: 0, scale: 0.4, rotate: -20 }
          }
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            delay: delay + 0.4,
            repeat: Infinity,
            repeatDelay: 3.2,
          }}
        >
          <path
            d="M5 0 L6.1 3.9 L10 5 L6.1 6.1 L5 10 L3.9 6.1 L0 5 L3.9 3.9 Z"
            fill={colors[1]}
          />
        </motion.svg>
      ) : null}
    </>
  );
}
