import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Skeleton className="h-4 w-48 rounded-full" />
        <Skeleton className="h-12 w-2/3 max-w-2xl" />
        <Skeleton className="h-20 w-full max-w-xl" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
