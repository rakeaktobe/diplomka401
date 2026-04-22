"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Button that toggles between light and dark themes.
 * Renders null on server to avoid hydration mismatch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after hydration to prevent SSR mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
