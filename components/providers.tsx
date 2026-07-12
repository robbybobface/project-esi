"use client";

import { IntroProvider } from "@/components/intro-provider";
import { ShaderVariantProvider } from "@/components/shader-variant-context";
import { SmoothScroll } from "@/components/smooth-scroll";
import { InitialThemeProvider } from "@/lib/color-scheme";
import { ReducedMotionProvider } from "@/lib/motion";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({
  children,
  initialTheme,
  themeExplicit,
}: {
  children: ReactNode;
  initialTheme: "light" | "dark";
  themeExplicit: boolean;
}): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={themeExplicit ? initialTheme : "system"}
      // Pin hydration to the cookie when the user chose a theme explicitly
      enableSystem={!themeExplicit}
      storageKey="theme"
      disableTransitionOnChange
    >
      <InitialThemeProvider theme={initialTheme}>
        <ReducedMotionProvider>
          <MotionConfig reducedMotion="user">
            <ShaderVariantProvider>
              <IntroProvider>
                <SmoothScroll>{children}</SmoothScroll>
              </IntroProvider>
            </ShaderVariantProvider>
          </MotionConfig>
        </ReducedMotionProvider>
      </InitialThemeProvider>
    </ThemeProvider>
  );
}
