/**
 * React Query hook for all batch notes
 * Fetches all notes for a batch
 */

import { useQuery } from "@tanstack/react-query";
import type { NoteDto } from "@/types";
import { fetchNotes } from "../api/note";

/**
 * Hook for all batch notes with React Query
 * 
 * @param batchId - Batch ID
 * @returns Query state with notes data
 */
export function useAllNotes(batchId: string) {
  return useQuery<NoteDto[]>({
    queryKey: ["batch", batchId, "notes"],
    queryFn: async () => {
      const response = await fetchNotes(batchId);
      return response.notes;
    },
    staleTime: 30000, // Data is fresh for 30 seconds
    retry: 1,
  });
}

