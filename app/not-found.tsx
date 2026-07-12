import { StatusPage } from "@/components/status-page";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Page not found",
  description: "The page you're looking for has moved or never existed.",
  path: "/404",
  noIndex: true,
});

export default function NotFound(): ReactNode {
  return (
    <StatusPage
      eyebrow="404"
      headline="This path isn't on the map."
      body="The page you're looking for has moved or never existed."
      homeLabel="Back home"
    />
  );
}
