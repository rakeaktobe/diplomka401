"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function TopUpForm() {
  const router = useRouter();
  // Stable client reference — avoids creating a new Supabase connection per render
  const supabaseRef = useRef(createClient());

  const [amount, setAmount] = useState<string>("3500");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const supabase = supabaseRef.current;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      setError("Пользователь не авторизован.");
      setLoading(false);
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value < 100) {
      setError("Минимальная сумма пополнения — 100 ₸.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: value,
      status: "success",
    });

    if (insertError) {
      setError("Ошибка при сохранении платежа: " + insertError.message);
      setLoading(false);
      return;
    }

    // Also update the balance in the profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    const currentBalance = (profile?.balance || 0);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ balance: currentBalance + value })
      .eq("id", user.id);

    if (updateError) {
      setError("Оплата прошла, но баланс не обновлен: " + updateError.message);
    } else {
      setSuccess(true);
      setAmount("3500");
      // Flush SSR cache so the payment history row appears without a full reload
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleTopUp} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium dark:text-slate-200">
            Сумма пополнения (₸)
          </label>
          {success && (
            <Badge variant="success" className="animate-in fade-in zoom-in">
              Успешно
            </Badge>
          )}
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="100"
          required
          disabled={loading}
        />
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Mock card fields */}
      <div className="space-y-2">
        <label className="text-sm font-medium dark:text-slate-200">
          Номер карты (демо)
        </label>
        <Input type="text" placeholder="0000 0000 0000 0000" disabled />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-200">
            ММ/ГГ
          </label>
          <Input type="text" placeholder="12/26" disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-200">CVC</label>
          <Input type="text" placeholder="123" disabled />
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Обработка...</>
        ) : (
          "Пополнить"
        )}
      </Button>
    </form>
  );
}
