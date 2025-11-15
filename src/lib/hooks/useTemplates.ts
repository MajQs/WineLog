/**
 * React Query hook for templates data
 * Manages fetching and caching of templates list
 */

import { useQuery } from "@tanstack/react-query";
import type { TemplateListItemDto, BatchType } from "@/types";
import { fetchTemplates } from "../api/template";

/**
 * Hook for templates list with React Query
 *
 * @param type - Optional batch type filter
 * @returns Query state with templates data
 */
export function useTemplates(type?: BatchType) {
  return useQuery<TemplateListItemDto[]>({
    queryKey: ["templates", type],
    queryFn: () => fetchTemplates(type),
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    retry: 1,
  });
}
