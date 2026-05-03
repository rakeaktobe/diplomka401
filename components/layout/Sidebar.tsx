"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  CreditCard, 
  LifeBuoy, 
  ActivitySquare, 
  List, 
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type Locale, getLocalizedHref } from "@/lib/i18n";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.lang as Locale || "ru";

  const sidebarLinks = [
    { name: locale === 'ru' ? "Главная" : locale === 'kk' ? "Басты бет" : "Home",         href: "/dashboard",              icon: LayoutDashboard },
    { name: locale === 'ru' ? "Мои подписки" : locale === 'kk' ? "Менің жазылымдарым" : "My subscriptions",   href: "/dashboard/subscriptions", icon: List },
    { name: locale === 'ru' ? "Платежи" : locale === 'kk' ? "Төлемдер" : "Payments",         href: "/dashboard/payments",      icon: CreditCard },
    { name: locale === 'ru' ? "Поддержка" : locale === 'kk' ? "Қолдау" : "Support",       href: "/dashboard/support",       icon: LifeBuoy },
    { name: locale === 'ru' ? "Статус сети" : locale === 'kk' ? "Желі күйі" : "Network status",     href: "/dashboard/monitoring",    icon: ActivitySquare },
    { name: locale === 'ru' ? "Профиль" : locale === 'kk' ? "Профиль" : "Profile",         href: "/dashboard/profile",       icon: UserCircle },
  ];

  return (
    <aside className="w-72 flex-shrink-0 hidden lg:flex flex-col border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/40 backdrop-blur-xl min-h-[calc(100vh-4.1rem)] p-6 transition-all">
      <nav className="space-y-2 flex-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const localizedHref = getLocalizedHref(link.href, locale);
          const isActive = pathname === localizedHref;
          return (
            <Link
              key={link.href}
              href={localizedHref}
              className="relative group block"
            >
              <div
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
                {link.name}
                
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-600 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {dict.client}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">ID: 8823491</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
