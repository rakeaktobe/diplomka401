import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n-server";
import { TariffCatalog } from "@/components/TariffCatalog";
import { Wifi, ShieldCheck, Gamepad2, ArrowRight, Router } from "lucide-react";

export const metadata = {
  title: "Домашний интернет — ТЕЛЕКОМ",
};

export default async function InternetHome() {
  const locale = await getLocaleFromCookie();
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const { data: tariffs } = await supabase
    .from("tariffs")
    .select("*")
    .in("category", ["internet", "combo", "b2b"])
    .order("price", { ascending: true });
  return (
    <div className="flex flex-col w-full">
      {/* ── Corporate Hero ────────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800 text-white py-24 relative overflow-hidden">
        {/* Abstract background waves */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none">
           <div className="w-[800px] h-[800px] border-[60px] border-kt-blue rounded-full absolute -top-40 -right-40 mix-blend-screen" />
           <div className="w-[600px] h-[600px] border-[40px] border-cyan-400 rounded-full absolute top-10 right-10 mix-blend-screen blur-xl" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4">Для дома</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight">
            Оптика до квартиры: скорость, которой можно доверять
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Подключите высокоскоростной домашний интернет от ТЕЛЕКОМ. Технология GPON обеспечивает бесперебойную связь даже в часы пик.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="inline-flex items-center justify-center bg-kt-blue hover:bg-blue-600 h-14 px-8 text-base font-semibold shadow-lg shadow-kt-blue/30 text-white rounded-md transition-colors w-full sm:w-auto">
               Выбрать тариф <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link href="/help" className="inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-base font-semibold rounded-md transition-colors bg-transparent w-full sm:w-auto">
               Подробнее о GPON
            </Link>
          </div>
        </div>
      </section>

      {/* ── Advantages Grid ───────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Почему выбирают наш интернет</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">Стабильность, которую невозможно не заметить.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
               <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                 <Wifi className="w-7 h-7 text-kt-blue" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">До 1000 Мбит/с</h3>
               <p className="text-slate-500 dark:text-slate-400">Мгновенная загрузка тяжелых файлов, плавная видеотрансляция и никаких зависаний.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
               <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6">
                 <ShieldCheck className="w-7 h-7 text-green-600 dark:text-green-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Безопасность</h3>
               <p className="text-slate-500 dark:text-slate-400">Встроенная защита от DDoS атак уровня сети провайдера. Ваши данные под защитой.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
               <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                 <Gamepad2 className="w-7 h-7 text-purple-600 dark:text-purple-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Низкий Ping</h3>
               <p className="text-slate-500 dark:text-slate-400">Прямые пиринговые соединения с крупнейшими игровыми серверами. Играйте без лагов.</p>
             </div>
          </div>
        </div>
      </section>

      {/* ── Router & FTTH Highlight ───────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
         <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-kt-blue rounded-full text-sm font-semibold">
               <Router className="w-4 h-4" /> Включено в тариф
             </div>
             <h2 className="text-3xl font-bold dark:text-white">Бесплатная аренда премиум роутера</h2>
             <p className="text-lg text-slate-500 dark:text-slate-400">
               При подключении домашнего интернета мы абсолютно бесплатно предоставляем современный двухдиапазонный Wi-Fi роутер стандарта 802.11ac.
             </p>
             <ul className="space-y-3 pt-2 text-slate-600 dark:text-slate-300">
               <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-kt-blue shrink-0" /> Покрытие до 100 кв.м.</li>
               <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-kt-blue shrink-0" /> Поддержка 5GHz для минимальных задержек</li>
               <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-kt-blue shrink-0" /> Бесплатная замена при технических неполадках</li>
             </ul>
           </div>
           
           <div className="flex-1 w-full flex justify-center">
             <div className="w-full max-w-sm aspect-square bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl relative overflow-hidden shadow-xl border border-white dark:border-slate-700 p-8 flex flex-col items-center justify-center">
                 <Router className="w-32 h-32 text-slate-400 dark:text-slate-500 mb-6 drop-shadow-md" />
                 <p className="text-center font-bold text-slate-700 dark:text-slate-200">Премиальный ONT терминал</p>
                 <p className="text-center text-sm text-slate-400 mt-2">Оптический кабель подводится прямо к устройству (FTTH/GPON).</p>
             </div>
           </div>
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
