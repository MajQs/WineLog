/**
 * ArchivedBatchView component
 * Main view for displaying archived batch details
 */

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { useArchivedBatch } from "@/lib/hooks/useArchivedBatch";
import { useRatingMutation } from "@/lib/hooks/useRatingMutation";
import { 
  MetaInfoBar, 
  StageTimeline, 
  NoteTimeline,
  ErrorState,
  SkeletonBatchView,
  StarRating,
  ButtonDeleteBatch
} from "./batch";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ArchivedBatchViewProps {
  batchId: string;
}

/**
 * Internal archived batch page component wrapped with QueryProvider
 */
function ArchivedBatchPageContent({ batchId }: ArchivedBatchViewProps) {
  const { data, isLoading, isError, error } = useArchivedBatch(batchId);
  const ratingMutation = useRatingMutation({ batchId });

  // Loading state
  if (isLoading) {
    return <SkeletonBatchView />;
  }

  // Error state
  if (isError) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // No data state (shouldn't happen after loading, but safety check)
  if (!data) {
    return <ErrorState error={new Error("Nie znaleziono nastawu")} />;
  }

  const handleRatingChange = (rating: number) => {
    ratingMutation.mutate(rating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Back to Archive Button and Delete */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <a href="/archived">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do archiwum
            </a>
          </Button>
          
          <ButtonDeleteBatch batchId={batchId} batchName={data.name} />
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {data.name}
          </h1>
          <MetaInfoBar batch={data} />
          
          {/* Star Rating */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <StarRating 
              initialRating={data.rating} 
              batchId={batchId}
              onChange={handleRatingChange}
              disabled={ratingMutation.isPending}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Stage Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Przebieg etapów
              </h2>
              <StageTimeline 
                stages={data.stages} 
                currentStageId={undefined}
                isArchived={true}
              />
            </div>
          </div>

          {/* Right Column - Notes History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Historia notatek
                {data.notesCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({data.notesCount})
                  </span>
                )}
              </h2>
              <NoteTimeline 
                notes={data.notes} 
                batchId={batchId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main ArchivedBatchView component with QueryProvider and Toast notifications
 */
export default function ArchivedBatchView({ batchId }: ArchivedBatchViewProps) {
  return (
    <QueryProvider>
      <ArchivedBatchPageContent batchId={batchId} />
      <Toaster />
    </QueryProvider>
  );
}

