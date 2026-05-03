"use client";

import { useState, useTransition } from "react";
import { Plus, Wallet, Shield, Ban, CreditCard, ChevronDown, User, MoreVertical, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserBalance, toggleUserRole, updateSubscription, cancelSubscription } from "../actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Tariff = {
  id: string;
  name: string;
  price: number;
};

type Subscription = {
  id: string;
  status: string;
  tariff_id: string;
  tariffs: Tariff;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  balance: number;
  role: string;
  subscriptions: Subscription[];
};

interface UserTableProps {
  users: UserProfile[];
  tariffs: Tariff[];
}

export default function UserTable({ users, tariffs }: UserTableProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [modalType, setModalType] = useState<"balance" | "subscription" | null>(null);
  const [amountToAdd, setAmountToAdd] = useState<number>(0);
  const [selectedTariffId, setSelectedTariffId] = useState<string>("");

  const handleOpenBalanceModal = (user: UserProfile) => {
    setSelectedUser(user);
    setAmountToAdd(0);
    setModalType("balance");
  };

  const handleOpenSubscriptionModal = (user: UserProfile) => {
    setSelectedUser(user);
    const activeSub = user.subscriptions.find(s => s.status === 'active');
    setSelectedTariffId(activeSub?.tariff_id || "");
    setModalType("subscription");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const onUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || amountToAdd <= 0) return;

    startTransition(async () => {
      const result = await updateUserBalance(selectedUser.id, amountToAdd);
      if (result.success) {
        handleCloseModal();
      } else {
        alert(result.error);
      }
    });
  };

  const onUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedTariffId) return;

    startTransition(async () => {
      const result = await updateSubscription(selectedUser.id, selectedTariffId);
      if (result.success) {
        handleCloseModal();
      } else {
        alert(result.error);
      }
    });
  };

  const onToggleRole = (user: UserProfile) => {
    startTransition(async () => {
      const result = await toggleUserRole(user.id, user.role);
      if (!result.success) alert(result.error);
    });
  };

  const onCancelSub = (subId: string) => {
    startTransition(async () => {
      const result = await cancelSubscription(subId);
      if (!result.success) alert(result.error);
    });
  };

  return (
    <div className="space-y-6">
      <Card glass className="overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Пользователь</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Роль</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Баланс</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Активный тариф</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Управление</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {users.map((user, index) => {
                const activeSub = user.subscriptions.find(s => s.status === 'active');
                return (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {user.full_name || "Без имени"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            ID: {user.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button 
                         onClick={() => onToggleRole(user)}
                         disabled={isPending}
                         className="focus:outline-none"
                       >
                         <Badge 
                           variant={user.role === 'admin' ? 'blue' : 'secondary'} 
                           className={user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                         >
                           {user.role === 'admin' ? 'Администратор' : 'Клиент'}
                         </Badge>
                       </button>
                    </td>
                    <td className="px-8 py-6">
                       <div className="text-sm font-black text-slate-900 dark:text-white">
                         {user.balance.toLocaleString()} ₸
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      {activeSub ? (
                        <div className="flex items-center gap-2 group/sub">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              {activeSub.tariffs?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">Активен до 15.05</span>
                          </div>
                          <button 
                            onClick={() => onCancelSub(activeSub.id)}
                            disabled={isPending}
                            className="p-1.5 opacity-0 group-hover/sub:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Отменить подписку"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Нет активных услуг</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-xl h-9 w-9 border-slate-200 dark:border-slate-800"
                            onClick={() => handleOpenBalanceModal(user)}
                            disabled={isPending}
                          >
                             <Wallet className="w-4 h-4 text-emerald-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-xl h-9 w-9 border-slate-200 dark:border-slate-800"
                            onClick={() => handleOpenSubscriptionModal(user)}
                            disabled={isPending}
                          >
                             <CreditCard className="w-4 h-4 text-blue-500" />
                          </Button>
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals using AnimatePresence */}
      <AnimatePresence>
        {(modalType === "balance" || modalType === "subscription") && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      {modalType === "balance" ? <Wallet className="w-6 h-6 text-blue-600" /> : <CreditCard className="w-6 h-6 text-blue-600" />}
                   </div>
                   <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                   {modalType === "balance" ? "Пополнение баланса" : "Управление услугой"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                   Пользователь: <span className="text-slate-900 dark:text-white font-bold">{selectedUser.full_name || "Без имени"}</span>
                </p>

                {modalType === "balance" ? (
                  <form onSubmit={onUpdateBalance} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Сумма зачисления (₸)</label>
                       <Input
                         required
                         type="number"
                         min="1"
                         value={amountToAdd || ""}
                         onChange={(e) => setAmountToAdd(Number(e.target.value))}
                         className="h-16 text-3xl font-black text-center rounded-3xl bg-slate-50 dark:bg-slate-950 border-none"
                         placeholder="0"
                       />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1 h-14 rounded-2xl font-bold">Отмена</Button>
                      <Button type="submit" isLoading={isPending} className="flex-1 h-14 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700">
                        Зачислить
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={onUpdateSubscription} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Выберите новый тариф</label>
                       <div className="relative">
                          <select
                            required
                            value={selectedTariffId}
                            onChange={(e) => setSelectedTariffId(e.target.value)}
                            className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-950 border-none rounded-3xl appearance-none font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                          >
                            <option value="">Выберите из списка...</option>
                            {tariffs.map(t => (
                              <option key={t.id} value={t.id}>{t.name} — {t.price} ₸</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1 h-14 rounded-2xl font-bold">Отмена</Button>
                      <Button type="submit" isLoading={isPending} className="flex-1 h-14 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700">
                        Обновить
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
