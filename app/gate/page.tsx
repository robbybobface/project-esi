import { GateSplash } from "@/components/gate-splash";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Password gate splash — served via middleware rewrite for locked visitors
export const metadata: Metadata = createMetadata({
  title: "Coming Soon",
  description:
    "Epicurean Spirits International — something exceptional is coming.",
  path: "/gate",
  noIndex: true,
});

export default function GatePage(): ReactNode {
  return <GateSplash />;
}
