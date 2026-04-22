"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

interface NavbarProps {
  dict: Dictionary["navbar"];
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Activity className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">ТЕЛЕКОМ</span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-5">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
              pathname === "/" ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"
            )}
          >
            {dict.tariffs}
          </Link>

          {!isDashboard ? (
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <UserCircle className="h-5 w-5" />
              {dict.login}
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              <UserCircle className="h-5 w-5" />
              {dict.cabinet}
            </Link>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
