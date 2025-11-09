/**
 * Batch Stage Service
 * Handles business logic for batch stage operations
 */

import type { SupabaseClient } from "../db/supabase.client";
import type {
  AdvanceStageCommand,
  AdvanceStageResponseDto,
  CurrentStageDetailsDto,
  BatchStageDto,
  StageSummaryDto,
  NoteDto,
  StageName,
  NoteStageContextDto,
} from "../types";

/**
 * Advances batch to the next stage
 * Closes current stage and optionally creates a note
 * 
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param command - Advance stage command with optional note
 * @returns Response with previous and current stage info
 */
export async function advanceToNextStage(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  command: AdvanceStageCommand
): Promise<AdvanceStageResponseDto> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id, status")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  if (batch.status === "archived") {
    throw new Error("BATCH_ARCHIVED");
  }

  // 2. Get all stages for the batch (to find current and next)
  const { data: allStages, error: stagesError } = await supabase
    .from("batch_stages")
    .select(
      `
      id,
      batch_id,
      template_stage_id,
      started_at,
      completed_at,
      template_stages!inner(position, name, description, instructions, materials, days_min, days_max)
    `
    )
    .eq("batch_id", batchId)
    .order("template_stages(position)", { ascending: true });

  if (stagesError) {
    throw new Error(`Failed to fetch batch stages: ${stagesError.message}`);
  }

  if (!allStages || allStages.length === 0) {
    throw new Error("NO_STAGES_FOUND");
  }

  // Find current stage (first non-completed)
  const stages = allStages as any[];
  const currentStageIndex = stages.findIndex((s) => !s.completed_at);

  if (currentStageIndex === -1) {
    // All stages completed
    throw new Error("FINAL_STAGE");
  }

  const currentStage = stages[currentStageIndex];
  const currentTemplateStage = currentStage.template_stages;

  // Find next stage
  const nextStageIndex = currentStageIndex + 1;
  if (nextStageIndex >= stages.length) {
    // Current stage is the last one
    throw new Error("FINAL_STAGE");
  }

  const nextStage = stages[nextStageIndex];
  const nextTemplateStage = nextStage.template_stages;

  // 3. Complete current stage
  const completedAt = new Date().toISOString().split("T")[0];
  const { error: completeError } = await supabase
    .from("batch_stages")
    .update({ completed_at: completedAt })
    .eq("id", currentStage.id);

  if (completeError) {
    throw new Error(`Failed to complete current stage: ${completeError.message}`);
  }

  // 4. Start next stage
  const startedAt = new Date().toISOString().split("T")[0];
  const { error: startError } = await supabase
    .from("batch_stages")
    .update({ started_at: startedAt })
    .eq("id", nextStage.id);

  if (startError) {
    throw new Error(`Failed to start next stage: ${startError.message}`);
  }

  // 5. Create note if provided
  let noteDto: NoteDto | undefined;
  if (command.note) {
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        batch_id: batchId,
        stage_id: currentStage.id,
        user_id: userId,
        action: command.note.action,
        observations: command.note.observations || null,
      })
      .select("id, batch_id, stage_id, user_id, action, observations, created_at")
      .single();

    if (noteError) {
      throw new Error(`Failed to create note: ${noteError.message}`);
    }

    noteDto = {
      id: note.id,
      batch_id: note.batch_id,
      stage_id: note.stage_id,
      user_id: note.user_id,
      action: note.action,
      observations: note.observations,
      created_at: note.created_at,
      stage_name: currentTemplateStage.name,
    };
  }

  // 6. Build response DTOs
  const previousStageSummary: StageSummaryDto = {
    id: currentStage.id,
    position: currentTemplateStage.position,
    name: currentTemplateStage.name,
    description: currentTemplateStage.description,
    completed_at: completedAt,
    started_at: currentStage.started_at,
  };

  const currentStageDto: BatchStageDto = buildBatchStageDto(
    nextStage.id,
    nextStage.batch_id,
    nextStage.template_stage_id,
    nextTemplateStage,
    startedAt,
    null
  );

  return {
    previous_stage: previousStageSummary,
    current_stage: currentStageDto,
    note: noteDto,
  };
}

/**
 * Gets current stage details with notes
 * 
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @returns Current stage with full details and notes
 */
export async function getCurrentStageDetails(
  supabase: SupabaseClient,
  userId: string,
  batchId: string
): Promise<CurrentStageDetailsDto> {
  // 1. Verify batch exists and belongs to user
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // 2. Get current stage (first non-completed stage or last completed stage)
  const { data: currentStageData, error: currentStageError } = await supabase
    .from("batch_stages")
    .select(
      `
      id,
      batch_id,
      template_stage_id,
      started_at,
      completed_at,
      template_stages!inner(position, name, description, instructions, materials, days_min, days_max)
    `
    )
    .eq("batch_id", batchId)
    .order("template_stages(position)", { ascending: true });

  if (currentStageError) {
    throw new Error(`Failed to fetch stages: ${currentStageError.message}`);
  }

  if (!currentStageData || currentStageData.length === 0) {
    throw new Error("NO_STAGES_FOUND");
  }

  // Find current stage (first incomplete or last stage if all complete)
  const stages = currentStageData as any[];
  const currentStage = stages.find((s) => !s.completed_at) || stages[stages.length - 1];
  const templateStage = currentStage.template_stages;

  // 3. Get notes for current stage
  const { data: notesData, error: notesError } = await supabase
    .from("notes")
    .select("id, batch_id, stage_id, user_id, action, observations, created_at")
    .eq("batch_id", batchId)
    .eq("stage_id", currentStage.id)
    .order("created_at", { ascending: false });

  if (notesError) {
    throw new Error(`Failed to fetch notes: ${notesError.message}`);
  }

  const notes: NoteDto[] = (notesData || []).map((note) => ({
    id: note.id,
    batch_id: note.batch_id,
    stage_id: note.stage_id,
    user_id: note.user_id,
    action: note.action,
    observations: note.observations,
    created_at: note.created_at,
    stage_name: templateStage.name,
  }));

  // 4. Build response DTO
  const stageDto = buildBatchStageDto(
    currentStage.id,
    currentStage.batch_id,
    currentStage.template_stage_id,
    templateStage,
    currentStage.started_at,
    currentStage.completed_at
  );

  return {
    ...stageDto,
    notes,
  };
}

/**
 * Helper function to build BatchStageDto from database data
 */
function buildBatchStageDto(
  id: string,
  batch_id: string,
  template_stage_id: string,
  templateStage: any,
  started_at: string | null,
  completed_at: string | null
): BatchStageDto {
  return {
    id,
    batch_id,
    template_stage_id,
    position: templateStage.position,
    name: templateStage.name as StageName,
    description: templateStage.description,
    instructions: templateStage.instructions,
    materials: templateStage.materials,
    days_min: templateStage.days_min,
    days_max: templateStage.days_max,
    started_at,
    completed_at,
    status: completed_at ? "completed" : started_at ? "in_progress" : "pending",
    days_elapsed: started_at && !completed_at ? calculateDaysElapsed(started_at) : undefined,
  };
}

/**
 * Helper function to calculate days elapsed from a date
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

