/**
 * Archived View Component
 * Main component for archived batches page
 */

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { useArchivedBatches } from "@/lib/hooks/useArchivedBatches";
import { SkeletonArchive } from "./archived/SkeletonArchive";
import { ErrorState } from "./archived/ErrorState";
import { EmptyState } from "./archived/EmptyState";
import { BatchListArchived } from "./archived/BatchListArchived";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Archived Content Component
 * Renders archived batches list based on data state
 */
function ArchivedContent() {
  const { batches, isLoading, isError, refetch } = useArchivedBatches();

  // Loading state
  if (isLoading) {
    return <SkeletonArchive />;
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Empty state
  if (batches.length === 0) {
    return <EmptyState />;
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Archiwum</h1>
        <p className="text-muted-foreground mt-2">
          Przeglądaj zakończone nastawy i sprawdź swoje osiągnięcia
        </p>
      </header>

      {/* Archived Batches List */}
      <BatchListArchived batches={batches} />
    </div>
  );
}

/**
 * Archived View Component
 * Root component with QueryProvider wrapper
 */
export default function ArchivedView() {
  return (
    <QueryProvider>
      <ArchivedContent />
    </QueryProvider>
  );
}

