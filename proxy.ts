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
import { locales, defaultLocale } from './lib/i18n';

export default async function proxy(request: NextRequest) {
  // ── 1. Bootstrap a single mutable response ───────────────────
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // ── 2. Build Supabase client, closing over supabaseResponse ──
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: any) {
        cookiesToSet.forEach(({ name, value }: any) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }: any) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // ── 3. Refresh the session ───────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── 4. Locale Handling ───────────────────────────────────────
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in URL, redirect to default or cookie locale
  // Ignore API routes so they don't get redirected
  if (!pathnameHasLocale && !pathname.startsWith('/api')) {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = (localeCookie && locales.includes(localeCookie as any)) 
      ? localeCookie 
      : defaultLocale;

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    const redirectResponse = NextResponse.redirect(url);
    
    // Copy session cookies to redirect
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value, c);
    });
    
    redirectResponse.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return redirectResponse;
  }

  // Helper: copy refreshed session cookies onto a redirect response
  function withSessionCookies(redirect: NextResponse) {
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirect.cookies.set(c.name, c.value, c);
    });
    return redirect;
  }

  // ── 5. Auth & Admin Guards ──────────────────────────────────
  // Check if it's an auth page or dashboard/admin (considering locale prefix)
  const segments = pathname.split('/');
  const isAuthPage = segments.includes('login') || segments.includes('register');
  const isDashboard = segments.includes('dashboard');
  const isAdmin = segments.includes('admin');

  // Guard /dashboard
  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    // Keep locale
    const locale = segments[1];
    url.pathname = `/${locale}/login`;
    return withSessionCookies(NextResponse.redirect(url));
  }

  // Authenticated users on /login|/register
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    const locale = segments[1];
    url.pathname = `/${locale}/dashboard`;
    return withSessionCookies(NextResponse.redirect(url));
  }

  // Guard /admin
  if (isAdmin) {
    if (!user) {
      const url = request.nextUrl.clone();
      const locale = segments[1];
      url.pathname = `/${locale}/login`;
      return withSessionCookies(NextResponse.redirect(url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && user.email?.toLowerCase().trim() !== 'admin@telecom.kz') {
      const url = request.nextUrl.clone();
      const locale = segments[1];
      url.pathname = `/${locale}/dashboard`;
      return withSessionCookies(NextResponse.redirect(url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
