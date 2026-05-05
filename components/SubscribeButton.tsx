"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

interface SubscribeButtonProps {
  tariffId: string;
  /** Pass `dict.catalog` from the parent Server Component so this stays i18n-aware. */
  dict: Dictionary["catalog"];
}

export function SubscribeButton({ tariffId, dict }: SubscribeButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Guest → redirect to login
      router.push("/login");
      return;
    }

    try {
      // 1. Fetch user profile balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        throw new Error(profileError?.message || "Profile not found");
      }

      // 2. Fetch tariff details (price)
      const { data: tariff, error: tariffError } = await supabase
        .from("tariffs")
        .select("price")
        .eq("id", tariffId)
        .single();

      if (tariffError || !tariff) {
        throw new Error(tariffError?.message || "Tariff not found");
      }

      // 3. Logic: Check if balance is sufficient
      if (profile.balance < tariff.price) {
        alert(dict.buyError || "Купить невозможно");
        setLoading(false);
        return;
      }

      // 4. Call the RPC function for secure atomic transaction
      const { error: rpcError } = await supabase.rpc("subscribe_to_tariff", {
        p_user_id: user.id,
        p_tariff_id: tariffId,
      });

      if (rpcError) {
        const errorMessage = rpcError.message || "";
        if (errorMessage.includes("INSUFFICIENT_FUNDS")) {
          alert(dict.buyError || "Купить невозможно");
        } else {
          alert("Ошибка: " + (errorMessage || "Произошла неизвестная ошибка при подписке"));
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/subscriptions");
      }, 900);
    } catch (err: any) {
      console.error("Subscription process error:", err);
      alert("Произошла ошибка: " + err.message);
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full group-hover:bg-blue-700 transition-colors"
      onClick={handleSubscribe}
      disabled={loading || success}
    >
      {success ? (
        <><CheckCircle2 className="w-4 h-4 mr-2" />{dict.subscribed}</>
      ) : loading ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{dict.subscribing}</>
      ) : (
        <>{dict.subscribe}<ArrowRight className="w-4 h-4 ml-2" /></>
      )}
    </Button>
  );
}
