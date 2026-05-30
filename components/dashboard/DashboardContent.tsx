"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Tv, 
  Wifi, 
  Smartphone, 
  Package2, 
  Calendar, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";
import SpeedTest from "./SpeedTest";

interface DashboardContentProps {
  profile: any;
  subscriptions: any[];
  user: any;
  dict: any;
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  internet: Wifi,
  tv:       Tv,
  mobile:   Smartphone,
  combo:    Package2,
  b2b:      Package2,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardContent({ profile, subscriptions, user, dict }: DashboardContentProps) {
  const params = useParams();
  const locale = (params?.lang as string) || "ru";

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl pb-10"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {dict.welcome},{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {profile?.full_name?.split(' ')[0] ?? dict.user}!
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {dict.active}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="blue" className="px-4 py-1.5 text-xs">{dict.status}: {dict.overview?.premium || "Premium"}</Badge>
           <div className="text-right hidden sm:block">
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dict.id}</div>
             <div className="text-sm font-black dark:text-white">8823491</div>
           </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card - Premium look */}
        <motion.div variants={item} className="lg:col-span-4 h-full">
          <Card className="h-full overflow-hidden border-none bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl shadow-blue-500/30 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
            
            <CardHeader className="pb-0 relative z-10">
              <CardTitle className="text-xs font-black text-blue-100 uppercase tracking-[0.2em] flex items-center gap-2">
                <Wallet className="w-4 h-4" /> {dict.balance}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative z-10">
              <div className="text-5xl font-black tracking-tighter mb-2">
                {formatCurrency(profile?.balance ?? 0)}
              </div>
              <div className="flex items-center gap-2 text-blue-100/80 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>{dict.pay_until} 15.05.2026</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4 relative z-10">
              <Link href={`/${locale}/dashboard/payments`} className="w-full">
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none font-bold rounded-2xl h-12">
                  {dict.top_up}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Quick Stats / Secondary Card */}
        <motion.div variants={item} className="lg:col-span-8">
          <Card glass className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>{dict.active_services}</CardTitle>
                <CardDescription>{dict.manage_services}</CardDescription>
              </div>
              <Link href={`/${locale}/dashboard/subscriptions`}>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 font-bold gap-1 group">
                  {dict.all_services} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {subscriptions.length === 0 ? (
                <EmptyState 
                  icon={Package2}
                  title={dict.overview.noSubs}
                  description={dict.subscriptions.emptyDesc}
                  action={{
                    label: dict.catalog?.subscribe,
                    onClick: () => window.location.href = `/${locale}#tariffs`
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.slice(0, 4).map((sub) => {
                    const tariff   = sub.tariffs;
                    const IconComp = CATEGORY_ICON[tariff?.category ?? "internet"] ?? Wifi;
                    const tariffName = tariff?.[`name_${locale}`] || tariff?.name;

                    return (
                      <motion.div
                        key={sub.id}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group relative flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/30 transition-all"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm dark:text-white truncate">{tariffName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge variant={sub.status === "active" ? "success" : "warning"} className="px-2 py-0">
                                {sub.status === "active" ? (dict.overview?.working || "Работает") : (dict.overview?.pending || "Ожидает")}
                             </Badge>
                             <span className="text-[10px] font-bold text-slate-400">{tariff?.speed_mbps} {dict.speedtest?.mbps || "Mbps"}</span>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Speed Test Card */}
        <motion.div variants={item} className="lg:col-span-1">
           <SpeedTest dict={dict.speedtest} locale={locale} />
        </motion.div>

        {/* Network Status Card */}
        <motion.div variants={item}>
           <Card glass className="overflow-hidden border-none h-full">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" /> {dict.network_status}
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-end justify-between mb-4">
                  <div className="text-3xl font-black text-emerald-500">99.9%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dict.stable}</div>
               </div>
               <div className="flex gap-1 h-1.5 w-full">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={cn("flex-1 rounded-full", i === 18 ? "bg-amber-400" : "bg-emerald-500")} />
                  ))}
               </div>
             </CardContent>
           </Card>
        </motion.div>

        {/* Support Tickets */}
        <motion.div variants={item}>
           <Card glass className="border-none h-full">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                 <Info className="w-4 h-4 text-blue-500" /> {dict.support.title}
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{dict.no_tickets}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{dict.support_desc}</p>
                <Link href={`/${locale}/dashboard/support`}>
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold border-slate-200 dark:border-slate-800">
                    {dict.new_ticket}
                  </Button>
                </Link>
             </CardContent>
           </Card>
        </motion.div>

        {/* News/Updates */}
        <motion.div variants={item}>
           <Card glass className="border-none h-full">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm">{dict.news}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <Link href={`/${locale}/news`} className="group cursor-pointer block">
                   <div className="text-[10px] font-bold text-blue-500 uppercase">{dict.news_categories.promo}</div>
                   <div className="text-xs font-bold dark:text-white group-hover:underline">{dict.news_items.cashback}</div>
                </Link>
                <Link href={`/${locale}/news`} className="group cursor-pointer block">
                   <div className="text-[10px] font-bold text-emerald-500 uppercase">{dict.news_categories.update}</div>
                   <div className="text-xs font-bold dark:text-white group-hover:underline">{dict.news_items.channels}</div>
                </Link>
             </CardContent>
           </Card>
        </motion.div>
      </div>

      {/* Account Details - Modern Table/Grid */}
      <motion.div variants={item}>
        <Card glass className="overflow-hidden border-none">
          <CardHeader>
            <CardTitle>{dict.account_info}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{dict.contract_num}</div>
                <div className="text-sm font-bold dark:text-white">{dict.contract_val || "ЛС-84820129"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{dict.phone}</div>
                <div className="text-sm font-bold dark:text-white">{profile?.phone ?? dict.not_specified}</div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{dict.address}</div>
                <div className="text-sm font-bold dark:text-white truncate">{profile?.address ?? dict.not_assigned}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
