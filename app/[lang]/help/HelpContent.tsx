"use client";

import { useState } from "react";
import Link from "next/link";
import { LifeBuoy, FileText, Wrench, PhoneCall, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HelpContent({ t, locale }: { t: any; locale: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Short Top Hero for Help Center */}
      <section className="bg-kt-blue text-white py-20">
        <div className="max-w-screen-md mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-6">{t.title}</h1>
          <div className="flex gap-2 p-2 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <Input 
              placeholder={t.search} 
              className="bg-white text-slate-900 h-12 text-base border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
            <Button size="lg" className="h-12 shrink-0 bg-slate-800 text-white hover:bg-slate-700">{t.searchBtn}</Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
         <div className="max-w-screen-xl mx-auto px-4">
           {/* Direct Help Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
             <Link href={`/${locale}/dashboard/support`} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-kt-blue dark:hover:border-kt-blue transition group">
                <LifeBuoy className="w-8 h-8 text-kt-blue mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 dark:text-white">{t.writeSupport}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.writeSupportDesc}</p>
             </Link>
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-green-500 transition group cursor-pointer">
                <PhoneCall className="w-8 h-8 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 dark:text-white">{t.callCenter}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.callCenterDesc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition group cursor-pointer">
                <Wrench className="w-8 h-8 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 dark:text-white">{t.callMaster}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.callMasterDesc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition group cursor-pointer">
                <FileText className="w-8 h-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 dark:text-white">{t.knowledgeBase}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.knowledgeBaseDesc}</p>
             </div>
           </div>

           {/* FAQ Accordion */}
           <div className="max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center border-t border-slate-200 dark:border-slate-800 pt-16">{t.faqTitle}</h2>
             <div className="space-y-4">
               {t.faqs.map((faq: any, i: number) => (
                 <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                   <button 
                     onClick={() => toggleFAQ(i)}
                     className="w-full flex items-center justify-between p-6 text-left"
                   >
                     <span className="font-bold text-lg text-slate-800 dark:text-slate-200">{faq.q}</span>
                     <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openIndex === i ? "rotate-180 text-kt-blue" : ""}`} />
                   </button>
                   <div 
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                   >
                     <p className="px-6 pb-6 text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                       {faq.a}
                     </p>
                   </div>
                 </div>
               ))}
             </div>
             
             {/* Not found block */}
             <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/50 text-center flex flex-col items-center">
                <LifeBuoy className="w-12 h-12 text-kt-blue mb-4 opacity-80" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.notFound}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">{t.notFoundDesc}</p>
                <Link href={`/${locale}/dashboard/support`} className="bg-kt-blue hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors">
                  {t.contactSupport}
                </Link>
             </div>
           </div>
         </div>
      </section>
    </div>
  );
}