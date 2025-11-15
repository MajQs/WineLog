/**
 * BatchView component
 * Main view for displaying and managing a single batch
 */

import { QueryProvider } from "@/lib/providers/QueryProvider";
import { useBatch } from "@/lib/hooks/useBatch";
import { useAllNotes } from "@/lib/hooks/useAllNotes";
import {
  EditableHeading,
  MetaInfoBar,
  StageTimeline,
  StageCardCurrent,
  ButtonNextStage,
  ButtonCompleteBatch,
  NoteForm,
  NoteHistory,
  ErrorState,
  SkeletonBatchView,
} from "./batch";
import { Toaster } from "@/components/ui/sonner";

interface BatchViewProps {
  batchId: string;
}

/**
 * Internal batch page component wrapped with QueryProvider
 */
function BatchPageContent({ batchId }: BatchViewProps) {
  const { data, currentStage, isLoading, isError, error } = useBatch(batchId);
  const { data: allNotes, isLoading: isLoadingNotes } = useAllNotes(batchId);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <EditableHeading name={data.name} batchId={batchId} />
          <MetaInfoBar batch={data} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Stage Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Etapy produkcji</h2>
              <StageTimeline stages={data.stages} currentStageId={currentStage?.id} />
            </div>
          </div>

          {/* Right Column - Current Stage Details */}
          <div className="lg:col-span-2">
            <div className="space-y-4 sm:space-y-6">
              {/* Current Stage Card */}
              {currentStage && (
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Bieżący etap</h2>
                  <StageCardCurrent stage={currentStage} />
                </div>
              )}

              {/* Next Stage / Complete Batch Button */}
              {currentStage && data.status === "active" && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  {/* Check if this is the last stage */}
                  {currentStage.position === Math.max(...data.stages.map((s) => s.position)) ? (
                    <ButtonCompleteBatch batchId={batchId} batchName={data.name} disabled={data.status !== "active"} />
                  ) : (
                    <ButtonNextStage
                      batchId={batchId}
                      disabled={data.status !== "active"}
                      currentStagePosition={currentStage.position}
                      nextStagePosition={data.stages.find((s) => s.position === currentStage.position + 1)?.position}
                    />
                  )}
                </div>
              )}

              {/* Notes Section */}
              {currentStage && (
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notatki</h2>

                  {/* Note Form */}
                  <div className="mb-4 sm:mb-6">
                    <NoteForm batchId={batchId} />
                  </div>

                  {/* Note History - All notes grouped by stages */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Historia notatek</h3>
                    {isLoadingNotes ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Ładowanie notatek...</p>
                      </div>
                    ) : (
                      <NoteHistory notes={allNotes || []} stages={data.stages} batchId={batchId} />
                    )}
                  </div>
                </div>
              )}

              {/* Placeholder for completed batches */}
              {!currentStage && data.status === "completed" && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="text-center py-6 sm:py-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nastaw ukończony</h3>
                    <p className="text-sm sm:text-base text-gray-600">Wszystkie etapy zostały ukończone.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main BatchView component with QueryProvider and Toast notifications
 */
export default function BatchView({ batchId }: BatchViewProps) {
  return (
    <QueryProvider>
      <BatchPageContent batchId={batchId} />
      <Toaster />
    </QueryProvider>
  );
}
