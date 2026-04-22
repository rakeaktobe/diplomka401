import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Tv, Wifi, Smartphone, Package2, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

export const metadata = {
  title: "Личный кабинет",
};

interface SubscriptionRow {
  id: string;
  status: string;
  next_billing_date: string | null;
  tariffs: {
    id: string;
    name: string;
    speed_mbps: number | null;
    price: number;
    category: string;
  } | null;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile and subscriptions joined with tariffs
  const [profileResult, subsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id || "")
      .single(),
    supabase
      .from("subscriptions")
      .select(`id, status, next_billing_date, tariffs ( id, name, speed_mbps, price, description, category )`)
      .eq("user_id", user?.id || ""),
  ]);

  const profile       = profileResult.data;
  const subscriptions = subsResult.data ?? [];

  const CATEGORY_ICON: Record<string, React.ElementType> = {
    internet: Wifi,
    tv:       Tv,
    mobile:   Smartphone,
    combo:    Package2,
    b2b:      Package2,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">
          Добро пожаловать,{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {profile?.full_name ?? user?.email ?? "Пользователь"}
          </span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Ваш персональный кабинет управления услугами.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 shadow-sm md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Текущий баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-900 dark:text-blue-100">
              {formatCurrency(profile?.balance ?? 0)}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              К оплате до 15.05.2026
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/payments" className="w-full">
              <Button className="w-full">Пополнить баланс</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Active Subscriptions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="dark:text-white">Мои подписки</CardTitle>
            <CardDescription>Услуги, подключенные к вашему аккаунту.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 border border-dashed rounded-md dark:border-slate-700">
                У вас пока нет активных подписок.{" "}
                <Link href="/#tariffs" className="text-blue-600 dark:text-blue-400 underline">
                  Выбрать тариф
                </Link>
              </div>
            ) : (
              (subscriptions as unknown as SubscriptionRow[]).map((sub) => {
                const tariff   = sub.tariffs;
                const IconComp = CATEGORY_ICON[tariff?.category ?? "internet"] ?? Wifi;
                return (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg p-4 gap-4 bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg dark:text-white">{tariff?.name}</h4>
                        <Badge variant={sub.status === "active" ? "success" : "warning"} className="mt-1 text-[10px]">
                          {sub.status === "active" ? "Активен" : "Ожидает"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(tariff?.price ?? 0)} / мес
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {sub.next_billing_date
                          ? new Date(sub.next_billing_date).toLocaleDateString("ru-RU")
                          : "—"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account details */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Детали аккаунта</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Номер договора</span>
            <span className="font-medium dark:text-white">ЛС-84820129</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Телефон</span>
            <span className="font-medium dark:text-white">{profile?.phone ?? "—"}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Адрес подключения</span>
            <span className="font-medium dark:text-white">{profile?.address ?? "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
