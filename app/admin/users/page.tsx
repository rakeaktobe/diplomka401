"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Wallet, Shield } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  balance: number;
  role: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("full_name");
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (user: Profile) => {
    setSelectedUser(user);
    setAmountToAdd(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || amountToAdd <= 0) return;

    const newBalance = (selectedUser.balance || 0) + amountToAdd;

    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", selectedUser.id);

    if (!error) {
      // Create a payment record to keep history
      await supabase.from("payments").insert({
        user_id: selectedUser.id,
        amount: amountToAdd,
        status: "completed",
        payment_method: "admin_manual",
      });

      fetchUsers();
    }
    handleCloseModal();
  };

  const handleRoleToggle = async (user: Profile) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (confirm(`Изменить роль пользователя ${user.full_name || 'Без имени'} на ${newRole}?`)) {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", user.id);
      if (!error) fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        Пользователи
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Имя</th>
                <th className="px-6 py-4 font-medium">Роль</th>
                <th className="px-6 py-4 font-medium">Баланс (₸)</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono truncate max-w-[100px]" title={user.id}>
                      {user.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {user.full_name || "Без имени"}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleRoleToggle(user)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="Нажмите, чтобы изменить роль"
                      >
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                      {(user.balance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Пополнить</span>
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

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Пополнить баланс
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Для: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUser.full_name || "Без имени"}</span>
              </p>
            </div>
            
            <form onSubmit={handleAddFunds} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                  Сумма пополнения (₸)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={amountToAdd || ""}
                  onChange={(e) => setAmountToAdd(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-800 dark:text-slate-100 text-2xl font-bold text-center"
                  placeholder="0"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow font-medium"
                >
                  Зачислить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
