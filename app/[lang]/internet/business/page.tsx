"use client";

import { use } from "react";
import Link from "next/link";
import { Briefcase, Building2, Server, ArrowRight, Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";

import { getDictionaryClient } from "@/lib/i18n";

export default function InternetBusiness({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const locale = (lang as any) || "ru";
  const dict = getDictionaryClient(locale);
  const t = dict.internet_business;

  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 border-b border-slate-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-20 pointer-events-none">
           <div className="w-[800px] h-[800px] border-[60px] border-kt-purple rounded-full absolute -top-40 -right-40 mix-blend-screen" />
           <div className="w-[600px] h-[600px] border-[40px] border-pink-400 rounded-full absolute top-10 right-10 mix-blend-screen blur-xl" />
        </div>
        
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <p className="text-pink-400 font-bold tracking-widest text-sm uppercase mb-4">{t.hero_badge}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 max-w-3xl leading-tight">
            {t.hero_title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            {t.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/shop`} className="inline-flex items-center justify-center bg-kt-purple hover:bg-purple-600 h-14 px-8 text-base font-semibold shadow-lg shadow-kt-purple/30 text-white rounded-md transition-colors w-full sm:w-auto">
               {t.hero_cta_tariffs} <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <Link href={`/${locale}/help`} className="inline-flex items-center justify-center border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-base font-semibold rounded-md transition-colors bg-transparent w-full sm:w-auto">
               {t.hero_cta_request}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.advantages_title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">{t.advantages_subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                 <Server className="w-7 h-7 text-kt-purple" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_ip_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_ip_desc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                 <Building2 className="w-7 h-7 text-kt-blue" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_sla_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_sla_desc}</p>
             </div>
             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                 <Briefcase className="w-7 h-7 text-slate-600 dark:text-slate-400" />
               </div>
               <h3 className="text-xl font-bold mb-3 dark:text-white">{t.adv_manager_title}</h3>
               <p className="text-slate-500 dark:text-slate-400">{t.adv_manager_desc}</p>
             </div>
          </div>
        </div>
      </section>

      {/* ── B2B Lead Generation Form ───────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-screen-md mx-auto px-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <h2 className="text-3xl font-bold dark:text-white mb-4">{t.form_title}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">
              {t.form_subtitle}
            </p>
            <form className="max-w-md mx-auto space-y-4" onSubmit={(e) => { e.preventDefault(); alert(t.form_success); }}>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input required placeholder={t.form_name} className="pl-10 h-12 bg-white dark:bg-slate-900" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input required placeholder={t.form_company} className="pl-10 h-12 bg-white dark:bg-slate-900" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input required type="tel" placeholder={t.form_phone} className="pl-10 h-12 bg-white dark:bg-slate-900" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input required type="email" placeholder={t.form_email} className="pl-10 h-12 bg-white dark:bg-slate-900" />
              </div>
              <button
                type="submit"
                className="w-full mt-4 h-14 bg-kt-purple hover:bg-purple-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/30 transition-colors"
               >
                {t.form_submit}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
