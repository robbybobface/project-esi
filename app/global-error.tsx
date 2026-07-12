"use client";

import { StatusPage } from "@/components/status-page";
import { ShaderVariantProvider } from "@/components/shader-variant-context";
import { ReducedMotionProvider } from "@/lib/motion";
import { THEME_CRITICAL_CSS, THEME_INIT_SCRIPT } from "@/lib/theme-critical";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, type ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Root-layout crash boundary — must supply its own html/body and a thin
 * provider slice so ShaderCanvas still gets theme + variant context.
 */
export default function GlobalError({
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
    <html
      lang="en"
      suppressHydrationWarning
      className={[geistSans.variable, geistMono.variable].join(" ")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: THEME_CRITICAL_CSS }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme"
          disableTransitionOnChange
        >
          <ReducedMotionProvider>
            <MotionConfig reducedMotion="user">
              <ShaderVariantProvider>
                <StatusPage
                  eyebrow="Error"
                  headline="A brief interruption."
                  body="Something unexpected happened. Try again, or head home."
                  homeLabel="Back home"
                  onReset={reset}
                  resetLabel="Try again"
                />
              </ShaderVariantProvider>
            </MotionConfig>
          </ReducedMotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
