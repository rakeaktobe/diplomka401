"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin, Search, User, Menu, X,
  ChevronDown, Smartphone,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TelecomLogo } from "@/components/TelecomLogo";
import type { Locale, Dictionary } from "@/lib/i18n";

interface HeaderProps {
  dict: Dictionary["navbar"];
  locale: Locale;
  isAdmin?: boolean;
}

const TOP_LINKS = [
  { label: "Частным лицам",              href: "/" },
  { label: "Бизнесу",                    href: "/internet/business" },
  { label: "О компании",                 href: "/about" },
  { label: "Инвесторам и акционерам",    href: "/about" },
  { label: "Устойчивое развитие",        href: "/about" },
  { label: "Адреса и контакты",          href: "/about" },
];

const NAV_LINKS = [
  { label: "Магазин",       href: "/shop" },
  { 
    label: "Интернет",      
    href: "/internet/home",
    dropdown: [
      { label: "Для дома", href: "/internet/home" },
      { label: "Для бизнеса", href: "/internet/business" },
      { label: "Мобильный интернет", href: "/internet/mobile" },
    ]
  },
  { 
    label: "Телевидение",   
    href: "/tv/digital",
    dropdown: [
      { label: "Цифровое ТВ", href: "/tv/digital" },
      { label: "TV+", href: "/tv/plus" },
    ]
  },
  { 
    label: "Пакеты услуг",       
    href: "/combo",
    dropdown: [
      { label: "Комбо (Интернет + ТВ)", href: "/combo" },
    ]
  },
  { label: "Телефон",       href: "/shop" },
  { label: "Помощь",        href: "/help" },
];

export function Header({ locale, isAdmin }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Close mobile menu completely
  const closeMobile = () => {
    setMobileOpen(false);
    setOpenAccordion(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">

      {/* ── TOP BAR (dark) ─────────────────────────────────────── */}
      <div className="bg-kt-dark text-white/75 text-xs hidden lg:block">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-9">

          {/* Left: segment links */}
          <nav className="flex items-center gap-0">
            {TOP_LINKS.map(({ label, href }, i) => (
              <Link
                key={label}
                href={href}
                className={`px-3 py-2 hover:text-white transition-colors duration-300 whitespace-nowrap ${
                  i === 0 ? "text-white font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: app + city + language */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors duration-300">
              <Smartphone className="w-3.5 h-3.5" />
              Мобильное приложение
            </Link>
            <button className="flex items-center gap-1 hover:text-white transition-colors duration-300">
              <MapPin className="w-3.5 h-3.5 text-kt-blue" />
              Астана
              <ChevronDown className="w-3 h-3" />
            </button>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR (white) ────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-[72px] gap-4">

          {/* Logo with striking branding + hover effects */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
              <TelecomLogo size={44} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[22px] font-black tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-kt-blue transition-colors duration-300">
                ТЕЛЕКОМ
              </span>
              <span className="text-[9px] font-bold text-kt-blue tracking-[0.25em] leading-none mt-1.5 uppercase opacity-90">
                Национальный оператор
              </span>
            </div>
          </Link>

          {/* Center nav links — desktop Mega-Menu style (Dropdowns) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, dropdown }) => (
              <div key={label} className="relative group/nav z-50">
                <Link
                  href={href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-300 flex items-center gap-1.5 ${
                    pathname.startsWith(href) && href !== "/"
                      ? "text-kt-blue"
                      : "text-slate-700 dark:text-slate-200 hover:text-kt-blue dark:hover:text-kt-blue"
                  }`}
                >
                  {label}
                  {dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform group-hover/nav:rotate-180" />}
                </Link>
                
                {/* Desktop Dropdown popup */}
                {dropdown && (
                  <div className="absolute top-[100%] left-0 pt-2 w-56 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-2 flex flex-col relative z-50">
                      {dropdown.map(d => (
                        <Link 
                          key={d.label} 
                          href={d.href} 
                          className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-kt-blue dark:hover:text-kt-blue transition-colors"
                        >
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              aria-label="Search"
              className="p-2 text-slate-500 hover:text-kt-blue dark:text-slate-400 transition-colors duration-300 rounded-md"
            >
              <Search className="w-5 h-5" />
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-bold bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
              >
                Админ-панель
              </Link>
            )}
            <Link
              href="/dashboard/payments"
              className="px-4 py-2 text-sm font-semibold text-kt-blue border border-kt-blue/30 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-300"
            >
              Оплатить
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-kt-blue rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-sm shadow-kt-blue/20"
            >
              <User className="w-4 h-4" />
              Вход
            </Link>
            <ThemeToggle />
          </div>

          {/* Hamburger — mobile */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
             <ThemeToggle />
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown with accordions */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto max-h-[calc(100vh-72px)] px-4 pb-8 pt-3 flex flex-col gap-4 z-40">
            {/* Segment links top row */}
            <div className="flex gap-2 pb-4 overflow-x-auto border-b border-slate-100 dark:border-slate-800 scrollbar-hide">
              {TOP_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={closeMobile}
                  className="text-xs shrink-0 whitespace-nowrap text-slate-500 dark:text-slate-400 hover:text-kt-blue px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Main nav items (Accordion) */}
            <nav className="flex flex-col gap-1 pb-4">
              {NAV_LINKS.map(({ label, href, dropdown }) => (
                <div key={label} className="flex flex-col border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={href}
                      onClick={() => {
                        if (!dropdown) closeMobile();
                      }}
                      className="text-base font-semibold text-slate-800 dark:text-slate-200 py-3 flex-1"
                    >
                      {label}
                    </Link>
                    {dropdown && (
                      <button
                        onClick={() => setOpenAccordion(openAccordion === label ? null : label)}
                        className="p-3 -mr-3 text-slate-400"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openAccordion === label ? "rotate-180 text-kt-blue" : ""}`} />
                      </button>
                    )}
                  </div>
                  
                  {/* Accordion content */}
                  {dropdown && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === label ? "max-h-60 opacity-100 pb-3" : "max-h-0 opacity-0"}`}>
                      <div className="flex flex-col border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-4 space-y-3 pt-1">
                        {dropdown.map(d => (
                          <Link
                            key={d.label}
                            href={d.href}
                            onClick={closeMobile}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-kt-blue"
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full text-center py-3 text-base font-bold text-white bg-red-500 rounded-xl shadow-md"
                  onClick={closeMobile}
                >
                  Админ-панель
                </Link>
              )}
              <Link
                href="/login"
                className="w-full text-center py-3 text-base font-semibold text-white bg-kt-blue rounded-xl shadow-md"
                onClick={closeMobile}
              >
                Вход в Личный кабинет
              </Link>
              <Link
                href="/dashboard/payments"
                className="w-full text-center py-3 text-base font-semibold text-kt-blue border-2 border-kt-blue rounded-xl"
                onClick={closeMobile}
              >
                Оплатить услуги
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
