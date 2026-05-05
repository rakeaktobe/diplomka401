import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import SpeedTest from "@/components/dashboard/SpeedTest";
import { Zap } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.dashboard.speedtest.title,
  };
}

export default async function SpeedTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const t = dict.dashboard.speedtest_info;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Zap className="w-10 h-10 text-amber-500" />
          {dict.dashboard.speedtest.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {dict.home.speedtestDesc}
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <SpeedTest dict={dict.dashboard.speedtest} locale={locale} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
          <h3 className="font-bold text-lg mb-2 dark:text-white">{t.howItWorks}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {t.howItWorksDesc}
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50">
          <h3 className="font-bold text-lg mb-2 dark:text-white">{t.whatItMeans}</h3>
          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
            <p><strong>{dict.dashboard.speedtest.ping}:</strong> {t.ping.split(': ')[1]}</p>
            <p><strong>{dict.dashboard.speedtest.download}:</strong> {t.download.split(': ')[1]}</p>
            <p><strong>{dict.dashboard.speedtest.upload}:</strong> {t.upload.split(': ')[1]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

