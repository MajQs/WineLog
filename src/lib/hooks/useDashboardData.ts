/**
 * React Query hook for dashboard data
 * Manages fetching and caching of dashboard data
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import type { DashboardDto, DashboardBatchDto } from "../../types";
import { fetchDashboard } from "../api/dashboard";

/**
 * View model for BatchCard component
 * Transforms DashboardBatchDto with formatted dates
 */
export interface BatchCardVM {
  id: string;
  name: string;
  type: string;
  startedAtHuman: string;
  currentStageDescription: string;
  currentStagePosition: number;
  currentStageDaysElapsed?: number;
  latestNoteAction?: string;
  latestNoteDateHuman?: string;
}

/**
 * Transform DashboardBatchDto to BatchCardVM
 */
function transformBatchToVM(batch: DashboardBatchDto): BatchCardVM {
  return {
    id: batch.id,
    name: batch.name,
    type: batch.type,
    startedAtHuman: format(new Date(batch.started_at), "dd.MM.yyyy"),
    currentStageDescription: batch.current_stage.description,
    currentStagePosition: batch.current_stage.position,
    currentStageDaysElapsed: batch.current_stage.days_elapsed,
    latestNoteAction: batch.latest_note?.action,
    latestNoteDateHuman: batch.latest_note
      ? format(new Date(batch.latest_note.created_at), "dd.MM.yyyy")
      : undefined,
  };
}

/**
 * Hook for dashboard data with React Query
 * 
 * @returns Query state with dashboard data and batch view models
 */
export function useDashboardData() {
  const query = useQuery<DashboardDto>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 30000, // Data is fresh for 30 seconds
    retry: 2, // Retry failed requests twice
  });

  // Transform batches to view models
  const batchesVM = useMemo(() => {
    if (!query.data?.active_batches) return [];
    return query.data.active_batches.map(transformBatchToVM);
  }, [query.data?.active_batches]);

  return {
    data: query.data,
    batches: batchesVM,
    archivedCount: query.data?.archived_batches_count ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

