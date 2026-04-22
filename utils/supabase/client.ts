import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("Supabase Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
  }

  // ── URL Sanitization ───────────────────────────────────────────
  // Remove accidental /rest/v1/ suffix which causes "Failed to Fetch"
  if (url?.endsWith('/rest/v1/')) url = url.replace('/rest/v1/', '');
  if (url?.endsWith('/rest/v1'))  url = url.replace('/rest/v1', '');

  return createBrowserClient(
    url || "https://missing.supabase.co",
    key || "missing-key"
  )
}
