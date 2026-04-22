"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, CheckCircle2, XCircle } from "lucide-react";

type CheckResult = "available" | "unavailable" | null;

/**
 * AddressChecker — simulates a fibre-connectivity check for a given address.
 * Shows a 1.5 s loading state, then a randomised success/warning outcome.
 * Placed on the public Landing Page directly beneath the Hero section.
 */
export function AddressChecker() {
  const [address, setAddress] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<CheckResult>(null);
  const [checkedAddr, setCheckedAddr] = useState("");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!address.trim()) return;

    setResult(null);
    setLoading(true);
    setCheckedAddr(address.trim());

    // Simulated async check (1.5 s)
    await new Promise((r) => setTimeout(r, 1500));

    // Deterministic-ish random: available ~70 % of the time
    setResult(Math.random() < 0.7 ? "available" : "unavailable");
    setLoading(false);
  }

  function handleReset() {
    setResult(null);
    setAddress("");
    setCheckedAddr("");
  }

  return (
    <section className="relative z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Проверить доступность по адресу
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Узнайте, доступно ли подключение по оптике прямо к вашей квартире или офису.
            </p>
          </div>
        </div>

        {/* Form */}
        {result === null ? (
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Введите вашу улицу и номер дома"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !address.trim()}
              className="shrink-0 min-w-[140px]"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Проверяем...</>
              ) : (
                "Проверить"
              )}
            </Button>
          </form>
        ) : (
          /* Result banner */
          <div
            className={[
              "rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all",
              result === "available"
                ? "bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800"
                : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800",
            ].join(" ")}
          >
            <div
              className={[
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                result === "available"
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
              ].join(" ")}
            >
              {result === "available" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {result === "available"
                  ? "Отличные новости! По вашему адресу доступно подключение по оптике."
                  : "К сожалению, по этому адресу подключение пока недоступно."}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {result === "available"
                  ? `${checkedAddr} — оптоволоконная линия проходит до вашего дома. Выберите тариф и подключайтесь!`
                  : `${checkedAddr} — мы уже ведём работы по расширению сети. Оставьте заявку — мы сообщим о готовности.`}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              {result === "available" && (
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Выбрать тариф
                </Link>
              )}
              <Button size="sm" variant="outline" onClick={handleReset}>
                Другой адрес
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
