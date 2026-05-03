"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, UserCircle, Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

interface NavbarProps {
  dict: Dictionary["navbar"];
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard") || pathname?.includes("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 gap-4">

        {/* Logo */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              KAZAKH<span className="text-blue-600">TELECOM</span>
            </span>
          </Link>

          {/* Main Nav (Desktop) */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={cn(
                  "text-sm font-semibold transition-all hover:text-blue-600 dark:hover:text-blue-400",
                  pathname === "/" ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                )}
              >
                {dict.tariffs}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                О компании
              </Link>
              <nav className="flex items-center gap-6 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <Link href={`/${locale}/shop`} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all">Магазин</Link>
                <Link href={`/${locale}/tv`} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all">TV+</Link>
              </nav>
            </nav>
          )}
        </div>

        {/* Dashboard Tools */}
        {isDashboard && (
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Поиск по кабинету..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-none text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>

          {isDashboard ? (
             <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="rounded-xl relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
               </Button>
               <Link href="/dashboard/profile">
                 <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 rounded-xl border-slate-200 dark:border-slate-800">
                   <UserCircle className="h-4 w-4" />
                   {dict.cabinet}
                 </Button>
               </Link>
             </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">
                {dict.login}
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
