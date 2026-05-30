import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/i18n-server";
import { TariffCatalog } from "@/components/TariffCatalog";
import { MonitorPlay, Sparkles, Layers, ArrowRight } from "lucide-react";
import { type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.tv_digital.meta_title,
    description: (dict.tv_digital as any).meta_desc || dict.tv_digital.hero_subtitle || dict.metadata.description,
  };
}

export default async function TVDigital({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = (dict as any).tv_digital;
  const supabase = await createClient();

  const { data: tariffs } = await supabase
    .from("tariffs")
    .select("*")
    .eq("category", "tv")
    .order("price", { ascending: true });

  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 border-b border-slate-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none">
           <div className="w-[800px] h-[800px] border-[60px] border-emerald-500 rounded-full absolute -top-40 -right-40 mix-blend-screen" />
           <div className="w-[600px] h-[600px] border-[40px] border-green-400 rounded-full absolute top-10 right-10 mix-blend-screen blur-xl" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-4">{t.hero_badge}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight">
            {t.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            {t.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/shop`} className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-base font-semibold shadow-lg shadow-emerald-600/30 text-white rounded-md transition-colors w-full sm:w-auto">
               {t.hero_cta_tariffs} <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link href={`/${locale}/help`} className="inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-base font-semibold rounded-md transition-colors bg-transparent w-full sm:w-auto">
               {t.hero_cta_channels}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
         <div className="max-w-screen-xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                 <MonitorPlay className="w-7 h-7 text-emerald-600" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_content_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_content_desc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                 <Sparkles className="w-7 h-7 text-amber-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_archive_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_archive_desc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                 <Layers className="w-7 h-7 text-rose-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_multi_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_multi_desc}</p>
             </div>
           </div>
         </div>
      </section>

      {/* ── Popular Channels ───────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold dark:text-white mb-2">{t.popular_title}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">{t.popular_subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             {["Qazaqstan", "Khabar", "Eurasia", "Discovery Channel", "National Geographic", "Eurosport 1", "Nickelodeon"].map((channel) => (
                <div key={channel} className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 w-40 flex items-center justify-center text-center">
                   {channel}
                </div>
             ))}
          </div>
          <p className="mt-8 text-sm text-slate-400">{t.more_channels}</p>
        </div>
      </section>

      {/* ── Real Tariffs Rendering ───────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
         <div className="max-w-screen-xl mx-auto px-4 md:px-6">
           <TariffCatalog tariffs={tariffs ?? []} dict={dict.catalog} />
         </div>
      </section>
    </div>
  );
}
