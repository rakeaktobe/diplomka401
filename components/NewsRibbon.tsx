import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  const promos = news.filter(item => item.category === 'promo');
  
  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dict.promosTitle}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
              {dict.promosSubtitle}
            </p>
          </div>
          <Link href="/news" className="hidden md:flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            {dict.allPromos} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 no-scrollbar">
          {promos.map((promo) => {
            const title = (promo as any)[`title_${locale}`] || promo.title_ru;
            const image = promo.image_url || '/favicon.svg'; // Fallback

            return (
              <Link 
                key={promo.id} 
                href={`/promo/${promo.id}`} 
                className="group flex-shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[400px] block"
              >
                <article className="flex flex-col h-full cursor-pointer transform transition-all duration-300 group-hover:-translate-y-1">
                  {/* Image Container */}
                  <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-300 ${!promo.image_url ? `bg-gradient-to-br ${promo.gradient || 'from-blue-600 to-cyan-500'}` : ''}`}>
                    {promo.image_url ? (
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={100}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    )}
                  </div>
                  
                  {/* Title directly below image */}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {title}
                  </h3>
                </article>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-4 text-center md:hidden">
          <Link href="/news" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            {dict.allPromos} <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
