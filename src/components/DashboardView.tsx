/**
 * Dashboard View Component
 * Main component for dashboard page
 */

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { SkeletonDashboard } from "./dashboard/SkeletonDashboard";
import { ErrorState } from "./dashboard/ErrorState";
import { CTAButtonNewBatch } from "./dashboard/CTAButtonNewBatch";
import { BatchListActive } from "./batch/BatchListActive";
import { SectionArchive } from "./dashboard/SectionArchive";

/**
 * Dashboard Content Component
 * Renders dashboard based on data state
 */
function DashboardContent() {
  const { batches, archivedCount, isLoading, isError, refetch } = useDashboardData();

  // Loading state
  if (isLoading) {
    return <SkeletonDashboard />;
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header with CTA */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <CTAButtonNewBatch />
      </header>

      {/* Active Batches List */}
      <BatchListActive batches={batches} />

      {/* Archive Section */}
      <SectionArchive count={archivedCount} />
    </div>
  );
}

/**
 * Dashboard View Component
 * Root component with QueryProvider wrapper
 */
export default function DashboardView() {
  return (
    <QueryProvider>
      <DashboardContent />
    </QueryProvider>
  );
}
