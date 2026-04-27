"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, MessageSquare, Clock } from "lucide-react";

type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string };
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchTickets = async () => {
    setLoading(true);
    // Fetch tickets with user profile details
    const { data, error } = await supabase
      .from("tickets")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTickets(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseTicket = async (id: string) => {
    if (confirm("Вы уверены, что хотите закрыть этот тикет?")) {
      const { error } = await supabase
        .from("tickets")
        .update({ status: "closed" })
        .eq("id", id);
        
      if (!error) fetchTickets();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Управление тикетами
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Пользователь</th>
                <th className="px-6 py-4 font-medium w-1/3">Тема / Описание</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium">Дата создания</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <span>Тикеты не найдены</span>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {ticket.profiles?.full_name || "Неизвестный"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">{ticket.subject}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2" title={ticket.description}>
                        {ticket.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {ticket.status === 'open' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        {ticket.status === 'open' ? 'Открыт' : 'Закрыт'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(ticket.created_at).toLocaleDateString("ru-RU", {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {ticket.status === "open" ? (
                          <button
                            onClick={() => handleCloseTicket(ticket.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors text-sm font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Закрыть</span>
                          </button>
                        ) : (
                          <span className="text-sm text-slate-400 dark:text-slate-500 px-3 py-1.5">
                            Завершен
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
