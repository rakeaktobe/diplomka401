"use client";

import { useRouter } from "next/navigation";
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
 * Sets the NEXT_LOCALE cookie and refreshes Server Components with the new
 * dictionary. Uses startTransition so the UI stays responsive during refresh.
 */
export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setLocale(locale: Locale) {
    if (locale === currentLocale) return;
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    startTransition(() => {
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
