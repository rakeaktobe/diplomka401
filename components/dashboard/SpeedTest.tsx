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

export default function SpeedTest({ dict, locale = "ru" }: SpeedTestProps) {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [progress, setProgress] = useState(0);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const startTest = async () => {
    if (phase === "ping" || phase === "download" || phase === "upload") return; // prevent multiple clicks
    
    setPhase("ping");
    setPing(0);
    setDownload(0);
    setUpload(0);
    setProgress(0);
    setRecommendation(null);

    // 1. Ping Test
    let totalPing = 0;
    const pingIterations = 5;
    for (let i = 0; i < pingIterations; i++) {
      const start = performance.now();
      try {
        await fetch("/api/speedtest/ping", { cache: "no-store" });
      } catch (e) {
        console.error("Ping error", e);
      }
      const end = performance.now();
      totalPing += (end - start);
      setPing(Math.round(totalPing / (i + 1)));
      setProgress(((i + 1) / pingIterations) * 100);
    }
    
    setPhase("download");
    setProgress(0);

    // 2. Download Test
    let totalDlBits = 0;
    let totalDlTimeMs = 0;
    const dlIterations = 4; // 4 MB total payload (4x 1MB)
    for (let i = 0; i < dlIterations; i++) {
      const start = performance.now();
      try {
        const res = await fetch("/api/speedtest/download", { cache: "no-store" });
        const blob = await res.blob();
        totalDlBits += blob.size * 8;
      } catch (e) {
        console.error("Download error", e);
      }
      const end = performance.now();
      totalDlTimeMs += (end - start);
      
      const speedBps = (totalDlBits / (totalDlTimeMs / 1000));
      const speedMbps = speedBps / 1000000;
      
      setDownload(speedMbps);
      setProgress(((i + 1) / dlIterations) * 100);
    }

    setPhase("upload");
    setProgress(0);

    // 3. Upload Test
    let totalUlBits = 0;
    let totalUlTimeMs = 0;
    const ulIterations = 4; // 4 MB total payload (4x 1MB)
    
    // Create a 1MB blob once
    const size = 1024 * 1024;
    const buffer = new Uint8Array(size);
    crypto.getRandomValues(buffer);
    const uploadBlob = new Blob([buffer]);

    for (let i = 0; i < ulIterations; i++) {
      const start = performance.now();
      try {
        await fetch("/api/speedtest/upload", {
          method: "POST",
          body: uploadBlob,
          cache: "no-store"
        });
        totalUlBits += uploadBlob.size * 8;
      } catch (e) {
        console.error("Upload error", e);
      }
      const end = performance.now();
      totalUlTimeMs += (end - start);
      
      const speedBps = (totalUlBits / (totalUlTimeMs / 1000));
      const speedMbps = speedBps / 1000000;
      
      setUpload(speedMbps);
      setProgress(((i + 1) / ulIterations) * 100);
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
        body: JSON.stringify({
          download: Math.round(dl),
          upload: Math.round(ul),
          ping: p,
          locale
        })
      });
      const data = await res.json();
      if (data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error("Failed to fetch recommendation", err);
    } finally {
      setLoadingAi(false);
    }
  }, [locale]);

  // Effect to trigger AI recommendation when completed
  useEffect(() => {
    if (phase === "completed" && download > 0) {
      // Use a small delay to avoid "setState during render" warning if triggered synchronously
      const timer = setTimeout(() => {
        fetchRecommendation(download, upload, ping);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase, download, upload, ping, fetchRecommendation]);

  const getGaugeValue = () => {
    if (phase === "download") return download;
    if (phase === "upload") return upload;
    if (phase === "completed") return download;
    return 0;
  };

  const maxVal = 500;
  const percentage = Math.min((getGaugeValue() / maxVal) * 100, 100);
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card glass className="border-none h-full flex flex-col overflow-hidden relative group">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> {dict?.title || "Тест скорости"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 pb-6">
        <div className="relative w-48 h-48 mb-6">
          {/* Gauge Background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-200 dark:text-slate-800"
            />
            {/* Gauge Progress */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              fill="transparent"
              stroke="url(#speedGradient)"
              strokeWidth="12"
              strokeDasharray={502.4} // 2 * PI * 80
              initial={{ strokeDashoffset: 502.4 }}
              animate={{ strokeDashoffset: 502.4 - (percentage / 100) * 502.4 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Value Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase === "idle" ? "idle" : "value"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                {phase === "idle" ? (
                  <Activity className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
                ) : (
                  <>
                    <span className="text-4xl font-black tracking-tighter dark:text-white">
                      {phase === "ping" ? ping : Math.round(getGaugeValue())}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {phase === "ping" ? (dict?.ms || "мс") : (dict?.mbps || "Мбит/с")}
                    </span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Phase Info */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6">
          <div className={cn(
            "flex flex-col items-center p-2 rounded-2xl transition-colors",
            phase === "ping" ? "bg-blue-50 dark:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-900/50"
          )}>
            <Activity className={cn("w-4 h-4 mb-1", phase === "ping" ? "text-blue-500" : "text-slate-400")} />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{dict?.ping || "Пинг"}</span>
            <span className="text-xs font-black dark:text-white">{ping > 0 ? `${ping} ${dict?.ms || "мс"}` : "--"}</span>
          </div>
          <div className={cn(
            "flex flex-col items-center p-2 rounded-2xl transition-colors",
            phase === "download" ? "bg-blue-50 dark:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-900/50"
          )}>
            <ArrowDown className={cn("w-4 h-4 mb-1", phase === "download" ? "text-blue-500" : "text-slate-400")} />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{dict?.download || "Скачивание"}</span>
            <span className="text-xs font-black dark:text-white">{download > 0 ? Math.round(download) : "--"}</span>
          </div>
          <div className={cn(
            "flex flex-col items-center p-2 rounded-2xl transition-colors",
            phase === "upload" ? "bg-blue-50 dark:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-900/50"
          )}>
            <ArrowUp className={cn("w-4 h-4 mb-1", phase === "upload" ? "text-blue-500" : "text-slate-400")} />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{dict?.upload || "Загрузка"}</span>
            <span className="text-xs font-black dark:text-white">{upload > 0 ? Math.round(upload) : "--"}</span>
          </div>
        </div>

        <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 h-4 text-center">
          {phase === "ping" && (dict?.testing_ping || "Измерение задержки...")}
          {phase === "download" && (dict?.testing_download || "Тестирование загрузки...")}
          {phase === "upload" && (dict?.testing_upload || "Тестирование отдачи...")}
          {phase === "completed" && (dict?.completed || "Тест завершен")}
        </p>

        <AnimatePresence>
          {(loadingAi || recommendation) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-4 overflow-hidden"
            >
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {dict?.gemini_recommendation || "Рекомендация Gemini"}
                  </span>
                </div>
                {loadingAi ? (
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-full animate-pulse" />
                    <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full w-3/4 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {recommendation}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={startTest}
          disabled={phase !== "idle" && phase !== "completed"}
          className={cn(
            "w-full rounded-2xl font-bold h-12 transition-all shadow-lg shadow-blue-500/20",
            phase === "completed" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
          )}
        >
          {phase === "completed" ? (
            <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> {dict?.again || "Повторить"}</span>
          ) : (
            dict?.start || "Начать тест"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
