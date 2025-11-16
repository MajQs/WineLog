/**
 * Dashboard Service
 * Handles business logic for dashboard data aggregation
 */

import type { SupabaseClient } from "../db/supabase.client";
import type { DashboardDto, DashboardBatchDto, CurrentStageInfoDto, LatestNoteDto } from "../types";

/**
 * Gets dashboard data for a user including active batches and archived count
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @returns Dashboard data with active batches and archived count
 */
export async function getDashboardData(supabase: SupabaseClient, userId: string): Promise<DashboardDto> {
  try {
    // 1. Fetch active batches with current stage and latest note
    const activeBatches = await getActiveBatches(supabase, userId);

    // 2. Count archived batches
    const archivedCount = await getArchivedBatchesCount(supabase, userId);

    return {
      active_batches: activeBatches,
      archived_batches_count: archivedCount,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

/**
 * Fetches active batches with current stage and latest note information
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @returns Array of active batches with details
 */
async function getActiveBatches(supabase: SupabaseClient, userId: string): Promise<DashboardBatchDto[]> {
  // Fetch active batches
  const { data: batches, error: batchesError } = await supabase
    .from("batches")
    .select("id, name, type, started_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(10); // Limit to 10 most recent active batches for performance

  if (batchesError) {
    console.error("Failed to fetch active batches:", batchesError);
    throw new Error(`Failed to fetch active batches: ${batchesError.message}`);
  }

  if (!batches || batches.length === 0) {
    return [];
  }

  // For each batch, get current stage info and latest note
  const dashboardBatches: DashboardBatchDto[] = await Promise.all(
    batches.map(async (batch) => {
      // Get current stage (first non-completed stage)
      const currentStage = await getCurrentStageInfo(supabase, batch.id);

      // Get latest note
      const latestNote = await getLatestNote(supabase, batch.id);

      return {
        id: batch.id,
        name: batch.name,
        type: batch.type,
        started_at: batch.started_at,
        current_stage: currentStage,
        latest_note: latestNote,
      };
    })
  );

  return dashboardBatches;
}

/**
 * Gets current stage information for a batch
 *
 * @param supabase - Supabase client instance
 * @param batchId - Batch UUID
 * @returns Current stage information
 */
async function getCurrentStageInfo(supabase: SupabaseClient, batchId: string): Promise<CurrentStageInfoDto> {
  const { data: stageData, error: stageError } = await supabase
    .from("batch_stages")
    .select(
      `
      id,
      started_at,
      completed_at,
      template_stages!inner(position, name, description)
    `
    )
    .eq("batch_id", batchId)
    .is("completed_at", null)
    .order("template_stages(position)", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (stageError) {
    console.error(`Failed to fetch current stage for batch ${batchId}:`, stageError);
    // Return fallback stage info instead of throwing
    return {
      position: 1,
      name: "preparation",
      description: "Preparation stage",
    };
  }

  if (!stageData) {
    // All stages completed or no stages - return last stage
    const { data: lastStage } = await supabase
      .from("batch_stages")
      .select(
        `
        id,
        started_at,
        completed_at,
        template_stages!inner(position, name, description)
      `
      )
      .eq("batch_id", batchId)
      .order("template_stages(position)", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastStage) {
      const stageWithTemplate = lastStage as {
        started_at: string | null;
        template_stages: { position: number; name: string; description: string | null };
      };
      const templateStage = stageWithTemplate.template_stages;
      return {
        position: templateStage.position,
        name: templateStage.name,
        description: templateStage.description,
        days_elapsed: stageWithTemplate.started_at ? calculateDaysElapsed(stageWithTemplate.started_at) : undefined,
      };
    }

    // Fallback if no stages found
    return {
      position: 1,
      name: "preparation",
      description: "Preparation stage",
    };
  }

  const stageWithTemplate = stageData as {
    started_at: string | null;
    template_stages: { position: number; name: string; description: string | null };
  };
  const templateStage = stageWithTemplate.template_stages;

  return {
    position: templateStage.position,
    name: templateStage.name,
    description: templateStage.description,
    days_elapsed: stageWithTemplate.started_at ? calculateDaysElapsed(stageWithTemplate.started_at) : undefined,
  };
}

/**
 * Gets the latest note for a batch
 *
 * @param supabase - Supabase client instance
 * @param batchId - Batch UUID
 * @returns Latest note or null if no notes exist
 */
async function getLatestNote(supabase: SupabaseClient, batchId: string): Promise<LatestNoteDto | null> {
  const { data: noteData, error: noteError } = await supabase
    .from("notes")
    .select("id, action, created_at")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (noteError) {
    console.error(`Failed to fetch latest note for batch ${batchId}:`, noteError);
    return null;
  }

  if (!noteData) {
    return null;
  }

  return {
    id: noteData.id,
    action: noteData.action,
    created_at: noteData.created_at,
  };
}

/**
 * Counts archived batches for a user
 *
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @returns Count of archived batches
 */
async function getArchivedBatchesCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("batches")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "archived");

  if (error) {
    console.error("Failed to count archived batches:", error);
    throw new Error(`Failed to count archived batches: ${error.message}`);
  }

  return count || 0;
}

/**
 * Helper function to calculate days elapsed from a date
 *
 * @param startDate - Start date as string (YYYY-MM-DD)
 * @returns Number of days elapsed
 */
function calculateDaysElapsed(startDate: string | null): number | undefined {
  if (!startDate) return undefined;

  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
