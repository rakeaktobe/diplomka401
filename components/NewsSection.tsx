import Link from "next/link";
import { ArrowRight } from "lucide-react";

const NEWS_DATA = [
  {
    id: 1,
    date: "15 Апреля 2026",
    title: "ТЕЛЕКОМ расширяет покрытие 5G",
    excerpt: "Мы успешно завершили установку новых базовых станций, обеспечив высокоскоростным мобильным интернетом еще 5 городов.",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: 2,
    date: "10 Апреля 2026",
    title: "Новые каналы в пакетах TV+",
    excerpt: "В сетку вещания добавлены 10 новых познавательных и фильмовых каналов в HD-качестве без изменения абонентской платы.",
    gradient: "from-indigo-600 to-purple-500"
  },
  {
    id: 3,
    date: "05 Апреля 2026",
    title: "График плановых работ на магистралях",
    excerpt: "Уважаемые абоненты! В ночь с 12 на 13 апреля возможны кратковременные перебои со связью в связи с модернизацией оборудования.",
    gradient: "from-slate-700 to-slate-500"
  }
];

export function NewsSection() {
  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Новости и пресс-центр
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg">
              Самые свежие события, акции и важные уведомления от компании ТЕЛЕКОМ.
            </p>
          </div>
          <Link href="/news" className="hidden md:flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Все новости <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_DATA.map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} className="group block">
              <article className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Abstract image placeholder */}
                <div className={`w-full h-48 bg-gradient-to-br ${news.gradient} opacity-90 group-hover:opacity-100 transition-opacity relative`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    {news.date}
                  </span>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {news.excerpt}
                  </p>
                  
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-auto">
                    Читать далее <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/news" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            Все новости <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
