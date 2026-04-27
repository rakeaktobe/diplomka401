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
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      // Guest → redirect to login
      router.push("/login");
      return;
    }

    // Call the RPC function for secure atomic transaction
    const { error } = await supabase.rpc("subscribe_to_tariff", {
      p_user_id: session.user.id,
      p_tariff_id: tariffId,
    });

    if (error) {
      console.error("Supabase RPC Error:", error);
      const errorMessage = error.message || "";
      if (errorMessage.includes("INSUFFICIENT_FUNDS")) {
        alert("Недостаточно средств. Пожалуйста, пополните баланс.");
        router.push("/dashboard/payments");
      } else {
        alert("Ошибка: " + (errorMessage || "Произошла неизвестная ошибка при подписке"));
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/subscriptions");
      }, 900);
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
