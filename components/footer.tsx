"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowChip } from "@/components/arrow-chip";
import { RevealHeadline } from "@/components/reveal-headline";
import { useShaderVariant } from "@/components/shader-variant-context";
import { waveStopsCss } from "@/lib/shader-variants";
import type { ReactNode } from "react";

const ECOSYSTEM_LINKS = [
  { label: "Core Brand", href: "#ecosystem" },
  { label: "Experiences", href: "#ecosystem" },
  { label: "Hospitality", href: "#ecosystem" },
  { label: "Heritage", href: "#heritage" },
];

const COMPANY_LINKS = [
  { label: "Partnerships", href: "#partnerships" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

const BRAND_LINKS = [
  { label: "Gran Dinastía", href: "https://grandinastia.com/" },
  { label: "La Gran Señora", href: "https://www.lagransenora.com/" },
  { label: "Cuello Rum", href: "https://www.cuellosdistilleryltd.bz/" },
  { label: "Moon LIT Cove", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

// Same slant as nav — derived from esi_logo.svg's right edge (59px over 230px)
const TRAPEZOID_SLANT_RATIO = 59 / 230;
const WORDMARK_HEIGHT = 42;

function trapezoidClipPath(height: number): string {
  const slant = (height * TRAPEZOID_SLANT_RATIO).toFixed(2);
  return `polygon(${slant}px 0, 100% 0, calc(100% - ${slant}px) 100%, 0 100%)`;
}

export function Footer(): ReactNode {
  // Accent treatments derived from the active shader palette, matching the
  // ecosystem headline: gradient + flourish on the key words, palette-tinted
  // quiet tone on "Driven by"
  const { variant } = useShaderVariant();
  const waveStops = waveStopsCss(variant);
  const quietTone = `color-mix(in oklab, ${waveStops[1]} 42%, var(--foreground) 58%)`;

  // Two distinct accents from opposite ends of the palette: "heritage" gets
  // the warm stops, "hospitality" the cool ones (mirrored for seamless sweep)
  const mirror = (stops: string[]): string =>
    `linear-gradient(100deg, ${[...stops, ...[...stops].reverse()].join(", ")})`;
  const warmGradient = mirror([waveStops[2]!, waveStops[3]!, waveStops[4]!]);
  const coolGradient = mirror([waveStops[0]!, waveStops[1]!, waveStops[2]!]);

  return (
    <footer
      id="contact"
      className="bg-background text-foreground z-0 flex flex-col min-[851px]:sticky min-[851px]:bottom-0"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 pt-16 lg:px-10 lg:pt-20">
        <span className="border-foreground/[0.08] text-foreground/70 inline-flex items-center rounded-md border px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase">
          Get in touch
        </span>
        <div className="font-display mt-6 max-w-5xl text-4xl leading-[1.02] font-medium tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl">
          <RevealHeadline
            as="p"
            className="block"
            segments={[
              { text: "Built on" },
              {
                text: "heritage",
                className: "text-shimmer",
                style: { backgroundImage: warmGradient },
                flourish: {
                  colors: [waveStops[3]!, waveStops[4]!],
                  shape: "swash",
                  glint: false,
                },
              },
            ]}
          />
          <RevealHeadline
            as="p"
            className="block"
            delay={0.15}
            segments={[
              { text: "Driven by", style: { color: quietTone } },
              {
                text: "hospitality",
                className: "text-shimmer",
                style: { backgroundImage: coolGradient },
                flourish: {
                  colors: [waveStops[0]!, waveStops[2]!],
                  shape: "arc",
                  glint: false,
                },
              },
            ]}
          />
        </div>

        <div className="mt-8">
          <Link
            href="mailto:contact@esicorp.global"
            className="group inline-flex items-stretch gap-1"
          >
            <span className="bg-foreground text-background rounded-md px-5 py-3 text-xs font-medium tracking-widest uppercase">
              contact@esicorp.global
            </span>
            <ArrowChip className="bg-foreground text-background" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[1680px] flex-col gap-10 px-6 py-10 lg:mt-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:px-10 lg:py-12">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <span
              className="relative block shrink-0"
              style={{
                height: WORDMARK_HEIGHT,
                width: WORDMARK_HEIGHT * (487 / 230),
              }}
            >
              <Image
                src="/esi_logo.svg"
                alt="ESI — Epicurean Spirits International"
                fill
                sizes="89px"
                className="object-contain"
              />
            </span>
            {/* Parallelogram wordmark — slant matches the logo's right edge */}
            <span
              className="relative block whitespace-nowrap"
              style={{ height: WORDMARK_HEIGHT }}
              aria-hidden
            >
              <span
                className="absolute inset-0 bg-black"
                style={{ clipPath: trapezoidClipPath(WORDMARK_HEIGHT) }}
              />
              <span className="relative flex h-full flex-col justify-center px-5 font-sans text-[10px] leading-[11px] font-bold tracking-[0.14em] text-white uppercase">
                <span>Epicurean</span>
                <span>Spirits</span>
                <span>International</span>
              </span>
            </span>
          </Link>
          <p className="text-foreground/55 mt-4 max-w-xs leading-relaxed">
            Epicurean Spirits International — a global experiences and
            hospitality company built on generations of heritage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
          <FooterColumn title="Ecosystem" links={ECOSYSTEM_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Brands" links={BRAND_LINKS} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-foreground/55 mx-auto flex w-full max-w-[1680px] flex-col gap-4 px-6 py-6 font-mono text-sm lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>
            © 2026 Epicurean Spirits International, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;

  external?: boolean;
}

function FooterColumn({
  title,
  links,
  external,
}: FooterColumnProps): ReactNode {
  return (
    <div>
      <h4 className="font-subhead text-foreground/55 mb-5 text-xs tracking-widest uppercase">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => {
          const isExternal = external || link.href.startsWith("http");
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-foreground/85 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
