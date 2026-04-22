import Link from "next/link";
import { Globe, ArrowLeft, TriangleAlert } from "lucide-react";

export const metadata = {
  title: "Страница не найдена — ТЕЛЕКОМ",
  description: "Запрошенная страница не найдена на сервере ТЕЛЕКОМ.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 bg-slate-50 dark:bg-slate-950 text-center py-20 transition-colors">
      <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-500 mb-8 border border-red-100 dark:border-red-900 shadow-sm">
        <TriangleAlert className="w-8 h-8" />
      </div>
      
      <h1 className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 blur-[0.3px]">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Упс! Страница не найдена
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-10 text-lg leading-relaxed">
        Возможно, ссылка устарела, либо вы опечатались в адресе.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/"
          className="flex items-center justify-center bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-md shadow-lg shadow-blue-500/10 hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Вернуться на главную
        </Link>
        <Link 
          href="/dashboard/support"
          className="flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          Служба поддержки
        </Link>
      </div>

      {/* Watermark Logo */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none select-none flex items-center justify-center blur-sm">
        <Globe className="w-[400px] h-[400px] text-slate-900 dark:text-white" />
      </div>
    </div>
  );
}
