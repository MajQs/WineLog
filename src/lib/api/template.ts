/**
 * Template API client
 * Fetches template data from the backend
 */

import type { TemplateListItemDto, TemplateDto, TemplateListResponseDto, BatchType } from "@/types";
import { fetchWithAuth } from "./fetch";

/**
 * Fetches all templates with optional type filter
 *
 * @param type - Optional batch type filter
 * @returns List of templates
 */
export async function fetchTemplates(type?: BatchType): Promise<TemplateListItemDto[]> {
  const params = new URLSearchParams();
  if (type) {
    params.set("type", type);
  }

  const url = `/api/v1/templates${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await fetchWithAuth<TemplateListResponseDto>(url);

  return response.templates;
}

/**
 * Fetches a single template by ID with all stages
 *
 * @param templateId - Template UUID
 * @returns Template with stages
 */
export async function fetchTemplate(templateId: string): Promise<TemplateDto> {
  return fetchWithAuth<TemplateDto>(`/api/v1/templates/${templateId}`);
}
