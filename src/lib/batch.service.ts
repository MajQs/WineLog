/**
 * Batch Service
 * Handles business logic for batch operations
 */

import type { SupabaseClient } from "../db/supabase.client";
import type {
  BatchDto,
  BatchListItemDto,
  BatchListResponseDto,
  UpdateBatchResponseDto,
  CompleteBatchResponseDto,
  DeleteBatchResponseDto,
  CreateBatchCommand,
  BatchStatus,
  BatchType,
  BatchStageDto,
  CurrentStageInfoDto,
  LatestNoteDto,
  TemplateSummaryDto,
} from "../types";

/**
 * Creates a new batch from a template
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param command - Create batch command with template_id and optional name
 * @returns Created batch with details
 */
export async function createBatch(
  supabase: SupabaseClient,
  userId: string,
  command: CreateBatchCommand
): Promise<BatchDto> {
  // 1. Verify template exists and get its data
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id, name, type")
    .eq("id", command.template_id)
    .single();

  if (templateError || !template) {
    if (templateError?.code === "PGRST116") {
      throw new Error("TEMPLATE_NOT_FOUND");
    }
    throw new Error(`Failed to fetch template: ${templateError?.message}`);
  }

  // 2. Get all template stages
  const { data: templateStages, error: stagesError } = await supabase
    .from("template_stages")
    .select("*")
    .eq("template_id", command.template_id)
    .order("position", { ascending: true });

  if (stagesError) {
    throw new Error(`Failed to fetch template stages: ${stagesError.message}`);
  }

  if (!templateStages || templateStages.length === 0) {
    throw new Error("Template has no stages");
  }

  // 3. Generate batch name if not provided
  const batchName = command.name || `${template.name} - ${new Date().toLocaleDateString()}`;

  // 4. Insert batch
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .insert({
      user_id: userId,
      template_id: command.template_id,
      name: batchName,
      type: template.type,
      status: "active" as BatchStatus,
      started_at: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (batchError || !batch) {
    throw new Error(`Failed to create batch: ${batchError?.message}`);
  }

  // 5. Insert all batch_stages based on template_stages
  const batchStagesInserts = templateStages.map((ts) => ({
    batch_id: batch.id,
    template_stage_id: ts.id,
    // First stage starts immediately
    started_at: ts.position === 1 ? new Date().toISOString().split("T")[0] : null,
  }));

  const { data: batchStages, error: batchStagesError } = await supabase
    .from("batch_stages")
    .insert(batchStagesInserts)
    .select();

  if (batchStagesError || !batchStages) {
    // Rollback: delete the batch
    await supabase.from("batches").delete().eq("id", batch.id);
    throw new Error(`Failed to create batch stages: ${batchStagesError?.message}`);
  }

  // 6. Build complete BatchDto response
  const stages: BatchStageDto[] = batchStages.map((bs) => {
    const templateStage = templateStages.find((ts) => ts.id === bs.template_stage_id);
    if (!templateStage) {
      throw new Error(`Template stage not found for batch stage ${bs.id}`);
    }
    return {
      id: bs.id,
      batch_id: bs.batch_id,
      template_stage_id: bs.template_stage_id,
      position: templateStage.position,
      name: templateStage.name,
      description: templateStage.description,
      instructions: templateStage.instructions,
      materials: templateStage.materials,
      days_min: templateStage.days_min,
      days_max: templateStage.days_max,
      started_at: bs.started_at,
      completed_at: bs.completed_at,
      status: bs.completed_at ? "completed" : bs.started_at ? "in_progress" : "pending",
      days_elapsed: bs.started_at ? calculateDaysElapsed(bs.started_at) : undefined,
    };
  });

  const currentStage = stages.find((s) => s.status === "in_progress");
  const currentStageInfo: CurrentStageInfoDto | undefined = currentStage
    ? {
        position: currentStage.position,
        name: currentStage.name,
        description: currentStage.description,
        days_elapsed: currentStage.days_elapsed,
      }
    : undefined;

  const templateSummary: TemplateSummaryDto = {
    id: template.id,
    name: template.name,
    type: template.type,
  };

  return {
    id: batch.id,
    user_id: batch.user_id,
    template_id: batch.template_id,
    name: batch.name,
    type: batch.type,
    status: batch.status,
    started_at: batch.started_at,
    completed_at: batch.completed_at,
    created_at: batch.created_at,
    updated_at: batch.updated_at,
    template: templateSummary,
    current_stage: currentStageInfo,
    stages,
    notes: [],
    rating: null,
    current_stage_position: currentStage?.position,
  };
}

/**
 * Lists batches for a user with optional filters
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param filters - Optional filters (status, type, sort, order)
 * @returns List of batches with pagination info
 */
export async function listBatches(
  supabase: SupabaseClient,
  userId: string,
  filters?: {
    status?: BatchStatus;
    type?: BatchType;
    sort?: "created_at" | "started_at" | "name";
    order?: "asc" | "desc";
  }
): Promise<BatchListResponseDto> {
  // Build query
  let query = supabase.from("batches").select("*").eq("user_id", userId);

  // Apply filters
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  // Apply sorting
  const sortField = filters?.sort || "created_at";
  const sortOrder = filters?.order === "asc";
  query = query.order(sortField, { ascending: sortOrder });

  const { data: batches, error: batchesError } = await query;

  if (batchesError) {
    throw new Error(`Failed to fetch batches: ${batchesError.message}`);
  }

  if (!batches || batches.length === 0) {
    return {
      batches: [],
      total: 0,
    };
  }

  // For each batch, get current stage info, latest note, and rating
  const batchListItems: BatchListItemDto[] = await Promise.all(
    batches.map(async (batch) => {
      // Get current stage (first non-completed stage or last stage if all completed)
      const { data: batchStages } = await supabase
        .from("batch_stages")
        .select(
          `
          id,
          started_at,
          completed_at,
          template_stage_id,
          template_stages!inner(position, name, description)
        `
        )
        .eq("batch_id", batch.id)
        .order("template_stages(position)", { ascending: true });

      let currentStage: CurrentStageInfoDto;

      if (batchStages && batchStages.length > 0) {
        // Find first non-completed stage or use last stage
        const activeStage = batchStages.find((bs) => !bs.completed_at) || batchStages[batchStages.length - 1];
        const templateStage = (
          activeStage as { template_stages: { position: number; name: string; description: string } }
        ).template_stages;

        currentStage = {
          position: templateStage.position,
          name: templateStage.name,
          description: templateStage.description,
          days_elapsed: activeStage.started_at ? calculateDaysElapsed(activeStage.started_at) : undefined,
        };
      } else {
        // Fallback if no stages found
        currentStage = {
          position: 1,
          name: "preparation",
          description: "Preparing batch",
        };
      }

      // Get latest note
      const { data: latestNoteData } = await supabase
        .from("notes")
        .select("id, action, created_at")
        .eq("batch_id", batch.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const latestNote: LatestNoteDto | null = latestNoteData
        ? {
            id: latestNoteData.id,
            action: latestNoteData.action,
            created_at: latestNoteData.created_at,
          }
        : null;

      // Get rating
      const { data: ratingData } = await supabase
        .from("ratings")
        .select("rating")
        .eq("batch_id", batch.id)
        .eq("user_id", userId)
        .maybeSingle();

      return {
        id: batch.id,
        template_id: batch.template_id,
        name: batch.name,
        type: batch.type,
        status: batch.status,
        started_at: batch.started_at,
        completed_at: batch.completed_at,
        created_at: batch.created_at,
        updated_at: batch.updated_at,
        current_stage: currentStage,
        latest_note: latestNote,
        rating: ratingData?.rating || null,
      };
    })
  );

  return {
    batches: batchListItems,
    total: batchListItems.length,
  };
}

/**
 * Gets a single batch by ID with full details
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @returns Batch with all details or null if not found
 */
export async function getBatchById(
  supabase: SupabaseClient,
  userId: string,
  batchId: string
): Promise<BatchDto | null> {
  // Fetch batch
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (batchError) {
    if (batchError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch batch: ${batchError.message}`);
  }

  if (!batch) {
    return null;
  }

  // Fetch template info
  let templateSummary: TemplateSummaryDto | undefined;
  if (batch.template_id) {
    const { data: template } = await supabase
      .from("templates")
      .select("id, name, type")
      .eq("id", batch.template_id)
      .maybeSingle();

    if (template) {
      templateSummary = {
        id: template.id,
        name: template.name,
        type: template.type,
      };
    }
  }

  // Fetch batch stages with template stage data
  const { data: batchStagesData, error: stagesError } = await supabase
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

  interface BatchStageWithTemplate {
    id: string;
    batch_id: string;
    template_stage_id: string;
    started_at: string | null;
    completed_at: string | null;
    template_stages: {
      position: number;
      name: string;
      description: string;
      instructions: string | null;
      materials: string[] | null;
      days_min: number | null;
      days_max: number | null;
    };
  }

  const stages: BatchStageDto[] = (batchStagesData || []).map((bs: BatchStageWithTemplate) => {
    const ts = bs.template_stages;
    return {
      id: bs.id,
      batch_id: bs.batch_id,
      template_stage_id: bs.template_stage_id,
      position: ts.position,
      name: ts.name,
      description: ts.description,
      instructions: ts.instructions,
      materials: ts.materials,
      days_min: ts.days_min,
      days_max: ts.days_max,
      started_at: bs.started_at,
      completed_at: bs.completed_at,
      status: bs.completed_at ? "completed" : bs.started_at ? "in_progress" : "pending",
      days_elapsed: bs.started_at ? calculateDaysElapsed(bs.started_at) : undefined,
    };
  });

  // Determine current stage
  const currentStage = stages.find((s) => s.status === "in_progress");
  const currentStageInfo: CurrentStageInfoDto | undefined = currentStage
    ? {
        position: currentStage.position,
        name: currentStage.name,
        description: currentStage.description,
        days_elapsed: currentStage.days_elapsed,
      }
    : undefined;

  // Fetch notes
  const { data: notesData } = await supabase
    .from("notes")
    .select("id, batch_id, stage_id, user_id, action, observations, created_at")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false });

  const notes = notesData || [];

  // Fetch rating
  const { data: ratingData } = await supabase
    .from("ratings")
    .select("rating")
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  return {
    id: batch.id,
    user_id: batch.user_id,
    template_id: batch.template_id,
    name: batch.name,
    type: batch.type,
    status: batch.status,
    started_at: batch.started_at,
    completed_at: batch.completed_at,
    created_at: batch.created_at,
    updated_at: batch.updated_at,
    template: templateSummary,
    current_stage: currentStageInfo,
    stages,
    notes,
    rating: ratingData?.rating || null,
    current_stage_position: currentStage?.position,
  };
}

/**
 * Updates batch name
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @param name - New batch name
 * @returns Updated batch info
 */
export async function updateBatchName(
  supabase: SupabaseClient,
  userId: string,
  batchId: string,
  name: string
): Promise<UpdateBatchResponseDto | null> {
  // Update batch name
  const { data: batch, error: updateError } = await supabase
    .from("batches")
    .update({ name })
    .eq("id", batchId)
    .eq("user_id", userId)
    .select("id, name, updated_at")
    .maybeSingle();

  if (updateError) {
    throw new Error(`Failed to update batch: ${updateError.message}`);
  }

  if (!batch) {
    return null;
  }

  return {
    id: batch.id,
    name: batch.name,
    updated_at: batch.updated_at,
  };
}

/**
 * Completes a batch
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @returns Completed batch info
 */
export async function completeBatch(
  supabase: SupabaseClient,
  userId: string,
  batchId: string
): Promise<CompleteBatchResponseDto | null> {
  // First check if batch exists and is active
  const { data: existingBatch, error: fetchError } = await supabase
    .from("batches")
    .select("id, name, status")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch batch: ${fetchError.message}`);
  }

  if (!existingBatch) {
    return null;
  }

  if (existingBatch.status === "archived") {
    throw new Error("BATCH_ALREADY_COMPLETED");
  }

  // Update batch to archived status with completed_at date
  const completedAt = new Date().toISOString().split("T")[0];

  const { data: batch, error: updateError } = await supabase
    .from("batches")
    .update({
      status: "archived" as BatchStatus,
      completed_at: completedAt,
    })
    .eq("id", batchId)
    .eq("user_id", userId)
    .select("id, name, status, completed_at")
    .maybeSingle();

  if (updateError || !batch) {
    throw new Error(`Failed to complete batch: ${updateError?.message}`);
  }

  if (!batch.completed_at) {
    throw new Error("Batch completed_at is null after update");
  }

  return {
    id: batch.id,
    name: batch.name,
    status: batch.status,
    completed_at: batch.completed_at,
    message: "Batch completed successfully",
  };
}

/**
 * Deletes a batch
 * @param supabase - Supabase client instance
 * @param userId - User ID from JWT token
 * @param batchId - Batch UUID
 * @returns Success message or null if not found
 */
export async function removeBatch(
  supabase: SupabaseClient,
  userId: string,
  batchId: string
): Promise<DeleteBatchResponseDto | null> {
  // Check if batch exists
  const { data: existingBatch } = await supabase
    .from("batches")
    .select("id")
    .eq("id", batchId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingBatch) {
    return null;
  }

  // Delete batch (cascade will handle related records)
  const { error: deleteError } = await supabase.from("batches").delete().eq("id", batchId).eq("user_id", userId);

  if (deleteError) {
    throw new Error(`Failed to delete batch: ${deleteError.message}`);
  }

  return {
    message: "Batch deleted successfully",
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
