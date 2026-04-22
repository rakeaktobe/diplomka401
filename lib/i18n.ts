/**
 * Shared i18n types and constants.
 *
 * ⚠️  This file must NOT import from "next/headers" or any other
 *     server-only module. It is imported by both Server and Client
 *     Components (e.g. LanguageSwitcher, Navbar).
 */

// ── Types & constants ─────────────────────────────────────────
export type Locale = "ru" | "kk" | "en";
export const defaultLocale: Locale = "ru";
export const locales: Locale[] = ["ru", "kk", "en"];

// Infer the full dictionary shape from the Russian source of truth.
import type ruDict from "@/dictionaries/ru.json";
export type Dictionary = typeof ruDict;
