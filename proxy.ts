/**
 * proxy.ts — Next.js 16 Proxy (replaces middleware.ts)
 *
 * Responsibilities:
 *  1. Refresh the Supabase session on every request (keeps JWT alive).
 *  2. Redirect unauthenticated users away from /dashboard/* → /login.
 *  3. Redirect authenticated users away from /login|/register → /dashboard.
 *
 * Key rules (@supabase/ssr):
 *  - Create ONE supabaseResponse, mutate it in setAll — never create a
 *    second NextResponse.next() inside setAll or session cookies are dropped.
 *  - Always use supabase.auth.getUser() — never getSession() — in proxy/middleware.
 *  - Copy session cookies onto any redirect response you create.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  // ── 1. Bootstrap a single mutable response ───────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://mock-xyz.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "mock-anon-key";

  // ── 2. Build Supabase client, closing over supabaseResponse ──
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        // Write into the request object (visible to remaining pipeline steps)
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // Recreate the response so it carries the mutated request headers,
        // then write the same cookies into the response for the browser.
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // ── 3. Skip DB round-trip for the mock/dev fallback URL ──────
  if (supabaseUrl === "https://mock-xyz.supabase.co") {
    return supabaseResponse;
  }

  // ── 4. Refresh the session — MUST come before any redirect ───
  // Never put logic between createServerClient() and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthPage  = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");

  // Helper: copy refreshed session cookies onto a redirect response
  function withSessionCookies(redirect: NextResponse) {
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirect.cookies.set(c.name, c.value, c);
    });
    return redirect;
  }

  // ── 5. Guard /dashboard/* — unauthenticated users → /login ───
  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return withSessionCookies(NextResponse.redirect(url));
  }

  // ── 6. Authenticated users on /login|/register → /dashboard ─
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return withSessionCookies(NextResponse.redirect(url));
  }

  // ── 7. Return the mutated supabaseResponse ───────────────────
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation files)
     * - favicon.ico
     * - any file with an image/font extension
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
