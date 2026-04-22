import Link from "next/link";
import { Layers, Zap, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Пакеты услуг (Комбо)",
  description: "Объедините интернет, ТВ и мобильную связь в один пакет.",
};

export default function ComboPackages() {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 border-b border-slate-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none">
           <div className="w-[800px] h-[800px] border-[60px] border-amber-500 rounded-full absolute -top-40 -right-40 mix-blend-screen" />
           <div className="w-[600px] h-[600px] border-[40px] border-orange-400 rounded-full absolute top-10 right-10 mix-blend-screen blur-xl" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <p className="text-amber-500 font-bold tracking-widest text-sm uppercase mb-4">Пакеты услуг</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight">
            Больше услуг — больше выгоды
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            Объедините домашний интернет, цифровое телевидение и мобильную связь в один пакет. Один счет, максимальное удобство и экономия до 40%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 h-14 px-8 text-base font-semibold shadow-lg shadow-amber-600/30 text-white rounded-md transition-colors w-full sm:w-auto">
               Выбрать Комбо <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link href="/help" className="inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-base font-semibold rounded-md transition-colors bg-transparent w-full sm:w-auto">
               Рассчитать выгоду
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
         <div className="max-w-screen-xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                 <Zap className="w-7 h-7 text-amber-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Супер экономия</h3>
               <p className="text-slate-500 dark:text-slate-400">Подключая услуги вместе, вы платите значительно меньше, чем за каждую услугу по отдельности.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                 <Layers className="w-7 h-7 text-blue-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Единый счет</h3>
               <p className="text-slate-500 dark:text-slate-400">Все услуги оплачиваются одним платежом раз в месяц. Идеальный контроль бюджета.</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                 <HeartHandshake className="w-7 h-7 text-indigo-500" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">Премиум статус</h3>
               <p className="text-slate-500 dark:text-slate-400">Абоненты Комбо получают приоритетное обслуживание в службе поддержки 24/7.</p>
             </div>
           </div>
         </div>
      </section>
    </div>
  );
}
