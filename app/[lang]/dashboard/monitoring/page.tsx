"use client";

import { useEffect, useRef, useState, use, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivitySquare, Loader2 } from "lucide-react";
import { getDictionaryClient, type Locale } from "@/lib/i18n";

// ── Types matching the network_status schema ─────────────────────
interface NetworkNode {
  id: string;
  region: string;
  status: "online" | "degraded" | "offline";
  updated_at: string;
}

export default function MonitoringPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const locale = (lang as Locale) || "ru";
  const fullDict = getDictionaryClient(locale);
  const dict = fullDict.dashboard.monitoring;
  
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function getInitialNodes() {
      const { data } = await supabase
        .from("network_status")
        .select("*")
        .order("region");
      if (data) setNetworkNodes(data as NetworkNode[]);
      setLoading(false);
    }

    getInitialNodes();

    const channel = supabase
      .channel("network_status_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "network_status" },
        (payload) => {
          setNetworkNodes((current) =>
            current.map((node) =>
              node.id === payload.new.id
                ? (payload.new as NetworkNode)
                : node
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 dark:text-white">
          <ActivitySquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          {dict.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {dict.subtitle}
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dict.connecting}
            </span>
          </div>
        )}

        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-lg dark:text-white">
              {dict.regions}
            </CardTitle>
            <Badge
              variant="outline"
              className="border-green-300 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-400 dark:bg-green-950/40 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {dict.realtimeActive}
            </Badge>
          </div>
          <CardDescription>
            {dict.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {networkNodes.length === 0 && !loading && (
              <p className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                {dict.empty}
              </p>
            )}
            {networkNodes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-5 w-5 shrink-0">
                    {item.status === "online" && (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500" />
                      </>
                    )}
                    {item.status === "degraded" && (
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                    )}
                    {item.status === "offline" && (
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                      {item.region}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {dict.updated}:{" "}
                      {new Date(item.updated_at).toLocaleTimeString(locale === 'kk' ? 'kk-KZ' : locale === 'ru' ? 'ru-RU' : 'en-US')}
                    </div>
                  </div>
                </div>

                <div className="pl-9 sm:pl-0">
                  <Badge
                    variant={
                      item.status === "online"
                        ? "success"
                        : item.status === "degraded"
                        ? "warning"
                        : "error"
                    }
                    className="uppercase tracking-widest text-[10px] w-full justify-center sm:w-auto"
                  >
                    {item.status === "online" && dict.online}
                    {item.status === "degraded" && dict.degraded}
                    {item.status === "offline" && dict.offline}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
