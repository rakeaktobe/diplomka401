import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
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

const CARD_DELAYS = ["0ms", "80ms", "160ms"];

export function NewsSection({ news, dict, locale }: NewsSectionProps) {
  const newsItems = news.filter(item => item.category === "news");

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
              <Newspaper className="w-3.5 h-3.5" />
              Press Center
            </span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {dict.title}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed">
              {dict.subtitle}
            </p>
          </div>

          <Link
            href={`/${locale}/news`}
            className="hidden sm:inline-flex items-center gap-2 self-end px-5 py-2.5 rounded-full border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200 group shrink-0"
          >
            {dict.allNews}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Cards grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => {
            const title   = (item as any)[`title_${locale}`]   || item.title_ru;
            const excerpt = (item as any)[`excerpt_${locale}`] || item.excerpt_ru;
            const date    = (item as any)[`date_${locale}`]    || item.date_ru;
            const gradient = item.gradient || "from-blue-600 to-indigo-600";

            return (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.id}`}
                className="group block"
                style={{ animationDelay: CARD_DELAYS[index] ?? "0ms" }}
              >
                <article className="h-full flex flex-col bg-white dark:bg-slate-800/70 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">

                  {/* ── Gradient image area ── */}
                  <div className={`relative w-full h-52 bg-gradient-to-br ${gradient} overflow-hidden`}>
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-black/10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5" />

                    {/* Category chip */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest">
                        <Newspaper className="w-3 h-3" />
                        {dict.title.split(" ")[0]}
                      </span>
                    </div>

                    {/* Bottom scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/50 transition-all duration-300" />
                  </div>

                  {/* ── Content ── */}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {date}
                    </div>

                    <h3 className="font-black text-[17px] leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">
                      {excerpt}
                    </p>

                    {/* ── CTA pill button ── */}
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                        {dict.readMore}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* ── Mobile CTA ─────────────────────────────────────── */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-200 group"
          >
            {dict.allNews}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
