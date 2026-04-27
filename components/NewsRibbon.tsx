import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROMO_DATA = [
  {
    id: 1,
    image: '/images/baige 5g ad.png',
    title: "Скоростной интернет 5G: Участвуй в Байге"
  },
  {
    id: 2,
    image: '/images/bonus system ad.png',
    title: "Программа лояльности: Получайте бонусы"
  },
  {
    id: 3,
    image: '/images/kazakhtelecom prime ad.png',
    title: "Премиальные услуги с Kazakhtelecom Prime"
  },
  {
    id: 4,
    image: '/images/phone app ad.png',
    title: "Управляйте услугами через мобильное приложение"
  },
  {
    id: 5,
    image: '/images/sportline tv+ ad.png',
    title: "Спортивные каналы в лучшем качестве на TV+"
  },
  {
    id: 6,
    image: '/images/static ip-adress ad.png',
    title: "Статический IP-адрес для вашего бизнеса"
  }
];

export function NewsRibbon() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Акции и предложения
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
              Узнайте больше о наших продуктах и специальных предложениях.
            </p>
          </div>
          <Link href="/news" className="hidden md:flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Все акции <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 no-scrollbar">
          {PROMO_DATA.map((promo) => (
            <Link 
              key={promo.id} 
              href={`/promo/${promo.id}`} 
              className="group flex-shrink-0 snap-start w-[280px] sm:w-[320px] md:w-[400px] block"
            >
              <article className="flex flex-col h-full cursor-pointer transform transition-all duration-300 group-hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                {/* Title directly below image */}
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {promo.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center md:hidden">
          <Link href="/news" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Все акции <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
