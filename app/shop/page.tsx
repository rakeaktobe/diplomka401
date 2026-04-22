import { createClient } from "@/utils/supabase/server";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n-server";
import { TariffCatalog } from "@/components/TariffCatalog";
import { AddressChecker } from "@/components/AddressChecker";
import { TechnologyTabs } from "@/components/TechnologyTabs";
import { Bell, Filter } from "lucide-react";

export const metadata = {
  title: "Магазин тарифов",
  description: "Выберите лучший пакет интернета, ТВ или мобильной связи.",
};

export default async function ShopPage() {
  const locale = await getLocaleFromCookie();
  const dict   = await getDictionary(locale);

  const supabase = await createClient();
  const { data: tariffs } = await supabase
    .from("tariffs")
    .select("*")
    .order("price", { ascending: true });

  return (
    <div className="flex flex-col w-full">

      {/* ── Page Header ─────────────────────────────────────── */}
      <section className="bg-kt-gray-light dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-sm text-kt-blue font-semibold uppercase tracking-wide mb-1">
                Все тарифы и пакеты
              </p>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                Магазин услуг
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
                Технология FTTH (оптика до квартиры) — стабильная скорость без
                падений в пиковые часы. Выберите подходящий пакет для дома или бизнеса.
              </p>
            </div>

            {/* Underline tabs */}
            <TechnologyTabs />
          </div>
        </div>
      </section>

      {/* ── Promo Banner ────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 mt-8">
        <div className="flex items-center gap-4 bg-kt-purple text-white rounded-2xl px-6 py-4 shadow-lg shadow-kt-purple/20">
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
      </div>

      {/* ── Catalog ─────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 w-full">
        <TariffCatalog tariffs={tariffs ?? []} dict={dict.catalog} />
      </div>

      {/* ── Address Checker ─────────────────────────────────── */}
      <div className="bg-kt-gray-light dark:bg-slate-900 pb-16">
        <AddressChecker />
      </div>

    </div>
  );
}
