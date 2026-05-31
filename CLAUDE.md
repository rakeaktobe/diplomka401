# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (TypeScript errors are ignored — see next.config.ts)
npm run lint     # ESLint
npm run start    # Start production server after build
```

**Setup:** Copy `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`. The Supabase URL must NOT end with `/rest/v1/` — the client trims it automatically but the raw value should be clean.

---

## Architecture

This is a **Next.js 16 App Router** project for a Kazakhtelecom ISP customer portal. All routes live under `app/[lang]/` where `lang` is one of `ru` (default) | `kk` | `en`.

### Routing

Every page is at `app/[lang]/<section>/page.tsx`. Public pages: `/`, `/about`, `/news`, `/shop`, `/internet/*`, `/tv/*`, `/combo`, `/help`. Auth pages: `/login`, `/register`. Authenticated: `/dashboard/*`. Admin-only: `/admin/*`.

### i18n

- Locale types and helpers: `lib/i18n.ts` (safe to import in both Server and Client Components)
- Server-side dictionary loader: `lib/i18n-server.ts`
- Translation files: `dictionaries/ru.json` (canonical), `dictionaries/kk.json`, `dictionaries/en.json`
- The `Dictionary` type is derived from `ru.json` — always add new keys to all three files.
- AI prompts are also stored in the dictionaries under `ai_prompt` and `ai_recommendation` keys.

### Supabase / Auth

Two separate client factories — always use the right one:
- **Server Components / Route Handlers / Server Actions:** `utils/supabase/server.ts` → `createClient()` (uses `next/headers` cookies)
- **Client Components:** `utils/supabase/client.ts` → `createClient()` (browser client)
- Legacy `lib/supabase.ts` exports a module-level `supabase` instance — avoid for new code.

Admin access is granted when `profiles.role === 'admin'` OR `user.email === 'admin@telecom.kz'`. This check happens in `app/[lang]/layout.tsx`.

### Database schema (`lib/database.types.ts`)

Key tables: `profiles` (id, full_name, phone, address, balance, role), `tariffs` (localized name/description columns: `name_ru`, `name_kk`, `name_en`, etc.), `subscriptions`, `payments`, `tickets`.

### Mock data (`lib/api.ts`)

Contains in-memory mock implementations of all data-fetching functions (profile, tariffs, subscriptions, payments, tickets, network status). Used for UI development without a live DB. Not used in production pages — those call Supabase directly.

### AI Features

- **Chatbot** (`app/api/chat/route.ts`): Edge runtime, streams via Gemini (`gemini-3-flash-preview`) using `@ai-sdk/google`. Fetches live tariffs from DB to inject into system prompt. UI in `components/Chatbot.tsx`.
- **Speed test recommendation** (`app/api/recommendation/route.ts`): Edge runtime, non-streaming, same Gemini model. Called after a speed test in `components/dashboard/SpeedTest.tsx`.

### Providers (in `app/[lang]/layout.tsx`)

`ThemeProvider` (next-themes, class-based dark mode) wraps `CityProvider` which exposes the currently selected city. City persists in `localStorage`; hydration mismatch is avoided by syncing in `useEffect`.
