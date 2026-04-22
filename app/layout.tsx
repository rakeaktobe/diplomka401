import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getLocaleFromCookie, getDictionary } from "@/lib/i18n-server";

// ── Typography: Inter with full Cyrillic + Latin subsets ─────────
// `display: swap` prevents FOIT; weight range covers all weights we use.
const inter = Inter({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://telecom.kz"),
  title: {
    default: "ТЕЛЕКОМ | Надежный провайдер",
    template: "%s | ТЕЛЕКОМ",
  },
  description: "Скоростной интернет, мобильная связь и TV+ для дома и бизнеса в Казахстане.",
  openGraph: {
    title: "ТЕЛЕКОМ | Надежный провайдер",
    description: "Скоростной интернет, мобильная связь и TV+ для дома и бизнеса в Казахстане.",
    url: "https://telecom.kz",
    siteName: "ТЕЛЕКОМ",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ТЕЛЕКОМ | Надежный провайдер",
    description: "Скоростной интернет, мобильная связь и TV+ для дома и бизнеса в Казахстане.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);

  return (
    // suppressHydrationWarning prevents next-themes SSR mismatch flicker
    <html
      lang={locale}
      className={`${inter.variable} h-full scroll-smooth`}
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
          {/* Dual-level branded header — fixed, offset handled by main pt-[100px] */}
          <Header dict={dict.navbar} locale={locale} />

          <main className="flex-1 flex flex-col pt-[100px]">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
