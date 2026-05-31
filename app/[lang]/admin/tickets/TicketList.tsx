"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, MessageSquare, Clock, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { closeTicket } from "../actions";

type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

interface TicketListProps {
  initialTickets: Ticket[];
  dict: any;
  locale: string;
}

export default function TicketList({ initialTickets, dict, locale }: TicketListProps) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const t = dict.admin.tickets;

  const handleCloseTicket = (id: string) => {
    startTransition(async () => {
      const result = await closeTicket(id);
      if (!result.success) alert(result.error);
    });
  };

  const filteredTickets = initialTickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    t.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
              />
           </div>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.col_client}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">{t.col_subject}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.col_status}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.col_action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <AnimatePresence mode="popLayout">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20">
                       <EmptyState
                         icon={MessageSquare}
                         title={t.empty_title}
                         description={t.empty_desc}
                       />
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket, index) => (
                    <motion.tr 
                      key={ticket.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <User className="w-5 h-5" />
                           </div>
                           <div className="text-sm font-bold text-slate-900 dark:text-white">
                              {ticket.profiles?.full_name || t.unknown}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{ticket.subject}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium italic">
                          &quot;{ticket.description}&quot;
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {new Date(ticket.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={ticket.status === 'open' ? 'outline' : 'default'} className={ticket.status === 'open' ? 'border-amber-500 text-amber-500' : 'bg-green-500'}>
                          {ticket.status === 'open' ? t.status_open : t.status_closed}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {ticket.status === "open" ? (
                          <Button
                            onClick={() => handleCloseTicket(ticket.id)}
                            variant="default"
                            size="sm"
                            disabled={isPending}
                            className="rounded-xl h-9 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {t.close_btn}
                          </Button>
                        ) : (
                          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pr-4">{t.completed}</div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
