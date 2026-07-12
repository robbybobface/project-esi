"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const InitialThemeContext = createContext<"light" | "dark">("light");

/** Server-resolved theme so SSR + first client paint agree (avoids hydration mismatch). */
export function InitialThemeProvider({
  theme,
  children,
}: {
  theme: "light" | "dark";
  children: ReactNode;
}): ReactNode {
  return (
    <InitialThemeContext.Provider value={theme}>
      {children}
    </InitialThemeContext.Provider>
  );
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Dark scheme for shaders/placeholders — cookie/SSR theme until mounted, then next-themes. */
export function useIsDark(): boolean {
  const initial = useContext(InitialThemeContext);
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  if (!mounted) return initial === "dark";
  return resolvedTheme === "dark";
}
