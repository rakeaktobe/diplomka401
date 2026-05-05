"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { getDictionaryClient, type Locale } from "@/lib/i18n";

export default function DashboardLoading() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] as Locale) || 'ru';
  const dict = getDictionaryClient(locale);
  
  const loadingText = dict.dashboard.loadingData;

  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-medium animate-pulse">{loadingText}</p>
      </div>
    </div>
  );
}

