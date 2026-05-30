import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.news.title,
    description: dict.news.subtitle,
  };
}

// Hardcoded Technology News as requested to populate the empty page
const TECH_NEWS = [
  {
    id: "tech-1",
    title_ru: "ТЕЛЕКОМ запускает сеть 10 Гбит/с",
    title_kk: "ТЕЛЕКОМ 10 Гбит/с желісін іске қосуда",
    title_en: "TELECOM Launches 10Gbps Network",
    excerpt_ru: "Наша компания успешно протестировала технологию XGS-PON, обеспечивающую беспрецедентную скорость интернета в мегаполисах.",
    excerpt_kk: "Біздің компания қалалық аймақтарда бұрын-соңды болмаған интернет жылдамдығын қамтамасыз ететін XGS-PON технологиясын сәтті сынақтан өткізді.",
    excerpt_en: "Our company successfully tested XGS-PON technology, providing unprecedented internet speeds in metropolitan areas.",
    date_ru: "25 мая 2026",
    date_kk: "25 мамыр 2026",
    date_en: "May 25, 2026",
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    id: "tech-2",
    title_ru: "Национальный ИИ-ассистент снизил ожидание на 90%",
    title_kk: "Ұлттық ЖИ-көмекшісі күту уақытын 90%-ға қысқартты",
    title_en: "National AI Assistant Reduces Wait Times by 90%",
    excerpt_ru: "Локальная нейросеть, обученная на трех языках, теперь мгновенно решает проблемы с маршрутизацией и подключением.",
    excerpt_kk: "Үш тілде оқытылған жергілікті нейрондық желі енді маршрутизация мен байланыс мәселелерін лезде шешеді.",
    excerpt_en: "A locally trained neural network in three languages now instantly resolves routing and connection issues.",
    date_ru: "20 мая 2026",
    date_kk: "20 мамыр 2026",
    date_en: "May 20, 2026",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: "tech-3",
    title_ru: "Расширение 5G в 50 отдаленных поселков",
    title_kk: "50 шалғай елді мекенге 5G желісін кеңейту",
    title_en: "5G Expansion to 50 Remote Villages",
    excerpt_ru: "Мы преодолеваем цифровое неравенство, устанавливая новые вышки 5G, которые дают селам стабильную скорость более 300 Мбит/с.",
    excerpt_kk: "Біз ауылдарға 300 Мбит/с тұрақты жылдамдық беретін жаңа 5G мұнараларын орнату арқылы цифрлық теңсіздікті жеңудеміз.",
    excerpt_en: "We are bridging the digital divide by installing new 5G towers that provide villages with stable speeds of over 300 Mbps.",
    date_ru: "15 мая 2026",
    date_kk: "15 мамыр 2026",
    date_en: "May 15, 2026",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    id: "tech-4",
    title_ru: "Защита B2B отразила 10 миллионов DDoS-атак",
    title_kk: "B2B қорғанысы 10 миллион DDoS-шабуылға тойтарыс берді",
    title_en: "B2B Protection Thwarts 10 Million DDoS Attacks",
    excerpt_ru: "Наши центры очистки трафика справились с крупнейшей ботнет-атакой без единой минуты простоя для корпоративных клиентов.",
    excerpt_kk: "Біздің трафикті тазарту орталықтары корпоративтік клиенттер үшін бір минуттық үзіліссіз ең үлкен ботнет шабуылына төтеп берді.",
    excerpt_en: "Our traffic scrubbing centers handled the largest botnet attack without a single minute of downtime for corporate clients.",
    date_ru: "10 мая 2026",
    date_kk: "10 мамыр 2026",
    date_en: "May 10, 2026",
    gradient: "from-rose-500 to-orange-500"
  },
  {
    id: "tech-5",
    title_ru: "Внедрение Wi-Fi 7 в новых роутерах",
    title_kk: "Жаңа роутерлерде Wi-Fi 7 енгізу",
    title_en: "Wi-Fi 7 Introduction in New Routers",
    excerpt_ru: "Следующее поколение беспроводной связи уже доступно для абонентов премиальных тарифов с новыми маршрутизаторами.",
    excerpt_kk: "Сымсыз байланыстың келесі буыны жаңа маршрутизаторлары бар премиум тариф абоненттері үшін қолжетімді.",
    excerpt_en: "The next generation of wireless connectivity is now available for premium tariff subscribers with new routers.",
    date_ru: "2 мая 2026",
    date_kk: "2 мамыр 2026",
    date_en: "May 2, 2026",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "tech-6",
    title_ru: "Телекоммуникационный спутник выходит на орбиту",
    title_kk: "Телекоммуникациялық спутник орбитаға шығарылуда",
    title_en: "Telecommunications Satellite Reaches Orbit",
    excerpt_ru: "Запуск нового спутника связи обеспечит 100% покрытие резервным интернетом всей территории страны к следующему году.",
    excerpt_kk: "Жаңа байланыс спутнигін ұшыру келесі жылға қарай бүкіл ел аумағын резервтік интернетпен 100% қамтуды қамтамасыз етеді.",
    excerpt_en: "The launch of a new communication satellite will ensure 100% backup internet coverage across the country by next year.",
    date_ru: "20 апреля 2026",
    date_kk: "20 сәуір 2026",
    date_en: "April 20, 2026",
    gradient: "from-fuchsia-600 to-pink-600"
  }
];

export default async function NewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = await getDictionary(locale);
  const supabase = (await createClient()) as any;

  // Fetch real news from DB to combine with mock tech news
  const { data: dbNews } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  // Format DB news to match our object structure, fallback to empty arrays if null
  const formattedDbNews = (dbNews || []).map((item: any) => ({
    id: item.id,
    title_ru: item.title_ru,
    title_kk: item.title_kk,
    title_en: item.title_en,
    excerpt_ru: item.excerpt_ru,
    excerpt_kk: item.excerpt_kk,
    excerpt_en: item.excerpt_en,
    date_ru: new Date(item.created_at).toLocaleDateString("ru-RU"),
    date_kk: new Date(item.created_at).toLocaleDateString("kk-KZ"),
    date_en: new Date(item.created_at).toLocaleDateString("en-US"),
    gradient: item.gradient || "from-slate-600 to-slate-800"
  }));

  const allNews = [...formattedDbNews, ...TECH_NEWS];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
            <Newspaper className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {dict.news.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            {dict.news.subtitle}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((item) => {
            const title = (item as any)[`title_${locale}`] || item.title_ru;
            const excerpt = (item as any)[`excerpt_${locale}`] || item.excerpt_ru;
            const date = (item as any)[`date_${locale}`] || item.date_ru;

            return (
              <Link key={item.id} href={`/${locale}/news/${item.id}`} className="group block h-full">
                <article className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {/* Image Placeholder */}
                  <div className={`w-full h-56 bg-gradient-to-br ${item.gradient} opacity-90 group-hover:opacity-100 transition-opacity relative`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
                      <Calendar className="w-4 h-4 mr-2" />
                      {date}
                    </div>
                    
                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6 flex-1 line-clamp-3">
                      {excerpt}
                    </p>
                    
                    <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-auto">
                      {dict.news.readMore} <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
