"use client";

import { useState } from "react";
import { CreditCard, Search, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Payment = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string | null;
  profiles: { full_name: string } | null;
};

interface PaymentListProps {
  initialPayments: Payment[];
}

export default function PaymentList({ initialPayments }: PaymentListProps) {
  const [search, setSearch] = useState("");

  const filteredPayments = initialPayments.filter(p => 
    p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            История платежей
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Просмотр всех транзакций и пополнений баланса.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Поиск по имени..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
              />
           </div>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Клиент / ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Метод</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Сумма</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Статус</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="group hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {payment.profiles?.full_name || "Неизвестный"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {payment.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        payment.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {payment.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        {payment.payment_method || "Система"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-black ${
                      payment.amount > 0 ? 'text-green-600' : 'text-slate-900 dark:text-white'
                    }`}>
                      {payment.amount.toLocaleString()} ₸
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <Badge variant={payment.status === 'completed' ? 'default' : 'outline'} className={payment.status === 'completed' ? 'bg-green-500' : ''}>
                      {payment.status === 'completed' ? 'Успешно' : payment.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(payment.created_at).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
