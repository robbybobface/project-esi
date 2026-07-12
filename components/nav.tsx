"use client";

import { siteConfig } from "@/lib/metadata";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

const contactHref = `mailto:${siteConfig.contactEmail}`;

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

// Slant measured from esi_logo.svg itself: the logo's right edge runs from
// (486, 0) to (427, 230) in its viewBox — 59px over 230px. Deriving the badge
// slant from the same edge keeps the two shapes exactly parallel.
const TRAPEZOID_SLANT_RATIO = 59 / 230;
const WORDMARK_HEIGHT = 42;
// Visual logo height inside the scrolled pill; applied via transform scale so
// the layout box (and therefore the pill) never resizes.
const WORDMARK_HEIGHT_SCROLLED = 32;

// Clip-path polygon for a given badge height, keeping the slant angle constant
function trapezoidClipPath(height: number): string {
  const slant = (height * TRAPEZOID_SLANT_RATIO).toFixed(2);
  return `polygon(${slant}px 0, 100% 0, calc(100% - ${slant}px) 100%, 0 100%)`;
}

const links = [
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "Heritage", href: "#heritage" },
] as const;

interface NavProps {
  delay?: number;
  // Entrance animation waits for this (the preloader gates the hero intro)
  active?: boolean;
}

export function Nav({ delay = 1.4, active = true }: NavProps): ReactNode {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <motion.nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-10 py-6 max-[850px]:px-6 max-[850px]:py-4">
        <motion.div
          className="pointer-events-auto flex items-center"
          variants={{
            hidden: { opacity: 0, y: -12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <motion.a
            href="/"
            // Lock to the same 50px as the menu pill so the two sides share
            // a vertical center (logo is 42px, centered inside this box)
            className="relative inline-flex h-[50px] items-center gap-1 rounded-lg border text-xl font-medium tracking-tight"
            initial={false}
            animate={{
              paddingLeft: scrolled ? 6 : 0,
              paddingRight: scrolled ? 6 : 0,
              // When scrolled, padding is already baked into the 50px target
              // via the scale shrink; keep height stable either way
              paddingTop: scrolled ? 3 : 0,
              paddingBottom: scrolled ? 3 : 0,
              backgroundColor: scrolled
                ? "rgba(255,255,255,1)"
                : "rgba(255,255,255,0)",
              color: scrolled ? "#0a0a0a" : "#ffffff",

              borderColor: scrolled
                ? "rgba(10,10,10,0.08)"
                : "rgba(255,255,255,0)",
            }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          >
            {/* Fixed 42px layout box; the logo shrinks inside it via transform
                (GPU-composited, no layout/re-raster per frame) */}
            <motion.span
              initial={false}
              animate={{
                scale: scrolled
                  ? WORDMARK_HEIGHT_SCROLLED / WORDMARK_HEIGHT
                  : 1,
              }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="relative block will-change-transform"
              style={{
                height: WORDMARK_HEIGHT,
                width: WORDMARK_HEIGHT * (487 / 230),
              }}
            >
              <Image
                src="/esi_logo.svg"
                alt="ESI — Epicurean Spirits International"
                fill
                priority
                sizes="89px"
                className={[
                  "object-contain transition-opacity duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  scrolled ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <Image
                src="/esi_logo_alt.svg"
                alt=""
                aria-hidden
                fill
                sizes="89px"
                className={[
                  "object-contain transition-opacity duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                  scrolled ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </motion.span>

            {/* Stacked company name — desktop only; too wide for mobile header.
                Absolutely positioned so scroll-hide never triggers layout. */}
            <motion.span
              initial={false}
              animate={scrolled ? { opacity: 0, x: -12 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="absolute top-1/2 left-[calc(100%+2px)] hidden whitespace-nowrap will-change-transform min-[850px]:block"
              style={{ height: WORDMARK_HEIGHT, y: "-50%" }}
              aria-hidden
            >
              {/* CSS trapezoid — static clip, slant matches the logo's right edge */}
              <span
                className="absolute inset-0 bg-black"
                style={{ clipPath: trapezoidClipPath(WORDMARK_HEIGHT) }}
              />
              {/* Horizontal padding keeps the text clear of the slanted edges */}
              <span className="relative flex h-full flex-col justify-center px-5 font-sans text-[10px] leading-[11px] font-bold tracking-[0.14em] text-white uppercase">
                <span>Epicurean</span>
                <span>Spirits</span>
                <span>International</span>
              </span>
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div
          className="pointer-events-auto flex items-center"
          variants={{
            hidden: { opacity: 0, y: -12 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <div className="flex h-[50px] items-center gap-1 rounded-lg border border-neutral-900/[0.08] bg-white p-1.5 text-xs font-medium tracking-widest text-neutral-700 uppercase">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hidden h-full items-center rounded-md px-4 transition-colors hover:bg-neutral-100 hover:text-neutral-900 min-[850px]:inline-flex"
              >
                {l.label}
              </a>
            ))}
            <a
              href={contactHref}
              className="inline-flex h-full items-center rounded-md bg-neutral-900 px-4 text-white transition-colors duration-200 hover:bg-neutral-800"
            >
              Contact Us
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-full w-10 items-center justify-center rounded-md text-neutral-900 transition-colors hover:bg-neutral-100 min-[850px]:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="bg-background pointer-events-auto fixed inset-0 z-40 min-[850px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
          >
            <div className="flex justify-end px-6 py-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="text-foreground hover:bg-foreground/5 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <motion.ul
              className="flex flex-col gap-2 px-6 pt-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-foreground border-foreground/[0.08] block border-b py-4 text-3xl font-medium tracking-tight"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="mt-6"
              >
                <a
                  href={contactHref}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-4 text-sm font-medium tracking-widest text-white uppercase"
                >
                  Contact Us
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
