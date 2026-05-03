import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/i18n-server";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinks } from "@/components/QuickLinks";
import { AddressChecker } from "@/components/AddressChecker";
import { TariffCatalog } from "@/components/TariffCatalog";
import { TechnologyTabs } from "@/components/TechnologyTabs";
import { NewsRibbon } from "@/components/NewsRibbon";
import { NewsSection } from "@/components/NewsSection";
import { HomeSpeedTest } from "@/components/HomeSpeedTest";
import { Wifi, Tv, Smartphone, Bell } from "lucide-react";
import { type Locale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = dict;

  // ── Data ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: tariffs, error: tariffsError } = await supabase
    .from("tariffs")
    .select("*")
    .order("price", { ascending: true });

  const { data: newsData, error: newsError } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: heroSlidesData, error: heroError } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true });

  // Fallbacks if DB is not seeded yet
  const heroSlides = heroSlidesData?.length ? heroSlidesData : [
    {
      id: "fallback-1",
      image_url: "/images/baige 5g ad.png",
      badge_ru: "5G Интернет", badge_kk: "5G Интернеті", badge_en: "5G Internet",
      title_ru: "Скорость нового поколения", title_kk: "Жаңа буын жылдамдығы", title_en: "Next-gen speed",
      subtitle_ru: "Подключайте 5G от Kazakhtelecom...", subtitle_kk: "Kazakhtelecom 5G желісін қосыңыз...", subtitle_en: "Connect 5G from Kazakhtelecom...",
      cta_ru: "Подключить сейчас", cta_kk: "Қазір қосылу", cta_en: "Connect now",
      cta_href: "/internet/home",
      display_order: 1
    },
    {
      id: "fallback-2",
      image_url: "/images/kazakhtelecom prime ad.png",
      badge_ru: "Premium Подписка", badge_kk: "Premium Жазылым", badge_en: "Premium Subscription",
      title_ru: "Kazakhtelecom Prime", title_kk: "Kazakhtelecom Prime", title_en: "Kazakhtelecom Prime",
      subtitle_ru: "Единая подписка на интернет...", subtitle_kk: "Интернетке бірыңғай жазылым...", subtitle_en: "Single subscription for internet...",
      cta_ru: "Узнать больше", cta_kk: "Көбірек білу", cta_en: "Learn more",
      cta_href: "/combo",
      display_order: 2
    }
  ];

  const news = newsData?.length ? newsData : [
    {
      id: "n1", title_ru: "Запуск 5G в регионах", title_kk: "Өңірлерде 5G іске қосылды", title_en: "5G Launch in Regions",
      excerpt_ru: "Мы расширяем сеть 5G по всему Казахстану. Теперь еще больше городов...",
      date_ru: "15 мая 2026", date_kk: "15 мамыр 2026", date_en: "May 15, 2026",
      gradient: "from-blue-600 to-indigo-600", category: "news"
    },
    {
      id: "p1", title_ru: "Бонусная система", title_kk: "Бонустық жүйе", title_en: "Bonus System",
      excerpt_ru: "Участвуйте в нашей обновленной бонусной системе и экономьте на связи.",
      date_ru: "01 мая 2026", date_kk: "01 мамыр 2026", date_en: "May 1, 2026",
      image_url: "/images/bonus system ad.png", category: "promo"
    }
  ];

  return (
    <div className="flex flex-col w-full">

      {/* ── 1. Hero Carousel ─────────────────────────────────── */}
      <HeroSection slides={heroSlides as any ?? []} dict={t.hero} locale={locale} />

      {/* ── 2. Quick Links (Онлайн-каналы связи) ─────────────── */}
      <QuickLinks locale={locale} dict={t.quickLinks} />

      {/* ── 3. Address Checker ───────────────────────────────── */}
      <AddressChecker dict={t.addressChecker} locale={locale} />

      {/* ── 4. Features strip ────────────────────────────────── */}
      <section className="py-16 bg-kt-gray-light dark:bg-slate-900 transition-colors">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(
              [
                { icon: Wifi,       iconBg: "bg-blue-50   dark:bg-blue-950",   iconFg: "text-kt-blue",              key: "internet" },
                { icon: Tv,         iconBg: "bg-indigo-50 dark:bg-indigo-950", iconFg: "text-indigo-600 dark:text-indigo-400", key: "tv"       },
                { icon: Smartphone, iconBg: "bg-cyan-50   dark:bg-cyan-950",   iconFg: "text-cyan-600   dark:text-cyan-400",   key: "mobile"   },
              ] as const
            ).map(({ icon: Icon, iconBg, iconFg, key }) => (
              <div key={key} className="flex flex-col items-center text-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center ${iconFg} mb-2 shadow-sm`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {t.features[key as keyof typeof t.features].title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.features[key as keyof typeof t.features].desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Tariffs Section ───────────────────────────────── */}
      <section id="tariffs" className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {t.home.packagesTitle}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                {t.home.packagesDesc}
              </p>
            </div>

            {/* Underline tab toggle */}
            <TechnologyTabs />
          </div>

          {/* Promo Banner */}
          <div className="flex items-center gap-4 bg-kt-purple text-white rounded-2xl px-6 py-4 mb-8 shadow-lg shadow-kt-purple/20">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">
                {t.home.promoBannerTitle}
              </p>
              <p className="text-sm text-white/80 mt-0.5">
                {t.home.promoBannerDesc}
              </p>
            </div>
          </div>

          {/* Tariff catalog */}
          <TariffCatalog tariffs={tariffs as any ?? []} dict={t.catalog} />
        </div>
      </section>

      {/* ── 5.5 Speed Test Section ────────────────────────────── */}
      <HomeSpeedTest 
        dict={{
          badge: t.home.speedtestBadge || "Speed Test",
          title: t.home.speedtestTitle || "How fast is your internet?",
          desc:  t.home.speedtestDesc  || "Check your connection speed.",
          btn:   t.home.speedtestBtn   || "Start Test",
          metrics: {
            mbps:   t.dashboard?.speedtest?.mbps || "Mbps",
            ping:   t.dashboard?.speedtest?.ping || "Ping",
            upload: t.dashboard?.speedtest?.upload || "Upload"
          }
        }} 
        locale={locale} 
      />

      {/* ── 6. News & Press Center ────────────────────────────── */}
      <NewsSection news={news as any ?? []} dict={t.news} locale={locale} />

      {/* ── 7. Promotions Ribbon ──────────────────────────────── */}
      <NewsRibbon news={news as any ?? []} dict={t.news} locale={locale} />

    </div>
  );
}
