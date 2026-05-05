"use client";

import { motion } from "framer-motion";
import { Users, CreditCard, Ticket, Activity, ArrowUpRight, Zap, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dictionary } from "@/lib/i18n";

interface AdminDashboardContentProps {
  dict: Dictionary;
  stats: {
    totalUsers: number;
    activeSubs: number;
    openTickets: number;
  };
}

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

export function AdminDashboardContent({ dict, stats }: AdminDashboardContentProps) {
  const params = useParams();
  const locale = (params?.lang as string) || "ru";
  const d = dict.admin.dashboard;

  const statCards = [
    {
      title: d.totalUsers,
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      accent: "blue",
      description: d.userGrowth
    },
    {
      title: d.activeSubscriptions,
      value: stats.activeSubs,
      icon: CreditCard,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      accent: "emerald",
      description: d.conversion
    },
    {
      title: d.openTickets,
      value: stats.openTickets,
      icon: Ticket,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      accent: "amber",
      description: d.responseTime
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
               {d.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
               {d.subtitle}
            </p>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{d.liveStatus}</span>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card glass className="overflow-hidden group hover:border-blue-500/30 transition-all">
              <CardHeader className="pb-2">
                 <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-full">
                       <ArrowUpRight className="w-3 h-3" /> {d.up}
                    </div>
                 </div>
                 <CardTitle className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                    {stat.title}
                 </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-xs font-medium text-slate-400">
                   {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <motion.div variants={item}>
            <Card glass className="h-full border-none">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Activity className="w-5 h-5 text-blue-500" /> {d.systemActivity}
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     {[1,2,3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-blue-500" />
                           <div className="flex-1">
                              <div className="text-sm font-bold dark:text-white">{d.dbUpdate}</div>
                              <div className="text-xs text-slate-500">{d.system} • {d.timeAgo}</div>
                           </div>
                           <div className="text-[10px] font-black text-slate-400 uppercase">{d.success}</div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </motion.div>

         <motion.div variants={item}>
            <Card className="h-full border-none bg-slate-900 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
               <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-white">
                     <Zap className="w-5 h-5 text-amber-500" /> {d.quickAccess}
                  </CardTitle>
               </CardHeader>
               <CardContent className="relative z-10 space-y-4">
                  <p className="text-sm text-slate-400 font-medium">
                     {d.quickAccessDesc}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                     <Link href={`/${locale}/admin/users`} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-center">
                        <Users className="w-5 h-5 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold">{d.users}</div>
                     </Link>
                     <Link href={`/${locale}/admin/tariffs`} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-center">
                        <CreditCard className="w-5 h-5 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold">{d.tariffs}</div>
                     </Link>
                     <Link href={`/${locale}/admin/tickets`} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-center">
                        <Ticket className="w-5 h-5 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold">{d.tickets}</div>
                     </Link>
                     <Link href={`/${locale}/admin/payments`} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group text-center">
                        <Banknote className="w-5 h-5 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                        <div className="text-xs font-bold">{d.payments}</div>
                     </Link>
                  </div>
               </CardContent>
            </Card>
         </motion.div>
      </div>
    </motion.div>
  );
}
