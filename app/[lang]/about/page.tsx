import Link from "next/link";
import { Wifi, TrendingUp, Users, Leaf, ArrowRight } from "lucide-react";
import { TelecomLogo } from "@/components/TelecomLogo";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: `${dict.about.title} — ${dict.metadata.siteName}`,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = dict.about;
  const brandName = dict.metadata.siteName;

  const STATS = [
    { label: t.stats.years,      value: "28+" },
    { label: t.stats.cities,     value: "180+" },
    { label: t.stats.subscribers, value: `6 ${t.stats.million}` },
    { label: t.stats.employees,   value: "18 000" },
  ];

  const VALUES = [
    {
      icon: Wifi,
      title: t.values.reliabilityTitle,
      desc: t.values.reliabilityDesc,
    },
    {
      icon: TrendingUp,
      title: t.values.futureTitle,
      desc: t.values.futureDesc,
    },
    {
      icon: Users,
      title: t.values.baseTitle,
      desc: t.values.baseDesc,
    },
    {
      icon: Leaf,
      title: t.values.ecoTitle,
      desc: t.values.ecoDesc,
    },
  ];

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-kt-dark to-slate-800 text-white py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <TelecomLogo size={52} />
              <span className="text-3xl font-black tracking-tight">{brandName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              {t.title}
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-xl">
              {t.subtitle}
            </p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <Link
                href={`/${locale}/shop`}
                className="inline-flex items-center gap-2 bg-kt-blue text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                {dict.catalog.title} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                {dict.navbar.cabinet}
              </Link>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {STATS.map(({ label, value }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-black text-white">{value}</p>
                <p className="text-sm text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="py-20 bg-kt-gray-light dark:bg-slate-900">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 text-center">
            {t.values.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-kt-blue/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-kt-blue" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-screen-xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {t.cta.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            {t.cta.desc}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 bg-kt-blue text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-kt-blue/30 text-lg"
          >
            {t.cta.selectTariff} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
