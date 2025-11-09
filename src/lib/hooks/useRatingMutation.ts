/**
 * React Query mutation hook for batch rating
 * Handles adding/updating rating with optimistic updates
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RatingDto, BatchDto } from "@/types";
import { upsertBatchRating } from "../api/batch";

interface UseRatingMutationOptions {
  batchId: string;
  onSuccess?: (data: RatingDto) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for rating mutation with optimistic updates
 * 
 * @param options - Mutation options with batchId and callbacks
 * @returns Mutation object with mutate function
 */
export function useRatingMutation({ 
  batchId, 
  onSuccess, 
  onError 
}: UseRatingMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation<RatingDto, Error, number>({
    mutationFn: (rating: number) => {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error("Ocena musi być w zakresie 1-5");
      }
      return upsertBatchRating(batchId, rating);
    },
    
    // Optimistic update
    onMutate: async (newRating: number) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["batch", batchId] });

      // Snapshot the previous value
      const previousBatch = queryClient.getQueryData<BatchDto>(["batch", batchId]);

      // Optimistically update the cache
      if (previousBatch) {
        queryClient.setQueryData<BatchDto>(["batch", batchId], {
          ...previousBatch,
          rating: newRating,
        });
      }

      // Return context with previous value
      return { previousBatch };
    },

    // On success
    onSuccess: (data) => {
      toast.success("Ocena została zapisana");
      // Invalidate and refetch batch data
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
      onSuccess?.(data);
    },

    // On error
    onError: (error, _newRating, context) => {
      // Rollback optimistic update
      if (context?.previousBatch) {
        queryClient.setQueryData(["batch", batchId], context.previousBatch);
      }
      
      toast.error("Nie udało się zapisać oceny", {
        description: error.message || "Spróbuj ponownie później",
      });
      
      onError?.(error);
    },
  });
}

