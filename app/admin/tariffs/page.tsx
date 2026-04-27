"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit2, Trash2, X } from "lucide-react";

type Tariff = {
  id: string;
  name: string;
  price: number;
  speed_mbps: number | null;
  description: string | null;
  category: string;
};

type TariffForm = {
  name: string;
  price: number;
  speed_mbps: number;
  description: string;
  category: string;
};

export default function AdminTariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [formData, setFormData] = useState<TariffForm>({
    name: "",
    price: 0,
    speed_mbps: 0,
    description: "",
    category: "internet",
  });

  const supabase = createClient();

  const fetchTariffs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tariffs")
      .select("id, name, price, speed_mbps, description, category")
      .order("price");
    if (!error && data) {
      setTariffs(data as Tariff[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTariffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (tariff?: Tariff) => {
    if (tariff) {
      setEditingTariff(tariff);
      setFormData({
        name: tariff.name,
        price: tariff.price,
        speed_mbps: tariff.speed_mbps ?? 0,
        description: tariff.description ?? "",
        category: tariff.category,
      });
    } else {
      setEditingTariff(null);
      setFormData({
        name: "",
        price: 0,
        speed_mbps: 0,
        description: "",
        category: "internet",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTariff(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      speed_mbps: Number(formData.speed_mbps),
      description: formData.description,
      category: formData.category,
    };

    if (editingTariff) {
      const { error } = await supabase
        .from("tariffs")
        .update(payload)
        .eq("id", editingTariff.id);
      if (!error) fetchTariffs();
    } else {
      const { error } = await supabase.from("tariffs").insert(payload);
      if (!error) fetchTariffs();
    }
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот тариф?")) {
      const { error } = await supabase.from("tariffs").delete().eq("id", id);
      if (!error) fetchTariffs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Управление тарифами
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить тариф</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Название</th>
                <th className="px-6 py-4 font-medium">Категория</th>
                <th className="px-6 py-4 font-medium">Цена (₸)</th>
                <th className="px-6 py-4 font-medium">Скорость (Мбит/с)</th>
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
              ) : tariffs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Тарифы не найдены
                  </td>
                </tr>
              ) : (
                tariffs.map((tariff) => (
                  <tr key={tariff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {tariff.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">{tariff.category}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{tariff.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{tariff.speed_mbps ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(tariff)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tariff.id)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {editingTariff ? "Редактировать тариф" : "Новый тариф"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Название</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Цена (₸)</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Скорость (Мбит/с)</label>
                  <input
                    required
                    type="number"
                    value={formData.speed_mbps}
                    onChange={(e) => setFormData({ ...formData, speed_mbps: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="internet">Интернет</option>
                  <option value="tv">Телевидение</option>
                  <option value="mobile">Мобильная связь</option>
                  <option value="combo">Комбо</option>
                  <option value="b2b">Для бизнеса</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Описание</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                  placeholder="Краткое описание тарифа..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow font-medium"
                >
                  {editingTariff ? "Обновить" : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
