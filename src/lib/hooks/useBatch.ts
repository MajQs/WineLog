/**
 * React Query hook for batch data
 * Manages fetching and caching of batch, stages, and notes
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import type { BatchDto, CurrentStageDetailsDto, BatchStageDto } from "@/types";
import { fetchBatch, fetchCurrentStage } from "../api/batch";

/**
 * View model for BatchView component
 * Combines batch data with current stage details
 */
export interface BatchVM {
  id: string;
  name: string;
  type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  startedAtHuman: string;
  completedAtHuman?: string;
  current_stage_position?: number;
  stages: BatchStageDto[];
  currentStageDetails?: CurrentStageDetailsDto;
  template?: {
    id: string;
    name: string;
    type: string;
  };
  rating?: number | null;
}

/**
 * Transform BatchDto to BatchVM with formatted dates
 */
function transformBatchToVM(
  batch: BatchDto, 
  currentStage?: CurrentStageDetailsDto
): BatchVM {
  return {
    id: batch.id,
    name: batch.name,
    type: batch.type,
    status: batch.status,
    started_at: batch.started_at,
    completed_at: batch.completed_at,
    startedAtHuman: format(new Date(batch.started_at), "dd.MM.yyyy"),
    completedAtHuman: batch.completed_at 
      ? format(new Date(batch.completed_at), "dd.MM.yyyy") 
      : undefined,
    current_stage_position: batch.current_stage_position,
    stages: batch.stages,
    currentStageDetails: currentStage,
    template: batch.template,
    rating: batch.rating,
  };
}

/**
 * Hook for batch data with React Query
 * Fetches batch and current stage in parallel
 * 
 * @param batchId - Batch ID
 * @returns Query state with batch data and view model
 */
export function useBatch(batchId: string) {
  // Fetch batch data
  const batchQuery = useQuery<BatchDto>({
    queryKey: ["batch", batchId],
    queryFn: () => fetchBatch(batchId),
    staleTime: 30000, // Data is fresh for 30 seconds
    retry: 1,
  });

  // Fetch current stage details (only if batch is active)
  const currentStageQuery = useQuery<CurrentStageDetailsDto>({
    queryKey: ["batch", batchId, "current-stage"],
    queryFn: () => fetchCurrentStage(batchId),
    staleTime: 30000,
    retry: 1,
    enabled: !!batchQuery.data && batchQuery.data.status === "active",
  });

  // Transform batch to view model
  const batchVM = useMemo(() => {
    if (!batchQuery.data) return null;
    return transformBatchToVM(batchQuery.data, currentStageQuery.data);
  }, [batchQuery.data, currentStageQuery.data]);

  // Combined loading state
  const isLoading = batchQuery.isLoading || 
    (batchQuery.data?.status === "active" && currentStageQuery.isLoading);

  // Combined error state
  const isError = batchQuery.isError || currentStageQuery.isError;
  const error = batchQuery.error || currentStageQuery.error;

  return {
    data: batchVM,
    batch: batchQuery.data,
    currentStage: currentStageQuery.data,
    isLoading,
    isError,
    error,
    refetch: () => {
      batchQuery.refetch();
      currentStageQuery.refetch();
    },
  };
}

