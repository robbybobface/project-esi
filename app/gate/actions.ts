"use server";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "esi_access";
const COOKIE_MAX_AGE_S = 60 * 60 * 24; // 24 hours

export interface UnlockState {
  ok?: boolean;
  error?: string;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function unlock(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const expected = process.env.SITE_PASSWORD;

  // Gate disabled — treat as unlocked
  if (!expected) return { ok: true };

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || submitted !== expected) {
    return { error: "Incorrect password" };
  }

  // Store a hash of the password (never the plaintext); middleware.ts
  // verifies it by hashing the env value the same way
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, await sha256Hex(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_S,
  });

  // No redirect — the client plays the gate exit animation, then refreshes
  return { ok: true };
}
