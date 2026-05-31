import Link from "next/link";
import { Phone, MessageCircle, Send, Briefcase, Search } from "lucide-react";
import { type Locale, getLocalizedHref } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

interface QuickLinkItem {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  bg: string;
  href: string;
}

interface QuickLinksProps {
  locale: Locale;
  dict: Dictionary["quickLinks"];
}

export function QuickLinks({ locale, dict }: QuickLinksProps) {
  const ITEMS: QuickLinkItem[] = [
    {
      icon: Phone,
      label: "160",
      sublabel: dict.callCenter,
      bg: "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30",
      href: "tel:160",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      sublabel: dict.messageUs,
      bg: "bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[#25D366]/30",
      href: "https://wa.me/77771234567",
    },
    {
      icon: Send,
      label: "Telegram",
      sublabel: dict.ourBot,
      bg: "bg-gradient-to-br from-[#229ED9] to-[#0088CC] shadow-[#229ED9]/30",
      href: "https://t.me/telecom_kz_bot",
    },
    {
      icon: Briefcase,
      label: dict.business,
      sublabel: dict.corpClients,
      bg: "bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-700/30",
      href: "/internet/business",
    },
    {
      icon: Search,
      label: dict.check,
      sublabel: dict.orderStatus,
      bg: "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30",
      href: "/dashboard",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 py-12 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
          {dict.title}
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
                className={`w-16 h-16 sm:w-20 sm:h-20 ${bg} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 border border-white/10`}
              >
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" />
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
