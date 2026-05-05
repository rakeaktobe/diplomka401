import { createClient } from "@/utils/supabase/server";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wifi, Tv, Smartphone, Package2,
  Calendar, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.dashboard.subscriptions.title,
  };
}

// ── Category icon/colour lookup ─────────────────────────────────
type Category = "internet" | "tv" | "mobile" | "combo" | "b2b";

interface Tariff {
  id: string;
  name: string;
  name_ru?: string | null;
  name_kk: string | null;
  name_en: string | null;
  speed_mbps: number | null;
  price: number;
  description: string;
  description_ru?: string | null;
  category: Category;
}

interface Subscription {
  id: string;
  status: string;
  next_billing_date: string | null;
  tariffs: Tariff | null;
}

const CATEGORY_STYLE: Record<Category, { bg: string; icon: React.ElementType }> = {
  internet: { bg: "bg-blue-100   text-blue-700   dark:bg-blue-950   dark:text-blue-400",   icon: Wifi      },
  tv:       { bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400", icon: Tv        },
  mobile:   { bg: "bg-cyan-100   text-cyan-700   dark:bg-cyan-950   dark:text-cyan-400",   icon: Smartphone},
  combo:    { bg: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400", icon: Package2  },
  b2b:      { bg: "bg-amber-100  text-amber-700  dark:bg-amber-950  dark:text-amber-400",  icon: Package2  },
};

export default async function SubscriptionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const fullDict = await getDictionary(locale);
  const dict = fullDict.dashboard.subscriptions;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let subscriptions = null;
  let error = null;

  try {
    const res = await supabase
      .from("subscriptions")
      .select(`
        id,
        status,
        next_billing_date,
        tariffs ( id, name_ru, name_kk, name_en, speed_mbps, price, description_ru, category )
      `)
      .eq("user_id", user?.id ?? "");
      
    if (res.error) throw res.error;
    subscriptions = res.data;
  } catch (err) {
    console.error("[Subscriptions] Error fetching subscriptions:", err);
    error = err;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">{dict.title}</h1>
        <p className="text-slate-500 dark:text-slate-400">{dict.subtitle}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {dict.error}
        </div>
      )}

      {!subscriptions || subscriptions.length === 0 ? (
        <Card className="flex flex-col items-center py-12 px-4 shadow-sm border-dashed dark:border-slate-700">
          <CardTitle className="mb-2 dark:text-white">{dict.empty}</CardTitle>
          <CardDescription className="text-center mb-6">
            {dict.emptyDesc}
          </CardDescription>
          <Link href="/">
            <Button>{dict.catalog}</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(subscriptions as any[]).map((sub) => {
            const tariff = sub.tariffs;
            if (!tariff) return null;

            const cat    = (tariff.category as Category) ?? "internet";
            const meta   = CATEGORY_STYLE[cat] ?? CATEGORY_STYLE.internet;
            const Icon   = meta.icon;
            
            // Use dictionary translation if available, otherwise fallback to DB locale, then fallback to base name
            const tDict = (fullDict.catalog as any).tariffs?.[tariff.name_ru || tariff.name];
            const tariffName = tDict?.name || tariff[`name_${locale}`] || tariff.name_ru || tariff.name;

            return (
              <Card
                key={sub.id}
                className="relative overflow-hidden group shadow-sm hover:shadow-md transition-all pt-2 dark:bg-slate-900 dark:border-slate-700"
              >
                {/* Status colour bar */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    sub.status === "active" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />

                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.bg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white">{tariffName}</CardTitle>
                        <Badge
                          variant={sub.status === "active" ? "success" : "warning"}
                          className="mt-1 lowercase text-[10px]"
                        >
                          {sub.status === "active" ? dict.active : dict.pending}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="py-4 text-sm text-slate-600 dark:text-slate-400 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{dict.payment}:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800">
                      {formatCurrency(tariff.price)} / {fullDict.catalog.perMonth}
                    </span>
                  </div>
                  {tariff.speed_mbps && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">{dict.speed}:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {fullDict.catalog.upTo} {tariff.speed_mbps} {fullDict.catalog.mbps}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{dict.nextBilling}:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {sub.next_billing_date
                        ? new Date(sub.next_billing_date).toLocaleDateString(locale === 'kk' ? 'kk-KZ' : locale === 'ru' ? 'ru-RU' : 'en-US')
                        : dict.not_assigned}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50 dark:bg-slate-800/50 pt-4">
                  <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600">
                    {dict.changeBtn}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
