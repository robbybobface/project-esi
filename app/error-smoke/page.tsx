"use client";

import type { ReactNode } from "react";

/** Temporary route for smoke-testing app/error.tsx — delete after verify. */
export default function ErrorSmokePage(): ReactNode {
  throw new Error("Smoke-test intentional error");
}
