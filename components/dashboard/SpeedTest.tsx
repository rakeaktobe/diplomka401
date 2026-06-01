"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowDown, ArrowUp, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SpeedTestProps {
  dict: Record<string, string>;
  locale?: string;
}

type TestPhase = "idle" | "ping" | "download" | "upload" | "completed";
type FeedbackLevel = "excellent" | "good" | "ok" | "poor";

const DOWNLOAD_BYTES = 4 * 1024 * 1024; // must match route

function getSpeedFeedback(mbps: number, locale: string) {
  const level: FeedbackLevel =
    mbps >= 100 ? "excellent" : mbps >= 25 ? "good" : mbps >= 5 ? "ok" : "poor";

  const labels: Record<string, Record<FeedbackLevel, string>> = {
    ru: { excellent: "Отличная скорость", good: "Хорошая скорость", ok: "Средняя скорость", poor: "Низкая скорость" },
    kk: { excellent: "Тамаша жылдамдық", good: "Жақсы жылдамдық", ok: "Орта жылдамдық", poor: "Төмен жылдамдық" },
    en: { excellent: "Excellent speed", good: "Good speed", ok: "Average speed", poor: "Low speed" },
  };
  const hints: Record<string, Record<FeedbackLevel, string>> = {
    ru: {
      excellent: "Поддерживает 4K-видео, онлайн-игры и несколько устройств одновременно.",
      good: "Отлично для HD-видео, удалённой работы и видеозвонков.",
      ok: "Подходит для браузинга и стандартного видео.",
      poor: "Возможны задержки. Рекомендуем тариф с большей скоростью.",
    },
    kk: {
      excellent: "4K-бейне, онлайн-ойындар және бірнеше құрылғыны қолдайды.",
      good: "HD-бейне, қашықтан жұмыс және бейне қоңыраулар үшін тамаша.",
      ok: "Браузер және стандартты бейне үшін жеткілікті.",
      poor: "Кідірістер болуы мүмкін. Жылдамырақ тариф ұсынамыз.",
    },
    en: {
      excellent: "Supports 4K streaming, gaming and multiple devices.",
      good: "Great for HD video, remote work and video calls.",
      ok: "Suitable for browsing and standard video.",
      poor: "May experience slowdowns. Consider a faster plan.",
    },
  };
  const colorMap: Record<FeedbackLevel, string> = {
    excellent: "emerald", good: "blue", ok: "amber", poor: "red",
  };

  const lang = labels[locale] ? locale : "ru";
  return { level, label: labels[lang][level], hint: hints[lang][level], color: colorMap[level] };
}

export default function SpeedTest({ dict, locale = "ru" }: SpeedTestProps) {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const startTest = async () => {
    if (phase !== "idle" && phase !== "completed") return;

    setPhase("ping");
    setPing(0); setDownload(0); setUpload(0);
    setProgress(0); setRecommendation(null);

    // ── 1. Ping ──────────────────────────────────────────────────
    const PING_N = 3;
    let totalPing = 0;
    for (let i = 0; i < PING_N; i++) {
      const t = performance.now();
      try { await fetch("/api/speedtest/ping", { cache: "no-store" }); } catch {}
      totalPing += performance.now() - t;
      setPing(Math.round(totalPing / (i + 1)));
      setProgress(((i + 1) / PING_N) * 100);
    }

    // ── 2. Download — stream, timer starts after first byte ──────
    setPhase("download");
    setProgress(0);
    try {
      const res = await fetch("/api/speedtest/download", { cache: "no-store" });
      const reader = res.body!.getReader();
      let dlBytes = 0;
      let dlStart = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Exclude server gen latency — start clock on first received byte
        if (dlStart < 0) dlStart = performance.now();
        dlBytes += value.length;
        const sec = (performance.now() - dlStart) / 1000;
        if (sec > 0.05) {
          setDownload((dlBytes * 8) / sec / 1e6);
          setProgress(Math.min((dlBytes / DOWNLOAD_BYTES) * 100, 99));
        }
      }
      setProgress(100);
    } catch (e) {
      console.error("Download error", e);
    }

    // ── 3. Upload — single 1 MB request ─────────────────────────
    setPhase("upload");
    setProgress(0);
    try {
      const buf = new Uint8Array(1024 * 1024);
      for (let i = 0; i < buf.length; i += 65536) {
        crypto.getRandomValues(buf.subarray(i, Math.min(i + 65536, buf.length)));
      }
      const t = performance.now();
      await fetch("/api/speedtest/upload", { method: "POST", body: buf, cache: "no-store" });
      const sec = (performance.now() - t) / 1000;
      setUpload((buf.length * 8) / sec / 1e6);
    } catch (e) {
      console.error("Upload error", e);
    }

    setPhase("completed");
    setProgress(100);
  };

  const fetchRecommendation = React.useCallback(async (dl: number, ul: number, p: number) => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ download: Math.round(dl), upload: Math.round(ul), ping: p, locale }),
      });
      const data = await res.json();
      if (data.recommendation) setRecommendation(data.recommendation);
    } catch {}
    finally { setLoadingAi(false); }
  }, [locale]);

  useEffect(() => {
    if (phase === "completed" && download > 0) {
      const t = setTimeout(() => fetchRecommendation(download, upload, ping), 100);
      return () => clearTimeout(t);
    }
  }, [phase, download, upload, ping, fetchRecommendation]);

  const maxVal = 200;
  const gaugeVal = phase === "upload" ? upload : download;
  const percentage = Math.min((gaugeVal / maxVal) * 100, 100);
  const feedback = phase === "completed" && download > 0 ? getSpeedFeedback(download, locale) : null;
  const isRunning = phase !== "idle" && phase !== "completed";

  return (
    <Card glass className="border-none h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> {dict?.title || "Тест скорости"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center pt-2 pb-6 gap-4">

        {/* ── Gauge ─────────────────────────────────────────────── */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
            <circle cx="72" cy="72" r="60" fill="none" stroke="currentColor"
              strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
            <motion.circle
              cx="72" cy="72" r="60" fill="none"
              stroke="url(#sg)" strokeWidth="10"
              strokeDasharray={376.99}
              initial={{ strokeDashoffset: 376.99 }}
              animate={{ strokeDashoffset: 376.99 - (percentage / 100) * 376.99 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "idle" ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </motion.div>
              ) : (
                <motion.div key="val"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl font-black tracking-tighter dark:text-white">
                    {phase === "ping" ? ping : Math.round(gaugeVal)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {phase === "ping" ? (dict?.ms || "мс") : (dict?.mbps || "Мбит/с")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────────── */}
        <div className="w-full grid grid-cols-3 gap-2">
          {[
            { icon: Activity,  label: dict?.ping     || "Пинг",       value: ping > 0     ? `${ping} ${dict?.ms || "мс"}`       : "—", active: phase === "ping"     },
            { icon: ArrowDown, label: dict?.download  || "Скачивание", value: download > 0 ? `${Math.round(download)}`           : "—", active: phase === "download" },
            { icon: ArrowUp,   label: dict?.upload    || "Загрузка",   value: upload > 0   ? `${Math.round(upload)}`             : "—", active: phase === "upload"   },
          ].map(({ icon: Icon, label, value, active }) => (
            <div key={label} className={cn(
              "flex flex-col items-center p-2 rounded-xl transition-colors",
              active ? "bg-blue-50 dark:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-900/50"
            )}>
              <Icon className={cn("w-3.5 h-3.5 mb-0.5", active ? "text-blue-500" : "text-slate-400")} />
              <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
              <span className="text-[11px] font-black dark:text-white">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Progress bar + phase label ─────────────────────────── */}
        <div className="w-full space-y-1.5">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", phase === "completed" ? "bg-emerald-500" : "bg-blue-500")}
              animate={{ width: `${progress}%` }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase text-center h-3.5">
            {phase === "ping"     && (dict?.testing_ping     || "Измерение задержки...")}
            {phase === "download" && (dict?.testing_download || "Тестирование загрузки...")}
            {phase === "upload"   && (dict?.testing_upload   || "Тестирование отдачи...")}
            {phase === "completed" && (dict?.completed       || "Тест завершён")}
          </p>
        </div>

        {/* ── Speed feedback ────────────────────────────────────── */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className={cn("rounded-2xl p-3 border", {
                "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50": feedback.color === "emerald",
                "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50":             feedback.color === "blue",
                "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50":         feedback.color === "amber",
                "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50":                 feedback.color === "red",
              })}>
                <p className={cn("text-xs font-black mb-0.5", {
                  "text-emerald-700 dark:text-emerald-400": feedback.color === "emerald",
                  "text-blue-700 dark:text-blue-400":       feedback.color === "blue",
                  "text-amber-700 dark:text-amber-400":     feedback.color === "amber",
                  "text-red-700 dark:text-red-400":         feedback.color === "red",
                })}>
                  {feedback.label}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{feedback.hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI recommendation ─────────────────────────────────── */}
        <AnimatePresence>
          {(loadingAi || recommendation) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {dict?.gemini_recommendation || "Рекомендация AI"}
                  </span>
                </div>
                {loadingAi ? (
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full w-full animate-pulse" />
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{recommendation}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Button ────────────────────────────────────────────── */}
        <Button
          onClick={startTest}
          disabled={isRunning}
          className={cn(
            "w-full rounded-2xl font-bold h-11 shadow-md",
            phase === "completed"
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
          )}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/40 animate-pulse" />
              {phase === "ping" && (dict?.testing_ping || "Пинг...")}
              {phase === "download" && (dict?.testing_download || "Загрузка...")}
              {phase === "upload" && (dict?.testing_upload || "Отдача...")}
            </span>
          ) : phase === "completed" ? (
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> {dict?.again || "Повторить"}</span>
          ) : (
            dict?.start || "Начать тест"
          )}
        </Button>

      </CardContent>
    </Card>
  );
}
