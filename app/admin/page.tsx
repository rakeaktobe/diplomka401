import { createClient } from "@/utils/supabase/server";
import { Users, CreditCard, Ticket } from "lucide-react";

export default async function AdminOverview() {
  const supabase = await createClient();

  // 1. Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 2. Active subscriptions
  const { count: activeSubs } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 3. Open tickets
  const { count: openTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  const stats = [
    {
      title: "Всего пользователей",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Активные подписки",
      value: activeSubs || 0,
      icon: CreditCard,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Открытые тикеты",
      value: openTickets || 0,
      icon: Ticket,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Обзор платформы
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mt-8">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Добро пожаловать в Админ-Панель</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Здесь вы можете управлять пользователями, тарифами и запросами в техподдержку. Используйте меню слева для навигации.
        </p>
      </div>
    </div>
  );
}
