/**
 * Skeleton loading state for Archived View
 * Displays placeholder UI while data is loading
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton Archive Component
 * Shows animated placeholders for archived batches content
 */
export function SkeletonArchive() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Archived batches grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Render 6 batch card skeletons */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type badge skeleton */}
              <Skeleton className="h-6 w-20 rounded-full" />

              {/* Rating skeleton */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="size-4 rounded-full" />
                ))}
              </div>

              {/* Dates skeleton */}
              <div className="space-y-2 border-t pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
