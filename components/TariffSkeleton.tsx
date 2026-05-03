import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function TariffSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="relative flex flex-col bg-white dark:bg-slate-900 pt-2 overflow-hidden border-slate-100 dark:border-slate-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800" />
          
          <CardHeader className="pb-3">
            {/* Category badge skeleton */}
            <Skeleton className="h-6 w-24 rounded-full mb-3" />
            
            {/* Title skeleton */}
            <Skeleton className="h-7 w-3/4 mb-2" />
            
            {/* Speed pill skeleton */}
            <div className="flex items-center gap-1.5 mt-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Description skeletons */}
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            {/* Feature chips skeleton */}
            <div className="flex gap-1.5 mt-4">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-4">
            {/* Price skeleton */}
            <div className="flex items-baseline gap-2 mt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-8" />
            </div>

            {/* Perks list skeleton */}
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
