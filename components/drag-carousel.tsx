"use client";

import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  type PanInfo,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface DragCarouselProps {
  children: ReactNode;
  className?: string;
  // Gap between cards (tailwind class on the track)
  gapClassName?: string;
}

// Horizontal drag carousel with momentum, rubber-band edges, a grab cursor,
// pagination dots (the carousel affordance), and a desktop "Drag" tooltip.
export function DragCarousel({
  children,
  className,
  gapClassName = "gap-4",
}: DragCarouselProps): ReactNode {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRef = useRef(0);
  const x = useMotionValue(0);

  // Tooltip follows the cursor on springs
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  const measure = () => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const maxDrag = Math.min(0, -(track.scrollWidth - wrapper.offsetWidth));
    setConstraints({ left: maxDrag, right: 0 });

    const count = track.children.length;
    setCardCount(count);

    const first = track.children[0] as HTMLElement | undefined;
    if (!first || count < 2) {
      stepRef.current = 0;
      return;
    }
    // Distance between card starts (width + gap)
    const second = track.children[1] as HTMLElement | undefined;
    stepRef.current = second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // Re-measure when children change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // Keep the active dot in sync with drag position
  useEffect(() => {
    return x.on("change", (latest) => {
      const step = stepRef.current;
      if (step <= 0 || cardCount < 2) return;
      const index = Math.round(Math.abs(latest) / step);
      setActiveIndex(Math.min(cardCount - 1, Math.max(0, index)));
    });
  }, [x, cardCount]);

  const goTo = (index: number) => {
    const step = stepRef.current;
    if (step <= 0) return;
    const target = Math.max(constraints.left, Math.min(0, -index * step));
    void animate(x, target, {
      type: "spring",
      stiffness: 280,
      damping: 32,
      mass: 0.7,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left + 16);
    cursorY.set(e.clientY - rect.top - 16);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);

    const step = stepRef.current;
    if (step > 0) {
      // Snap to the nearest card after a fling
      const projected = x.get() + info.velocity.x * 0.25;
      const index = Math.round(Math.abs(projected) / step);
      const clamped = Math.min(cardCount - 1, Math.max(0, index));
      goTo(clamped);
      return;
    }

    const targetX = Math.max(
      constraints.left,
      Math.min(0, x.get() + info.velocity.x * 0.3),
    );
    x.set(targetX);
  };

  const showDots = cardCount > 1;

  return (
    <div className={className}>
      <div
        ref={wrapperRef}
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          ref={trackRef}
          className={[
            "flex cursor-grab select-none active:cursor-grabbing",
            gapClassName,
          ].join(" ")}
          style={{ x }}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.12}
          dragTransition={{
            power: 0.25,
            timeConstant: 180,
            modifyTarget: (target) =>
              Math.max(constraints.left, Math.min(0, target)),
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {children}
        </motion.div>

        {/* Soft right-edge fade — kept narrow so the next-card peek stays readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-background to-transparent min-[851px]:w-12"
        />

        {/* Cursor-following "Drag" pill (mouse only — hidden while dragging) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-30 hidden items-center justify-center rounded-md border border-foreground/10 bg-background/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur-md min-[851px]:flex"
          style={{ x: springX, y: springY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering && !isDragging ? 1 : 0,
            scale: isHovering && !isDragging ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
        >
          Drag
        </motion.div>
      </div>

      {/* Pagination dots — the quiet signal that this is a carousel */}
      {showDots ? (
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Carousel pages"
        >
          {Array.from({ length: cardCount }, (_, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Show card ${i + 1} of ${cardCount}`}
                onClick={() => goTo(i)}
                className={[
                  "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out",
                  active
                    ? "w-6 bg-foreground"
                    : "w-1.5 bg-foreground/25 hover:bg-foreground/45",
                ].join(" ")}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
