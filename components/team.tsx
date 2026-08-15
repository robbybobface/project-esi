"use client";

import { motion, useInView } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { GlobeBackdrop } from "./globe-backdrop";
import { RevealHeadline } from "./reveal-headline";
import { CARD_TONES } from "@/lib/card-tones";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

// Pixels per second for the ambient auto-scroll
const AUTOPLAY_SPEED = 24;

interface TeamMember {
  name: string;
  role: string;
  // Super-short bio shown on the card
  blurb: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Robert Anderson",
    role: "Chief Executive Officer",
    blurb:
      "Twenty years in high-end restaurants, then finance at scale — now taking La Gran Señora global with the Camarena Familia.",
  },
  {
    name: "Matthew Brurs",
    role: "VP of Operations",
    blurb:
      "Securities and lending veteran with a top-producer track record and a spotless reputation built over two decades.",
  },
  {
    name: "Craig Ziegler",
    role: "Chief Creative Officer (AIG)",
    blurb:
      "40+ years leading immersive experience projects for AT&T, MTV, MGM, Resorts World, and Microsoft.",
  },
  {
    name: "David Hinkle",
    role: "Chief Operations Officer",
    blurb:
      "35+ years at the intersection of retail and real estate; co-founder of TORG, with 7 million square feet leased across 43 states.",
  },
  {
    name: "Luis De Santos",
    role: "Chief Product Officer",
    blurb:
      "Master Sommelier — the first of Filipino descent — behind beverage programs for MGM Grand and the Wolfgang Puck Group.",
  },
  {
    name: "Freddie Paloma",
    role: "Chief Marketing Officer",
    blurb:
      "25 years of relationship-driven marketing; co-founder of Elevate Hospitality Group behind GYU+ and Moignet Café.",
  },
  {
    name: "Dave Lawrence",
    role: "Company Advisor",
    blurb:
      "Former Chief Financial Officer of Patron Spirits with deep finance and strategy experience across industries.",
  },
  {
    name: "Tim Searcy",
    role: "Company Advisor",
    blurb:
      "Broadway and Las Vegas performer, two-time Las Vegas Toddy Award winner, and creator of Cinetra.",
  },
  {
    name: "Andy Firoved",
    role: "Company Advisor",
    blurb:
      "SaaS founder whose HOTB systems have delivered over $10 billion in federal assistance with the U.S. Treasury.",
  },
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Autoplay pauses while the pointer is over the scroller or the user is dragging
  const pausedRef = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Respect users who prefer reduced motion — no ambient scrolling
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Half the content width = one full copy of the list (it is rendered twice)
    const loopWidth = () => scroller.scrollWidth / 2;

    // Keep the scroll position inside the first copy so the loop is seamless
    const wrap = () => {
      const width = loopWidth();
      if (width <= 0) return;
      if (scroller.scrollLeft >= width) scroller.scrollLeft -= width;
      if (scroller.scrollLeft < 0) scroller.scrollLeft += width;
    };

    const onPointerEnter = () => {
      pausedRef.current = true;
    };
    const onPointerLeave = () => {
      pausedRef.current = false;
    };

    scroller.addEventListener("pointerenter", onPointerEnter);
    scroller.addEventListener("pointerleave", onPointerLeave);

    // With reduced motion there is no frame loop, so manual swipes need the
    // scroll listener to keep the infinite wrap working
    if (reducedMotion) {
      scroller.addEventListener("scroll", wrap, { passive: true });
    }

    let frameId = 0;
    let lastTime = performance.now();
    // Browsers round scrollLeft writes to whole pixels, so sub-pixel movement
    // is lost each frame. Carry the fractional remainder across frames.
    let carry = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      if (!pausedRef.current) {
        carry += AUTOPLAY_SPEED * dt;
        const before = scroller.scrollLeft;
        scroller.scrollLeft = before + carry;
        // Whatever the browser didn't apply stays in the carry for next frame
        carry -= scroller.scrollLeft - before;
      }
      // Loop wrap runs here (once per frame) instead of on every scroll
      // event — covers autoplay, drags, swipes, and button scrolls alike
      wrap();
      frameId = requestAnimationFrame(tick);
    };

    // Only autoplay while the carousel is on screen — the loop starts when
    // the section scrolls into view and stops entirely once it leaves
    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen && !frameId && !reducedMotion) {
          lastTime = performance.now();
          frameId = requestAnimationFrame(tick);
          return;
        }
        if (!onScreen && frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(scroller);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      scroller.removeEventListener("pointerenter", onPointerEnter);
      scroller.removeEventListener("pointerleave", onPointerLeave);
      scroller.removeEventListener("scroll", wrap);
    };
  }, []);

  // Mouse drag-to-scroll (touch already scrolls natively)
  const dragStateRef = useRef<{ startX: number; startScroll: number } | null>(
    null
  );

  const onScrollerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragStateRef.current = {
      startX: e.clientX,
      startScroll: scroller.scrollLeft,
    };
    scroller.setPointerCapture(e.pointerId);
    // Stops text selection from starting mid-drag
    e.preventDefault();
  };

  const onScrollerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    const scroller = scrollerRef.current;
    if (!drag || !scroller) return;
    scroller.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
  };

  const onScrollerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    scrollerRef.current?.releasePointerCapture(e.pointerId);
  };

  // Holds the timeout that resumes autoplay after an arrow-button scroll
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Pause autoplay while the smooth scroll animates, otherwise the
    // per-frame scrollLeft writes cancel the browser's animation
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 900);

    // Scroll by the width of the first card plus the gap between cards
    const firstCard = scroller.querySelector("article");
    const cardWidth = firstCard ? firstCard.clientWidth + 20 : 360;
    scroller.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="team"
      className="bg-background text-foreground relative w-full overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Interactive globe behind the content — anchored to the right on
          desktop, centered on mobile. Grab any exposed area to spin it. */}
      {/* Top-anchored so the sphere's rim is never clipped by the section edge */}
      <GlobeBackdrop className="absolute top-[-10%] right-[-25%] z-0 w-[min(1250px,74vw)] [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)] max-[850px]:top-auto max-[850px]:right-auto max-[850px]:bottom-[-18%] max-[850px]:left-1/2 max-[850px]:w-[170%] max-[850px]:-translate-x-1/2 max-[850px]:[mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] max-[850px]:[-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

      {/* Theme-matched wash so the globe dissolves into the page bg instead
          of ending on a hard overflow clip */}
      <div
        aria-hidden
        className="from-background via-background/75 pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-20% to-transparent max-[850px]:h-56"
      />

      <div className="pointer-events-none relative z-10 mx-auto max-w-[1680px] px-10 pt-32 pb-64 max-[850px]:px-6 max-[850px]:pt-24 max-[850px]:pb-48">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
          <div className="col-span-3 pt-2 max-[1100px]:col-span-12 max-[850px]:col-span-1">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="border-foreground/[0.08] text-foreground/70 inline-flex items-center rounded-md border px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase"
            >
              The team
            </motion.span>
          </div>

          <div className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              id="team-heading"
              delay={0.05}
              className="text-[clamp(2rem,4.2vw,4rem)] leading-[1.02] font-medium tracking-tight text-balance"
            >
              Building the foundation for global expansion.
            </RevealHeadline>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="text-foreground/60 mt-6 max-w-[60ch] text-xl leading-snug font-light text-balance"
            >
              A core team and world-class advisors spanning hospitality,
              spirits, finance, entertainment, and technology.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.25 }}
          className="mt-20 max-[850px]:mt-12"
        >
          <div
            ref={scrollerRef}
            // Focusable so keyboard users can scroll the row with arrow keys
            tabIndex={0}
            className="focus-visible:outline-foreground/40 pointer-events-auto flex cursor-grab gap-5 overflow-x-auto rounded-2xl pb-2 select-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Team members"
            onPointerDown={onScrollerPointerDown}
            onPointerMove={onScrollerPointerMove}
            onPointerUp={onScrollerPointerUp}
            onPointerCancel={onScrollerPointerUp}
          >
            {/* The list renders twice so the auto-scroll can loop seamlessly */}
            {[0, 1].map((copy) =>
              TEAM_MEMBERS.map((member, i) => {
                const tone = CARD_TONES[i % CARD_TONES.length]!;
                return (
                  <article
                    key={`${copy}-${member.name}`}
                    role="listitem"
                    aria-hidden={copy === 1 || undefined}
                    className={[
                      "relative flex shrink-0 flex-col justify-between",
                      "min-h-[340px] w-[340px] max-[850px]:min-h-[300px] max-[850px]:w-[280px]",
                      "rounded-2xl p-8 max-[850px]:p-6",
                      "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      tone.card,
                    ].join(" ")}
                  >
                    <span
                      aria-hidden
                      className={[
                        "flex h-14 w-14 items-center justify-center rounded-full",
                        "text-lg font-medium tracking-tight",
                        tone.chip,
                      ].join(" ")}
                    >
                      {initialsOf(member.name)}
                    </span>

                    <div>
                      <p
                        className={[
                          "font-mono text-xs tracking-[0.2em] uppercase",
                          tone.label,
                        ].join(" ")}
                      >
                        {member.role}
                      </p>
                      <h3 className="font-subhead mt-2 text-2xl leading-tight font-medium tracking-tight max-[850px]:text-xl">
                        {member.name}
                      </h3>
                      <p
                        className={[
                          "mt-3 text-lg leading-relaxed max-[850px]:text-xl",
                          tone.body,
                        ].join(" ")}
                      >
                        {member.blurb}
                      </p>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div className="pointer-events-auto mt-8 flex items-center justify-end gap-3">
            <CarouselButton direction={-1} onClick={() => scrollByCard(-1)} />
            <CarouselButton direction={1} onClick={() => scrollByCard(1)} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface CarouselButtonProps {
  direction: 1 | -1;
  onClick: () => void;
}

function CarouselButton({
  direction,
  onClick,
}: CarouselButtonProps): ReactNode {
  const Icon = direction === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        direction === 1 ? "Next team members" : "Previous team members"
      }
      className="border-foreground/[0.12] text-foreground/80 hover:border-foreground/30 hover:text-foreground inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300"
    >
      <Icon className="h-5 w-5" strokeWidth={1.6} />
    </button>
  );
}
