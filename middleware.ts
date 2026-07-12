import { isPasswordProtected } from "@/lib/config";
import { NextResponse, type NextRequest } from "next/server";

// Password gate: requests without a valid access cookie are rewritten to the
// /gate splash. The cookie stores a SHA-256 hash of SITE_PASSWORD (never the
// plaintext) and expires after 24h (set in app/gate/actions.ts).

const ACCESS_COOKIE = "esi_access";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // PASSWORD_PROTECTED=false — skip gating entirely
  if (!isPasswordProtected()) {
    if (pathname === "/gate") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const password = process.env.SITE_PASSWORD;

  // Gate disabled when no password is configured
  if (!password) return NextResponse.next();

  const expected = await sha256Hex(password);
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  const unlocked = cookie === expected;

  // Direct visits to /gate: send unlocked users home, let others through
  if (pathname === "/gate") {
    if (unlocked) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (unlocked) return NextResponse.next();

  // Locked: serve the gate splash while keeping the requested URL
  return NextResponse.rewrite(new URL("/gate", request.url));
}

export const config = {
  // Skip Next internals, static files (anything with an extension), and
  // metadata routes so assets keep loading on the gate itself
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|opengraph-image|icon|apple-icon|.*\\..*).*)",
  ],
};
