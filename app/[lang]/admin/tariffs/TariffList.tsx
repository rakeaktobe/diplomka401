"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, X, Wifi, Tv, Smartphone, Package2, Shield, Search, MoreVertical, Zap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveTariff, deleteTariff } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tariff = {
  id: string;
  name_ru: string;
  price: number;
  speed_mbps: number | null;
  description_ru: string | null;
  category: string;
};

interface TariffListProps {
  initialTariffs: Tariff[];
}

const CATEGORY_ICON: Record<string, any> = {
  internet: Wifi,
  tv: Tv,
  mobile: Smartphone,
  combo: Package2,
  b2b: Shield,
};

export default function TariffList({ initialTariffs }: TariffListProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name_ru: "",
    price: 0,
    speed_mbps: 0,
    description_ru: "",
    category: "internet",
  });

  const handleOpenModal = (tariff?: Tariff) => {
    if (tariff) {
      setEditingTariff(tariff);
      setFormData({
        name_ru: tariff.name_ru,
        price: tariff.price,
        speed_mbps: tariff.speed_mbps ?? 0,
        description_ru: tariff.description_ru ?? "",
        category: tariff.category,
      });
    } else {
      setEditingTariff(null);
      setFormData({
        name_ru: "",
        price: 0,
        speed_mbps: 0,
        description_ru: "",
        category: "internet",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTariff(null);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveTariff(formData, editingTariff?.id);
      if (result.success) {
        handleCloseModal();
      } else {
        alert(result.error);
      }
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTariff(id);
      if (!result.success) alert(result.error);
    });
  };

  const filteredTariffs = initialTariffs.filter(t => t.name_ru.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Управление тарифами
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Создание и редактирование тарифных планов для клиентов.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Поиск тарифов..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all w-full md:w-64"
              />
           </div>
           <Button onClick={() => handleOpenModal()} className="rounded-2xl h-11 px-6 bg-blue-600 hover:bg-blue-700">
             <Plus className="w-5 h-5 mr-2" /> Добавить тариф
           </Button>
        </div>
      </div>

      <Card glass className="overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Тариф</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Категория</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Цена</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Характеристики</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredTariffs.map((tariff, index) => {
                const Icon = CATEGORY_ICON[tariff.category] || Zap;
                return (
                  <motion.tr 
                    key={tariff.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-slate-50 dark:hover:bg-blue-500/5 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {tariff.name_ru}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-[200px]">
                            {tariff.description_ru || "Нет описания"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center uppercase tracking-widest">
                       <Badge variant="secondary" className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {tariff.category}
                       </Badge>
                    </td>
                    <td className="px-8 py-6">
                       <div className="text-sm font-black text-slate-900 dark:text-white">
                         {tariff.price.toLocaleString()} ₸
                       </div>
                       <div className="text-[10px] text-slate-400 font-bold">в месяц</div>
                    </td>
                    <td className="px-8 py-6">
                       {tariff.speed_mbps ? (
                         <div className="flex items-center gap-2">
                           <Zap className="w-4 h-4 text-amber-500" />
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                             {tariff.speed_mbps} Mbps
                           </span>
                         </div>
                       ) : (
                         <span className="text-xs text-slate-400 italic">Специальное предложение</span>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl h-9 w-9"
                            onClick={() => handleOpenModal(tariff)}
                          >
                             <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-500 transition-colors" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl h-9 w-9 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => onDelete(tariff.id)}
                          >
                             <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
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

      <AnimatePresence>
        {isModalOpen && (
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
              className="relative w-full max-w-xl overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-blue-600" />
                   </div>
                   <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                      <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
                   {editingTariff ? "Редактирование тарифа" : "Создание нового тарифа"}
                </h2>

                <form onSubmit={onSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Название тарифа</label>
                       <Input
                         required
                         type="text"
                         value={formData.name_ru}
                         onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                         className="h-14 font-bold rounded-2xl bg-slate-50 dark:bg-slate-950 border-none px-6"
                         placeholder="Введите название..."
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Цена (₸)</label>
                       <Input
                         required
                         type="number"
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                         className="h-14 font-bold rounded-2xl bg-slate-50 dark:bg-slate-950 border-none px-6"
                         placeholder="0"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Скорость (Mbps)</label>
                       <Input
                         type="number"
                         value={formData.speed_mbps}
                         onChange={(e) => setFormData({ ...formData, speed_mbps: Number(e.target.value) })}
                         className="h-14 font-bold rounded-2xl bg-slate-50 dark:bg-slate-950 border-none px-6"
                         placeholder="0"
                       />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Категория услуг</label>
                       <div className="relative">
                          <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl appearance-none font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                          >
                             <option value="internet">Интернет</option>
                             <option value="tv">Телевидение</option>
                             <option value="mobile">Мобильная связь</option>
                             <option value="combo">Комбо</option>
                             <option value="b2b">Бизнес</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Описание тарифа</label>
                       <textarea
                         value={formData.description_ru}
                         onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                         className="w-full h-32 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border-none font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                         placeholder="Кратко опишите преимущества..."
                       />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1 h-14 rounded-2xl font-bold">Отмена</Button>
                    <Button type="submit" isLoading={isPending} className="flex-1 h-14 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700">
                       {editingTariff ? "Обновить тариф" : "Создать тариф"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
