/**
 * Server-only i18n utilities.
 *
 * Must ONLY be imported from Server Components, Server Actions, or
 * API route handlers. Never import this file from a Client Component.
 */
import { cookies } from "next/headers";
import type { Locale, Dictionary } from "@/lib/i18n";
import { locales, defaultLocale } from "@/lib/i18n";

// ── Dictionary loader ─────────────────────────────────────────

/**
 * Load the JSON dictionary for a given locale.
 * Uses dynamic import so only the requested locale is bundled.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "kk":
      return (await import("@/dictionaries/kk.json")).default as unknown as Dictionary;
    case "en":
      return (await import("@/dictionaries/en.json")).default as unknown as Dictionary;
    case "ru":
    default:
      return (await import("@/dictionaries/ru.json")).default;
  }
}

// ── Cookie-based locale resolver ──────────────────────────────

/**
 * Read the NEXT_LOCALE cookie from the current request.
 * Must only be called in Server Components / Server Actions.
 */
export async function getLocaleFromCookie(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get("NEXT_LOCALE")?.value;
    if (raw && locales.includes(raw as Locale)) {
      return raw as Locale;
    }
  } catch {
    // cookies() throws outside the request scope; safe to default.
  }
  return defaultLocale;
}
