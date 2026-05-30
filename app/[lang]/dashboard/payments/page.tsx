import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowDownRight } from "lucide-react";
import { TopUpForm } from "@/components/TopUpForm";
import { formatCurrency } from "@/utils/formatCurrency";
import { getDictionary } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

// Enforce dynamic rendering out of cache so tables always show fresh inserts.
export const dynamic = "force-dynamic";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang as Locale) || "ru";
  const dict = (await getDictionary(locale)).dashboard.payments;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-5xl">
       <div>
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">{dict.title}</h1>
          <p className="text-slate-500 dark:text-slate-400">{dict.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-1 border-blue-200 dark:border-blue-900/50">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {dict.topUpTitle}
                </CardTitle>
                <CardDescription>
                   {dict.topUpDesc}
                </CardDescription>
             </CardHeader>
             <CardContent>
                {/* Embedded Client Component */}
                <TopUpForm dict={dict} />
             </CardContent>
          </Card>

          <Card className="xl:col-span-2 dark:border-slate-800">
             <CardHeader>
                <CardTitle className="dark:text-white">{dict.history}</CardTitle>
                <CardDescription>{dict.historyDesc}</CardDescription>
             </CardHeader>
             <CardContent>
                {error ? (
                  <div className="text-red-500 py-6 text-sm">{(dict as any).error_save || "Error"}</div>
                ) : !payments || payments.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    {dict.empty}
                  </div>
                ) : (
                  <div className="space-y-4">
                   {(payments as Payment[]).map((p) => (
                       <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-100 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900/50 shadow-sm gap-2">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                <ArrowDownRight className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">{dict.topUp}</h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                   ID: {p.id.split('-')[0]} • {new Date(p.created_at).toLocaleString(locale === 'kk' ? 'kk-KZ' : locale === 'ru' ? 'ru-RU' : 'en-US')}
                                </span>
                             </div>
                          </div>
                          <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                             <div className="font-bold text-green-600 dark:text-green-400 text-lg">+{formatCurrency(p.amount)}</div>
                             <Badge variant={p.status === "success" ? "success" : "warning"} className="text-[10px]">
                                {p.status === "success" ? dict.success : dict.inProcess}
                             </Badge>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </CardContent>
          </Card>
        </div>
    </div>
  );
}
