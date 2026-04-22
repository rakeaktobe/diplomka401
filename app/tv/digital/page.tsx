import Link from "next/link";
import { MonitorPlay, Sparkles, Layers, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Цифровое ТВ — ТЕЛЕКОМ",
};

export default function TVDigital() {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 border-b border-slate-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none">
           <div className="w-[800px] h-[800px] border-[60px] border-emerald-500 rounded-full absolute -top-40 -right-40 mix-blend-screen" />
           <div className="w-[600px] h-[600px] border-[40px] border-green-400 rounded-full absolute top-10 right-10 mix-blend-screen blur-xl" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-4">Телевидение</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight">
            Мир развлечений в качестве 4K
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Более 170 каналов, функция паузы и архива эфира. Наслаждайтесь безупречным качеством изображения вместе с Цифровым ТВ от ТЕЛЕКОМ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-base font-semibold shadow-lg shadow-emerald-600/30 text-white rounded-md transition-colors w-full sm:w-auto">
               Тарифы ТВ <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link href="/help" className="inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-base font-semibold rounded-md transition-colors bg-transparent w-full sm:w-auto">
               Список каналов
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
               <h3 className="text-xl font-bold mb-3 dark:text-white">HD и 4K Контент</h3>
               <p className="text-slate-500 dark:text-slate-400">Лучшие фильмы, спорт и познавательные программы в невероятной четкости.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                 <Sparkles className="w-7 h-7 text-amber-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Пауза и архив</h3>
               <p className="text-slate-500 dark:text-slate-400">Пропустили любимую передачу? Смотрите ее в записи в любое удобное время до 7 дней.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                 <Layers className="w-7 h-7 text-rose-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Мультискрин</h3>
               <p className="text-slate-500 dark:text-slate-400">Смотрите ТВ на телевизоре, смартфоне или планшете одновременно с одного аккаунта.</p>
             </div>
           </div>
         </div>
      </section>

      {/* ── Popular Channels ───────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold dark:text-white mb-2">Популярные телеканалы в HD</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">В базовый ТВ-пакет включены главные национальные и мировые информационно-развлекательные каналы.</p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
             {/* Stubbing out channel logos as text blocks since image assets are unknown */}
             {["Qazaqstan", "Khabar", "Eurasia", "Discovery Channel", "National Geographic", "Eurosport 1", "Nickelodeon"].map((channel) => (
                <div key={channel} className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 w-40 flex items-center justify-center text-center">
                   {channel}
                </div>
             ))}
          </div>
          <p className="mt-8 text-sm text-slate-400">И еще более 150 телеканалов на любой вкус...</p>
        </div>
      </section>
    </div>
  );
}
