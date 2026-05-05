"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, Lock } from "lucide-react";

interface TopUpFormProps {
  dict: any;
}

export function TopUpForm({ dict }: TopUpFormProps) {
  const router = useRouter();
  // Stable client reference — avoids creating a new Supabase connection per render
  const supabaseRef = useRef(createClient());

  const [amount, setAmount] = useState<string>("3500");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  // Simple card number formatter (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(" ").slice(0, 19) : v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  async function handleTopUp(e: React.FormEvent) {
    e.preventDefault();
    
    // Basic client-side validation for the demo
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError(dict.card_error);
      return;
    }
    if (expiry.length < 5) {
      setError(dict.expiry_error);
      return;
    }
    if (cvc.length < 3) {
      setError(dict.cvc_error);
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    // Simulate bank processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const supabase = supabaseRef.current;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      setError(dict.unauthorized);
      setLoading(false);
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value < 100) {
      setError(dict.amount_min);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: value,
      status: "success",
    });

    if (insertError) {
      setError(dict.error_save + ": " + insertError.message);
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
      setError(dict.error_balance + ": " + updateError.message);
    } else {
      setSuccess(true);
      setAmount("3500");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      // Flush SSR cache so the payment history row appears without a full reload
      router.refresh();
      setTimeout(() => setSuccess(false), 5000);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleTopUp} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium dark:text-slate-200">
            {dict.amount}
          </label>
          {success && (
            <Badge variant="success" className="animate-in fade-in zoom-in">
              {dict.success}
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
          className="font-bold text-lg"
        />
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 animate-pulse">{error}</p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
            <CreditCard className="w-4 h-4 text-slate-400" /> {dict.card_number}
          </label>
          <Input 
            type="text" 
            placeholder="0000 0000 0000 0000" 
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
              <Calendar className="w-4 h-4 text-slate-400" /> {dict.expiry}
            </label>
            <Input 
              type="text" 
              placeholder="12/26" 
              value={expiry}
              onChange={handleExpiryChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 dark:text-slate-200">
              <Lock className="w-4 h-4 text-slate-400" /> {dict.cvc}
            </label>
            <Input 
              type="password" 
              placeholder="***" 
              value={cvc}
              onChange={handleCvcChange}
              maxLength={4}
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {dict.processing}</>
        ) : (
          dict.topUpBtn
        )}
      </Button>
      <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
        {dict.secure_notice}
      </p>
    </form>
  );
}

