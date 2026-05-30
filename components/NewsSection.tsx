import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface NewsItem {
  id: string;
  title_ru: string | null;
  title_kk: string | null;
  title_en: string | null;
  excerpt_ru: string | null;
  excerpt_kk: string | null;
  excerpt_en: string | null;
  date_ru: string | null;
  date_kk: string | null;
  date_en: string | null;
  gradient: string | null;
  category: string;
}

interface NewsSectionProps {
  news: NewsItem[];
  dict: Dictionary["news"];
  locale: string;
}

export function NewsSection({ news, dict, locale }: NewsSectionProps) {
  const newsItems = news.filter(item => item.category === 'news');

  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dict.title}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
              {dict.subtitle}
            </p>
          </div>
          <Link href={`/${locale}/news`} className="hidden md:flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            {dict.allNews} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item) => {
            const title = (item as any)[`title_${locale}`] || item.title_ru;
            const excerpt = (item as any)[`excerpt_${locale}`] || item.excerpt_ru;
            const date = (item as any)[`date_${locale}`] || item.date_ru;

            return (
              <Link key={item.id} href={`/${locale}/news/${item.id}`} className="group block">
                <article className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Abstract image placeholder */}
                  <div className={`w-full h-48 bg-gradient-to-br ${item.gradient || 'from-blue-600 to-cyan-500'} opacity-90 group-hover:opacity-100 transition-opacity relative`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      {date}
                    </span>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {excerpt}
                    </p>
                    
                    <span className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-auto">
                      {dict.readMore} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href={`/${locale}/news`} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            {dict.allNews} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
