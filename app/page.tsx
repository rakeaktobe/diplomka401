import { createClient } from "@/utils/supabase/server";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n-server";
import { HeroSection } from "@/components/HeroSection";
import { QuickLinks } from "@/components/QuickLinks";
import { AddressChecker } from "@/components/AddressChecker";
import { TariffCatalog } from "@/components/TariffCatalog";
import { TechnologyTabs } from "@/components/TechnologyTabs";
import { NewsRibbon } from "@/components/NewsRibbon";
import { Wifi, Tv, Smartphone, Bell } from "lucide-react";

export default async function Home() {
  // ── i18n ──────────────────────────────────────────────────────
  const locale = await getLocaleFromCookie();
  const dict   = await getDictionary(locale);
  const t      = dict;

  // ── Data ──────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: tariffs } = await supabase
    .from("tariffs")
    .select("*")
    .order("price", { ascending: true });

  return (
    <div className="flex flex-col w-full">

      {/* ── 1. Hero Carousel ─────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. Quick Links (Онлайн-каналы связи) ─────────────── */}
      <QuickLinks />

      {/* ── 3. Address Checker ───────────────────────────────── */}
      <AddressChecker />

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
                  {t.features[key].title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.features[key].desc}
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
                Пакеты услуг
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                Технология FTTH (оптика до квартиры) гарантирует стабильную скорость без
                падений в часы пик. Выберите подходящий пакет ниже.
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
                Для новых абонентов — 50% скидка на первый месяц
              </p>
              <p className="text-sm text-white/80 mt-0.5">
                Акция действует при подключении любого тарифа FTTH до конца месяца
              </p>
            </div>
          </div>

          {/* Tariff catalog */}
          <TariffCatalog tariffs={tariffs ?? []} dict={t.catalog} />
        </div>
      </section>

      {/* ── 6. Corporate News Section ──────────────────────────── */}
      <NewsRibbon />

    </div>
  );
}
