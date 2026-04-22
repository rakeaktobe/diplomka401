import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-medium animate-pulse">Загрузка данных...</p>
      </div>
    </div>
  );
}
