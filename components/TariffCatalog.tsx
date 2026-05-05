"use client";

import { useState, useMemo } from "react";
import type { Dictionary } from "@/lib/i18n";
import { formatAmount } from "@/utils/formatCurrency";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscribeButton } from "@/components/SubscribeButton";
import { TariffSkeleton } from "./TariffSkeleton";
import {
  Wifi, Tv, Smartphone, Package2,
  Building2, CheckCircle2, Zap, Users, Star,
} from "lucide-react";
import { useParams } from "next/navigation";

// ── types mirror the Supabase schema ────────────────────────────
type Category = "internet" | "tv" | "mobile" | "combo" | "b2b";

interface Tariff {
  id: string;
  name?: string | null;
  name_ru?: string | null;
  name_kk?: string | null;
  name_en?: string | null;
  speed_mbps: number | null;
  price: number;
  description?: string | null;
  description_ru?: string | null;
  description_kk?: string | null;
  description_en?: string | null;
  category: Category;
}

interface TariffCatalogProps {
  tariffs: Tariff[];
  dict: Dictionary["catalog"];
}

// ── Helpers ──────────────────────────────────────────────────────

function getCategoryMeta(category: Category, dict: Dictionary["catalog"]): { label: string; icon: React.ElementType; color: string } {
  const meta: Record<Category, { label: string; icon: React.ElementType; color: string }> = {
    internet: { label: dict.internet, icon: Wifi,      color: "blue"   },
    tv:       { label: dict.tv,       icon: Tv,        color: "indigo" },
    mobile:   { label: dict.mobile,   icon: Smartphone,color: "cyan"   },
    combo:    { label: dict.combo,    icon: Package2,  color: "violet" },
    b2b:      { label: dict.b2b,      icon: Building2, color: "amber"  },
  };
  return meta[category];
}

/** Derive visual feature chips from the tariff description for combos */
function ComboFeatureChips({ category, speedMbps, dict }: { category: Category; speedMbps: number | null; dict: Dictionary["catalog"] }) {
  if (category !== "combo" && category !== "b2b") return null;

  const chips = [];
  if (speedMbps) chips.push({ icon: Wifi, label: `${dict.upTo} ${speedMbps} ${dict.mbps}` });
  if (category === "combo" || category === "b2b") {
    chips.push({ icon: Smartphone, label: "SIM-карта" });
    chips.push({ icon: Tv, label: "ТВ-пакет" });
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {chips.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
        >
          <Icon className="w-3 h-3" /> {label}
        </span>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────

export function TariffCatalog({ tariffs, dict }: TariffCatalogProps) {
  const [activeTab, setActiveTab] = useState<"b2c" | "b2b">("b2c");
  const [isChangingTab, setIsChangingTab] = useState(false);
  const params = useParams();
  const locale = (params?.lang as string) || "ru";

  // ── Deduplication safety net (in case DB has duplicates) ─────
  const uniqueTariffs = useMemo(
    () => Array.from(new Map(tariffs.map((t) => [t.name_ru || t.name, t])).values()),
    [tariffs]
  );

  const b2cTariffs = useMemo(
    () => uniqueTariffs.filter((t) => t.category !== "b2b"),
    [uniqueTariffs]
  );
  const b2bTariffs = useMemo(
    () => uniqueTariffs.filter((t) => t.category === "b2b"),
    [uniqueTariffs]
  );
  const displayed = activeTab === "b2c" ? b2cTariffs : b2bTariffs;

  const handleTabChange = (tab: "b2c" | "b2b") => {
    if (tab === activeTab) return;
    setIsChangingTab(true);
    setActiveTab(tab);
    setTimeout(() => setIsChangingTab(false), 400);
  };

  return (
    <div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            {dict.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
            {dict.subtitle}
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 gap-1 shadow-sm">
            <button
              onClick={() => handleTabChange("b2c")}
              className={[
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === "b2c"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {dict.forHome}
            </button>
            <button
              onClick={() => handleTabChange("b2b")}
              className={[
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === "b2b"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {dict.forBusiness}
            </button>
          </div>
        </div>

        {isChangingTab || (tariffs.length === 0 && activeTab === "b2c") ? (
           <TariffSkeleton />
        ) : (
          <>
            {activeTab === "b2b" && b2bTariffs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 dark:text-slate-400">
                <Building2 className="w-16 h-16 opacity-30" />
                <p className="text-lg font-medium">{dict.comingSoon}</p>
                <p className="text-sm">{dict.b2bContact}: <span className="text-blue-600">b2b@telecom.kz</span></p>
              </div>
            )}

            {displayed.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayed.map((tariff) => {
                  const meta = getCategoryMeta(tariff.category, dict);
                  const Icon = meta.icon;
                  const isCombo = tariff.category === "combo";
                  const isB2B   = tariff.category === "b2b";
                  
                  // Use dictionary translation if available, otherwise fallback to DB locale, then fallback to base name
                  const tDict = (dict as any).tariffs?.[tariff.name_ru || tariff.name];
                  const displayName = tDict?.name || (tariff as any)[`name_${locale}`] || tariff.name_ru || tariff.name;
                  const displayDesc = tDict?.description || (tariff as any)[`description_${locale}`] || tariff.description_ru || tariff.description;

                  return (
                    <Card
                      key={tariff.id}
                      className={[
                        "relative flex flex-col group transition-all bg-white dark:bg-slate-900 pt-2 overflow-hidden",
                        isCombo ? "ring-2 ring-violet-400 dark:ring-violet-600 hover:ring-violet-500" : "hover:border-blue-300 dark:hover:border-blue-700",
                        isB2B   ? "ring-2 ring-amber-400 dark:ring-amber-600 hover:ring-amber-500" : "",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "absolute top-0 left-0 w-full h-1",
                          isCombo ? "bg-gradient-to-r from-violet-500 to-blue-500" :
                          isB2B   ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                          "bg-blue-500",
                        ].join(" ")}
                      />

                      {(tariff.name_ru === "Black" || tariff.name === "Black") && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white uppercase tracking-wider">
                            <Star className="w-2.5 h-2.5" /> {dict.top}
                          </span>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <Badge
                          variant="secondary"
                          className="inline-flex w-fit bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent mb-3"
                        >
                          <Icon className="w-3 h-3 mr-1.5" />
                          {meta.label}
                        </Badge>

                        <CardTitle className="text-xl text-slate-800 dark:text-slate-100">
                          {displayName}
                        </CardTitle>

                        {tariff.speed_mbps && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Zap className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {dict.upTo} {tariff.speed_mbps} {dict.mbps}
                            </span>
                          </div>
                        )}

                        <CardDescription className="mt-2 text-sm leading-relaxed min-h-[56px]">
                          {displayDesc}
                        </CardDescription>

                        <ComboFeatureChips category={tariff.category} speedMbps={tariff.speed_mbps} dict={dict} />
                      </CardHeader>


                      <CardContent className="flex-1 pb-4">
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                            {formatAmount(tariff.price)}
                          </span>
                          <span className="text-lg font-bold text-slate-500 dark:text-slate-400">₸</span>
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ {dict.perMonth}</span>
                        </div>

                        <ul className="mt-5 flex flex-col gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            {dict.unlimited}
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            {dict.freeConn}
                          </li>
                          {(isCombo || isB2B) && (
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              {isB2B ? dict.staticIp : dict.singleBill}
                            </li>
                          )}
                          {isB2B && (
                            <li className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500 shrink-0" />
                              {dict.personalManager}
                            </li>
                          )}
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <SubscribeButton tariffId={tariff.id} dict={dict} />
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
