"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export function TechnologyTabs() {
  const [activeTab, setActiveTab] = useState<"ftth" | "adsl">("ftth");
  const params = useParams();
  const locale = params?.lang as string || "ru";

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
      <button
        onClick={() => setActiveTab("ftth")}
        className={`px-5 py-2 text-sm font-bold border-b-2 -mb-px transition-colors duration-300 ${
          activeTab === "ftth"
            ? "text-kt-blue border-kt-blue"
            : "text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        {locale === 'ru' ? "Оптика (FTTH)" : locale === 'kk' ? "Оптика (FTTH)" : "Fiber (FTTH)"}
      </button>
      <button
        onClick={() => setActiveTab("adsl")}
        className={`px-5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-300 ${
          activeTab === "adsl"
            ? "text-kt-blue border-kt-blue font-bold"
            : "text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        {locale === 'ru' ? "Медь (ADSL)" : locale === 'kk' ? "Мыс (ADSL)" : "Copper (ADSL)"}
      </button>
    </div>
  );
}
