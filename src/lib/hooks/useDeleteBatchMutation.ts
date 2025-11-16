/**
 * React Query mutation hook for deleting a batch
 * Handles batch deletion with cache invalidation and redirect
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBatch } from "../api/batch";

interface UseDeleteBatchMutationOptions {
  batchId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for delete batch mutation
 *
 * @param options - Mutation options with batchId and callbacks
 * @returns Mutation object with mutate function
 */
export function useDeleteBatchMutation({ batchId, onSuccess, onError }: UseDeleteBatchMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, undefined>({
    mutationFn: () => deleteBatch(batchId),

    // On success
    onSuccess: (data) => {
      toast.success("Nastaw został usunięty", {
        description: data.message,
      });

      // Invalidate archived batches list
      queryClient.invalidateQueries({ queryKey: ["batches", "archived"] });

      // Remove batch from cache
      queryClient.removeQueries({ queryKey: ["batch", batchId] });

      // Call onSuccess callback first to allow parent component to handle redirect
      onSuccess?.();

      // Redirect after delay - this is intentional navigation, not a state mutation
      setTimeout(() => {
        window.location.href = "/archived";
      }, 1000);
    },

    // On error
    onError: (error) => {
      toast.error("Nie udało się usunąć nastawu", {
        description: error.message || "Spróbuj ponownie później",
      });

      onError?.(error);
    },
  });
}
