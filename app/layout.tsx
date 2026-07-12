import { Providers } from "@/components/providers";
import { ShaderVariantToggle } from "@/components/shader-variant-toggle";
import { SkipToContent } from "@/components/skip-to-content";
import { ThemeSwitch } from "@/components/theme-switch";
import { baseMetadata } from "@/lib/metadata";
import {
  resolveTheme,
  THEME_CRITICAL_CSS,
  THEME_INIT_SCRIPT,
} from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
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

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactNode> {
  const { theme: initialTheme, explicit: themeExplicit } = await resolveTheme();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Font variables must live on <html>: the font stacks in globals.css are
      // declared on :root, and var() references resolve where they're declared
      className={[
        geistSans.variable,
        geistMono.variable,
        initialTheme === "dark" ? "dark" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ colorScheme: initialTheme }}
    >
      <head>
        {/* Blocking: set theme class + CSS vars before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: THEME_CRITICAL_CSS }} />
        {/* Prefetch both gate gradients so theme toggle is instant */}
        <link rel="preload" href="/gate-gradient.svg" as="image" />
        <link rel="preload" href="/gate-gradient-dark.svg" as="image" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers initialTheme={initialTheme} themeExplicit={themeExplicit}>
          <SkipToContent />
          {children}
          <ShaderVariantToggle />
          <ThemeSwitch />
        </Providers>
      </body>
    </html>
  );
}
