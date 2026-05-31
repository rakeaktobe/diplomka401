import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface NewsItem {
  id: string;
  title_ru: string | null;
  title_kk: string | null;
  title_en: string | null;
  image_url: string | null;
  gradient: string | null;
  category: string;
}

interface NewsRibbonProps {
  news: NewsItem[];
  dict: Dictionary["news"];
  locale: string;
}

export function NewsRibbon({ news, dict, locale }: NewsRibbonProps) {
  const promos = news.filter(item => item.category === "promo");

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-3">
              <Tag className="w-3.5 h-3.5" />
              Special Offers
            </span>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {dict.promosTitle}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed">
              {dict.promosSubtitle}
            </p>
          </div>

          <Link
            href={`/${locale}/news`}
            className="hidden sm:inline-flex items-center gap-2 self-end px-5 py-2.5 rounded-full border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200 group shrink-0"
          >
            {dict.allPromos}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Horizontal scroll ──────────────────────────────── */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {promos.map((promo) => {
            const title  = (promo as any)[`title_${locale}`] || promo.title_ru;
            const image  = promo.image_url || "/favicon.svg";
            const gradient = promo.gradient || "from-indigo-600 to-purple-600";

            return (
              <Link
                key={promo.id}
                href={`/promo/${promo.id}`}
                className="group flex-shrink-0 snap-start w-[280px] sm:w-[340px] md:w-[420px] block"
              >
                <article className="flex flex-col h-full rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out bg-white dark:bg-slate-800/60">

                  {/* ── Image ── */}
                  <div className={`relative w-full aspect-[16/10] overflow-hidden ${!promo.image_url ? `bg-gradient-to-br ${gradient}` : ""}`}>
                    {promo.image_url ? (
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 280px, (max-width: 1200px) 340px, 420px"
                        quality={100}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <>
                        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-black/10 group-hover:scale-110 transition-transform duration-500" />
                      </>
                    )}
                    {/* Bottom scrim */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-300" />
                    {/* Promo badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest">
                        <Tag className="w-3 h-3" />
                        {dict.allPromos.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  {/* ── Title + CTA ── */}
                  <div className="p-5 flex items-end justify-between gap-3">
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2 flex-1">
                      {title}
                    </h3>
                    <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white transition-all duration-200">
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* ── Mobile CTA ─────────────────────────────────────── */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200 group"
          >
            {dict.allPromos}
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
