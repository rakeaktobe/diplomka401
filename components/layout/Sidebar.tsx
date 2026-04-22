"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, LifeBuoy, ActivitySquare, List, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Главная",         href: "/dashboard",              icon: Home },
  { name: "Мои подписки",   href: "/dashboard/subscriptions", icon: List },
  { name: "Платежи",         href: "/dashboard/payments",      icon: CreditCard },
  { name: "Поддержка",       href: "/dashboard/support",       icon: LifeBuoy },
  { name: "Статус сети",     href: "/dashboard/monitoring",    icon: ActivitySquare },
  { name: "Профиль",         href: "/dashboard/profile",       icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <nav className="space-y-1 flex-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-400 dark:text-slate-600 uppercase tracking-wider">
        Личный кабинет
      </div>
    </aside>
  );
}
