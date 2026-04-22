import Link from "next/link";
import { Wifi, TrendingUp, Users, Leaf, ArrowRight } from "lucide-react";
import { TelecomLogo } from "@/components/TelecomLogo";

export const metadata = {
  title: "О компании",
  description: "АО ТЕЛЕКОМ — национальный цифровой оператор Казахстана.",
};

const STATS = [
  { label: "Лет на рынке",      value: "28+" },
  { label: "Городов покрытия",  value: "180+" },
  { label: "Абонентов",         value: "6 млн" },
  { label: "Сотрудников",       value: "18 000" },
];

const VALUES = [
  {
    icon: Wifi,
    title: "Надёжность сети",
    desc: "Uptime 99.9% — гарантированная стабильность соединения 24/7 по всем регионам Казахстана.",
  },
  {
    icon: TrendingUp,
    title: "Технологии будущего",
    desc: "FTTH, 5G, IoT — мы строим цифровую инфраструктуру страны и внедряем передовые решения.",
  },
  {
    icon: Users,
    title: "6 миллионов абонентов",
    desc: "Крупнейшая абонентская база в Казахстане. Каждый третий житель страны — наш клиент.",
  },
  {
    icon: Leaf,
    title: "Устойчивое развитие",
    desc: "Снижение углеродного следа, зелёная энергетика и ответственное корпоративное управление.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-kt-dark to-slate-800 text-white py-24">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <TelecomLogo size={52} />
              <span className="text-3xl font-black tracking-tight">ТЕЛЕКОМ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              О компании
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-xl">
              АО «ТЕЛЕКОМ» — национальный телекоммуникационный оператор Казахстана.
              Мы создаём цифровую инфраструктуру страны, обеспечивая связь каждого дома
              и каждого бизнеса с современным миром.
            </p>
            <div className="flex gap-4 mt-2 flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-kt-blue text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Наши тарифы <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
              >
                Личный кабинет
              </Link>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            {STATS.map(({ label, value }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-6 text-center backdrop-blur-sm">
                <p className="text-3xl font-black text-white">{value}</p>
                <p className="text-sm text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="py-20 bg-kt-gray-light dark:bg-slate-900">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 text-center">
            Наши ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-kt-blue/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-kt-blue" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-screen-xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Станьте клиентом ТЕЛЕКОМ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            Подключите высокоскоростной интернет FTTH уже сегодня и оцените разницу.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-kt-blue text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-kt-blue/30 text-lg"
          >
            Выбрать тариф <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
