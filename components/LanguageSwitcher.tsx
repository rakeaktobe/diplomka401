"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { type Locale, locales } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  ru: "RU",
  kk: "KK",
  en: "EN",
};

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

/**
 * Language switcher component.
 * Updates the URL segment (e.g., /ru -> /kk) and sets the NEXT_LOCALE cookie.
 * Uses usePathname and router.push() for a smooth transition.
 */
export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function setLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return;

    // 1. Update cookie for middleware and server-side consistency
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // 2. Calculate the new path by replacing the locale segment
    const segments = pathname.split("/");
    
    // Check if the first segment is a known locale
    const currentLocaleInPath = segments[1] as Locale;
    if (locales.includes(currentLocaleInPath)) {
      segments[1] = newLocale;
    } else {
      // If no locale in path, prepend it
      segments.splice(1, 0, newLocale);
    }
    
    const newPathname = segments.join("/") || "/";

    startTransition(() => {
      router.push(newPathname);
      // Force a refresh to update server components with new dictionary
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center rounded-md overflow-hidden border border-white/20"
      aria-label="Выбор языка"
    >
      {locales.map((locale, idx) => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          disabled={isPending}
          aria-pressed={locale === currentLocale}
          className={[
            "px-2.5 py-1 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kt-blue disabled:opacity-60",
            idx !== 0 ? "border-l border-white/20" : "",
            locale === currentLocale
              ? "bg-kt-blue text-white"
              : "text-white/70 hover:text-white hover:bg-white/10",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}
