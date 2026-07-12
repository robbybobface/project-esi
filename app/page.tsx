import { Brands } from "@/components/brands";
import { Ecosystem } from "@/components/ecosystem";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Heritage } from "@/components/heritage";
import { Hero } from "@/components/hero";
import { Partnerships } from "@/components/partnerships";
import { Preloader } from "@/components/preloader";
import { StructuredData } from "@/components/structured-data";
import { Team } from "@/components/team";
import { Vision } from "@/components/vision";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  description:
    "Epicurean Spirits International (ESI) — a global experiences and hospitality company built on heritage. La Gran Señora Tequila, Moon LIT Cove rum, and world-class hospitality since 1860.",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <>
      <Preloader />
      <StructuredData />
      <main
        id="main-content"
        className="relative z-10 flex-1 bg-background"
      >
        <Hero />
        <Vision />
        <Ecosystem />
        <Partnerships />
        <Brands />
        <Heritage />
        <Team />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
