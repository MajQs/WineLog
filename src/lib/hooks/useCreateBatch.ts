/**
 * React Query hook for creating a batch
 * Manages mutation, optimistic updates, and cache invalidation
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBatchCommand, BatchDto } from "@/types";
import { createBatch } from "../api/batch";

/**
 * Hook for creating a batch with React Query
 * Automatically invalidates batches and dashboard cache on success
 * 
 * @returns Mutation state and mutate function
 */
export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation<BatchDto, Error, CreateBatchCommand>({
    mutationFn: (command: CreateBatchCommand) => createBatch(command),
    onSuccess: () => {
      // Invalidate and refetch batches list
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

