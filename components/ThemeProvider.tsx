"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Thin wrapper around next-themes ThemeProvider.
 * Must be a Client Component because it uses React context.
 * Place it inside app/layout.tsx wrapping the body content.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
