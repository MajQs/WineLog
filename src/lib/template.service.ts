/**
 * Template Service
 * Handles business logic for template operations
 */

import type { SupabaseClient } from "../db/supabase.client";
import type { TemplateListItemDto, TemplateDto, TemplateStageDto, BatchType } from "../types";

/**
 * Get all templates with optional type filter
 * @param supabase - Supabase client instance
 * @param type - Optional batch type filter
 * @returns Array of template list items
 */
export async function getTemplates(supabase: SupabaseClient, type?: BatchType): Promise<TemplateListItemDto[]> {
  // Build query
  let query = supabase
    .from("templates")
    .select("id, name, type, version, created_at")
    .order("name", { ascending: true });

  // Apply type filter if provided
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching templates:", error);
    throw new Error(`Failed to fetch templates: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single template by ID with all stages
 * @param supabase - Supabase client instance
 * @param templateId - Template UUID
 * @returns Template with stages or null if not found
 */
export async function getTemplateById(supabase: SupabaseClient, templateId: string): Promise<TemplateDto | null> {
  // Fetch template with stages
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id, name, type, version, created_at")
    .eq("id", templateId)
    .single();

  if (templateError) {
    if (templateError.code === "PGRST116") {
      // No rows returned - template not found
      return null;
    }
    console.error("Error fetching template:", templateError);
    throw new Error(`Failed to fetch template: ${templateError.message}`);
  }

  // Fetch template stages
  const { data: stages, error: stagesError } = await supabase
    .from("template_stages")
    .select("id, position, name, description, instructions, materials, days_min, days_max, created_at")
    .eq("template_id", templateId)
    .order("position", { ascending: true });

  if (stagesError) {
    console.error("Error fetching template stages:", stagesError);
    throw new Error(`Failed to fetch template stages: ${stagesError.message}`);
  }

  // Map to DTO format
  const templateDto: TemplateDto = {
    ...template,
    stages: (stages || []) as TemplateStageDto[],
  };

  return templateDto;
}
