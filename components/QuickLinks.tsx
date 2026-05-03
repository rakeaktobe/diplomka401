import Link from "next/link";
import { Phone, MessageCircle, Send, Briefcase, Search } from "lucide-react";
import { type Locale, getLocalizedHref } from "@/lib/i18n";

interface QuickLinkItem {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  bg: string;
  href: string;
}

interface QuickLinksProps {
  locale: Locale;
}

export function QuickLinks({ locale }: QuickLinksProps) {
  const ITEMS: QuickLinkItem[] = [
    {
      icon: Phone,
      label: "160",
      sublabel: locale === 'ru' ? "Колл-центр" : locale === 'kk' ? "Байланыс орталығы" : "Call Center",
      bg: "bg-kt-blue",
      href: "tel:160",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      sublabel: locale === 'ru' ? "Написать нам" : locale === 'kk' ? "Бізге жазыңыз" : "Message us",
      bg: "bg-[#25D366]",
      href: "https://wa.me/77771234567",
    },
    {
      icon: Send,
      label: "Telegram",
      sublabel: locale === 'ru' ? "Наш бот" : locale === 'kk' ? "Біздің бот" : "Our bot",
      bg: "bg-[#229ED9]",
      href: "https://t.me/telecom_kz_bot",
    },
    {
      icon: Briefcase,
      label: locale === 'ru' ? "Бизнес" : locale === 'kk' ? "Бизнес" : "Business",
      sublabel: locale === 'ru' ? "Корп. клиентам" : locale === 'kk' ? "Корп. клиенттерге" : "Corp. clients",
      bg: "bg-slate-800",
      href: "/internet/business",
    },
    {
      icon: Search,
      label: locale === 'ru' ? "Проверка" : locale === 'kk' ? "Тексеру" : "Check",
      sublabel: locale === 'ru' ? "Статус заявки" : locale === 'kk' ? "Өтінім мәртебесі" : "Order status",
      bg: "bg-kt-blue",
      href: "/dashboard",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 py-12 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
          {locale === 'ru' ? "Онлайн-каналы связи" : locale === 'kk' ? "Онлайн байланыс арналары" : "Online Communication Channels"}
        </h2>

        {/* Items grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {ITEMS.map(({ icon: Icon, label, sublabel, bg, href }) => (
            <Link
              key={label}
              href={getLocalizedHref(href, locale)}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3 w-24 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Circle icon */}
              <div
                className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              {/* Text */}
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
