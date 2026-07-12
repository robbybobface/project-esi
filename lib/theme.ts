import { cookies, headers } from "next/headers";

export type SiteTheme = "light" | "dark";

export interface ResolvedTheme {
  theme: SiteTheme;
  // True when the visitor explicitly chose light/dark via the theme cookie
  explicit: boolean;
}

/** Theme from the `theme` cookie, falling back to the client hint when unset. */
export async function resolveTheme(): Promise<ResolvedTheme> {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;

  if (themeCookie === "dark" || themeCookie === "light") {
    return { theme: themeCookie, explicit: true };
  }

  const headerStore = await headers();
  const prefers = headerStore.get("sec-ch-prefers-color-scheme");
  if (prefers === "dark") {
    return { theme: "dark", explicit: false };
  }

  return { theme: "light", explicit: false };
}

export {
  THEME_CRITICAL_CSS,
  THEME_INIT_SCRIPT,
} from "@/lib/theme-critical";
