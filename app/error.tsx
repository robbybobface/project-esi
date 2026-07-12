"use client";

import { StatusPage } from "@/components/status-page";
import { useEffect, type ReactNode } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Error"
      headline="A brief interruption."
      body="Something unexpected happened. Try again, or head home."
      homeLabel="Back home"
      onReset={reset}
      resetLabel="Try again"
    />
  );
}
