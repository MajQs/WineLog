/**
 * Skeleton loading state for Dashboard
 * Displays placeholder UI while data is loading
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton Dashboard Component
 * Shows animated placeholders for dashboard content
 */
export function SkeletonDashboard() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header with CTA button skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Active batches section skeleton */}
      <section className="mb-8">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Render 3 batch card skeletons */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Archive section skeleton */}
      <section>
        <Skeleton className="h-20 w-full rounded-lg" />
      </section>
    </div>
  );
}

