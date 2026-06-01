import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CityProvider } from "@/lib/city-context";
import { getDictionary } from "@/lib/i18n-server";
import { Chatbot } from "@/components/Chatbot";
import { createClient } from "@/utils/supabase/server";
import { type Locale } from "@/lib/i18n";
import { Database } from "@/lib/database.types";

// ── Typography: Inter loaded via CSS @import in globals.css ────────
// This avoids next/font/google's build-time network fetching.
// inter.variable just needs to be a valid CSS class name carrier.
const inter = { variable: "font-sans", className: "font-sans" } as const;

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = dict.metadata;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t.title,
      template: `%s | ${t.siteName}`,
    },
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      url: `${siteUrl}/${locale}`,
      siteName: t.siteName,
      locale: locale === 'kk' ? 'kk_KZ' : locale === 'ru' ? 'ru_RU' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t.title,
      description: t.description,
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);

  // Check if current user is admin to show admin nav button
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      // Grant admin access if role is admin OR email is admin@telecom.kz
      isAdmin = (profile as any)?.role === "admin" || user.email?.toLowerCase() === "admin@telecom.kz";
    }
  } catch {
    // Not authenticated or DB unavailable — isAdmin stays false
  }

  return (
    // suppressHydrationWarning prevents next-themes SSR mismatch flicker
    <html
      lang={locale}
      className={`${inter.variable} h-full scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`
          ${inter.className}
          antialiased
          min-h-full flex flex-col
          bg-white dark:bg-slate-950
          text-slate-900 dark:text-slate-100
          transition-colors duration-200
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CityProvider defaultCity={dict.navbar.city}>
            {/* Dual-level branded header — fixed, offset handled by main pt-[100px] */}
            <Header dict={dict.navbar} locale={locale} isAdmin={isAdmin} />

            <main className="flex-1 flex flex-col pt-[100px]">
              {children}
            </main>

            <Footer dict={dict.footer} locale={locale} />
            <Chatbot />
          </CityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
