/**
 * React Query hook for archived batch data
 * Manages fetching and caching of archived batch with stages and notes
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import type { BatchDto } from "@/types";
import type { ArchivedBatchViewModel } from "@/types/viewModels";
import { fetchBatch } from "../api/batch";

/**
 * Transform BatchDto to ArchivedBatchViewModel with formatted dates
 */
function transformBatchToVM(batch: BatchDto): ArchivedBatchViewModel {
  // For archived batches, ensure the last stage has completed_at set
  let stages = batch.stages;

  if (batch.status === "archived" && batch.completed_at && stages.length > 0) {
    // Find the last stage by position
    const sortedStages = [...stages].sort((a, b) => a.position - b.position);
    const lastStage = sortedStages[sortedStages.length - 1];

    // If last stage doesn't have completed_at, set it to batch.completed_at
    if (!lastStage.completed_at) {
      stages = stages.map((stage) =>
        stage.id === lastStage.id ? { ...stage, completed_at: batch.completed_at, status: "completed" as const } : stage
      );
    }
  }

  return {
    id: batch.id,
    name: batch.name,
    type: batch.type,
    status: batch.status,
    started_at: batch.started_at,
    completed_at: batch.completed_at,
    startedAtHuman: format(new Date(batch.started_at), "dd.MM.yyyy"),
    completedAtHuman: batch.completed_at ? format(new Date(batch.completed_at), "dd.MM.yyyy") : undefined,
    template: batch.template,
    stages,
    notes: batch.notes || [],
    rating: batch.rating,
    notesCount: batch.notes?.length || 0,
  };
}

/**
 * Hook for archived batch data with React Query
 * Fetches complete batch data including stages and notes
 *
 * @param batchId - Batch ID
 * @returns Query state with archived batch view model
 */
export function useArchivedBatch(batchId: string) {
  // Fetch batch data
  const batchQuery = useQuery<BatchDto>({
    queryKey: ["batch", batchId],
    queryFn: () => fetchBatch(batchId),
    staleTime: 30000, // Data is fresh for 30 seconds
    retry: 1,
  });

  // Transform batch to view model
  const batchVM = useMemo(() => {
    if (!batchQuery.data) return null;
    return transformBatchToVM(batchQuery.data);
  }, [batchQuery.data]);

  return {
    data: batchVM,
    batch: batchQuery.data,
    isLoading: batchQuery.isLoading,
    isError: batchQuery.isError,
    error: batchQuery.error,
    refetch: batchQuery.refetch,
  };
}
