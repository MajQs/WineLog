/**
 * SkeletonBatchView component
 * Loading skeleton for Batch View
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonBatchView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Heading */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-b border-gray-200">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stage Timeline Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Skeleton className="h-6 w-40 mb-4" />

              {/* Timeline Items */}
              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Current Stage Card Skeleton */}
              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-5 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>

                    {/* Materials */}
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Stage Button Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Skeleton className="h-11 w-full sm:w-64" />
              </div>

              {/* Notes Section Skeleton */}
              <div>
                <Skeleton className="h-6 w-24 mb-4" />

                {/* Note Form Skeleton */}
                <Card className="mb-6">
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>

                {/* Note Timeline Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6 space-y-3">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <div className="flex gap-4 pt-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
