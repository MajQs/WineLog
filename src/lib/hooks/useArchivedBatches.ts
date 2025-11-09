/**
 * React Query hook for archived batches
 * Manages fetching and caching of archived batches list
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import type { BatchListResponseDto } from "../../types";
import type { ArchivedBatchCardVM } from "../../types/viewModels";
import { fetchArchivedBatches } from "../api/batch";

/**
 * Transform BatchListItemDto to ArchivedBatchCardVM
 */
function transformBatchToVM(batch: BatchListResponseDto["batches"][number]): ArchivedBatchCardVM {
  return {
    id: batch.id,
    name: batch.name,
    type: batch.type,
    startedAt: batch.started_at,
    completedAt: batch.completed_at || "",
    startedAtHuman: format(new Date(batch.started_at), "dd.MM.yyyy"),
    completedAtHuman: batch.completed_at 
      ? format(new Date(batch.completed_at), "dd.MM.yyyy")
      : "",
    rating: batch.rating,
  };
}

/**
 * Hook for archived batches data with React Query
 * 
 * @returns Query state with archived batches view models
 */
export function useArchivedBatches() {
  const query = useQuery<BatchListResponseDto>({
    queryKey: ["batches", "archived"],
    queryFn: fetchArchivedBatches,
    staleTime: 30000, // Data is fresh for 30 seconds
    retry: 2, // Retry failed requests twice
  });

  // Transform batches to view models
  const batchesVM = useMemo(() => {
    if (!query.data?.batches) return [];
    return query.data.batches.map(transformBatchToVM);
  }, [query.data?.batches]);

  return {
    batches: batchesVM,
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

