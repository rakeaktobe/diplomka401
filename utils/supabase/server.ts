import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("Supabase Error: Missing environment variables in server client.")
  }

  // ── URL Sanitization ───────────────────────────────────────────
  if (url?.endsWith('/rest/v1/')) url = url.replace('/rest/v1/', '');
  if (url?.endsWith('/rest/v1'))  url = url.replace('/rest/v1', '');

  return createServerClient<Database>(
    url || "https://missing.supabase.co",
    key || "missing-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}
